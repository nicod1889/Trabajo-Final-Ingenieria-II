package com.azulyoro.back.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CargaResponseDto {
    private Long id;
    private String nombre;
    private TipoCargaResponseDto tipoCarga;
    private boolean isDeleted;
}
