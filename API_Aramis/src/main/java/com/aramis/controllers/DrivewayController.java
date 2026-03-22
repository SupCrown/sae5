package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.LocationRequest;
import com.aramis.models.driveway.Driveway;
import com.aramis.models.driveway.DrivewayRepository;
import com.aramis.models.level.Level;
import com.aramis.models.level.LevelRepository;
import com.aramis.models.location.Location;
import com.aramis.models.location.LocationRepository;
import com.aramis.utils.Role;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/driveway")
@Slf4j
public class DrivewayController {

    private final DrivewayRepository drivewayRepository;

    public DrivewayController(DrivewayRepository drivewayRepository) {
        this.drivewayRepository = drivewayRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<Driveway> getById(@PathVariable Integer id) {
        Optional<Driveway> driveway = drivewayRepository.findById(id);
        return driveway.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<Iterable<Driveway>> getAll(@PageableDefault(size = 20, sort = "locationID") Pageable pageable) {
        var driveways = drivewayRepository.findAll(pageable);

        List<Driveway> drivewaysResponses = new ArrayList<>();
        for(Driveway driveway : driveways) {
            drivewaysResponses.add(driveway);
        }

        return ResponseEntity.ok(drivewaysResponses);
    }
}

