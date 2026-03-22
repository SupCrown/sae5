package com.aramis.controllers;

import com.aramis.annotations.Authorize;
import com.aramis.dto.LevelResponse;
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
@RequestMapping("/level")
@Slf4j
public class LevelController {

    private final LevelRepository levelRepository;

    public LevelController(LevelRepository levelRepository) {
        this.levelRepository = levelRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LevelResponse> getById(@PathVariable Integer id) {
        Optional<Level> level = levelRepository.findById(id);
        return level.map(value -> ResponseEntity.ok(new LevelResponse(value))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<Iterable<LevelResponse>> getAll(@PageableDefault(size = 20, sort = "levelID") Pageable pageable) {
        var levels = levelRepository.findAll(pageable);

        List<LevelResponse> levelsResponses = new ArrayList<>();
        for(Level level : levels) {
            levelsResponses.add(new LevelResponse(level));
        }

        return ResponseEntity.ok(levelsResponses);
    }
}

