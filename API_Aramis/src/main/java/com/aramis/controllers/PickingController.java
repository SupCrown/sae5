package com.aramis.controllers;

import com.aramis.dto.PickingTaskResponse;
import com.aramis.services.PickingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/picking")
public class PickingController {

    private final PickingService pickingService;

    public PickingController(PickingService pickingService) {
        this.pickingService = pickingService;
    }

    @GetMapping("/next")
    public ResponseEntity<PickingTaskResponse> getNextStep(@RequestParam int login) {
        // Appelle le service qui contient toute la logique
        PickingTaskResponse task = pickingService.getNextTask(login);
        return ResponseEntity.ok(task);
    }
}