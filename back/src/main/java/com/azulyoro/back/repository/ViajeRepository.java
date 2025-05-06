package com.azulyoro.back.repository;

import com.azulyoro.back.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface ViajeRepository extends JpaRepository <Viaje, Long> {
    @Modifying
    @Query("update Viaje s set s.estado = 'CANCELLED' where s.id = ?1")
    void softDelete(Long id);

    @Query("select s.fechaSalida from Viaje s where s.id = ?1")
    LocalDate findFechaSalidaById(Long id);
}
