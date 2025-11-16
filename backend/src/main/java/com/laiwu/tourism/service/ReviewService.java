package com.laiwu.tourism.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.laiwu.tourism.entity.Review;
import com.laiwu.tourism.common.PageResult;

import java.util.List;

/**
 * 评论服务接口
 */
public interface ReviewService extends IService<Review> {

    /**
     * 根据景点ID获取评论列表
     * @param spotId 景点ID
     * @return 评论列表
     */
    List<Review> getReviewsBySpotId(Integer spotId);

    /**
     * 分页查询评论
     * @param page 当前页码
     * @param size 每页大小
     * @param spotId 景点ID（可选）
     * @param userId 用户ID（可选）
     * @param status 状态（可选）
     * @return 分页结果
     */
    PageResult<Review> getReviewPage(int page, int size, Integer spotId, Long userId, Integer status);

    /**
     * 添加评论
     * @param review 评论信息
     * @return 添加结果
     */
    boolean addReview(Review review);

    /**
     * 点赞评论
     * @param reviewId 评论ID
     * @return 点赞结果
     */
    boolean likeReview(Long reviewId);

    /**
     * 删除评论
     * @param reviewId 评论ID
     * @param userId 用户ID
     * @return 删除结果
     */
    boolean deleteReview(Long reviewId, Long userId);

    /**
     * 更新评论状态
     * @param reviewId 评论ID
     * @param status 状态
     * @return 更新结果
     */
    boolean updateReviewStatus(Long reviewId, Integer status);

    /**
     * 计算景点平均评分
     * @param spotId 景点ID
     * @return 平均评分
     */
    Double calculateAverageRating(Integer spotId);

    /**
     * 获取用户的评论
     * @param userId 用户ID
     * @return 用户评论列表
     */
    List<Review> getUserReviews(Long userId);
}