package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.User;
import com.laiwu.tourism.mapper.UserMapper;
import com.laiwu.tourism.service.UserService;
import com.laiwu.tourism.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Override
    public User getUserByOpenid(String openid) {
        return userMapper.selectByOpenid(openid);
    }

    @Override
    public User createOrUpdateUser(User user) {
        User existingUser = getUserByOpenid(user.getOpenid());
        if (existingUser != null) {
            // 更新用户信息
            existingUser.setNickname(user.getNickname());
            existingUser.setAvatarUrl(user.getAvatarUrl());
            userMapper.updateById(existingUser);
            return existingUser;
        } else {
            // 创建新用户
            user.setCreatedAt(new Date());
            user.setLastLoginTime(new Date());
            user.setStatus(1);
            userMapper.insert(user);
            return user;
        }
    }

    @Override
    public void updateLastLoginTime(Long userId) {
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setLastLoginTime(new Date());
            userMapper.updateById(user);
        }
    }

    @Override
    public Map<String, Object> wechatLogin(String code) {
        // 这里需要对接微信小程序API获取openid
        // 简化实现，实际需要调用微信接口
        String openid = "mock_openid_" + code;
        
        // 查找或创建用户
        User user = getUserByOpenid(openid);
        if (user == null) {
            user = new User();
            user.setOpenid(openid);
            user.setCreatedAt(new Date());
            user.setLastLoginTime(new Date());
            user.setStatus(1);
            userMapper.insert(user);
        } else {
            updateLastLoginTime(user.getUserId());
        }
        
        // 生成JWT token
        String token = jwtUtils.generateToken(user.getUserId(), "user", "user");
        
        // 缓存token到Redis，设置过期时间
        redisTemplate.opsForValue().set("user_token:" + user.getUserId(), token,
                7, TimeUnit.DAYS);
        
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        return result;
    }

    @Override
    public void updateMapPreference(Long userId, String mapPreference) {
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setMapPreference(mapPreference);
            userMapper.updateById(user);
        }
    }
}