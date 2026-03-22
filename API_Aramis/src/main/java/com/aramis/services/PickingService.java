package com.aramis.services;

import com.aramis.dto.PickingTaskResponse;
import com.aramis.dto.ProductPlacement;
import com.aramis.dto.ProductSupportFormBD;
import com.aramis.models.contain.Contain;
import com.aramis.models.contain.ContainRepository;
import com.aramis.utils.EPrepareStatus;
import com.aramis.models.order.Order;
import com.aramis.models.order.OrderRepository;
import com.aramis.models.product.Product;
import com.aramis.models.product.ProductRepository;
import com.aramis.models.support.Support;
import com.aramis.models.support.SupportRepository;
import com.aramis.models.user.User;
import com.aramis.models.user.UserRepository;
import com.aramis.utils.PickingTaskResponseType;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class PickingService {

    private final SupportRepository supportRepo;
    private final ContainRepository containRepo;
    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PickingService(SupportRepository supportRepo, ContainRepository containRepo,
                          OrderRepository orderRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.supportRepo = supportRepo;
        this.containRepo = containRepo;
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    // ========================================================================
    // LOGIQUE : AUTO-ASSIGNATION
    // ========================================================================
    @Transactional
    public PickingTaskResponse getNextTask(int id) {
        Optional<User> user = userRepo.findById(id);
        if (user.isEmpty()) throw new RuntimeException("User introuvable id: " + id);

        Optional<Support> currentSupport = supportRepo.findByUserAndStatus(user.get(), EPrepareStatus.Preparing);

        return currentSupport.map(support -> calculateNextProduct(support, true, false)).orElseGet(() -> startNewOrder(user.get()));
    }

    private PickingTaskResponse startNewOrder(User user) {
        List<Order> orders = orderRepo.findByStatusOrderByPriorityDesc(EPrepareStatus.Pending);
        if (orders.isEmpty()) {
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType(PickingTaskResponseType.NO_ORDERS);
            return r;
        }
        Order order = orders.get(0);
        order.setStatus(EPrepareStatus.Preparing);
        order = orderRepo.save(order);

        // On retourne la prochaine étape à préparer
        return getNextStepToStartPreparingOrder(user, order);
    }

    // ========================================================================
    // LOGIQUE : ASSIGNATION MANUELLE
    // ========================================================================
    @Transactional
    public PickingTaskResponse assignOrderManually(int login, int orderId) {
        User user = userRepo.findByLogin(login);
        if (user == null) throw new RuntimeException("User introuvable Login: " + login);

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable ID: " + orderId));

        if (order.getStatus() != EPrepareStatus.Pending) {
            throw new RuntimeException("Cette commande ne peut pas être préparée (Statut: " + order.getStatus() + ")");
        }

        // Si l'utilisateur a déjà une commande en cours, on met simplement cette commande
        // en "file d'attente" pour être la prochaine (priorité).
        Optional<Support> currentSupport = supportRepo.findByUserAndStatus(user, EPrepareStatus.Preparing);
        if (currentSupport.isPresent()) {
            order.setPriority(true);
            orderRepo.save(order);

            PickingTaskResponse queued = new PickingTaskResponse();
            queued.setType(PickingTaskResponseType.QUEUED);
            return queued;
        }

        order.setStatus(EPrepareStatus.Preparing);
        order = orderRepo.save(order);

        // On retourne la prochaine étape à préparer
        return getNextStepToStartPreparingOrder(user, order);
    }


    // ========================================================================
    // LOGIQUE COMMUNE : PACKING ET SAUVEGARDE
    // ========================================================================
    private PickingTaskResponse getNextStepToStartPreparingOrder(User user, Order order) {
        Iterable<Support> supports = supportRepo.findAllByOrder(order);

        List<Support> orderSupports = new ArrayList<>();
        for (Support orderSupport : supports) {
            orderSupports.add(orderSupport);
        }
        orderSupports.sort(Comparator.comparingInt(Support::getSupportID));

        if (!orderSupports.isEmpty()) {
            Support nextSupport = null;
            for (Support support : orderSupports) {
                support.setUser(user);
                support = supportRepo.save(support);

                if (nextSupport == null && support.getStatus() == EPrepareStatus.Pending) {
                    support.setStatus(EPrepareStatus.Preparing);
                    nextSupport = supportRepo.save(support);
                }
            }
            if (nextSupport != null) {
                return calculateNextProduct(nextSupport, true, false);
            }
        }
        PickingTaskResponse resp = new PickingTaskResponse();
        resp.setType(PickingTaskResponseType.NO_ORDERS);
        return resp;
    }

    // ========================================================================
    // LOGIQUE : CONTINUER LE SUPPORT EN COURS
    // ========================================================================
    private PickingTaskResponse calculateNextProduct(Support support, boolean initOrder, boolean missingItem) {
        try {
            String nestedPlacements = support.getNestedProductsPlacements();
            List<ProductPlacement> plan;
            if(nestedPlacements == null || nestedPlacements.isEmpty()) {
                Iterable<ProductSupportFormBD> products = productRepo.findAllProductBySupportID(support.getSupportID());

                List<Product> productsToNest = new ArrayList<>();
                for (Product product : products) {
                    productsToNest.add(product);
                }

                plan = SupportService.calculateOptimisedSupport(productsToNest, support.getType());

                ObjectMapper objectMapper = new ObjectMapper();
                nestedPlacements = objectMapper.writeValueAsString(plan);

                support.setNestedProductsPlacements(nestedPlacements);
                supportRepo.save(support);
            } else {
                plan = objectMapper.readValue(
                        nestedPlacements,
                        new TypeReference<>(){}
                );
            }

            List<Contain> contents = containRepo.findBySupport(support);

            PickingTaskResponse resp = getCurrentStep(plan, contents);
            if (!initOrder) {
                updateSupport(support, resp.getStep().getProductId(), missingItem);
                resp = getCurrentStep(plan, contents);
            }

            if (resp != null) {
                return resp;
            }

            support.setStatus(EPrepareStatus.Done);
            supportRepo.save(support);
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType(PickingTaskResponseType.FINISHED);
            return r;

        } catch (Exception e) {
            throw new RuntimeException("Erreur calcul picking", e);
        }
    }

    private static PickingTaskResponse getCurrentStep(List<ProductPlacement> plan, List<Contain> contents) {
        PickingTaskResponse resp = null;
        for (ProductPlacement step : plan) {
            int pId = step.getProductId();

            Optional<Contain> match = contents.stream()
                    .filter(c -> c.getProduct() != null && c.getProduct().getProductID().equals(pId))
                    .findFirst();

            if (
                match.isPresent()
                && match.get().getServedQuantity() < match.get().getApprovedQuantity()
                && !match.get().isMissingItems()
            ) {
                Contain contain = match.get();

                List<ProductPlacement> sameProduct = plan.stream().filter(s -> s.getProductId() == pId).toList();
                ProductPlacement nextStep = sameProduct.get(contain.getServedQuantity());

                resp = new PickingTaskResponse();
                resp.setType(PickingTaskResponseType.PICK_PRODUCT);
                resp.setStep(nextStep);
                resp.setPlacedQuantity(contain.getServedQuantity());
                break;
            }
        }
        return resp;
    }

    private void updateSupport(Support support, int productID, boolean missingItem) {
        Optional<Contain> contain = containRepo.findBySupportAndProductProductID(support, productID);

        if (contain.isPresent()) {
            Contain currentContain = contain.get();

            if (missingItem) {
                currentContain.setMissingItems(true);
            } else {
                currentContain.setServedQuantity(currentContain.getServedQuantity() + 1);
            }

            containRepo.save(currentContain);
        }
    }

    // ========================================================================
    // LOGIQUE : /order/nextStep
    // Renvoie l'étape suivante sous la forme [[(x,y,z),(w,l,h)], ...]
    // et termine le support si toutes les quantités sont servies
    // ou marquées comme manquantes.
    // ========================================================================
    @Transactional
    public PickingTaskResponse getNextStep(int userId, int orderId, boolean missingItem) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable ID: " + orderId));

        Iterable<Support> supports = supportRepo.findAllByOrderOrderBySupportIDDesc(order);

        try {
            PickingTaskResponse nextStep = null;
            for (Support support : supports) {
                if (support.getUser() == null ) {
                    throw new RuntimeException("Commande non débutée.");
                }

                if (support.getUser().getUserID() != userId) {
                    throw new RuntimeException("Commande déjà commencée par un utilisateur.");
                }

                if (nextStep == null || nextStep.getType() == PickingTaskResponseType.FINISHED) {
                    nextStep = calculateNextProduct(support, false, missingItem);
                }
            }

            return nextStep;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du calcul de l'étape suivante", e);
        }
    }
}