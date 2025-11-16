package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.laiwu.tourism.entity.ScenicSpot;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 景点Mapper接口
 */
@Mapper
public interface ScenicSpotMapper extends BaseMapper<ScenicSpot> {

    /**
     * 分页查询景点列表
     * @param page 分页对象
     * @param keyword 搜索关键词
     * @param tags 标签筛选
     * @return 景点列表
     */
    IPage<ScenicSpot> selectScenicSpotPage(IPage<ScenicSpot> page, 
                                          @Param("keyword") String keyword,
                                          @Param("tags") List<String> tags);

    /**
     * 查询热门景点
     * @param limit 数量限制
     * @return 热门景点列表
     */
    List<ScenicSpot> selectHotSpots(@Param("limit") Integer limit);

    /**
     * 根据标签查询景点
     * @param tags 标签列表
     * @return 景点列表
     */
    List<ScenicSpot> selectByTags(@Param("tags") List<String> tags);
}