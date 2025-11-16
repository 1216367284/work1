package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 景点实体类
 */
@Data
@TableName("scenic_spot")
public class ScenicSpot implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 景点ID
     */
    @TableId
    private Integer spotId;

    /**
     * 景点名称
     */
    private String name;

    /**
     * 地址
     */
    private String address;

    /**
     * 详细介绍
     */
    private String description;

    /**
     * 门票价格
     */
    private BigDecimal ticketPrice;

    /**
     * 开放时间
     */
    private String openingHours;

    /**
     * 3D全景图地址
     */
    private String panoramaUrl;

    /**
     * 文化标签 (如 '["红色", "自然风光"]')
     */
    private String tags;

    /**
     * 经度
     */
    private Double longitude;

    /**
     * 纬度
     */
    private Double latitude;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 评分
     */
    private Double rating;

    /**
     * 人气指数
     */
    private Integer popularity;

    /**
     * 景点状态
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