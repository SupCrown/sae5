package com.aramis.controllers;

import com.aramis.dto.LocationRequest;
import com.aramis.models.driveway.Driveway;
import com.aramis.models.driveway.DrivewayRepository;
import com.aramis.models.level.Level;
import com.aramis.models.level.LevelRepository;
import com.aramis.models.location.Location;
import com.aramis.models.location.LocationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Optional;

@RestController
@RequestMapping("/position")
public class PositionController {

    private final LocationRepository locationRepository;
    private final DrivewayRepository drivewayRepository;
    private final LevelRepository levelRepository;

    public PositionController(LocationRepository locationRepository, DrivewayRepository drivewayRepository, LevelRepository levelRepository) {
        this.locationRepository = locationRepository;
        this.drivewayRepository = drivewayRepository;
        this.levelRepository = levelRepository;
    }

    @GetMapping("/create")
    public ResponseEntity<LocationRequest> createForm() {
        return ResponseEntity.ok(new LocationRequest());
    }

    @PostMapping("/create")
    public ResponseEntity<Location> create(@RequestBody LocationRequest request) {
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

        Location saved = locationRepository.save(location);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/update/{id}")
    public ResponseEntity<Location> getForUpdate(@PathVariable Integer id) {
        Optional<Location> location = locationRepository.findById(id);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<Location> update(@PathVariable Integer id, @RequestBody LocationRequest request) {
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

        Location saved = locationRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!locationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        locationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Location> getById(@PathVariable Integer id) {
        Optional<Location> location = locationRepository.findById(id);
        return location.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}

