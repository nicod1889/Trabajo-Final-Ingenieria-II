package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "viaje")
public class Viaje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "camion_id")
    private Camion camion;

    @ManyToOne
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "carga_id")
    private Carga carga;

    private Double precio;

    private LocalDate fechaSalida;

    private LocalDate fechaEstimadaEntrega;

    @Enumerated(value = EnumType.STRING)
    private ServiceStatus estado;

    @ManyToOne
    private Pay pago;
}
