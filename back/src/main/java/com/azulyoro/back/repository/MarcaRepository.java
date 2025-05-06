package com.azulyoro.back.repository;

import com.azulyoro.back.model.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MarcaRepository extends JpaRepository<Marca, Long> {
    @Modifying
    @Query("update Marca b set b.isDeleted = true where b.id = ?1")
    void softDelete(Long id);
}