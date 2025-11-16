# 旅游景点地图导航系统

## 项目概述

旅游景点地图导航系统是一个基于微信小程序的旅游信息服务平台，旨在为游客提供便捷的景点查询、地图导航、活动参与等功能。系统支持多地图服务切换（高德、百度、腾讯），提供景点详情、路线规划、活动报名等核心功能，帮助游客更好地探索和体验旅游目的地。

## 主要功能

### 前端功能

- **地图浏览**：支持多地图服务商切换，查看景点分布
- **景点查询**：按名称、分类、位置等条件搜索景点
- **景点详情**：查看景点介绍、图片、开放时间、门票价格等信息
- **路线规划**：根据起点和终点规划导航路线
- **活动参与**：浏览和报名参加各类旅游活动
- **个人中心**：收藏管理、浏览历史、我的订单等
- **评论互动**：对景点和活动进行评论和评分
- **位置服务**：获取用户当前位置，展示周边景点

### 后端功能

- **用户管理**：注册、登录、权限控制
- **景点数据管理**：增删改查景点信息
- **活动管理**：创建、编辑、发布活动
- **评论管理**：评论审核、统计
- **订单管理**：门票预订、支付处理
- **收藏与历史记录**：用户行为数据存储
- **地图服务集成**：封装多地图服务商API

## 技术栈

### 前端

- **开发框架**：微信小程序原生开发
- **UI组件**：WeUI
- **地图服务**：高德地图API、百度地图API、腾讯地图API（通过适配器模式统一调用）
- **状态管理**：小程序globalData
- **网络请求**：wx.request封装

### 后端

- **开发语言**：Java
- **框架**：Spring Boot 2.x
- **ORM**：MyBatis-Plus
- **数据库**：MySQL 8.x
- **缓存**：Redis
- **认证**：JWT
- **API文档**：Swagger/OpenAPI
- **日志**：SLF4J + Logback

### 数据库

- **主数据库**：MySQL 8.x
- **数据库连接池**：HikariCP
- **数据备份**：定时备份机制

### 部署

- **容器化**：Docker
- **CI/CD**：Jenkins
- **监控**：Prometheus + Grafana
- **日志分析**：ELK Stack

## 项目结构

### 前端目录结构

```
frontend/
├── app.js                 # 小程序入口文件
├── app.json               # 小程序全局配置
├── app.wxss               # 小程序全局样式
├── components/            # 公共组件
│   ├── map-marker/        # 地图标记组件
│   ├── search-bar/        # 搜索栏组件
│   └── loading/           # 加载提示组件
├── pages/                 # 页面目录
│   ├── index/             # 首页
│   ├── spotMap/           # 景点地图页面
│   ├── spotList/          # 景点列表页面
│   ├── spotDetail/        # 景点详情页面
│   ├── activityDetail/    # 活动详情页面
│   ├── userCenter/        # 个人中心
│   └── login/             # 登录页面
├── utils/                 # 工具类
│   ├── request.js         # 网络请求封装
│   ├── auth.js            # 身份认证
│   ├── map/               # 地图服务适配器
│   │   ├── IMapService.js     # 地图服务接口
│   │   ├── GaodeMapService.js # 高德地图服务实现
│   │   ├── BaiduMapService.js # 百度地图服务实现
│   │   ├── TencentMapService.js # 腾讯地图服务实现
│   │   └── MapServiceFactory.js # 地图服务工厂
│   └── common.js          # 通用工具函数
└── services/              # API服务层
    ├── userService.js     # 用户相关服务
    ├── spotService.js     # 景点相关服务
    ├── activityService.js # 活动相关服务
    └── orderService.js    # 订单相关服务
```

### 后端目录结构

```
backend/
├── src/main/java/com/travel/spot/
│   ├── TravelSpotApplication.java    # 应用程序入口
│   ├── config/                       # 配置类
│   │   ├── SwaggerConfig.java        # Swagger配置
│   │   ├── SecurityConfig.java       # 安全配置
│   │   └── MapServiceConfig.java     # 地图服务配置
│   ├── controller/                   # 控制器
│   │   ├── UserController.java       # 用户控制器
│   │   ├── SpotController.java       # 景点控制器
│   │   ├── ActivityController.java   # 活动控制器
│   │   ├── OrderController.java      # 订单控制器
│   │   └── MapController.java        # 地图服务控制器
│   ├── service/                      # 服务层
│   │   ├── impl/                     # 服务实现
│   │   │   ├── UserServiceImpl.java  # 用户服务实现
│   │   │   ├── SpotServiceImpl.java  # 景点服务实现
│   │   │   └── ...
│   │   ├── UserService.java          # 用户服务接口
│   │   ├── SpotService.java          # 景点服务接口
│   │   └── ...
│   ├── mapper/                       # 数据访问层
│   │   ├── UserMapper.java
│   │   ├── SpotMapper.java
│   │   └── ...
│   ├── model/                        # 数据模型
│   │   ├── entity/                   # 实体类
│   │   ├── dto/                      # 数据传输对象
│   │   └── vo/                       # 视图对象
│   ├── exception/                    # 异常处理
│   │   ├── GlobalExceptionHandler.java
│   │   └── BusinessException.java
│   ├── utils/                        # 工具类
│   │   ├── JsonUtils.java
│   │   ├── JwtUtils.java
│   │   └── ...
│   └── map/                          # 地图服务
│       ├── IMapService.java          # 地图服务接口
│       ├── impl/                     # 地图服务实现
│       │   ├── GaodeMapServiceImpl.java
│       │   ├── BaiduMapServiceImpl.java
│       │   ├── TencentMapServiceImpl.java
│       │   └── MapServiceFactory.java
│       └── config/                   # 地图配置
├── src/main/resources/
│   ├── application.yml               # 应用配置
│   ├── application-dev.yml           # 开发环境配置
│   ├── application-prod.yml          # 生产环境配置
│   └── mapper/                       # MyBatis映射文件
└── pom.xml                           # Maven配置
```

