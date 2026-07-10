package com.luxrental.common.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RateLimit {
    int limit() default 5;      // Maximal number of requests allowed within the duration

    int duration() default 600; // Active duration in seconds

    long blockDuration() default 30; // Block duration time
}
