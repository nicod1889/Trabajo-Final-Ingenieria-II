package com.azulyoro.back.repository;

import com.azulyoro.back.model.Empleado;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    Optional<Empleado> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByIdentificationNumber(Long identificationNumber);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empleado e WHERE e.email = :email AND e.id <> :id")
    boolean existsByEmailExcludingId(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empleado e WHERE e.identificationNumber = :identificationNumber AND e.id <> :id")
    boolean existsByIdentificationNumberExcludingId(@Param("id") Long id, @Param("identificationNumber") Long identificationNumber);

    @Modifying
    @Query("update Empleado e set e.isDeleted = true where e.id = ?1")
    void softDelete(Long id);
}
