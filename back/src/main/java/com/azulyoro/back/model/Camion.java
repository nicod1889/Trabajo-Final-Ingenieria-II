package com.azulyoro.back.model;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Camion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String patente;

    @ManyToOne
    @JoinColumn(name = "marca_id")
    private Marca marca;

    @Column(nullable = false)
    private String modelo;

    @Column(nullable = false)
    private Integer anio;

    @Column(nullable = false)
    private Integer km;

    @Column(nullable = false, unique = true)
    private String numeroChasis;

    @Column(nullable = false, unique = true)
    private String numeroMotor;

    private String observaciones;

    @OneToMany(mappedBy = "camion")
    private List<Services> services;

    @OneToMany(mappedBy = "camion")
    private List<Viaje> viajes;

    private boolean isDeleted;
}
