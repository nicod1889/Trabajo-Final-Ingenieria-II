package com.azulyoro.back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.azulyoro.back.model.Carga;

@Repository
public interface CargaRepository extends JpaRepository<Carga, Long> {
    @Modifying
    @Query("update Carga c set c.isDeleted = true where c.id = ?1")
    void softDelete(Long id);
}
