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
public class Carga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;

    @ManyToOne
    private TipoCarga tipoCarga;

    @OneToMany(mappedBy = "carga")
    private List<Viaje> viajes;

    private boolean isDeleted;
}
