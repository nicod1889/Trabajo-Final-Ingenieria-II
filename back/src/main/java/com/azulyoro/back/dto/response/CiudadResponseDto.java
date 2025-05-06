package com.azulyoro.back.dto.response;

import com.azulyoro.back.model.Provincia;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CiudadResponseDto {
    private Long id;
    private String nombre;
    private Provincia provincia;
    private boolean isDeleted;
}
