package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 用户实体类
 */
@Data
@TableName("user")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @TableId
    private Long userId;

    /**
     * 微信用户唯一标识
     */
    private String openid;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像地址
     */
    private String avatarUrl;

    /**
     * 地图偏好 ('Tencent', 'Gaode', 'Baidu')
     */
    private String mapPreference;

    /**
     * 创建时间
     */
    private Date createdAt;

    /**
     * 最后登录时间
     */
    private Date lastLoginTime;

    /**
     * 用户状态
     */
    private Integer status;
}