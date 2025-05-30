package com.azulyoro.back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteResponseDto extends ClienteBasicResponseDto {
    private List<ServicesBasicResponseDto> services;
}
