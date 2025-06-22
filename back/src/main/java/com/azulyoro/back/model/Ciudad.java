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
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Provincia provincia;

    @OneToMany(mappedBy = "origen")
    private List<Viaje> viajesComoOrigen;

    @OneToMany(mappedBy = "destino")
    private List<Viaje> viajesComoDestino;

    private boolean isDeleted;
}
