package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 活动实体类
 */
@Data
@TableName("activity")
public class Activity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 活动ID
     */
    @TableId
    private Integer activityId;

    /**
     * 活动名称
     */
    private String title;

    /**
     * 活动详情
     */
    private String content;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 活动地点
     */
    private String location;

    /**
     * 状态 ('upcoming', 'ongoing', 'finished')
     */
    private String status;

    /**
     * 活动图片
     */
    private String imageUrl;

    /**
     * 参与人数
     */
    private Integer participantCount;

    /**
     * 创建时间
     */
    private Date createdAt;

    /**
     * 更新时间
     */
    private Date updatedAt;
}