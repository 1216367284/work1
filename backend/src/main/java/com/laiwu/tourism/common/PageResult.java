package com.laiwu.tourism.common;

import lombok.Data;

import java.util.List;

/**
 * 分页结果类
 */
@Data
public class PageResult<T> {

    /**
     * 总记录数
     */
    private long total;

    /**
     * 当前页数据
     */
    private List<T> records;

    /**
     * 每页大小
     */
    private long size;

    /**
     * 当前页码
     */
    private long current;

    /**
     * 总页数
     */
    private long pages;

    /**
     * 构造函数
     * @param total 总记录数
     * @param records 数据列表
     * @param size 每页大小
     * @param current 当前页码
     */
    public PageResult(long total, List<T> records, long size, long current) {
        this.total = total;
        this.records = records;
        this.size = size;
        this.current = current;
        this.pages = total % size == 0 ? total / size : total / size + 1;
    }
}