package com.azulyoro.back.dto.response;

import com.azulyoro.back.model.TipoIdentificacion;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteBasicResponseDto {
    private Long id;
    private String name;
    private String lastName;
    private TipoIdentificacion category;
    private Long identificationNumber;
    private String email;
    private String businessName;
    private boolean isDeleted;
}
