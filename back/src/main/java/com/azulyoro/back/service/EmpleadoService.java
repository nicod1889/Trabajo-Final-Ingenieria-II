package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.RegisterRequest;
import com.azulyoro.back.dto.response.EmpleadoResponseDto;
import com.azulyoro.back.dto.response.ServicesBasicResponseDto;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.exception.FieldNotValidException;
import com.azulyoro.back.exception.UserAlreadyRegistered;
import com.azulyoro.back.mapper.EmpleadoMapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.mapper.ServicesMapper;
import com.azulyoro.back.model.Empleado;
import com.azulyoro.back.repository.EmpleadoRepository;
import com.azulyoro.back.util.MessageUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class EmpleadoService implements IEmpleadoService{
    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EmpleadoMapper empleadoMapper;

    @Autowired
    private ServicesMapper servicesMapper;

    @Autowired
    private PageMapper pageMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<Empleado> findById(Long id) {
        return empleadoRepository.findById(id);
    }

    @Override
    public EmpleadoResponseDto create(RegisterRequest registerRequest) {
        return empleadoMapper.entityToDto(createEmpleado(registerRequest));
    }

    @Override
    public EmpleadoResponseDto update(Long id, RegisterRequest registerRequest) {
        Empleado currentEmpleado = empleadoRepository.findById(id).orElseThrow(()-> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        Empleado newEmpleado = validateAndProcessUpdateRequest(id, registerRequest);
        newEmpleado.setId(id);
        newEmpleado.setPassword(currentEmpleado.getPassword());

        return empleadoMapper.entityToDto(empleadoRepository.save(newEmpleado));
    }

    @Override
    public EmpleadoResponseDto getById(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));

        EmpleadoResponseDto dto = empleadoMapper.entityToDto(empleado);
        dto.setServices(getServicesDto(empleado));

        return dto;
    }

    @Override
    public List<EmpleadoResponseDto> getAll() {
        return empleadoRepository
                .findAll()
                .stream()
                .map( e -> {
                    var dto = empleadoMapper.entityToDto(e);
                    dto.setServices(getServicesDto(e));
                    return dto;
                })
                .toList();
    }

    @Override
    public CustomPage<EmpleadoResponseDto> getByPage(Pageable pageable) {
        Page<EmpleadoResponseDto> page = empleadoRepository
                .findAll(pageable)
                .map( e -> {
                    var dto = empleadoMapper.entityToDto(e);
                    dto.setServices(getServicesDto(e));
                    return dto;
                });

        return pageMapper.pageToCustomPage(page);
    }

    @Transactional
    @Override
    public void delete(Long id) {
        try {
            empleadoRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    private List<ServicesBasicResponseDto> getServicesDto(Empleado empleado){
        return Optional.ofNullable(empleado.getServices())
                .orElse(Collections.emptyList())
                .stream()
                .map(servicesMapper::entityToBasicDto)
                .toList();
    }

    private Empleado validateAndProcessRequest(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail();
        Long idNumber = registerRequest.getNumeroIdentificacion();

        if (empleadoRepository.existsByEmail(email))
            throw new UserAlreadyRegistered(MessageUtil.emailAlreadyRegistered(email));

        if (empleadoRepository.existsByNumeroIdentificacion(idNumber))
            throw new UserAlreadyRegistered(MessageUtil.idNumberAlreadyRegistered(idNumber));

        Empleado empleado = empleadoMapper.dtoToEntity(registerRequest);
        empleado.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        return empleado;
    }

    private Empleado validateAndProcessUpdateRequest(Long id, RegisterRequest registerRequest) {
        String email = registerRequest.getEmail();
        Long idNumber = registerRequest.getNumeroIdentificacion();

        if (empleadoRepository.existsByEmailExcludingId(id, email))
            throw new UserAlreadyRegistered(MessageUtil.emailAlreadyRegistered(email));

        if (empleadoRepository.existsByNumeroIdentificacionExcludingId(id, idNumber))
            throw new UserAlreadyRegistered(MessageUtil.idNumberAlreadyRegistered(idNumber));

        return empleadoMapper.dtoToEntity(registerRequest);
    }

    public Empleado createEmpleado(RegisterRequest registerRequest) {
        if (registerRequest.getPassword() == null) {
            throw new FieldNotValidException(MessageUtil.fieldNotValid("Password", "null"));
        }

        Empleado empleado = validateAndProcessRequest(registerRequest);

        return empleadoRepository.save(empleado);
    }
}
