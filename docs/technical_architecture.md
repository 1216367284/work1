# 旅游景点地图导航系统 - 技术架构文档

## 1. 系统架构概述

旅游景点地图导航系统采用前后端分离的架构设计，由前端微信小程序、后端API服务和数据库三大部分组成。系统通过RESTful API进行数据交互，实现了高度的模块化和可扩展性。

### 1.1 整体架构图

```
+---------------------+      HTTP/HTTPS      +---------------------+
|  微信小程序前端     | <-------------------> |  Spring Boot后端服务 |
|  (WeChat Mini Program) |                     |  (RESTful API)     |
+---------------------+                       +---------------------+
                                                   |
                                                   | JDBC/JPA
                                                   v
                                            +-------------------+
                                            |  MySQL数据库      |
                                            |  (关系型数据存储)  |
                                            +-------------------+
                                                   |
                                                   | Redis
                                                   v
                                            +-------------------+
                                            |  Redis缓存        |
                                            |  (热点数据存储)    |
                                            +-------------------+
```

### 1.2 分层架构

#### 前端架构分层

1. **表现层（UI）**：WXML、WXSS、组件
2. **业务层（Logic）**：JS页面逻辑、状态管理
3. **服务层（Service）**：API服务封装
4. **工具层（Utils）**：通用工具、地图适配器

#### 后端架构分层

1. **控制器层（Controller）**：处理HTTP请求，参数验证，响应封装
2. **服务层（Service）**：业务逻辑处理，事务管理
3. **数据访问层（DAO/Mapper）**：数据库操作，ORM映射
4. **模型层（Model）**：实体类、DTO、VO
5. **配置层（Config）**：系统配置，第三方服务配置
6. **工具层（Utils）**：通用工具类

## 2. 技术栈选型

### 2.1 前端技术栈

| 类别 | 技术/框架 | 版本 | 用途 |
|------|-----------|------|------|
| 开发语言 | JavaScript | ES6+ | 前端开发 |
| 开发框架 | 微信小程序原生开发 | - | 应用框架 |
| UI组件库 | WeUI | 1.1.4 | 界面组件 |
| 地图服务 | 高德地图API | v1.4.15 | 地图功能 |
| 地图服务 | 百度地图API | v3.0 | 地图功能 |
| 地图服务 | 腾讯地图API | v1.2 | 地图功能 |
| 状态管理 | 小程序globalData | - | 全局状态管理 |
| 网络请求 | wx.request | - | API请求 |

### 2.2 后端技术栈

| 类别 | 技术/框架 | 版本 | 用途 |
|------|-----------|------|------|
| 开发语言 | Java | 1.8+ | 后端开发 |
| Web框架 | Spring Boot | 2.7.x | 应用框架 |
| 安全框架 | Spring Security | 5.x | 身份认证与授权 |
| ORM框架 | MyBatis-Plus | 3.5.x | 数据访问 |
| 数据库 | MySQL | 8.0+ | 关系型数据库 |
| 缓存 | Redis | 5.0+ | 缓存服务 |
| 认证 | JWT | - | 无状态认证 |
| API文档 | Swagger/OpenAPI | 3.0 | API文档生成 |
| 日志 | SLF4J + Logback | - | 日志记录 |
| 工具库 | Lombok | 1.18.x | 代码简化 |
| 工具库 | Hutool | 5.x | 工具集 |
| HTTP客户端 | OkHttp | 4.x | API调用 |

## 3. 核心功能模块设计

### 3.1 地图服务模块

#### 3.1.1 设计模式

采用**适配器模式**和**工厂模式**相结合的方式，实现多地图服务的无缝切换。

#### 3.1.2 接口设计

```javascript
// 前端地图服务接口
interface IMapService {
  // 初始化地图
  initMap(mapContainer, options?);
  // 设置地图中心点
  setCenter(latitude, longitude, zoom?);
  // 添加标记点
  addMarker(options);
  // 移除标记点
  removeMarker(markerId);
  // 批量添加标记点
  addMarkers(markers);
  // 清除所有标记点
  clearMarkers();
  // 计算两点距离
  calculateDistance(point1, point2);
  // 规划路线
  planRoute(startPoint, endPoint, options?);
  // 搜索地点
  searchPlace(keyword, options?);
  // 获取地址信息
  getAddressInfo(latitude, longitude);
  // 获取当前位置
  getCurrentLocation();
  // 坐标转换
  convertCoordinate(coordinates, fromCoord, toCoord);
  // 设置地图缩放级别
  setZoom(zoom);
  // 获取地图缩放级别
  getZoom();
  // 添加控件
  addControl(control);
  // 移除控件
  removeControl(controlId);
  // 显示信息窗口
  showInfoWindow(markerId, content);
  // 隐藏信息窗口
  hideInfoWindow();
  // 添加地图事件监听
  on(eventName, callback);
  // 移除地图事件监听
  off(eventName, callback);
  // 销毁地图实例
  destroy();
}
```

