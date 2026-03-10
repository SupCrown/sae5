package com.aramis.controllers;

import com.aramis.dto.PickingTaskResponse;
import com.aramis.services.PickingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/order")
public class OrderController {

    private final PickingService pickingService;

    public OrderController(PickingService pickingService) {
        this.pickingService = pickingService;
    }

    // Endpoint 1 : Attribution Automatique
    @PostMapping("/autoAssign")
    public ResponseEntity<PickingTaskResponse> autoAssign(
            @RequestParam(name = "PreparateurID") int preparateurId
    ) {
        PickingTaskResponse task = pickingService.getNextTask(preparateurId);
        return ResponseEntity.ok(task);
    }

    // Endpoint 2 : Attribution Manuelle
    @PostMapping("/manualAssign")
    public ResponseEntity<PickingTaskResponse> manualAssign(
            @RequestParam(name = "PreparateurID") int preparateurId,
            @RequestParam(name = "CommandeID") Long orderId) {

        PickingTaskResponse task = pickingService.assignOrderManually(preparateurId, orderId);
        return ResponseEntity.ok(task);
    }

    // Endpoint 3 : Étape suivante de la commande
    @PostMapping("/nextStep")
    public ResponseEntity<java.util.List<java.util.List<java.util.List<Integer>>>> nextStep(
            @RequestParam(name = "CommandeID") Long orderId
    ) {
        var nextStep = pickingService.getNextStep(orderId);
        return ResponseEntity.ok(nextStep);
    }
}