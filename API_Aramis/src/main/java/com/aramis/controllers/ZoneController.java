package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.DrivewayResponse;
import com.aramis.models.driveway.Driveway;
import com.aramis.models.driveway.DrivewayRepository;
import com.aramis.models.zone.Zone;
import com.aramis.models.zone.ZoneRepository;
import com.aramis.utils.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/zone")
@Slf4j
public class ZoneController {

    private final ZoneRepository zoneRepository;

    public ZoneController(ZoneRepository zoneRepository) {
        this.zoneRepository = zoneRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<Zone> getById(@PathVariable Integer id) {
        Optional<Zone> zone = zoneRepository.findById(id);
        return zone.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<Iterable<Zone>> getAll(@PageableDefault(size = 20, sort = "zoneID") Pageable pageable) {
        var driveways = zoneRepository.findAll(pageable);

        List<Zone> zoneResponses = new ArrayList<>();
        for (Zone zone : driveways) {
            zoneResponses.add(zone);
        }

        return ResponseEntity.ok(zoneResponses);
    }
}

