package com.azulyoro.back.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
public class Cliente extends Persona{

    private String businessName;

    @OneToMany(mappedBy = "cliente")
    private List<Services> services;
}