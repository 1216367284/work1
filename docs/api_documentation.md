# 旅游景点地图导航系统 - API文档

## 1. 接口概述

本文档详细描述旅游景点地图导航系统的RESTful API接口，包括用户管理、景点管理、活动管理、评论管理等模块。系统采用前后端分离架构，前端通过HTTP请求调用后端API获取数据和执行操作。

### 1.1 基础信息

- **API基础URL**: `https://api.example.com/api`
- **认证方式**: JWT (JSON Web Token)
- **请求格式**: JSON
- **响应格式**: JSON
- **状态码**: HTTP标准状态码

### 1.2 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| code | Integer | 状态码，200表示成功，其他表示失败 |
| message | String | 响应消息，成功或错误描述 |
| data | Object | 响应数据，根据接口不同返回不同结构 |

### 1.3 错误码说明

| 错误码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，请先登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |
| 5001 | 用户名或密码错误 |
| 5002 | 用户已存在 |
| 5003 | 景点不存在 |
| 5004 | 活动不存在 |
| 5005 | 订单不存在 |
| 5006 | 余额不足 |
| 5007 | 活动参与人数已满 |

## 2. 认证与授权

### 2.1 用户登录

**接口路径**: `/api/auth/login`
**请求方法**: POST
**请求参数**:

```json
{
  "username": "string",
  "password": "string"
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string",
    "expireTime": "string",
    "user": {
      "id": 1,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "phone": "string",
      "email": "string",
      "role": 0
    }
  }
}
```

### 2.2 用户注册

**接口路径**: `/api/auth/register`
**请求方法**: POST
**请求参数**:

```json
{
  "username": "string",
  "password": "string",
  "nickname": "string",
  "phone": "string",
  "email": "string"
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "string",
    "nickname": "string"
  }
}
```

### 2.3 用户登出

**接口路径**: `/api/auth/logout`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": null
}
```

### 2.4 刷新Token

**接口路径**: `/api/auth/refresh`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {refreshToken}

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "string",
    "expireTime": "string"
  }
}
```

## 3. 用户管理

### 3.1 获取当前用户信息

**接口路径**: `/api/users/me`
**请求方法**: GET
**请求头**:
- `Authorization`: Bearer {token}

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "phone": "string",
    "email": "string",
    "gender": 0,
    "birthDate": "string",
    "role": 0,
    "status": 1,
    "createdAt": "string",
    "lastLoginAt": "string"
  }
}
```

### 3.2 更新当前用户信息

**接口路径**: `/api/users/me`
**请求方法**: PUT
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "nickname": "string",
  "avatar": "string",
  "phone": "string",
  "email": "string",
  "gender": 0,
  "birthDate": "string"
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "nickname": "string",
    "avatar": "string",
    "phone": "string",
    "email": "string",
    "gender": 0,
    "birthDate": "string"
  }
}
```

### 3.3 修改密码

**接口路径**: `/api/users/me/password`
**请求方法**: PUT
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "oldPassword": "string",
  "newPassword": "string"
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

### 3.4 获取用户列表（管理员）

**接口路径**: `/api/users`
**请求方法**: GET
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认10
- `keyword`: 搜索关键词（用户名、昵称、手机号、邮箱）
- `role`: 角色类型
- `status`: 用户状态

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pages": 10,
    "page": 1,
    "size": 10,
    "list": [
      {
        "id": 1,
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "phone": "string",
        "email": "string",
        "role": 0,
        "status": 1,
        "createdAt": "string",
        "lastLoginAt": "string"
      }
    ]
  }
}
```

## 4. 景点管理

### 4.1 获取景点列表

**接口路径**: `/api/spots`
**请求方法**: GET

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认10
- `keyword`: 搜索关键词
- `categoryId`: 分类ID
- `sort`: 排序方式（name, rating, reviewCount, visitCount）
- `order`: 排序顺序（asc, desc）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pages": 10,
    "page": 1,
    "size": 10,
    "list": [
      {
        "id": 1,
        "name": "string",
        "coverImage": "string",
        "latitude": 39.916345,
        "longitude": 116.397155,
        "address": "string",
        "city": "string",
        "ticketPrice": 60.00,
        "rating": 4.8,
        "reviewCount": 15680,
        "distance": 1234 // 当前位置距离，单位米
      }
    ]
  }
}
```

