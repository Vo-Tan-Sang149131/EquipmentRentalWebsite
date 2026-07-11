package com.luxrental.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.util.TestSocketUtils;
import redis.embedded.RedisServer;

import java.io.IOException;

@TestConfiguration
public class TestRedisConfig {

    private RedisServer redisServer;
    private int redisPort;

    @PostConstruct
    public void startRedis() throws IOException {
        // Find an available port
        redisPort = TestSocketUtils.findAvailableTcpPort();

        try {
            redisServer = new RedisServer(redisPort);
            redisServer.start();
            System.out.println("Embedded Redis started on port: " + redisPort);
        } catch (Exception e) {
            System.err.println("Failed to start embedded Redis: " + e.getMessage());
            throw new RuntimeException("Cannot start embedded Redis server for tests", e);
        }
    }

    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            try {
                redisServer.stop();
                System.out.println("Embedded Redis stopped");
            } catch (Exception e) {
                System.err.println("Error stopping Redis: " + e.getMessage());
            }
        }
    }

    @Bean
    @Primary
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory connectionFactory) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(connectionFactory);
        template.afterPropertiesSet();
        return template;
    }
}
