package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.laiwu.tourism.entity.Review;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 评论Mapper接口
 */
@Mapper
public interface ReviewMapper extends BaseMapper<Review> {

    /**
     * 根据景点ID查询评论列表
     * @param spotId 景点ID
     * @return 评论列表
     */
    List<Review> selectBySpotId(@Param("spotId") Integer spotId);

    /**
     * 分页查询评论
     * @param page 分页对象
     * @param spotId 景点ID
     * @param userId 用户ID
     * @param status 状态
     * @return 评论分页列表
     */
    IPage<Review> selectReviewPage(IPage<Review> page,
                                 @Param("spotId") Integer spotId,
                                 @Param("userId") Long userId,
                                 @Param("status") Integer status);

    /**
     * 更新点赞数
     * @param reviewId 评论ID
     * @param increment 增量
     * @return 更新结果
     */
    int updateLikeCount(@Param("reviewId") Long reviewId,
                      @Param("increment") Integer increment);
}