### 4.2 获取景点详情

**接口路径**: `/api/spots/{id}`
**请求方法**: GET

**路径参数**:
- `id`: 景点ID

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "string",
    "description": "string",
    "categoryId": 11,
    "categoryName": "历史建筑",
    "coverImage": "string",
    "images": ["url1", "url2"],
    "latitude": 39.916345,
    "longitude": 116.397155,
    "address": "string",
    "district": "string",
    "city": "string",
    "province": "string",
    "ticketPrice": 60.00,
    "openTime": "08:30",
    "closeTime": "17:00",
    "contactPhone": "string",
    "rating": 4.8,
    "reviewCount": 15680,
    "visitCount": 100000,
    "features": ["世界文化遗产", "皇家建筑"],
    "isFavorite": false,
    "createdAt": "string"
  }
}
```

### 4.3 获取附近景点

**接口路径**: `/api/spots/nearby`
**请求方法**: GET

**请求参数**:
- `latitude`: 纬度
- `longitude`: 经度
- `radius`: 搜索半径，单位米，默认5000
- `limit`: 返回数量，默认20
- `categoryId`: 分类ID（可选）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "string",
      "coverImage": "string",
      "latitude": 39.916345,
      "longitude": 116.397155,
      "address": "string",
      "rating": 4.8,
      "distance": 1234
    }
  ]
}
```

### 4.4 获取热门景点

**接口路径**: `/api/spots/hot`
**请求方法**: GET

**请求参数**:
- `limit`: 返回数量，默认10

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "string",
      "coverImage": "string",
      "address": "string",
      "rating": 4.8,
      "reviewCount": 15680,
      "visitCount": 100000
    }
  ]
}
```

### 4.5 增加景点访问量

**接口路径**: `/api/spots/{id}/view`
**请求方法**: POST

**路径参数**:
- `id`: 景点ID

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "visitCount": 100001
  }
}
```

### 4.6 创建景点（管理员）

**接口路径**: `/api/spots`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "name": "string",
  "description": "string",
  "categoryId": 11,
  "coverImage": "string",
  "images": ["url1", "url2"],
  "latitude": 39.916345,
  "longitude": 116.397155,
  "address": "string",
  "district": "string",
  "city": "string",
  "province": "string",
  "ticketPrice": 60.00,
  "openTime": "08:30",
  "closeTime": "17:00",
  "contactPhone": "string",
  "features": ["世界文化遗产", "皇家建筑"]
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "string",
    "description": "string",
    "categoryId": 11,
    "coverImage": "string",
    "latitude": 39.916345,
    "longitude": 116.397155,
    "address": "string",
    "ticketPrice": 60.00,
    "openTime": "08:30",
    "closeTime": "17:00",
    "contactPhone": "string",
    "status": 1,
    "createdAt": "string"
  }
}
```

## 5. 活动管理

### 5.1 获取活动列表

**接口路径**: `/api/activities`
**请求方法**: GET

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认10
- `keyword`: 搜索关键词
- `status`: 活动状态（0-未开始，1-进行中，2-已结束）
- `sort`: 排序方式（startTime, name）
- `order`: 排序顺序（asc, desc）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "pages": 5,
    "page": 1,
    "size": 10,
    "list": [
      {
        "id": 1,
        "name": "string",
        "image": "string",
        "startTime": "string",
        "endTime": "string",
        "location": "string",
        "price": 599.00,
        "currentParticipants": 35,
        "maxParticipants": 100,
        "status": 1,
        "daysLeft": 5 // 距离开始还有几天
      }
    ]
  }
}
```

### 5.2 获取活动详情

**接口路径**: `/api/activities/{id}`
**请求方法**: GET

