package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.laiwu.tourism.entity.Activity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 活动Mapper接口
 */
@Mapper
public interface ActivityMapper extends BaseMapper<Activity> {

    /**
     * 分页查询活动列表
     * @param page 分页对象
     * @param status 活动状态
     * @return 活动分页列表
     */
    IPage<Activity> selectActivityPage(IPage<Activity> page,
                                     @Param("status") String status);

    /**
     * 查询近期活动
     * @param limit 数量限制
     * @return 近期活动列表
     */
    List<Activity> selectRecentActivities(@Param("limit") Integer limit);

    /**
     * 查询进行中活动
     * @return 进行中活动列表
     */
    List<Activity> selectOngoingActivities();
}