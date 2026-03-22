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
@RequestMapping("/position")
@Slf4j
public class PositionController {

    private final LocationRepository locationRepository;
    private final DrivewayRepository drivewayRepository;
    private final LevelRepository levelRepository;

    public PositionController(LocationRepository locationRepository, DrivewayRepository drivewayRepository, LevelRepository levelRepository) {
        this.locationRepository = locationRepository;
        this.drivewayRepository = drivewayRepository;
        this.levelRepository = levelRepository;
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/create")
    public ResponseEntity<Object> create(@RequestBody LocationRequest request) {
        Optional<Driveway> drivewayOpt = drivewayRepository.findById(request.getDrivewayId());
        Optional<Level> levelOpt = levelRepository.findById(request.getLevelId());

        if (drivewayOpt.isEmpty() || levelOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Timestamp now = new Timestamp(System.currentTimeMillis());

        Location location = new Location();
        location.setLocationCode(request.getLocationCode());
        location.setDriveway(drivewayOpt.get());
        location.setLevel(levelOpt.get());
        location.setDateCreation(now);
        location.setDateModification(now);

        try {
            Location saved = locationRepository.save(location);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            log.error("Error while creating location", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    @Authorize(roles = Role.ADMIN)
    @PostMapping("/update/{id}")
    public ResponseEntity<Object> update(@PathVariable Integer id, @RequestBody LocationRequest request) {
        Optional<Location> existingOpt = locationRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Driveway> drivewayOpt = drivewayRepository.findById(request.getDrivewayId());
        Optional<Level> levelOpt = levelRepository.findById(request.getLevelId());

        if (drivewayOpt.isEmpty() || levelOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        Location existing = existingOpt.get();
        existing.setLocationCode(request.getLocationCode());
        existing.setDriveway(drivewayOpt.get());
        existing.setLevel(levelOpt.get());
        existing.setDateModification(new Timestamp(System.currentTimeMillis()));

        try {
            Location saved = locationRepository.save(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error while updating location", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    @Authorize(roles = Role.ADMIN)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Object> delete(@PathVariable Integer id) {
        if (!locationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            locationRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error while deleting location", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request: " + e.getMessage());
        }
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable Integer id) {
        Optional<Location> location = locationRepository.findById(id);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<Iterable<Location>> getAll(@PageableDefault(size = 20, sort = "locationID") Pageable pageable) {
        var locations = locationRepository.findAll(pageable);

        List<Location> locationsResponses = new ArrayList<>();
        for(Location location : locations) {
           locationsResponses.add(location);
        }

        return ResponseEntity.ok(locationsResponses);
    }
}