#### 3.1.3 实现类

- `GaodeMapService`: 高德地图服务实现
- `BaiduMapService`: 百度地图服务实现
- `TencentMapService`: 腾讯地图服务实现
- `MapServiceFactory`: 地图服务工厂类，负责创建和管理地图服务实例

### 3.2 景点管理模块

#### 3.2.1 数据模型

```java
// 景点实体类
public class Spot {
    private Long id;                // 主键ID
    private String name;            // 景点名称
    private String description;     // 描述
    private Long categoryId;        // 分类ID
    private String coverImage;      // 封面图片
    private String images;          // 图片集合（JSON）
    private BigDecimal latitude;    // 纬度
    private BigDecimal longitude;   // 经度
    private String address;         // 地址
    private String district;        // 区县
    private String city;            // 城市
    private String province;        // 省份
    private BigDecimal ticketPrice; // 门票价格
    private String openTime;        // 开放时间
    private String closeTime;       // 关闭时间
    private String contactPhone;    // 联系电话
    private BigDecimal rating;      // 评分
    private Integer reviewCount;    // 评论数
    private Integer visitCount;     // 访问量
    private Integer status;         // 状态
    private Date createdAt;         // 创建时间
    private Date updatedAt;         // 更新时间
    // getter and setter
}
```

#### 3.2.2 API接口

| API路径 | 方法 | 功能描述 | 参数 | 成功返回 |
|---------|------|----------|------|----------|
| `/api/spots` | GET | 获取景点列表 | page, size, keyword, categoryId, sort | 分页景点列表 |
| `/api/spots/{id}` | GET | 获取景点详情 | id | 景点详情对象 |
| `/api/spots` | POST | 创建景点 | Spot对象 | 创建的景点对象 |
| `/api/spots/{id}` | PUT | 更新景点信息 | id, Spot对象 | 更新后的景点对象 |
| `/api/spots/{id}` | DELETE | 删除景点 | id | 操作结果 |
| `/api/spots/nearby` | GET | 获取附近景点 | latitude, longitude, radius | 附近景点列表 |
| `/api/spots/hot` | GET | 获取热门景点 | limit | 热门景点列表 |
| `/api/spots/search` | GET | 搜索景点 | keyword, page, size | 搜索结果 |
| `/api/spots/{id}/view` | POST | 增加景点访问量 | id | 更新后的访问量 |

### 3.3 用户管理模块

#### 3.3.1 数据模型

```java
// 用户实体类
public class User {
    private Long id;            // 主键ID
    private String username;    // 用户名
    private String password;    // 密码（加密）
    private String nickname;    // 昵称
    private String avatar;      // 头像URL
    private String phone;       // 手机号
    private String email;       // 邮箱
    private Integer gender;     // 性别
    private Date birthDate;     // 出生日期
    private Integer role;       // 角色
    private Integer status;     // 状态
    private Date createdAt;     // 创建时间
    private Date updatedAt;     // 更新时间
    private Date lastLoginAt;   // 最后登录时间
    // getter and setter
}
```

#### 3.3.2 API接口

| API路径 | 方法 | 功能描述 | 参数 | 成功返回 |
|---------|------|----------|------|----------|
| `/api/auth/login` | POST | 用户登录 | username, password | JWT token和用户信息 |
| `/api/auth/register` | POST | 用户注册 | User对象 | 注册结果 |
| `/api/auth/logout` | POST | 用户登出 | token | 登出结果 |
| `/api/users/me` | GET | 获取当前用户信息 | token | 用户信息 |
| `/api/users/me` | PUT | 更新当前用户信息 | token, User对象 | 更新后的用户信息 |
| `/api/users/me/password` | PUT | 修改密码 | token, oldPassword, newPassword | 修改结果 |
| `/api/users/{id}` | GET | 根据ID获取用户信息 | id | 用户信息 |
| `/api/users` | GET | 获取用户列表 | page, size, keyword | 分页用户列表 |
| `/api/users/{id}` | PUT | 更新用户信息 | id, User对象 | 更新后的用户信息 |
| `/api/users/{id}` | DELETE | 删除用户 | id | 操作结果 |

