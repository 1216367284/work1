package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.laiwu.tourism.entity.User;

import java.util.Map;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {

    /**
     * 根据openid获取用户信息
     * @param openid 微信openid
     * @return 用户信息
     */
    User getUserByOpenid(String openid);

    /**
     * 创建或更新用户信息
     * @param user 用户信息
     * @return 更新后的用户
     */
    User createOrUpdateUser(User user);

    /**
     * 更新用户登录时间
     * @param userId 用户ID
     */
    void updateLastLoginTime(Long userId);

    /**
     * 用户微信登录
     * @param code 微信登录code
     * @return 登录结果
     */
    Map<String, Object> wechatLogin(String code);

    /**
     * 更新用户地图偏好设置
     * @param userId 用户ID
     * @param mapPreference 地图偏好
     */
    void updateMapPreference(Long userId, String mapPreference);
}