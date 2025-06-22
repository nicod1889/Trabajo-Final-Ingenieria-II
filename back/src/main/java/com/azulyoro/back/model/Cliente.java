package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Persona{

    private String razonSocial;

    @OneToMany(mappedBy = "cliente")
    private List<Services> services;
}