### 数据库结构

```
database/
├── init_database.sql       # 数据库初始化脚本
├── backup/                 # 数据备份目录
└── sql/                    # 其他SQL脚本
```

## 快速开始

### 前置条件

- JDK 1.8+ 或 JDK 11+
- Maven 3.6+
- MySQL 8.x
- Redis 5.x+
- Node.js 14.x+（用于前端构建）
- 微信开发者工具

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/travel-spot-system.git
cd travel-spot-system
```

#### 2. 数据库初始化

```bash
# 创建数据库
mysql -u root -p
CREATE DATABASE travel_spot_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入初始化脚本
mysql -u root -p travel_spot_system < database/init_database.sql
```

#### 3. 配置数据库连接

编辑 `backend/src/main/resources/application-dev.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/travel_spot_system?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your-password
    driver-class-name: com.mysql.cj.jdbc.Driver
```

#### 4. 配置地图服务API密钥

在 `backend/src/main/resources/application.yml` 中配置地图服务API密钥：

```yaml
travel:
  map:
    gaode:
      api-key: your-gaode-api-key
    baidu:
      ak: your-baidu-ak
    tencent:
      key: your-tencent-key
```

#### 5. 启动后端服务

```bash
cd backend
mvn clean package -DskipTests
java -jar target/travel-spot-system-1.0.0.jar
```

#### 6. 配置前端项目

编辑 `frontend/utils/request.js`，修改API基础URL：

```javascript
const BASE_URL = 'http://localhost:8080/api';
```

#### 7. 运行前端项目

使用微信开发者工具导入前端项目目录，然后运行。

## API文档

后端服务启动后，可以通过以下地址访问API文档：

- Swagger UI: http://localhost:8080/swagger-ui.html
- API文档JSON: http://localhost:8080/v3/api-docs

## 地图服务适配器

系统实现了地图服务适配器模式，可以无缝切换不同的地图服务提供商。主要包含以下组件：

- **IMapService.js**: 地图服务接口，定义了统一的地图操作方法
- **GaodeMapService.js**: 高德地图服务实现
- **BaiduMapService.js**: 百度地图服务实现
- **TencentMapService.js**: 腾讯地图服务实现
- **MapServiceFactory.js**: 地图服务工厂，负责创建和管理地图服务实例

## 核心功能模块

### 景点地图

景点地图页面展示地图和景点标记，支持地图缩放、平移、切换地图类型等操作。点击标记可以查看景点简要信息，并可以导航到景点详情页面。

### 景点列表

景点列表页面展示所有景点信息，支持按名称、分类、评分等条件筛选和排序。列表项显示景点名称、图片、评分、距离等信息。

### 景点详情

景点详情页面展示景点的详细信息，包括介绍、图片轮播、开放时间、门票价格、地址、联系方式等。用户可以在此页面收藏景点、查看评论、参加相关活动等。

### 活动详情

活动详情页面展示旅游活动的详细信息，包括活动介绍、时间地点、参与人数、价格等。用户可以在此页面报名参加活动。

## 安全注意事项

1. API密钥必须妥善保管，避免泄露
2. 生产环境必须启用HTTPS
3. 用户密码必须加密存储
4. 敏感操作需要身份验证和授权
5. 输入数据必须进行验证和过滤，防止SQL注入和XSS攻击

## 性能优化

1. 数据库索引优化
2. Redis缓存热点数据
3. 图片懒加载和压缩
4. 接口请求合并和防抖
5. 代码分割和按需加载

## 许可证

[MIT License](LICENSE)

## 联系方式

- 项目维护者：[your-email@example.com](mailto:your-email@example.com)
- 问题反馈：[Issues](https://github.com/your-username/travel-spot-system/issues)
- 技术支持：[Support](https://example.com/support)

## 更新日志

### v1.0.0 (2024-xx-xx)

- 初始版本发布
- 实现基本的景点查询和地图导航功能
- 支持高德地图服务

### v1.1.0 (2024-xx-xx)

- 添加百度地图和腾讯地图支持
- 实现活动报名功能
- 优化地图性能

### v1.2.0 (计划中)

- 添加用户评价和评分系统
- 实现路线规划功能
- 支持离线地图缓存

## 贡献指南

欢迎贡献代码！请按照以下步骤进行：

1. Fork 项目仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 开发建议

1. 严格遵循代码规范和命名约定
2. 编写单元测试和集成测试
3. 保持代码简洁和可维护性
4. 添加详细的注释和文档
5. 定期更新依赖库，修复安全漏洞

---

感谢使用旅游景点地图导航系统！如有任何问题或建议，请随时联系我们。