package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;

@MappedSuperclass
@Getter
@Setter
public abstract class Persona {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String apellido;

    @Enumerated(EnumType.STRING)
    private TipoIdentificacion category;

    @Column(nullable = false, length = 50, unique = true)
    private Long identificationNumber;

    @Column(nullable = false, length = 50, unique = true)
    private String email;
    
    private boolean isDeleted;
}
