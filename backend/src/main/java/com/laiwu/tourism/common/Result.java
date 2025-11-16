package com.laiwu.tourism.common;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用响应结果
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 响应码
     */
    private int code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 成功响应
     * @param data 数据
     * @param <T> 数据类型
     * @return 响应结果
     */
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200);
        result.setMessage("success");
        result.setData(data);
        return result;
    }

    /**
     * 成功响应（无数据）
     * @return 响应结果
     */
    public static Result<?> success() {
        return success(null);
    }

    /**
     * 错误响应
     * @param code 错误码
     * @param message 错误消息
     * @return 响应结果
     */
    public static Result<?> error(int code, String message) {
        Result<?> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        return result;
    }

    /**
     * 错误响应（默认错误码）
     * @param message 错误消息
     * @return 响应结果
     */
    public static Result<?> error(String message) {
        return error(400, message);
    }
}