**路径参数**:
- `id`: 活动ID

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "name": "string",
    "description": "string",
    "image": "string",
    "images": ["url1", "url2"],
    "startTime": "string",
    "endTime": "string",
    "latitude": 39.916345,
    "longitude": 116.397155,
    "location": "string",
    "price": 599.00,
    "maxParticipants": 100,
    "currentParticipants": 35,
    "organizer": "string",
    "contactPhone": "string",
    "requirements": "string",
    "agenda": [
      {
        "time": "09:00",
        "content": "集合"
      }
    ],
    "status": 1,
    "isParticipated": false,
    "createdAt": "string"
  }
}
```

### 5.3 获取最新活动

**接口路径**: `/api/activities/latest`
**请求方法**: GET

**请求参数**:
- `limit`: 返回数量，默认10

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "string",
      "image": "string",
      "startTime": "string",
      "endTime": "string",
      "location": "string",
      "price": 599.00,
      "currentParticipants": 35,
      "maxParticipants": 100,
      "status": 1
    }
  ]
}
```

### 5.4 获取即将开始的活动

**接口路径**: `/api/activities/upcoming`
**请求方法**: GET

**请求参数**:
- `days`: 天数，默认30
- `limit`: 返回数量，默认10

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "string",
      "image": "string",
      "startTime": "string",
      "endTime": "string",
      "location": "string",
      "price": 599.00,
      "currentParticipants": 35,
      "maxParticipants": 100,
      "daysLeft": 5
    }
  ]
}
```

### 5.5 参加活动

**接口路径**: `/api/activities/{id}/participate`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 活动ID

**请求参数**:

```json
{
  "remark": "string" // 备注（可选）
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "参加活动成功",
  "data": {
    "participantId": 1,
    "activityId": 1,
    "joinTime": "string",
    "currentParticipants": 36
  }
}
```

### 5.6 取消参加活动

**接口路径**: `/api/activities/{id}/cancel`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 活动ID

**响应数据**:

```json
{
  "code": 200,
  "message": "取消参加成功",
  "data": {
    "currentParticipants": 35
  }
}
```

### 5.7 获取活动参与者列表（管理员）

**接口路径**: `/api/activities/{id}/participants`
**请求方法**: GET
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 活动ID

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认20

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 35,
    "pages": 2,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": 1,
        "userId": 1,
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "phone": "string",
        "joinTime": "string",
        "remark": "string"
      }
    ]
  }
}
```

## 6. 评论管理

### 6.1 获取评论列表

**接口路径**: `/api/reviews`
**请求方法**: GET

**请求参数**:
- `targetId`: 目标ID（景点或活动ID）
- `targetType`: 目标类型（1-景点，2-活动）
- `page`: 页码，默认1
- `size`: 每页数量，默认20
- `rating`: 评分筛选（1-5）
- `hasImage`: 是否有图片（true, false）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1000,
    "pages": 50,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": 1,
        "content": "string",
        "rating": 5,
        "userId": 1,
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "images": ["url1", "url2"],
        "likes": 23,
        "isLiked": false,
        "createdAt": "string"
      }
    ]
  }
}
```

### 6.2 发表评论

**接口路径**: `/api/reviews`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "content": "string",
  "rating": 5,
  "targetId": 1,
  "targetType": 1,
  "images": ["url1", "url2"]
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "评论成功",
  "data": {
    "id": 1,
    "content": "string",
    "rating": 5,
    "targetId": 1,
    "targetType": 1,
    "images": ["url1", "url2"],
    "likes": 0,
    "createdAt": "string"
  }
}
```

### 6.3 点赞评论

**接口路径**: `/api/reviews/{id}/like`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 评论ID

**响应数据**:

```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "likes": 24
  }
}
```

### 6.4 取消点赞

**接口路径**: `/api/reviews/{id}/unlike`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 评论ID

**响应数据**:

```json
{
  "code": 200,
  "message": "取消点赞成功",
  "data": {
    "likes": 23
  }
}
```

### 6.5 获取景点评论

**接口路径**: `/api/spots/{id}/reviews`
**请求方法**: GET

**路径参数**:
- `id`: 景点ID

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认20
- `rating`: 评分筛选（1-5）
- `hasImage`: 是否有图片（true, false）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 1000,
    "pages": 50,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": 1,
        "content": "string",
        "rating": 5,
        "userId": 1,
        "username": "string",
        "nickname": "string",
        "avatar": "string",
        "images": ["url1", "url2"],
        "likes": 23,
        "isLiked": false,
        "createdAt": "string"
      }
    ]
  }
}
```

## 7. 收藏管理

### 7.1 获取用户收藏列表

**接口路径**: `/api/favorites`
**请求方法**: GET
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认20

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "pages": 3,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": 1,
        "spotId": 1,
        "spotName": "string",
        "coverImage": "string",
        "address": "string",
        "rating": 4.8,
        "ticketPrice": 60.00,
        "createTime": "string"
      }
    ]
  }
}
```

