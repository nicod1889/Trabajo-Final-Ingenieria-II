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

    boolean existsByNumeroIdentificacion(Long numeroIdentificacion);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empleado e WHERE e.email = :email AND e.id <> :id")
    boolean existsByEmailExcludingId(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(e) > 0 THEN true ELSE false END FROM Empleado e WHERE e.numeroIdentificacion = :numeroIdentificacion AND e.id <> :id")
    boolean existsByNumeroIdentificacionExcludingId(@Param("id") Long id, @Param("numeroIdentificacion") Long numeroIdentificacion);

    @Modifying
    @Query("update Empleado e set e.isDeleted = true where e.id = ?1")
    void softDelete(Long id);
}
