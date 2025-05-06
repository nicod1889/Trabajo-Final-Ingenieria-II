package com.azulyoro.back.service;

import com.azulyoro.back.dto.CustomPage;
import com.azulyoro.back.dto.request.ClienteRequestDto;
import com.azulyoro.back.dto.response.ClienteResponseDto;
import com.azulyoro.back.exception.CannotDeleteActiveServicesException;
import com.azulyoro.back.exception.CannotDeleteEntityException;
import com.azulyoro.back.mapper.Mapper;
import com.azulyoro.back.mapper.PageMapper;
import com.azulyoro.back.model.Cliente;
import com.azulyoro.back.model.ServiceStatus;
import com.azulyoro.back.model.Services;
import com.azulyoro.back.repository.ClienteRepository;
import com.azulyoro.back.util.MessageUtil;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService implements EntityService<ClienteRequestDto, ClienteResponseDto> {
    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private Mapper<Cliente, ClienteRequestDto, ClienteResponseDto> clienteMapper;

    @Autowired
    private PageMapper pageMapper;

    @Override
    public ClienteResponseDto create(ClienteRequestDto clienteRequestDto) {
        Cliente cliente = clienteRepository.save(clienteMapper.dtoToEntity(clienteRequestDto));
        return clienteMapper.entityToDto(cliente);
    }

    @Override
    public ClienteResponseDto update(Long id, ClienteRequestDto clienteRequestDto) {
        Cliente currentCliente = getClienteById(id);

        Cliente clienteToUpdate = clienteMapper.dtoToEntity(clienteRequestDto);
        clienteToUpdate.setId(id);
        clienteToUpdate.setServices(currentCliente.getServices());

        return clienteMapper.entityToDto(clienteRepository.save(clienteToUpdate));
    }

    @Override
    public ClienteResponseDto getById(Long id) {
        return clienteMapper.entityToDto(getClienteById(id));
    }

    @Override
    public List<ClienteResponseDto> getAll() {
        return clienteRepository
                .findAll()
                .stream()
                .map(clienteMapper::entityToDto)
                .toList();
    }

    @Override
    public CustomPage<ClienteResponseDto> getByPage(Pageable pageable) {
        Page<ClienteResponseDto> page = clienteRepository
                .findAll(pageable)
                .map(clienteMapper::entityToDto);

        return pageMapper.pageToCustomPage(page);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        validateRelatedServices(id);

        try {
            clienteRepository.softDelete(id);
        } catch (Exception e) {
            throw new CannotDeleteEntityException(MessageUtil.entityCannotDelete(id, e.getMessage()));
        }
    }

    private Cliente getClienteById(Long id) {
        return clienteRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(MessageUtil.entityNotFound(id)));
    }

    private void validateRelatedServices(Long id){
        List<Services> servicesRelated = clienteRepository.findServicesByClienteId(id);

        boolean hasRelatedIncomplete = servicesRelated.stream().anyMatch(
                e ->
                        e.getStatus().equals(ServiceStatus.TO_DO) ||
                        e.getStatus().equals(ServiceStatus.IN_PROGRESS) ||
                        (e.getStatus().equals(ServiceStatus.FINISHED) && e.getPay() == null)
        );

        if(hasRelatedIncomplete) throw new CannotDeleteActiveServicesException(MessageUtil.entityRelatedCannotDelete(id));
    }

    public Optional<Cliente> findById(Long id) {
        return clienteRepository.findById(id);
    }
}