### 7.2 添加收藏

**接口路径**: `/api/favorites`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "spotId": 1
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {
    "id": 1,
    "spotId": 1,
    "createTime": "string"
  }
}
```

### 7.3 取消收藏

**接口路径**: `/api/favorites/{id}`
**请求方法**: DELETE
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `id`: 收藏ID

**响应数据**:

```json
{
  "code": 200,
  "message": "取消收藏成功",
  "data": null
}
```

### 7.4 取消景点收藏（按景点ID）

**接口路径**: `/api/favorites/spot/{spotId}`
**请求方法**: DELETE
**请求头**:
- `Authorization`: Bearer {token}

**路径参数**:
- `spotId`: 景点ID

**响应数据**:

```json
{
  "code": 200,
  "message": "取消收藏成功",
  "data": null
}
```

## 8. 浏览历史

### 8.1 获取浏览历史

**接口路径**: `/api/history`
**请求方法**: GET
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:
- `page`: 页码，默认1
- `size`: 每页数量，默认20

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pages": 5,
    "page": 1,
    "size": 20,
    "list": [
      {
        "id": 1,
        "spotId": 1,
        "spotName": "string",
        "coverImage": "string",
        "address": "string",
        "rating": 4.8,
        "viewTime": "string",
        "viewCount": 3
      }
    ]
  }
}
```

### 8.2 记录浏览历史

**接口路径**: `/api/history`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "spotId": 1
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "spotId": 1,
    "viewTime": "string",
    "viewCount": 3
  }
}
```

### 8.3 清除浏览历史

**接口路径**: `/api/history`
**请求方法**: DELETE
**请求头**:
- `Authorization`: Bearer {token}

**响应数据**:

```json
{
  "code": 200,
  "message": "清除成功",
  "data": null
}
```

## 9. 分类管理

### 9.1 获取分类列表

**接口路径**: `/api/categories`
**请求方法**: GET

**请求参数**:
- `parentId`: 父分类ID，默认0（顶级分类）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "自然风光",
      "parentId": 0,
      "level": 1,
      "icon": "string",
      "children": [
        {
          "id": 6,
          "name": "海滩岛屿",
          "parentId": 1,
          "level": 2,
          "icon": "string"
        }
      ]
    }
  ]
}
```

### 9.2 获取所有分类（扁平结构）

**接口路径**: `/api/categories/all`
**请求方法**: GET

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "自然风光",
      "parentId": 0,
      "level": 1,
      "icon": "string"
    },
    {
      "id": 6,
      "name": "海滩岛屿",
      "parentId": 1,
      "level": 2,
      "icon": "string"
    }
  ]
}
```

## 10. 地图服务

### 10.1 地理编码（地址转坐标）

**接口路径**: `/api/map/geocode`
**请求方法**: GET

**请求参数**:
- `address`: 地址字符串
- `city`: 城市（可选）
- `mapType`: 地图类型（gaode, baidu, tencent），默认gaode

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "latitude": 39.916345,
    "longitude": 116.397155,
    "formattedAddress": "北京市东城区景山前街4号"
  }
}
```

### 10.2 逆地理编码（坐标转地址）

**接口路径**: `/api/map/reverse-geocode`
**请求方法**: GET

**请求参数**:
- `latitude`: 纬度
- `longitude`: 经度
- `mapType`: 地图类型（gaode, baidu, tencent），默认gaode

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "address": "北京市东城区景山前街4号",
    "province": "北京市",
    "city": "北京市",
    "district": "东城区",
    "street": "景山前街",
    "streetNumber": "4号"
  }
}
```

### 10.3 路径规划

**接口路径**: `/api/map/direction`
**请求方法**: GET

**请求参数**:
- `originLat`: 起点纬度
- `originLng`: 起点经度
- `destinationLat`: 终点纬度
- `destinationLng`: 终点经度
- `mode`: 出行方式（driving, walking, cycling, transit）
- `mapType`: 地图类型（gaode, baidu, tencent），默认gaode

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "distance": 5000, // 总距离，单位米
    "duration": 1800, // 预计时间，单位秒
    "steps": [
      {
        "distance": 1000,
        "duration": 600,
        "instruction": "从起点出发，沿XX路向东行驶1000米",
        "polyline": [
          [39.916345, 116.397155],
          [39.917345, 116.398155]
        ]
      }
    ]
  }
}
```