### 3.4 活动管理模块

#### 3.4.1 数据模型

```java
// 活动实体类
public class Activity {
    private Long id;                // 主键ID
    private String name;            // 活动名称
    private String description;     // 活动描述
    private String image;           // 活动图片
    private String images;          // 图片集合（JSON）
    private Date startTime;         // 开始时间
    private Date endTime;           // 结束时间
    private BigDecimal latitude;    // 纬度
    private BigDecimal longitude;   // 经度
    private String location;        // 活动地点
    private BigDecimal price;       // 活动费用
    private Integer maxParticipants; // 最大参与人数
    private Integer currentParticipants; // 当前参与人数
    private String organizer;       // 组织方
    private String contactPhone;    // 联系电话
    private String requirements;    // 活动要求
    private String agenda;          // 活动议程（JSON）
    private Integer status;         // 状态
    private Date createdAt;         // 创建时间
    private Date updatedAt;         // 更新时间
    // getter and setter
}
```

#### 3.4.2 API接口

| API路径 | 方法 | 功能描述 | 参数 | 成功返回 |
|---------|------|----------|------|----------|
| `/api/activities` | GET | 获取活动列表 | page, size, status, keyword | 分页活动列表 |
| `/api/activities/{id}` | GET | 获取活动详情 | id | 活动详情对象 |
| `/api/activities` | POST | 创建活动 | Activity对象 | 创建的活动对象 |
| `/api/activities/{id}` | PUT | 更新活动信息 | id, Activity对象 | 更新后的活动对象 |
| `/api/activities/{id}` | DELETE | 删除活动 | id | 操作结果 |
| `/api/activities/latest` | GET | 获取最新活动 | limit | 最新活动列表 |
| `/api/activities/upcoming` | GET | 获取即将开始的活动 | limit | 即将开始的活动列表 |
| `/api/activities/{id}/participate` | POST | 参加活动 | id, userId | 参与结果 |
| `/api/activities/{id}/cancel` | POST | 取消参加活动 | id, userId | 操作结果 |
| `/api/activities/{id}/participants` | GET | 获取活动参与者列表 | id, page, size | 参与者列表 |

### 3.5 评论与评分模块

#### 3.5.1 数据模型

```java
// 评论实体类
public class Review {
    private Long id;            // 主键ID
    private String content;     // 评论内容
    private Integer rating;     // 评分（1-5分）
    private Long userId;        // 用户ID
    private Long targetId;      // 目标ID（景点或活动）
    private Integer targetType; // 目标类型：1-景点，2-活动
    private String images;      // 图片集合（JSON）
    private Integer likes;      // 点赞数
    private Date createdAt;     // 创建时间
    private Date updatedAt;     // 更新时间
    // getter and setter
}
```

#### 3.5.2 API接口

| API路径 | 方法 | 功能描述 | 参数 | 成功返回 |
|---------|------|----------|------|----------|
| `/api/reviews` | GET | 获取评论列表 | targetId, targetType, page, size | 分页评论列表 |
| `/api/reviews` | POST | 发表评论 | Review对象 | 创建的评论 |
| `/api/reviews/{id}` | GET | 获取评论详情 | id | 评论详情 |
| `/api/reviews/{id}` | PUT | 更新评论 | id, Review对象 | 更新后的评论 |
| `/api/reviews/{id}` | DELETE | 删除评论 | id | 操作结果 |
| `/api/reviews/{id}/like` | POST | 点赞评论 | id, userId | 更新后的点赞数 |
| `/api/reviews/{id}/unlike` | POST | 取消点赞 | id, userId | 更新后的点赞数 |
| `/api/spots/{id}/reviews` | GET | 获取景点评论 | id, page, size | 景点评论列表 |
| `/api/activities/{id}/reviews` | GET | 获取活动评论 | id, page, size | 活动评论列表 |

## 4. 数据库设计

### 4.1 主要数据表

#### 4.1.1 users表

