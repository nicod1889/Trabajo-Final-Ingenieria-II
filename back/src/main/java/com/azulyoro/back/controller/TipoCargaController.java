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
import com.azulyoro.back.dto.request.TipoCargaRequestDto;
import com.azulyoro.back.dto.response.TipoCargaResponseDto;
import com.azulyoro.back.service.EntityService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/tipo_cargas")
@CrossOrigin
public class TipoCargaController {

    @Autowired
    private EntityService<TipoCargaRequestDto, TipoCargaResponseDto> service;

    @GetMapping("/all")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<List<TipoCargaResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<TipoCargaResponseDto> getById(@PathVariable Long id) {
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
    public ResponseEntity<TipoCargaResponseDto> create(@Valid @RequestBody TipoCargaRequestDto tipoCargaDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(tipoCargaDto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_ADMIN')")
    public ResponseEntity<TipoCargaResponseDto> update(@PathVariable Long id,
            @Valid @RequestBody TipoCargaRequestDto tipoCargaDto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(id, tipoCargaDto));
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public CustomPage<TipoCargaResponseDto> getTipoCargas(Pageable pageable) {
        return service.getByPage(pageable);
    }
}
