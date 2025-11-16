package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.laiwu.tourism.entity.Order;
import com.laiwu.tourism.common.PageResult;

import java.util.List;
import java.util.Map;

/**
 * 订单服务接口
 */
public interface OrderService extends IService<Order> {

    /**
     * 创建订单
     * @param order 订单信息
     * @return 创建的订单
     */
    Order createOrder(Order order);

    /**
     * 根据订单号查询订单
     * @param orderNumber 订单号
     * @return 订单信息
     */
    Order getOrderByOrderNumber(String orderNumber);

    /**
     * 获取用户订单列表
     * @param userId 用户ID
     * @param status 订单状态（可选）
     * @return 订单列表
     */
    List<Order> getUserOrders(Long userId, String status);

    /**
     * 分页查询订单
     * @param page 当前页码
     * @param size 每页大小
     * @param userId 用户ID（可选）
     * @param status 订单状态（可选）
     * @return 分页结果
     */
    PageResult<Order> getOrderPage(int page, int size, Long userId, String status);

    /**
     * 取消订单
     * @param orderId 订单ID
     * @param userId 用户ID
     * @return 取消结果
     */
    boolean cancelOrder(Long orderId, Long userId);

    /**
     * 支付订单
     * @param orderId 订单ID
     * @param userId 用户ID
     * @return 支付结果
     */
    Map<String, String> payOrder(Long orderId, Long userId);

    /**
     * 完成订单
     * @param orderId 订单ID
     * @return 完成结果
     */
    boolean completeOrder(Long orderId);

    /**
     * 统计用户订单数
     * @param userId 用户ID
     * @return 订单统计信息
     */
    Map<String, Integer> getOrderStatistics(Long userId);
}