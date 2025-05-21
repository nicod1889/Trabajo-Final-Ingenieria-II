package com.azulyoro.back.mapper;

import com.azulyoro.back.dto.request.ClienteRequestDto;
import com.azulyoro.back.dto.response.ClienteBasicResponseDto;
import com.azulyoro.back.dto.response.ClienteResponseDto;
import com.azulyoro.back.dto.response.ServicesBasicResponseDto;
import com.azulyoro.back.model.Cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Component
public class ClienteMapper implements Mapper<Cliente, ClienteRequestDto, ClienteResponseDto>{

    @Autowired
    private ServicesMapper servicesMapper;

    @Override
    public ClienteResponseDto entityToDto(Cliente cliente) {
        ClienteResponseDto clienteDto = new ClienteResponseDto();
        clienteDto.setId(cliente.getId());
        clienteDto.setCategory(cliente.getCategory());
        clienteDto.setNumeroIdentificacion(cliente.getNumeroIdentificacion());
        clienteDto.setEmail(cliente.getEmail());
        clienteDto.setBusinessName(cliente.getBusinessName());
        clienteDto.setServices(getServicesBasicDto(cliente));
        clienteDto.setDeleted(cliente.isDeleted());

        return clienteDto;
    }

    @Override
    public Cliente dtoToEntity(ClienteRequestDto requestDto) {
        Cliente cliente = new Cliente();
        cliente.setCategory(requestDto.getCategory());
        cliente.setNumeroIdentificacion(requestDto.getNumeroIdentificacion());
        cliente.setEmail(requestDto.getEmail());
        cliente.setBusinessName(requestDto.getBusinessName());
        return cliente;
    }
    private List<ServicesBasicResponseDto> getServicesBasicDto(Cliente cliente) {
        return Optional.ofNullable(cliente.getServices())
                .orElse(Collections.emptyList())
                .stream()
                .map(servicesMapper::entityToBasicDto)
                .toList();
    }

    public ClienteBasicResponseDto entityToBasicDto(Cliente cliente) {
        ClienteBasicResponseDto clienteDto = new ClienteBasicResponseDto();
        clienteDto.setId(cliente.getId());
        clienteDto.setCategory(cliente.getCategory());
        clienteDto.setNumeroIdentificacion(cliente.getNumeroIdentificacion());
        clienteDto.setEmail(cliente.getEmail());
        clienteDto.setBusinessName(cliente.getBusinessName());
        clienteDto.setDeleted(cliente.isDeleted());

        return clienteDto;
    }
}
