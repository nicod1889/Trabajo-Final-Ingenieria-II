package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Getter
@Setter
@Table(name = "viaje")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "num_orden", nullable = false, unique = true)
    private Integer numOrden;

    @ManyToOne
    @JoinColumn(name = "ciudad_origen_id", nullable = false)
    private Ciudad origen;

    @ManyToOne
    @JoinColumn(name = "ciudad_destino_id", nullable = false)
    private Ciudad destino;

    @Column(name = "fecha_salida")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate fechaSalida;

    @Column(name = "fecha_estimada_entrega")
    private LocalDate fechaEstimadaEntrega;

    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "camion_id", nullable = false)
    private Camion camion;

    @ManyToOne
    @JoinColumn(name = "empleado_id", nullable = false)
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "carga_id", nullable = false)
    private Carga carga;

    @Column(name = "precio", nullable = false)
    private Double precio;
    
    @Enumerated(value = EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private ServiceStatus estado;

    @Column(name = "observaciones", length = 500)
    private String observaciones;
}
