package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.laiwu.tourism.entity.User;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户Mapper接口
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据openid查询用户
     * @param openid 微信openid
     * @return 用户信息
     */
    User selectByOpenid(String openid);
}