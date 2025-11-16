package com.laiwu.tourism.utils;

import com.laiwu.tourism.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT工具类，用于生成和验证token
 */
@Component
public class JwtUtils {

    @Autowired
    private JwtConfig jwtConfig;

    /**
     * 生成token
     * @param userId 用户ID
     * @param username 用户名
     * @param roles 用户角色
     * @return token字符串
     */
    public String generateToken(Long userId, String username, String roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);
        claims.put("roles", roles);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                .signWith(SignatureAlgorithm.HS512, jwtConfig.getSecret())
                .compact();
    }

    /**
     * 从token中获取Claims
     * @param token token字符串
     * @return Claims对象
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtConfig.getSecret())
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * 验证token是否有效
     * @param token token字符串
     * @return 是否有效
     */
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 从token中获取用户ID
     * @param token token字符串
     * @return 用户ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return Long.parseLong(claims.get("userId").toString());
    }

    /**
     * 从token中获取用户名
     * @param token token字符串
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("username").toString();
    }
}