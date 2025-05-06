package com.azulyoro.back.controller;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.EmpleadoResponseDto;
import com.azulyoro.back.service.IEmpleadoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/empleados")
@CrossOrigin
public class EmpleadoController {
    @Autowired
    private IEmpleadoService empleadoService;

    @GetMapping("/all")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<List<EmpleadoResponseDto>> getAll() {
        return ResponseEntity.ok(empleadoService.getAll());
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public ResponseEntity<EmpleadoResponseDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(empleadoService.getById(id));
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ROL_ADMIN')")
    public ResponseEntity<Void> deleteById(@PathVariable Long id){
        empleadoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    //@PreAuthorize("hasRole('ROL_ADMIN')")
    public ResponseEntity<EmpleadoResponseDto> create(@Valid @RequestBody RegisterRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(empleadoService.create(dto));
    }

    @PutMapping("/{id}")
    //@PreAuthorize("hasRole('ROL_ADMIN')")
    public ResponseEntity<EmpleadoResponseDto> update(@PathVariable Long id, @Valid @RequestBody RegisterRequest dto){
        return ResponseEntity.status(HttpStatus.OK).body(empleadoService.update(id, dto));
    }

    @GetMapping
    //@PreAuthorize("hasAnyRole('ROL_ADMINISTRATIVO', 'ROL_CAMIONERO', 'ROL_ADMIN')")
    public CustomPage<EmpleadoResponseDto> getByPage(Pageable pageable) {
        return empleadoService.getByPage(pageable);
    }
}
