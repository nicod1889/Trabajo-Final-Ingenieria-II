package com.azulyoro.back.repository;

import com.azulyoro.back.model.Cliente;
import com.azulyoro.back.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    @Modifying
    @Query("update Cliente c set c.isDeleted = true where c.id = ?1")
    void softDelete(Long id);

    @Query("SELECT c.services FROM Cliente c WHERE c.id = :clienteId")
    List<Services> findServicesByClienteId(@Param("clienteId") Long clienteId);
}