存储用户信息，包括基本资料、权限、状态等。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 用户名 |
| password | VARCHAR(100) | NOT NULL | 密码（加密存储） |
| nickname | VARCHAR(50) | - | 昵称 |
| avatar | VARCHAR(255) | - | 头像URL |
| phone | VARCHAR(20) | UNIQUE | 手机号 |
| email | VARCHAR(100) | UNIQUE | 邮箱 |
| gender | TINYINT | DEFAULT 0 | 性别 |
| birth_date | DATE | - | 出生日期 |
| role | TINYINT | DEFAULT 0 | 角色 |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| last_login_at | TIMESTAMP | - | 最后登录时间 |

#### 4.1.2 spots表

存储景点信息，包括名称、位置、价格、描述等。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 景点ID |
| name | VARCHAR(100) | NOT NULL | 景点名称 |
| description | TEXT | - | 景点描述 |
| category_id | BIGINT | - | 分类ID |
| cover_image | VARCHAR(255) | - | 封面图片 |
| images | TEXT | - | 图片集合（JSON） |
| latitude | DECIMAL(10,8) | NOT NULL | 纬度 |
| longitude | DECIMAL(11,8) | NOT NULL | 经度 |
| address | VARCHAR(255) | NOT NULL | 地址 |
| district | VARCHAR(50) | - | 区县 |
| city | VARCHAR(50) | - | 城市 |
| province | VARCHAR(50) | - | 省份 |
| ticket_price | DECIMAL(10,2) | DEFAULT 0 | 门票价格 |
| open_time | VARCHAR(100) | - | 开放时间 |
| close_time | VARCHAR(100) | - | 关闭时间 |
| contact_phone | VARCHAR(20) | - | 联系电话 |
| rating | DECIMAL(3,1) | DEFAULT 0 | 评分 |
| review_count | INT | DEFAULT 0 | 评论数 |
| visit_count | INT | DEFAULT 0 | 访问量 |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

#### 4.1.3 activities表

存储活动信息，包括名称、时间、地点、费用等。

| 字段名 | 数据类型 | 约束 | 描述 |
|--------|----------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 活动ID |
| name | VARCHAR(100) | NOT NULL | 活动名称 |
| description | TEXT | - | 活动描述 |
| image | VARCHAR(255) | - | 活动图片 |
| images | TEXT | - | 图片集合（JSON） |
| start_time | DATETIME | NOT NULL | 开始时间 |
| end_time | DATETIME | NOT NULL | 结束时间 |
| latitude | DECIMAL(10,8) | - | 纬度 |
| longitude | DECIMAL(11,8) | - | 经度 |
| location | VARCHAR(255) | - | 活动地点 |
| price | DECIMAL(10,2) | DEFAULT 0 | 活动费用 |
| max_participants | INT | DEFAULT 0 | 最大参与人数 |
| current_participants | INT | DEFAULT 0 | 当前参与人数 |
| organizer | VARCHAR(100) | - | 组织方 |
| contact_phone | VARCHAR(20) | - | 联系电话 |
| requirements | TEXT | - | 活动要求 |
| agenda | TEXT | - | 活动议程（JSON） |
| status | TINYINT | DEFAULT 1 | 状态 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 4.2 索引设计

#### 4.2.1 users表索引

- PRIMARY KEY: `id`
- UNIQUE: `username`, `phone`, `email`
- INDEX: `idx_username`, `idx_phone`, `idx_email`

#### 4.2.2 spots表索引

- PRIMARY KEY: `id`
- INDEX: `idx_name`, `idx_category`, `idx_location` (联合索引), `idx_city`

#### 4.2.3 activities表索引

- PRIMARY KEY: `id`
- INDEX: `idx_name`, `idx_time` (联合索引), `idx_status`

## 5. 安全设计

### 5.1 认证与授权

- 使用JWT进行无状态认证
- 基于Spring Security实现权限控制
- 密码使用BCrypt算法加密存储
- 敏感操作需要二次验证

### 5.2 接口安全

- 所有API接口需要进行身份验证（除公开接口外）
- 使用HTTPS协议传输数据
- 接口请求频率限制
- 参数验证和XSS防护
- SQL注入防护

### 5.3 数据安全

- 敏感数据加密存储
- 数据库备份策略
- 访问日志记录
- 异常处理和日志记录

