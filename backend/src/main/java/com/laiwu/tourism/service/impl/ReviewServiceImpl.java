package com.laiwu.tourism.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.laiwu.tourism.entity.Review;
import com.laiwu.tourism.mapper.ReviewMapper;
import com.laiwu.tourism.common.PageResult;
import com.laiwu.tourism.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 评论服务实现类
 */
@Service
public class ReviewServiceImpl extends ServiceImpl<ReviewMapper, Review> implements ReviewService {

    @Autowired
    private ReviewMapper reviewMapper;

    @Override
    public List<Review> getReviewsBySpotId(Integer spotId) {
        return reviewMapper.selectBySpotId(spotId);
    }

    @Override
    public PageResult<Review> getReviewPage(int page, int size, Integer spotId, Long userId, Integer status) {
        IPage<Review> pageInfo = new Page<>(page, size);
        IPage<Review> result = reviewMapper.selectReviewPage(pageInfo, spotId, userId, status);
        
        return new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getSize(),
                result.getCurrent()
        );
    }

    @Override
    public boolean addReview(Review review) {
        review.setCreatedAt(new Date());
        review.setUpdatedAt(new Date());
        review.setLikeCount(0);
        review.setStatus(1); // 默认为已审核
        return reviewMapper.insert(review) > 0;
    }

    @Override
    public boolean likeReview(Long reviewId) {
        return reviewMapper.updateLikeCount(reviewId, 1) > 0;
    }

    @Override
    public boolean deleteReview(Long reviewId, Long userId) {
        Review review = reviewMapper.selectById(reviewId);
        if (review != null && review.getUserId().equals(userId)) {
            return reviewMapper.deleteById(reviewId) > 0;
        }
        return false;
    }

    @Override
    public boolean updateReviewStatus(Long reviewId, Integer status) {
        Review review = reviewMapper.selectById(reviewId);
        if (review != null) {
            review.setStatus(status);
            review.setUpdatedAt(new Date());
            return reviewMapper.updateById(review) > 0;
        }
        return false;
    }

    @Override
    public Double calculateAverageRating(Integer spotId) {
        List<Review> reviews = reviewMapper.selectBySpotId(spotId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        int totalRating = 0;
        for (Review review : reviews) {
            totalRating += review.getRating();
        }

        return (double) totalRating / reviews.size();
    }

    @Override
    public List<Review> getUserReviews(Long userId) {
        // 这里简化实现，实际应该查询用户的所有评论
        IPage<Review> pageInfo = new Page<>(1, 100); // 获取用户的最多100条评论
        IPage<Review> result = reviewMapper.selectReviewPage(pageInfo, null, userId, 1);
        return result.getRecords();
    }
}