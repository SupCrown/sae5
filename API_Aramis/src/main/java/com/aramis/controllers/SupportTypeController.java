package com.aramis.controllers;

import com.aramis.dto.DrivewayResponse;
import com.aramis.dto.SupportTypeResponse;
import com.aramis.models.driveway.Driveway;
import com.aramis.models.driveway.DrivewayRepository;
import com.aramis.models.supportType.SupportType;
import com.aramis.models.supportType.SupportTypeRepository;
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
@RequestMapping("/supportType")
@Slf4j
public class SupportTypeController {

    private final SupportTypeRepository supportTypeRepository;

    public SupportTypeController(SupportTypeRepository supportTypeRepository) {
        this.supportTypeRepository = supportTypeRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupportTypeResponse> getById(@PathVariable Integer id) {
        Optional<SupportType> type = supportTypeRepository.findById(id);
        return type.map(value -> ResponseEntity.ok(new SupportTypeResponse(value))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<Iterable<SupportTypeResponse>> getAll(@PageableDefault(size = 20, sort = "typeID") Pageable pageable) {
        var types = supportTypeRepository.findAll(pageable);

        List<SupportTypeResponse> typesResponses = new ArrayList<>();
        for(SupportType type : types) {
            typesResponses.add(new SupportTypeResponse(type));
        }

        return ResponseEntity.ok(typesResponses);
    }
}

