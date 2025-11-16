package com.laiwu.tourism.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 订单实体类
 */
@Data
@TableName("order")
public class Order implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 订单ID
     */
    @TableId
    private Long orderId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 景点ID
     */
    private Integer spotId;

    /**
     * 订单状态 ('pending', 'paid', 'used', 'cancelled')
     */
    private String orderStatus;

    /**
     * 总金额
     */
    private BigDecimal totalAmount;

    /**
     * 数量
     */
    private Integer quantity;

    /**
     * 支付时间
     */
    private Date payTime;

    /**
     * 使用时间
     */
    private Date useTime;

    /**
     * 订单号
     */
    private String orderNo;

    /**
     * 支付流水号
     */
    private String transactionId;

    /**
     * 创建时间
     */
    private Date createdAt;

    /**
     * 更新时间
     */
    private Date updatedAt;
}