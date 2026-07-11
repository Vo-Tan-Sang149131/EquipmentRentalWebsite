package com.luxrental.config.web;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.responses.ApiResponse;
import io.swagger.v3.oas.models.responses.ApiResponses;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            // 1. Config common information
            .info(new Info()
                .title("Demo Backend API")
                .version("1.0.0")
                .description("Spring Boot demo application with JWT Authentication and RBAC")
                .contact(new Contact().name("Demo Team").email("demo@example.com"))
                .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0.html")))

            // 2. Config server URLs
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Development Server"),
                new Server().url("https://api.example.com").description("Production Server")
            ))

            // 3. Config security scheme for JWT Bearer Token
            .components(new Components()
                .addSecuritySchemes("Bearer Token", new SecurityScheme()
                    .name("Bearer Token")
                    .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("JWT Bearer Token for API authentication")
                    .in(SecurityScheme.In.HEADER)))
            .addSecurityItem(new SecurityRequirement().addList("Bearer Token"));
    }

    /**
     * Auto add error codes for all endpoints
     */
    @Bean
    public OpenApiCustomizer globalResponseCustomizer() {
        return openApi -> openApi.getPaths().values().forEach(pathItem ->
            pathItem.readOperations().forEach(operation -> {
                ApiResponses apiResponses = operation.getResponses();

                // Add 401 Unauthorized if not exist
                if (!apiResponses.containsKey("401")) {
                    apiResponses.addApiResponse("401", new ApiResponse().description("Unauthorized"));
                }

                // Add 403 Forbidden if not exist
                if (!apiResponses.containsKey("403")) {
                    apiResponses.addApiResponse("403", new ApiResponse().description("Forbidden"));
                }

                // Add 500 Internal Server Error if not exist
                if (!apiResponses.containsKey("500")) {
                    apiResponses.addApiResponse("500", new ApiResponse().description("Internal Server Error"));
                }
            })
        );
    }
}
