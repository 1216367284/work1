package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.laiwu.tourism.entity.Activity;
import com.laiwu.tourism.common.PageResult;

import java.util.List;

/**
 * 活动服务接口
 */
public interface ActivityService extends IService<Activity> {

    /**
     * 分页查询活动列表
     * @param page 当前页码
     * @param size 每页大小
     * @param status 活动状态
     * @return 分页结果
     */
    PageResult<Activity> getActivityPage(int page, int size, String status);

    /**
     * 获取近期活动
     * @param limit 数量限制
     * @return 近期活动列表
     */
    List<Activity> getRecentActivities(int limit);

    /**
     * 获取进行中活动
     * @return 进行中活动列表
     */
    List<Activity> getOngoingActivities();

    /**
     * 获取活动详情
     * @param activityId 活动ID
     * @return 活动详情
     */
    Activity getActivityDetail(Integer activityId);

    /**
     * 新增活动
     * @param activity 活动信息
     * @return 新增结果
     */
    boolean addActivity(Activity activity);

    /**
     * 更新活动信息
     * @param activity 活动信息
     * @return 更新结果
     */
    boolean updateActivity(Activity activity);

    /**
     * 删除活动
     * @param activityId 活动ID
     * @return 删除结果
     */
    boolean deleteActivity(Integer activityId);

    /**
     * 参与活动
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return 参与结果
     */
    boolean joinActivity(Integer activityId, Long userId);

    /**
     * 更新活动状态
     * @param activityId 活动ID
     * @param status 新状态
     * @return 更新结果
     */
    boolean updateActivityStatus(Integer activityId, String status);
}