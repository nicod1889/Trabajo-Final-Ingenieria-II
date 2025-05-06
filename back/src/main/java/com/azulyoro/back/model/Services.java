package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "service")
public class Services {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "camion_id")
    private Camion camion;

    @ManyToMany
    @JoinTable(
            name = "rel_service_empleado",
            joinColumns = @JoinColumn(name = "FK_SERVICE", nullable = false),
            inverseJoinColumns = @JoinColumn(name="FK_EMPLOYEE", nullable = false)
    )
    private List<Empleado> empleados;

    @ManyToOne
    private ServiceType serviceType;

    private Double price;

    private LocalDate startDate;

    private LocalDate finalDate;

    @Enumerated(value = EnumType.STRING)
    private ServiceStatus status;

    @ManyToOne
    private Pay pay;
}
