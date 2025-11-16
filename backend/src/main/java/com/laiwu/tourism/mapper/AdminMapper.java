package com.laiwu.tourism.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.laiwu.tourism.entity.Admin;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 管理员Mapper接口
 */
@Mapper
public interface AdminMapper extends BaseMapper<Admin> {

    /**
     * 根据用户名查询管理员
     * @param username 用户名
     * @return 管理员信息
     */
    Admin selectByUsername(@Param("username") String username);

    /**
     * 更新最后登录时间
     * @param adminId 管理员ID
     * @param lastLoginTime 登录时间
     * @return 更新结果
     */
    int updateLastLoginTime(@Param("adminId") Integer adminId,
                          @Param("lastLoginTime") String lastLoginTime);
}