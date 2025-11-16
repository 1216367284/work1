package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 评论实体类
 */
@Data
@TableName("review")
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 评论ID
     */
    @TableId
    private Long reviewId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 景点ID
     */
    private Integer spotId;

    /**
     * 评分 (1-5星)
     */
    private Integer rating;

    /**
     * 评论内容
     */
    private String content;

    /**
     * 评论图片（JSON数组格式）
     */
    private String images;

    /**
     * 点赞数
     */
    private Integer likeCount;

    /**
     * 评论状态
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