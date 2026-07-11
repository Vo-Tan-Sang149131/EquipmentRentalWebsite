package com.luxrental.controller.upload.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class CloudinaryResponse {

    @JsonProperty("secure_url")
    private String secureUrl;

    @JsonProperty("public_id")
    private String publicId;

    @JsonProperty("format")
    private String format;

    @JsonProperty("resource_type")
    private String resourceType;
}