### 10.4 搜索地点

**接口路径**: `/api/map/place/search`
**请求方法**: GET

**请求参数**:
- `keyword`: 搜索关键词
- `latitude`: 中心点纬度（可选）
- `longitude`: 中心点经度（可选）
- `radius`: 搜索半径，单位米（可选）
- `city`: 城市（可选）
- `page`: 页码，默认1
- `size`: 每页数量，默认20
- `mapType`: 地图类型（gaode, baidu, tencent），默认gaode

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "list": [
      {
        "id": "string",
        "name": "string",
        "address": "string",
        "latitude": 39.916345,
        "longitude": 116.397155,
        "distance": 1234, // 距离中心点的距离，单位米
        "category": "string"
      }
    ]
  }
}
```

## 11. 文件上传

### 11.1 上传图片

**接口路径**: `/api/upload/image`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}
- `Content-Type`: multipart/form-data

**请求参数**:
- `file`: 图片文件
- `type`: 文件类型（avatar, spot, activity, review）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "url": "https://example.com/upload/image.jpg",
    "filename": "image.jpg",
    "size": 1024000,
    "type": "image/jpeg"
  }
}
```

### 11.2 批量上传图片

**接口路径**: `/api/upload/images`
**请求方法**: POST
**请求头**:
- `Authorization`: Bearer {token}
- `Content-Type`: multipart/form-data

**请求参数**:
- `files`: 图片文件数组
- `type`: 文件类型（spot, activity, review）

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "url": "https://example.com/upload/image1.jpg",
      "filename": "image1.jpg",
      "size": 1024000,
      "type": "image/jpeg"
    },
    {
      "url": "https://example.com/upload/image2.jpg",
      "filename": "image2.jpg",
      "size": 2048000,
      "type": "image/jpeg"
    }
  ]
}
```

## 12. 系统配置

### 12.1 获取系统配置

**接口路径**: `/api/configs`
**请求方法**: GET

**请求参数**:
- `keys`: 配置键，多个用逗号分隔，如"siteName,mapServiceType"

**响应数据**:

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "siteName": "旅游景点地图导航系统",
    "mapServiceType": "gaode",
    "defaultPageSize": "10",
    "maxReviewImages": "9"
  }
}
```

### 12.2 更新系统配置（管理员）

**接口路径**: `/api/configs`
**请求方法**: PUT
**请求头**:
- `Authorization`: Bearer {token}

**请求参数**:

```json
{
  "configs": {
    "siteName": "新系统名称",
    "mapServiceType": "baidu"
  }
}
```

**响应数据**:

```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

## 13. 常见问题

### 13.1 如何处理跨域问题？

后端已配置CORS，允许所有跨域请求。前端无需特殊处理。

### 13.2 Token过期如何处理？

前端应监听401错误，当收到401响应时，提示用户重新登录。

### 13.3 如何处理大文件上传？

对于超过10MB的文件，建议使用分片上传技术。系统支持断点续传。

### 13.4 如何获取当前用户位置？

使用微信小程序的`wx.getLocation()` API获取用户位置，然后通过地图服务API进行逆地理编码。

### 13.5 如何切换地图服务？

在前端使用MapServiceFactory创建不同的地图服务实例，或通过系统配置设置默认地图服务。

## 14. 版本历史

### v1.0.0

- 初始版本发布
- 实现基本的用户管理、景点管理、活动管理功能
- 支持高德地图服务

### v1.1.0

- 添加百度地图和腾讯地图支持
- 实现活动报名功能
- 优化地图性能

### v1.2.0

- 添加用户评价和评分系统
- 实现路线规划功能
- 支持离线地图缓存（前端）

---

本文档由旅游景点地图导航系统开发团队维护，最后更新时间：2024年。如有任何问题，请联系开发团队。