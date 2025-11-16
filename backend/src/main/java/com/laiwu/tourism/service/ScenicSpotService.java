package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.laiwu.tourism.entity.ScenicSpot;
import com.laiwu.tourism.common.PageResult;

import java.util.List;

/**
 * 景点服务接口
 */
public interface ScenicSpotService extends IService<ScenicSpot> {

    /**
     * 分页查询景点列表
     * @param page 当前页码
     * @param size 每页大小
     * @param keyword 搜索关键词
     * @param tags 标签筛选
     * @return 分页结果
     */
    PageResult<ScenicSpot> getScenicSpotPage(int page, int size, String keyword, List<String> tags);

    /**
     * 获取热门景点
     * @param limit 数量限制
     * @return 热门景点列表
     */
    List<ScenicSpot> getHotSpots(int limit);

    /**
     * 根据标签查询景点
     * @param tags 标签列表
     * @return 景点列表
     */
    List<ScenicSpot> getSpotsByTags(List<String> tags);

    /**
     * 获取景点详情
     * @param spotId 景点ID
     * @return 景点详情
     */
    ScenicSpot getScenicSpotDetail(Integer spotId);

    /**
     * 新增景点
     * @param scenicSpot 景点信息
     * @return 新增结果
     */
    boolean addScenicSpot(ScenicSpot scenicSpot);

    /**
     * 更新景点信息
     * @param scenicSpot 景点信息
     * @return 更新结果
     */
    boolean updateScenicSpot(ScenicSpot scenicSpot);

    /**
     * 删除景点
     * @param spotId 景点ID
     * @return 删除结果
     */
    boolean deleteScenicSpot(Integer spotId);

    /**
     * 获取景点评价统计
     * @param spotId 景点ID
     * @return 评价统计信息
     */
    Double getAverageRating(Integer spotId);
}