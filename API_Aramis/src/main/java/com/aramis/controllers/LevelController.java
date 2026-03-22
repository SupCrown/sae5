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

import javax.swing.text.AbstractDocument;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/position")
@Slf4j
public class LevelController {

    private final LevelRepository levelRepository;

    public LevelController(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }


    @Authorize(roles = Role.ADMIN)
    @GetMapping("/all")
    public ResponseEntity<Iterable<Level>> getAll(@PageableDefault(size = 20, sort = "locationID") Pageable pageable) {
        var levels = levelRepository.findAll(pageable);

        List<Level> levelsResponses = new ArrayList<>();
        for(Level level : levels) {
            levelsResponses.add(level);
        }

        return ResponseEntity.ok(levelsResponses);
    }
}

