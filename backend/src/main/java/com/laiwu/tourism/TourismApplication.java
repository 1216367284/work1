package com.laiwu.tourism;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * 莱芜文旅小程序后端应用主类
 */
@SpringBootApplication
@MapperScan("com.laiwu.tourism.mapper")
@EnableCaching
public class TourismApplication {

    public static void main(String[] args) {
        SpringApplication.run(TourismApplication.class, args);
    }

}