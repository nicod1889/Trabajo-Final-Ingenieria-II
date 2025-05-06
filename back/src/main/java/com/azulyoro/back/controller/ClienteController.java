package com.azulyoro.back.controller;

import com.azulyoro.back.dto.request.ClienteRequestDto;
import com.azulyoro.back.dto.response.ClienteResponseDto;
import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.service.EntityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
@CrossOrigin
public class ClienteController {
    @Autowired
    private EntityService<ClienteRequestDto, ClienteResponseDto> service;

    @GetMapping("/all")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<List<ClienteResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<ClienteResponseDto> getById(@PathVariable Long id) {
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
    public ResponseEntity<ClienteResponseDto> create(@Valid @RequestBody ClienteRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_ADMIN')")
    public ResponseEntity<ClienteResponseDto> update(@PathVariable Long id, @Valid @RequestBody ClienteRequestDto dto) {
        return ResponseEntity.status(HttpStatus.OK).body(service.update(id, dto));
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public CustomPage<ClienteResponseDto> getByPage(Pageable pageable) {
        return service.getByPage(pageable);
    }
}
