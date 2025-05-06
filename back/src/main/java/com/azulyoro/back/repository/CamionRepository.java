package com.azulyoro.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.azulyoro.back.model.Camion;

@Repository
public interface CamionRepository extends JpaRepository<Camion, Long> {
    @Modifying
    @Query("update Camion v set v.isDeleted = true where v.id = ?1")
    void softDelete(Long id);
}
