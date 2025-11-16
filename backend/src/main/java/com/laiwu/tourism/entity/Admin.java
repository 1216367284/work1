package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 管理员实体类
 */
@Data
@TableName("admin")
public class Admin implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 管理员ID
     */
    @TableId
    private Integer adminId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 加密后的密码
     */
    private String passwordHash;

    /**
     * 角色 ('super_admin', 'content_editor')
     */
    private String role;

    /**
     * 管理员姓名
     */
    private String realName;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 最后登录时间
     */
    private Date lastLoginTime;

    /**
     * 状态
     */
    private Integer status;

    /**
     * 创建时间
     */
    private Date createdAt;

    /**
     * 更新时间
     */
    private Date updatedAt;
}