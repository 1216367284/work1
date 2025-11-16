package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.Order;
import com.laiwu.tourism.mapper.OrderMapper;
import com.laiwu.tourism.common.PageResult;
import com.laiwu.tourism.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * 订单服务实现类
 */
@Service
public class OrderServiceImpl extends ServiceImpl<OrderMapper, Order> implements OrderService {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public Order createOrder(Order order) {
        // 生成订单号
        String orderNumber = generateOrderNumber();
        order.setOrderNumber(orderNumber);
        order.setOrderStatus("pending_payment");
        order.setCreatedAt(new Date());
        order.setUpdatedAt(new Date());
        
        orderMapper.insert(order);
        return order;
    }

    @Override
    public Order getOrderByOrderNumber(String orderNumber) {
        return orderMapper.selectByOrderNumber(orderNumber);
    }

    @Override
    public List<Order> getUserOrders(Long userId, String status) {
        // 这里简化实现，实际应该根据状态过滤
        return orderMapper.selectByUserId(userId);
    }

    @Override
    public PageResult<Order> getOrderPage(int page, int size, Long userId, String status) {
        IPage<Order> pageInfo = new Page<>(page, size);
        IPage<Order> result = orderMapper.selectOrderPage(pageInfo, userId, status);
        
        return new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public boolean cancelOrder(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order != null && order.getUserId().equals(userId)) {
            if ("pending_payment".equals(order.getOrderStatus())) {
                order.setOrderStatus("cancelled");
                order.setUpdatedAt(new Date());
                return orderMapper.updateById(order) > 0;
            }
        }
        return false;
    }

    @Override
    public Map<String, String> payOrder(Long orderId, Long userId) {
        Order order = orderMapper.selectById(orderId);
        if (order != null && order.getUserId().equals(userId)) {
            if ("pending_payment".equals(order.getOrderStatus())) {
                // 这里需要对接支付接口
                // 简化实现，直接更新订单状态
                order.setOrderStatus("paid");
                order.setPaymentTime(new Date());
                order.setUpdatedAt(new Date());
                orderMapper.updateById(order);
                
                Map<String, String> result = new HashMap<>();
                result.put("status", "success");
                result.put("message", "支付成功");
                return result;
            }
        }
        
        Map<String, String> result = new HashMap<>();
        result.put("status", "fail");
        result.put("message", "订单状态错误或不存在");
        return result;
    }

    @Override
    public boolean completeOrder(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order != null && "paid".equals(order.getOrderStatus())) {
            order.setOrderStatus("completed");
            order.setCompletedTime(new Date());
            order.setUpdatedAt(new Date());
            return orderMapper.updateById(order) > 0;
        }
        return false;
    }

    @Override
    public Map<String, Integer> getOrderStatistics(Long userId) {
        List<Order> orders = orderMapper.selectByUserId(userId);
        Map<String, Integer> statistics = new HashMap<>();
        
        // 初始化统计数据
        statistics.put("total", 0);
        statistics.put("pending_payment", 0);
        statistics.put("paid", 0);
        statistics.put("completed", 0);
        statistics.put("cancelled", 0);
        
        // 统计订单数
        for (Order order : orders) {
            statistics.put("total", statistics.get("total") + 1);
            if (order.getOrderStatus() != null) {
                Integer count = statistics.getOrDefault(order.getOrderStatus(), 0);
                statistics.put(order.getOrderStatus(), count + 1);
            }
        }
        
        return statistics;
    }

    /**
     * 生成订单号
     * @return 订单号
     */
    private String generateOrderNumber() {
        String time = String.valueOf(System.currentTimeMillis());
        String random = UUID.randomUUID().toString().substring(0, 6);
        return time + random;
    }
}