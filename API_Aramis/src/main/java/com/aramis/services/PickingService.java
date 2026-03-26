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
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.*;

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

        if (currentSupport.isPresent()) {
            Support support = currentSupport.get();
            PickingTaskResponse resp = calculateNextProduct(support, true, false);
            resp.setOrderID(support.getOrder().getOrderID());
            return resp;
        } else {
            return startNewOrder(user.get());
        }
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
        Optional<User> userOpt = userRepo.findByLogin(login);
        if (userOpt.isEmpty()) throw new RuntimeException("User introuvable Login: " + login);
        User user = userOpt.get();

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
                PickingTaskResponse resp = calculateNextProduct(nextSupport, true, false);
                resp.setOrderID(order.getOrderID());
                return resp;
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
                plan = getProductPlacements(support);
            } else {
                plan = objectMapper.readValue(
                        nestedPlacements,
                        new TypeReference<>(){}
                );
            }

            List<Contain> contents = containRepo.findBySupport(support);

            PickingTaskResponseAndContainID resp = getCurrentStep(plan, contents);;
            if (initOrder) {
                resp.response.setPlacedProducts(getPlacedProductPlacements(support));
            } else {
                updateSupport(resp.containID, missingItem);

                if (missingItem) {
                    plan = getProductPlacements(support);
                }

                resp = getCurrentStep(plan, contents);
            }

            if (resp.response != null) {
                if (support.getStatus() == EPrepareStatus.Pending) {
                    support.setStatus(EPrepareStatus.Preparing);
                    supportRepo.save(support);
                }
                return resp.response;
            }

            support.setStatus(EPrepareStatus.Done);
            support.setDatePreparation(Date.valueOf(LocalDate.now()));
            supportRepo.save(support);
            PickingTaskResponse r = new PickingTaskResponse();
            r.setType(PickingTaskResponseType.FINISHED);
            return r;

        } catch (Exception e) {
            throw new RuntimeException("Erreur calcul picking", e);
        }
    }

    private List<ProductPlacement> getProductPlacements(Support support) throws JsonProcessingException {
        List<Contain> contains = containRepo.findAllBySupportId(support.getSupportID());
        List<Product> products = SupportService.calculSupport(productRepo.findProductsBySupportID(support.getSupportID()), contains);

        List<ProductPlacement> plan = SupportService.calculateOptimisedSupport(products, support.getType());

        ObjectMapper objectMapper = new ObjectMapper();
        String nestedPlacements = objectMapper.writeValueAsString(plan);

        support.setNestedProductsPlacements(nestedPlacements);
        supportRepo.save(support);
        return plan;
    }

    private List<ProductPlacement> getPlacedProductPlacements(Support support) throws JsonProcessingException {
        List<ProductPlacement> plan = objectMapper.readValue(
                support.getNestedProductsPlacements(),
                new TypeReference<>(){}
        );

        List<Contain> contains = containRepo.findAllBySupportId(support.getSupportID());
        return SupportService.calculatePlacedSupport(plan, contains);
    }

    private static PickingTaskResponseAndContainID getCurrentStep(List<ProductPlacement> plan, List<Contain> contents) {
        PickingTaskResponseAndContainID resp = new PickingTaskResponseAndContainID();
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

                resp.response = new PickingTaskResponse();
                resp.response.setType(PickingTaskResponseType.PICK_PRODUCT);
                resp.response.setStep(nextStep);
                resp.response.setPlacedQuantity(contain.getServedQuantity());
                resp.response.setQuantityToPlace(contain.getApprovedQuantity());
                resp.response.setLocation(contain.getProduct().getLocation().toString());
                resp.containID = contain.getContainID();
                break;
            }
        }
        return resp;
    }

    private void updateSupport(int containID, boolean missingItem) {
        Optional<Contain> contain = containRepo.findById(containID);

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
    public PickingTaskResponse getNextStep(int userID, int orderID, boolean missingItem) {
        Order order = orderRepo.findById(orderID)
                .orElseThrow(() -> new RuntimeException("Commande introuvable ID: " + orderID));

        Iterable<Support> supportsIterable = supportRepo.findAllByOrderOrderBySupportIDDesc(order);

        List<Support> supports = new ArrayList<>();
        for (Support support: supportsIterable) {
            supports.add(support);
        }
        supports.sort(Comparator.comparingInt(Support::getSupportID));

        Optional<Support> currentSupport = supports.stream()
                .filter(s -> s.getStatus() == EPrepareStatus.Preparing && s.getUser().getUserID() == userID)
                .findFirst();

        try {
            PickingTaskResponse nextStep = null;
            if (currentSupport.isPresent())
            {
                nextStep = calculateNextProduct(currentSupport.get(), false, missingItem);
            }
            if (nextStep == null || nextStep.getType() == PickingTaskResponseType.FINISHED) {
                for (Support support : supports) {
                    if (support.getStatus() == EPrepareStatus.Done) {
                        continue;
                    }

                    if (support.getUser() == null ) {
                        throw new RuntimeException("Commande non débutée.");
                    }

                    if (support.getUser().getUserID() != userID) {
                        throw new RuntimeException("Commande déjà commencée par un utilisateur.");
                    }

                    if (nextStep == null || nextStep.getType() == PickingTaskResponseType.FINISHED) {
                        nextStep = calculateNextProduct(support, false, missingItem);
                    }
                }
            }

            if (nextStep == null || nextStep.getType() == PickingTaskResponseType.FINISHED) {
                order.setStatus(EPrepareStatus.Done);
                orderRepo.save(order);
                PickingTaskResponse r = new PickingTaskResponse();
                r.setType(PickingTaskResponseType.FINISHED);
                return r;
            }

            nextStep.setOrderID(orderID);
            return nextStep;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du calcul de l'étape suivante", e);
        }
    }

    private static class PickingTaskResponseAndContainID {
        public PickingTaskResponse response;
        public int containID;

        public PickingTaskResponseAndContainID() {
        }
    }
}