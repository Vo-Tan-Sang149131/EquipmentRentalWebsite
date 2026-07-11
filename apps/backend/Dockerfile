FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

COPY apps/backend/pom.xml .
RUN mvn dependency:go-offline

COPY apps/backend/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine-3.21

WORKDIR /app

RUN apk add --no-cache curl
RUN mkdir -p /app/logs

COPY --from=builder /build/target/backend.jar app.jar

RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/equipment_rental/api/v1/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
