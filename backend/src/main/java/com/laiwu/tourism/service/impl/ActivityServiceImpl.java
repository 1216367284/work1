package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.Activity;
import com.laiwu.tourism.mapper.ActivityMapper;
import com.laiwu.tourism.common.PageResult;
import com.laiwu.tourism.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 活动服务实现类
 */
@Service
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    @Autowired
    private ActivityMapper activityMapper;

    @Override
    public PageResult<Activity> getActivityPage(int page, int size, String status) {
        IPage<Activity> pageInfo = new Page<>(page, size);
        IPage<Activity> result = activityMapper.selectActivityPage(pageInfo, status);
        
        return new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public List<Activity> getRecentActivities(int limit) {
        return activityMapper.selectRecentActivities(limit);
    }

    @Override
    public List<Activity> getOngoingActivities() {
        return activityMapper.selectOngoingActivities();
    }

    @Override
    public Activity getActivityDetail(Integer activityId) {
        return activityMapper.selectById(activityId);
    }

    @Override
    public boolean addActivity(Activity activity) {
        activity.setCreatedAt(new Date());
        activity.setUpdatedAt(new Date());
        activity.setParticipantCount(0);
        
        // 根据时间设置初始状态
        Date now = new Date();
        if (now.before(activity.getStartTime())) {
            activity.setStatus("upcoming");
        } else if (now.after(activity.getEndTime())) {
            activity.setStatus("finished");
        } else {
            activity.setStatus("ongoing");
        }
        
        return activityMapper.insert(activity) > 0;
    }

    @Override
    public boolean updateActivity(Activity activity) {
        activity.setUpdatedAt(new Date());
        return activityMapper.updateById(activity) > 0;
    }

    @Override
    public boolean deleteActivity(Integer activityId) {
        return activityMapper.deleteById(activityId) > 0;
    }

    @Override
    public boolean joinActivity(Integer activityId, Long userId) {
        Activity activity = activityMapper.selectById(activityId);
        if (activity != null && "ongoing".equals(activity.getStatus())) {
            // 增加参与人数
            activity.setParticipantCount(activity.getParticipantCount() + 1);
            activity.setUpdatedAt(new Date());
            return activityMapper.updateById(activity) > 0;
        }
        return false;
    }

    @Override
    public boolean updateActivityStatus(Integer activityId, String status) {
        Activity activity = activityMapper.selectById(activityId);
        if (activity != null) {
            activity.setStatus(status);
            activity.setUpdatedAt(new Date());
            return activityMapper.updateById(activity) > 0;
        }
        return false;
    }
}