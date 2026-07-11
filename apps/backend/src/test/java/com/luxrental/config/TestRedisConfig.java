package com.luxrental.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import org.springframework.boot.test.context.TestConfiguration;
import redis.embedded.RedisServer;

import java.io.IOException;

@TestConfiguration
public class TestRedisConfig {

    private RedisServer redisServer;

    @PostConstruct
    public void startRedis() throws IOException {
        // Activate Redis server on port 6379 (default Redis port)
        redisServer = new RedisServer(6379);
        try {
            redisServer.start();
        } catch (Exception e) {
            // If Redis is already running, we can ignore the exception and continue with the tests
            System.out.println("Redis embedded server failed to start, it might be already running: " + e.getMessage());
        }
    }

    @PreDestroy
    public void stopRedis() throws IOException {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
}
