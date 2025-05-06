package com.azulyoro.back.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.CamionRequestDto;
import com.azulyoro.back.dto.response.CamionResponseDto;
import com.azulyoro.back.service.EntityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/camiones")
@CrossOrigin
public class CamionController {

    @Autowired
    private EntityService<CamionRequestDto, CamionResponseDto> service;

    @GetMapping("/all")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<List<CamionResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<CamionResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ROL_ADMIN')")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_ADMIN')")
    public ResponseEntity<CamionResponseDto> create(@Valid @RequestBody CamionRequestDto camionDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(camionDto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_ADMIN')")
    public ResponseEntity<CamionResponseDto> update(@PathVariable Long id,
            @Valid @RequestBody CamionRequestDto camionDto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(id, camionDto));
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public CustomPage<CamionResponseDto> getCamions(Pageable pageable) {
        return service.getByPage(pageable);
    }
}
