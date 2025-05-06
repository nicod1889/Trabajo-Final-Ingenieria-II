package com.azulyoro.back.repository;

import com.azulyoro.back.model.TipoCarga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoCargaRepository extends JpaRepository<TipoCarga, Long> {
    @Modifying
    @Query("update TipoCarga sp set sp.isDeleted = true where sp.id = ?1")
    void softDelete(Long id);
}