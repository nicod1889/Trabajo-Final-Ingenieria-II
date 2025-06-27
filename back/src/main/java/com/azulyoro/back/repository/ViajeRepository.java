package com.azulyoro.back.repository;

import com.azulyoro.back.model.ServiceStatus;
import com.azulyoro.back.model.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ViajeRepository extends JpaRepository <Viaje, Long> {
    @Modifying
    @Query("update Viaje s set s.estado = 'CANCELLED' where s.id = ?1")
    void softDelete(Long id);

    @Query("select s.fechaSalida from Viaje s where s.id = ?1")
    LocalDate findFechaSalidaById(Long id);

    boolean existsByCamionIdAndEstadoIn(Long camionId, List<ServiceStatus> estados);

    boolean existsByEmpleadoIdAndEstadoIn(Long empleadoId, List<ServiceStatus> estados);

    boolean existsByCamionIdAndEstadoInAndIdNot(Long camionId, List<ServiceStatus> estados, Long id);

    boolean existsByEmpleadoIdAndEstadoInAndIdNot(Long empleadoId, List<ServiceStatus> estados, Long id);
}
