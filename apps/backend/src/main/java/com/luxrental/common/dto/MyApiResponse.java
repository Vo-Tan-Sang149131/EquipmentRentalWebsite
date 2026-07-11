package com.luxrental.common.dto;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MyApiResponse<T> {

    private int statusCode;
    private Integer appCode;
    private String message;
    private T result;

    @Builder.Default
    private Instant timestamp = Instant.now(); // Use Instant.now() for representing time in UTC
}
