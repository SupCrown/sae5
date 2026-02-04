package com.aramis.services;

import com.aramis.dto.PickingTaskResponse;
import com.aramis.dto.PlacementData;
import com.aramis.models.contain.Contain;
import com.aramis.models.contain.ContainRepository;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.models.product.Product; // Import simple
import com.aramis.models.product.ProductRepository;
import com.aramis.models.support.Support;
import com.aramis.models.support.SupportRepository;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.skjolber.packing.api.*;
import com.github.skjolber.packing.packer.laff.LargestAreaFitFirstPackager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PickingService {

    private final SupportRepository supportRepo;
    private final ContainRepository containRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Constantes alignées avec les types BDD
    private static final String STATUS_SUPPORT_IN_PROGRESS = "2";
    private static final String STATUS_SUPPORT_FINISHED = "4";
    private static final int STATUS_ORDER_TODO = 1;

    public PickingService(SupportRepository supportRepo, ContainRepository containRepo,
                          ProductRepository productRepo, OrderRepository orderRepo, UserRepository userRepo) {
        this.supportRepo = supportRepo;
        this.containRepo = containRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public PickingTaskResponse getNextTask(int login) {
        User user = userRepo.findByLogin(login);
        if (user == null) throw new RuntimeException("User introuvable Login: " + login);

        Optional<Support> currentSupport = supportRepo.findByPreparedByAndStatus(user, STATUS_SUPPORT_IN_PROGRESS);

        if (currentSupport.isPresent()) {
            return calculateNextProduct(currentSupport.get());
        } else {
            return startNewSupport(user);
        }
    }

    private PickingTaskResponse calculateNextProduct(Support support) {
        try {
            List<PlacementData> plan = objectMapper.readValue(
                    support.getNestedProductsPlacements(),
                    new TypeReference<List<PlacementData>>(){}
            );

            List<Contain> contents = containRepo.findBySupport(support);

            // On clone la liste pour faire le calcul localement
            List<Contain> tempState = new ArrayList<>();
            for(Contain c : contents) {
                Contain copy = new Contain();
                copy.setProduct(c.getProduct());
                copy.setServedQuantity(c.getServedQuantity());
                tempState.add(copy);
            }

            for (PlacementData step : plan) {
                Long pId = Long.valueOf(step.getProductId());

                Optional<Contain> match = tempState.stream()
                        .filter(c -> c.getProduct() != null && c.getProduct().getProductId().equals(pId))
                        .findFirst();

                if (match.isPresent() && match.get().getServedQuantity() > 0) {
                    match.get().setServedQuantity(match.get().getServedQuantity() - 1);
                } else {
                    PickingTaskResponse resp = new PickingTaskResponse();
                    resp.setType("PICK_PRODUCT");
                    resp.setProductId(pId);
                    resp.setTargetX(step.getX());
                    resp.setTargetY(step.getY());
                    resp.setTargetZ(step.getZ());
                    return resp;
                }
            }

            support.setStatus(STATUS_SUPPORT_FINISHED);
            supportRepo.save(support);
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType("FINISHED");
            return r;

        } catch (Exception e) {
            throw new RuntimeException("Erreur calcul picking", e);
        }
    }

    private PickingTaskResponse startNewSupport(User user) {
        List<Order> orders = orderRepo.findByStatus(STATUS_ORDER_TODO);
        if (orders.isEmpty()) {
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType("NO_ORDERS");
            return r;
        }
        Order order = orders.get(0);

        // --- Récupération Produits ---
        List<Product> productsFromOrder = new ArrayList<>();
        // TODO: Décommenter la ligne suivante quand Order aura la relation
        // productsFromOrder = order.getProducts();

        // Sécurité : si la liste est vide (pas encore de lien en base), on prend tout le catalogue
        // pour éviter le crash "Empty List"
        if (productsFromOrder.isEmpty()) {
            productsFromOrder = (List<Product>) productRepo.findAll();
            if (productsFromOrder.isEmpty()) throw new RuntimeException("Aucun produit en base !");
            // On en prend juste 1 ou 2 pour tester
            if (productsFromOrder.size() > 5) productsFromOrder = productsFromOrder.subList(0, 3);
        }

        List<BoxItem> productsToPack = new ArrayList<>();
        for (Product p : productsFromOrder) {
            Box box = Box.newBuilder()
                    .withId(String.valueOf(p.getProductId()))
                    .withSize(p.getWidth(), p.getHeight(), p.getLength())
                    .withWeight(p.getWeight())
                    .withRotate3D()
                    .build();
            productsToPack.add(new BoxItem(box, 1));
        }

        // --- Configuration Carton (Large pour éviter l'erreur de capacité) ---
        Container container = Container.newBuilder()
                .withDescription("Carton Standard")
                .withSize(200, 200, 200) // Très grand
                .withEmptyWeight(1)
                .withMaxLoadWeight(100000) // Très lourd
                .build();

        List<ContainerItem> containerItems = ContainerItem.newListBuilder()
                .withContainer(container)
                .build();

        LargestAreaFitFirstPackager packager = LargestAreaFitFirstPackager.newBuilder().build();
        PackagerResult result = packager.newResultBuilder()
                .withContainerItems(containerItems)
                .withBoxItems(productsToPack)
                .build();

        if (!result.isSuccess()) throw new RuntimeException("Packing échoué (Produits trop gros ?)");

        Container match = result.get(0);
        List<PlacementData> placementsToSave = new ArrayList<>();

        for (Placement p : match.getStack().getPlacements()) {
            PlacementData pd = new PlacementData();
            BoxStackValue stackValue = p.getStackValue();
            if (stackValue instanceof BoxStackValue) {
                pd.setProductId(((BoxStackValue) stackValue).getBox().getId());
            } else {
                pd.setProductId("-1");
            }
            pd.setX(p.getAbsoluteX());
            pd.setY(p.getAbsoluteY());
            pd.setZ(p.getAbsoluteZ());
            placementsToSave.add(pd);
        }

        Support support = new Support();
        support.setPreparedBy(user);
        support.setOrder(order);
        support.setStatus(STATUS_SUPPORT_IN_PROGRESS);
        support.setTypeId(1); // Valeur par défaut pour éviter l'erreur typeid NOT NULL

        try {
            support.setNestedProductsPlacements(objectMapper.writeValueAsString(placementsToSave));
        } catch(Exception e) { throw new RuntimeException(e); }

        supportRepo.save(support);

        // Création des lignes Contain
        for (Product p : productsFromOrder) {
            Contain c = new Contain();
            c.setSupport(support); // Setter Lombok
            c.setProduct(p);       // Setter Lombok
            c.setApprovedQuantity(1);
            c.setServedQuantity(0);
            c.setMissingItems(false); // missing = approved (1) - served (0)
            containRepo.save(c);
        }

        PickingTaskResponse resp = new PickingTaskResponse();
        resp.setType("NEW_SUPPORT");
        resp.setSupportId(support.getSupportId());
        return resp;
    }
}