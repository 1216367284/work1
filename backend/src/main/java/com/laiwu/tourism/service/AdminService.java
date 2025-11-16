package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.laiwu.tourism.entity.Admin;

import java.util.Map;

/**
 * 管理员服务接口
 */
public interface AdminService extends IService<Admin> {

    /**
     * 根据用户名获取管理员
     * @param username 用户名
     * @return 管理员信息
     */
    Admin getAdminByUsername(String username);

    /**
     * 管理员登录
     * @param username 用户名
     * @param password 密码
     * @return 登录结果
     */
    Map<String, Object> adminLogin(String username, String password);

    /**
     * 添加管理员
     * @param admin 管理员信息
     * @return 添加结果
     */
    boolean addAdmin(Admin admin);

    /**
     * 更新管理员信息
     * @param admin 管理员信息
     * @return 更新结果
     */
    boolean updateAdmin(Admin admin);

    /**
     * 更新管理员密码
     * @param adminId 管理员ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 更新结果
     */
    boolean updatePassword(Integer adminId, String oldPassword, String newPassword);

    /**
     * 启用/禁用管理员
     * @param adminId 管理员ID
     * @param status 状态（1：启用，0：禁用）
     * @return 更新结果
     */
    boolean updateAdminStatus(Integer adminId, Integer status);

    /**
     * 验证密码
     * @param admin 管理员
     * @param password 密码
     * @return 验证结果
     */
    boolean verifyPassword(Admin admin, String password);

    /**
     * 加密密码
     * @param password 原始密码
     * @return 加密后的密码
     */
    String encryptPassword(String password);
}