package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.Admin;
import com.laiwu.tourism.mapper.AdminMapper;
import com.laiwu.tourism.service.AdminService;
import com.laiwu.tourism.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 管理员服务实现类
 */
@Service
public class AdminServiceImpl extends ServiceImpl<AdminMapper, Admin> implements AdminService {

    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public Admin getAdminByUsername(String username) {
        return adminMapper.selectByUsername(username);
    }

    @Override
    public Map<String, Object> adminLogin(String username, String password) {
        // 根据用户名查询管理员
        Admin admin = getAdminByUsername(username);
        if (admin == null) {
            return createErrorResult("用户名不存在");
        }

        // 检查管理员状态
        if (admin.getStatus() != 1) {
            return createErrorResult("账号已被禁用");
        }

        // 验证密码
        if (!verifyPassword(admin, password)) {
            return createErrorResult("密码错误");
        }

        // 更新最后登录时间
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        adminMapper.updateLastLoginTime(admin.getAdminId(), sdf.format(new Date()));

        // 生成JWT token
        String token = jwtUtils.generateToken(admin.getAdminId().longValue(), admin.getUsername(), admin.getRole());

        // 缓存token到Redis
        redisTemplate.opsForValue().set("admin_token:" + admin.getAdminId(), token,
                7, TimeUnit.DAYS);

        // 返回登录结果
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("admin", admin);
        result.put("status", "success");
        return result;
    }

    @Override
    public boolean addAdmin(Admin admin) {
        // 检查用户名是否已存在
        if (getAdminByUsername(admin.getUsername()) != null) {
            return false;
        }

        // 加密密码
        admin.setPasswordHash(encryptPassword(admin.getPasswordHash()));
        admin.setCreatedAt(new Date());
        admin.setUpdatedAt(new Date());
        admin.setStatus(1);

        return adminMapper.insert(admin) > 0;
    }

    @Override
    public boolean updateAdmin(Admin admin) {
        admin.setUpdatedAt(new Date());
        return adminMapper.updateById(admin) > 0;
    }

    @Override
    public boolean updatePassword(Integer adminId, String oldPassword, String newPassword) {
        Admin admin = adminMapper.selectById(adminId);
        if (admin != null && verifyPassword(admin, oldPassword)) {
            admin.setPasswordHash(encryptPassword(newPassword));
            admin.setUpdatedAt(new Date());
            return adminMapper.updateById(admin) > 0;
        }
        return false;
    }

    @Override
    public boolean updateAdminStatus(Integer adminId, Integer status) {
        Admin admin = adminMapper.selectById(adminId);
        if (admin != null) {
            admin.setStatus(status);
            admin.setUpdatedAt(new Date());
            return adminMapper.updateById(admin) > 0;
        }
        return false;
    }

    @Override
    public boolean verifyPassword(Admin admin, String password) {
        String encryptedPassword = encryptPassword(password);
        return encryptedPassword.equals(admin.getPasswordHash());
    }

    @Override
    public String encryptPassword(String password) {
        try {
            // 使用MD5加密密码
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                String hex = Integer.toHexString(b & 0xFF);
                if (hex.length() == 1) {
                    sb.append('0');
                }
                sb.append(hex);
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("密码加密失败", e);
        }
    }

    /**
     * 创建错误结果
     * @param message 错误信息
     * @return 错误结果
     */
    private Map<String, Object> createErrorResult(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "error");
        result.put("message", message);
        return result;
    }
}