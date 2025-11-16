package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.laiwu.tourism.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 订单Mapper接口
 */
@Mapper
public interface OrderMapper extends BaseMapper<Order> {

    /**
     * 根据用户ID查询订单列表
     * @param userId 用户ID
     * @return 订单列表
     */
    List<Order> selectByUserId(@Param("userId") Long userId);

    /**
     * 分页查询订单列表
     * @param page 分页对象
     * @param userId 用户ID
     * @param status 订单状态
     * @return 订单分页列表
     */
    IPage<Order> selectOrderPage(IPage<Order> page,
                               @Param("userId") Long userId,
                               @Param("status") String status);

    /**
     * 根据订单号查询订单
     * @param orderNumber 订单号
     * @return 订单信息
     */
    Order selectByOrderNumber(@Param("orderNumber") String orderNumber);
}