## 6. 性能优化

### 6.1 数据库优化

- 合理设计索引
- 避免全表扫描
- 使用连接池管理数据库连接
- 分库分表（大数据量场景）
- 读写分离（高并发场景）

### 6.2 缓存策略

- 使用Redis缓存热点数据
- 缓存景点信息、活动信息等频繁访问的数据
- 设置合理的缓存过期时间
- 缓存预热和缓存更新策略

### 6.3 前端优化

- 图片懒加载
- 组件复用
- 减少HTTP请求
- 数据预加载
- 页面渲染优化

### 6.4 后端优化

- 接口响应数据精简
- 异步处理耗时操作
- 连接池优化
- JVM参数调优

## 7. 部署架构

### 7.1 开发环境

```
+---------------------+      HTTP      +---------------------+
| 微信开发者工具      | <-------------> | Spring Boot内嵌Tomcat |
+---------------------+                +---------------------+
                                          |
                                          | JDBC
                                          v
                                   +-------------------+
                                   | 本地MySQL数据库   |
                                   +-------------------+
                                          |
                                          | Redis
                                          v
                                   +-------------------+
                                   | 本地Redis缓存     |
                                   +-------------------+
```

### 7.2 生产环境

```
+---------------------+      HTTPS      +---------------------+
| 微信小程序          | <-------------> | Nginx负载均衡      |
+---------------------+                +---------------------+
                                          |
                                          |
                              +-----------+-----------+
                              |                       |
                              v                       v
                +---------------------+   +---------------------+
                | Spring Boot实例1    |   | Spring Boot实例2    |
                +---------------------+   +---------------------+
                              |                       |
                              |                       |
                              v                       v
                        +-----------------+----------------+
                        |                                  |
                        v                                  v
                  +-------------------+            +-------------------+
                  | MySQL主从集群     |            | Redis集群         |
                  +-------------------+            +-------------------+
                        |                                  |
                        v                                  v
                  +-------------------+            +-------------------+
                  | ElasticSearch     |            | 日志分析系统      |
                  | (日志/搜索)        |            | (ELK Stack)       |
                  +-------------------+
```

## 8. 监控与运维

### 8.1 日志系统

- 使用SLF4J + Logback记录日志
- 日志分级：DEBUG, INFO, WARN, ERROR
- 关键操作日志记录
- 异常日志详细信息

### 8.2 监控系统

- 服务健康检查
- 性能监控
- 错误率监控
- 报警机制

### 8.3 运维自动化

- CI/CD集成
- 自动化部署
- 配置管理
- 自动化测试

## 9. 扩展性设计

### 9.1 地图服务扩展

- 通过适配器模式，支持新增地图服务提供商
- 只需实现IMapService接口，即可无缝集成新的地图服务

### 9.2 功能模块扩展

- 模块化设计，便于新增功能模块
- 接口标准化，降低模块间耦合度
- 事件驱动架构，支持插件式扩展

### 9.3 数据库扩展

- 分库分表策略
- 读写分离架构
- NoSQL数据库集成（可选）

## 10. 代码规范

### 10.1 Java代码规范

- 遵循Google Java Style Guide
- 使用Lombok简化代码
- 类和方法命名规范
- 注释规范

### 10.2 JavaScript代码规范

- 遵循ESLint标准
- 使用ES6+语法
- 变量和函数命名规范
- 注释规范

## 11. 测试策略

### 11.1 单元测试

- 使用JUnit进行Java单元测试
- 测试覆盖率目标：80%以上

### 11.2 集成测试

- API接口集成测试
- 数据库操作集成测试
- 服务层集成测试

### 11.3 端到端测试

- 关键业务流程测试
- 用户界面测试

## 12. 未来优化方向

### 12.1 功能优化

- 离线地图功能
- 个性化推荐
- 社交功能增强
- AI智能导览

### 12.2 性能优化

- 服务网格（Service Mesh）
- 微服务架构重构
- 容器化部署
- 云原生优化

### 12.3 安全性增强

- 多因素认证
- API网关安全增强
- 数据脱敏
- 安全审计

---

本文档详细描述了旅游景点地图导航系统的技术架构设计，包括系统架构、技术选型、核心功能模块设计、数据库设计、安全设计、性能优化等方面。通过本架构文档，可以帮助开发团队更好地理解系统设计，指导后续的开发和维护工作。