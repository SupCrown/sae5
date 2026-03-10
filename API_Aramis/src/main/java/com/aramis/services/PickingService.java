package com.aramis.services;

import com.aramis.dto.PickingTaskResponse;
import com.aramis.dto.PlacementData;
import com.aramis.models.contain.Contain;
import com.aramis.models.contain.ContainRepository;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.models.product.Product;
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

    // ========================================================================
    // LOGIQUE : AUTO-ASSIGNATION
    // ========================================================================
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

    private PickingTaskResponse startNewSupport(User user) {
        List<Order> orders = orderRepo.findByStatusOrderByPriorityDesc(STATUS_ORDER_TODO);
        if (orders.isEmpty()) {
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType("NO_ORDERS");
            return r;
        }
        Order order = orders.get(0);

        // On délègue la création du carton à la méthode commune
        return createSupportForOrder(user, order);
    }

    // ========================================================================
    // LOGIQUE : ASSIGNATION MANUELLE
    // ========================================================================
    @Transactional
    public PickingTaskResponse assignOrderManually(int login, Long orderId) {
        User user = userRepo.findByLogin(login);
        if (user == null) throw new RuntimeException("User introuvable Login: " + login);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable ID: " + orderId));

        if (order.getStatus() != STATUS_ORDER_TODO) {
            throw new RuntimeException("Cette commande ne peut pas être préparée (Statut: " + order.getStatus() + ")");
        }

        // Si l'utilisateur a déjà une commande en cours, on met simplement cette commande
        // en "file d'attente" pour être la prochaine (priorité) et on ne crée PAS
        // de nouveau support tout de suite.
        Optional<Support> currentSupport = supportRepo.findByPreparedByAndStatus(user, STATUS_SUPPORT_IN_PROGRESS);
        if (currentSupport.isPresent()) {
            order.setPriority(true);
            orderRepo.save(order);

            PickingTaskResponse queued = new PickingTaskResponse();
            queued.setType("QUEUED");
            queued.setSupportId(null);
            return queued;
        }

        // On délègue la création du carton à la méthode commune
        return createSupportForOrder(user, order);
    }


    // ========================================================================
    // LOGIQUE COMMUNE : PACKING ET SAUVEGARDE
    // ========================================================================
    private PickingTaskResponse createSupportForOrder(User user, Order order) {
        List<Product> productsFromOrder = new ArrayList<>();
        // TODO: productsFromOrder = order.getProducts();

        if (productsFromOrder.isEmpty()) {
            productsFromOrder = (List<Product>) productRepo.findAll();
            if (productsFromOrder.isEmpty()) throw new RuntimeException("Aucun produit en base !");
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

        Container container = Container.newBuilder()
                .withDescription("Carton Standard")
                .withSize(200, 200, 200)
                .withEmptyWeight(1)
                .withMaxLoadWeight(100000)
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
        support.setTypeId(1);

        try {
            support.setNestedProductsPlacements(objectMapper.writeValueAsString(placementsToSave));
        } catch(Exception e) { throw new RuntimeException(e); }

        supportRepo.save(support);

        for (Product p : productsFromOrder) {
            Contain c = new Contain();
            c.setSupport(support);
            c.setProduct(p);
            c.setApprovedQuantity(1);
            c.setServedQuantity(0);
            c.setMissingItems(false);
            containRepo.save(c);
        }

        PickingTaskResponse resp = new PickingTaskResponse();
        resp.setType("NEW_SUPPORT");
        resp.setSupportId(support.getSupportId());
        return resp;
    }

    // ========================================================================
    // LOGIQUE : CONTINUER LE SUPPORT EN COURS
    // ========================================================================
    private PickingTaskResponse calculateNextProduct(Support support) {
        try {
            List<PlacementData> plan = objectMapper.readValue(
                    support.getNestedProductsPlacements(),
                    new TypeReference<List<PlacementData>>(){}
            );

            List<Contain> contents = containRepo.findBySupport(support);

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

    // ========================================================================
    // LOGIQUE : /order/nextStep
    // Renvoie l'étape suivante sous la forme [[(x,y,z),(w,l,h)], ...]
    // et termine le support si toutes les quantités sont servies
    // ou marquées comme manquantes.
    // ========================================================================
    @Transactional
    public List<List<List<Integer>>> getNextStep(Long orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable ID: " + orderId));

        Support support = supportRepo.findFirstByOrderOrderBySupportIdDesc(order)
                .orElseThrow(() -> new RuntimeException("Aucun support associé à cette commande"));

        try {
            List<PlacementData> plan = objectMapper.readValue(
                    support.getNestedProductsPlacements(),
                    new TypeReference<List<PlacementData>>() {}
            );

            List<Contain> contents = containRepo.findBySupport(support);

            // État temporaire pour raisonner sur les quantités restantes
            List<Contain> tempState = new ArrayList<>();
            for (Contain c : contents) {
                Contain copy = new Contain();
                copy.setProduct(c.getProduct());
                copy.setServedQuantity(c.getServedQuantity());
                copy.setApprovedQuantity(c.getApprovedQuantity());
                copy.setMissingItems(c.isMissingItems());
                tempState.add(copy);
            }

            // Cherche la prochaine position à servir (étape suivante)
            for (PlacementData step : plan) {
                Long pId = Long.valueOf(step.getProductId());

                Optional<Contain> match = tempState.stream()
                        .filter(c -> c.getProduct() != null && c.getProduct().getProductId().equals(pId))
                        .findFirst();

                if (match.isEmpty()) {
                    continue;
                }

                Contain line = match.get();

                // Si toute la quantité validée est déjà servie
                // ou qu'il y a au moins un colis manquant, on passe au placement suivant
                if (line.getServedQuantity() >= line.getApprovedQuantity() || line.isMissingItems()) {
                    continue;
                }

                // Sinon, on renvoie l'étape suivante pour ce produit
                Product product = line.getProduct();

                List<Integer> position = List.of(step.getX(), step.getY(), step.getZ());
                List<Integer> dimension = List.of(product.getWidth(), product.getLength(), product.getHeight());

                List<List<Integer>> singleStep = List.of(position, dimension);
                List<List<List<Integer>>> response = new ArrayList<>();
                response.add(singleStep);
                return response;
            }

            // Si on arrive ici, toutes les lignes sont soit servies,
            // soit marquées avec des colis manquants : on clôt le support.
            support.setStatus(STATUS_SUPPORT_FINISHED);
            supportRepo.save(support);

            // On retourne un tableau vide pour signifier qu'il n'y a plus d'étape.
            return new ArrayList<>();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du calcul de l'étape suivante", e);
        }
    }
}