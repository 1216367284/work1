package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.ScenicSpot;
import com.laiwu.tourism.mapper.ScenicSpotMapper;
import com.laiwu.tourism.mapper.ReviewMapper;
import com.laiwu.tourism.common.PageResult;
import com.laiwu.tourism.service.ScenicSpotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;

/**
 * 景点服务实现类
 */
@Service
public class ScenicSpotServiceImpl extends ServiceImpl<ScenicSpotMapper, ScenicSpot> implements ScenicSpotService {

    @Autowired
    private ScenicSpotMapper scenicSpotMapper;

    @Autowired
    private ReviewMapper reviewMapper;

    @Override
    public PageResult<ScenicSpot> getScenicSpotPage(int page, int size, String keyword, List<String> tags) {
        IPage<ScenicSpot> pageInfo = new Page<>(page, size);
        IPage<ScenicSpot> result = scenicSpotMapper.selectScenicSpotPage(pageInfo, keyword, tags);
        
        return new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public List<ScenicSpot> getHotSpots(int limit) {
        return scenicSpotMapper.selectHotSpots(limit);
    }

    @Override
    public List<ScenicSpot> getSpotsByTags(List<String> tags) {
        return scenicSpotMapper.selectByTags(tags);
    }

    @Override
    public ScenicSpot getScenicSpotDetail(Integer spotId) {
        ScenicSpot spot = scenicSpotMapper.selectById(spotId);
        if (spot != null) {
            // 更新景点访问量
            spot.setViewCount(spot.getViewCount() + 1);
            scenicSpotMapper.updateById(spot);
        }
        return spot;
    }

    @Override
    public boolean addScenicSpot(ScenicSpot scenicSpot) {
        scenicSpot.setCreatedAt(new Date());
        scenicSpot.setUpdatedAt(new Date());
        scenicSpot.setViewCount(0);
        scenicSpot.setVisitCount(0);
        scenicSpot.setStatus(1);
        return scenicSpotMapper.insert(scenicSpot) > 0;
    }

    @Override
    public boolean updateScenicSpot(ScenicSpot scenicSpot) {
        scenicSpot.setUpdatedAt(new Date());
        return scenicSpotMapper.updateById(scenicSpot) > 0;
    }

    @Override
    public boolean deleteScenicSpot(Integer spotId) {
        ScenicSpot spot = scenicSpotMapper.selectById(spotId);
        if (spot != null) {
            // 软删除，更新状态为0
            spot.setStatus(0);
            spot.setUpdatedAt(new Date());
            return scenicSpotMapper.updateById(spot) > 0;
        }
        return false;
    }

    @Override
    public Double getAverageRating(Integer spotId) {
        // 这里需要根据评论计算平均评分
        // 简化实现，实际应该从review表查询
        return 4.5;
    }
}