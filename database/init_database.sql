-- 初始化数据库脚本 - 旅游景点地图导航系统

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS travel_spot_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE travel_spot_system;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码（加密存储）',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar VARCHAR(255) COMMENT '头像URL',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    email VARCHAR(100) UNIQUE COMMENT '邮箱',
    gender TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
    birth_date DATE COMMENT '出生日期',
    role TINYINT DEFAULT 0 COMMENT '角色：0-普通用户，1-管理员',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    last_login_at TIMESTAMP COMMENT '最后登录时间',
    INDEX idx_username (username),
    INDEX idx_phone (phone),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 景点表
CREATE TABLE IF NOT EXISTS spots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '景点名称',
    description TEXT COMMENT '景点描述',
    category_id BIGINT COMMENT '分类ID',
    cover_image VARCHAR(255) COMMENT '封面图片',
    images TEXT COMMENT '图片集合（JSON格式）',
    latitude DECIMAL(10, 8) NOT NULL COMMENT '纬度',
    longitude DECIMAL(11, 8) NOT NULL COMMENT '经度',
    address VARCHAR(255) NOT NULL COMMENT '地址',
    district VARCHAR(50) COMMENT '区县',
    city VARCHAR(50) COMMENT '城市',
    province VARCHAR(50) COMMENT '省份',
    ticket_price DECIMAL(10, 2) DEFAULT 0 COMMENT '门票价格',
    open_time VARCHAR(100) COMMENT '开放时间',
    close_time VARCHAR(100) COMMENT '关闭时间',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    rating DECIMAL(3, 1) DEFAULT 0 COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评论数',
    visit_count INT DEFAULT 0 COMMENT '访问量',
    status TINYINT DEFAULT 1 COMMENT '状态：0-下架，1-上架',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_location (latitude, longitude),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景点表';

-- 景点分类表
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    parent_id BIGINT DEFAULT 0 COMMENT '父分类ID',
    level TINYINT DEFAULT 1 COMMENT '分类级别',
    sort_order INT DEFAULT 0 COMMENT '排序',
    icon VARCHAR(50) COMMENT '图标',
    status TINYINT DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景点分类表';

-- 景点特色表
CREATE TABLE IF NOT EXISTS spot_features (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    spot_id BIGINT NOT NULL COMMENT '景点ID',
    feature VARCHAR(50) NOT NULL COMMENT '特色标签',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    INDEX idx_spot (spot_id),
    UNIQUE KEY uk_spot_feature (spot_id, feature)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='景点特色表';

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '活动名称',
    description TEXT COMMENT '活动描述',
    image VARCHAR(255) COMMENT '活动图片',
    images TEXT COMMENT '图片集合（JSON格式）',
    start_time DATETIME NOT NULL COMMENT '开始时间',
    end_time DATETIME NOT NULL COMMENT '结束时间',
    latitude DECIMAL(10, 8) COMMENT '纬度',
    longitude DECIMAL(11, 8) COMMENT '经度',
    location VARCHAR(255) COMMENT '活动地点',
    price DECIMAL(10, 2) DEFAULT 0 COMMENT '活动费用',
    max_participants INT DEFAULT 0 COMMENT '最大参与人数',
    current_participants INT DEFAULT 0 COMMENT '当前参与人数',
    organizer VARCHAR(100) COMMENT '组织方',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    requirements TEXT COMMENT '活动要求',
    agenda TEXT COMMENT '活动议程（JSON格式）',
    status TINYINT DEFAULT 1 COMMENT '状态：0-未开始，1-进行中，2-已结束',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_name (name),
    INDEX idx_time (start_time, end_time),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 活动参与表
CREATE TABLE IF NOT EXISTS activity_participants (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    activity_id BIGINT NOT NULL COMMENT '活动ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    join_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '参与时间',
    status TINYINT DEFAULT 1 COMMENT '状态：0-取消，1-已参与',
    remark VARCHAR(255) COMMENT '备注',
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_activity_user (activity_id, user_id),
    INDEX idx_activity (activity_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动参与表';

-- 评论表
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL COMMENT '评论内容',
    rating TINYINT NOT NULL COMMENT '评分（1-5分）',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    target_id BIGINT NOT NULL COMMENT '目标ID（景点或活动）',
    target_type TINYINT NOT NULL COMMENT '目标类型：1-景点，2-活动',
    images TEXT COMMENT '图片集合（JSON格式）',
    likes INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_target (target_id, target_type),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 收藏表
CREATE TABLE IF NOT EXISTS favorites (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    spot_id BIGINT NOT NULL COMMENT '景点ID',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_spot (user_id, spot_id),
    INDEX idx_user (user_id),
    INDEX idx_spot (spot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_no VARCHAR(50) NOT NULL UNIQUE COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    spot_id BIGINT NOT NULL COMMENT '景点ID',
    ticket_type VARCHAR(50) COMMENT '票型',
    quantity INT NOT NULL DEFAULT 1 COMMENT '数量',
    total_amount DECIMAL(10, 2) NOT NULL COMMENT '总金额',
    actual_amount DECIMAL(10, 2) NOT NULL COMMENT '实付金额',
    status TINYINT DEFAULT 1 COMMENT '状态：1-待支付，2-已支付，3-已取消，4-已使用，5-已退款',
    payment_method TINYINT COMMENT '支付方式：1-微信支付，2-支付宝',
    payment_time TIMESTAMP COMMENT '支付时间',
    visit_date DATE COMMENT '预约日期',
    contact_name VARCHAR(50) COMMENT '联系人姓名',
    contact_phone VARCHAR(20) COMMENT '联系人电话',
    use_time TIMESTAMP COMMENT '使用时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    INDEX idx_order_no (order_no),
    INDEX idx_user (user_id),
    INDEX idx_spot (spot_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 路线表
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '路线名称',
    description TEXT COMMENT '路线描述',
    start_spot_id BIGINT NOT NULL COMMENT '起点景点ID',
    end_spot_id BIGINT NOT NULL COMMENT '终点景点ID',
    distance DECIMAL(10, 2) COMMENT '距离（公里）',
    duration INT COMMENT '预计时长（分钟）',
    difficulty TINYINT DEFAULT 1 COMMENT '难度：1-简单，2-中等，3-困难',
    path_data TEXT COMMENT '路径数据（JSON格式）',
    waypoints TEXT COMMENT '途经点（JSON格式）',
    created_by BIGINT COMMENT '创建人ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (start_spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    FOREIGN KEY (end_spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_difficulty (difficulty)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线表';

-- 浏览历史表
CREATE TABLE IF NOT EXISTS browse_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    spot_id BIGINT NOT NULL COMMENT '景点ID',
    view_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '浏览时间',
    view_count INT DEFAULT 1 COMMENT '浏览次数',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (spot_id) REFERENCES spots(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_spot (spot_id),
    INDEX idx_time (view_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='浏览历史表';

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_configs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    config_key VARCHAR(50) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_desc VARCHAR(255) COMMENT '配置描述',
    config_type TINYINT DEFAULT 1 COMMENT '配置类型：1-字符串，2-数字，3-布尔，4-JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 初始化数据
-- 插入默认分类
INSERT INTO categories (id, name, parent_id, level, sort_order, status) VALUES
(1, '自然风光', 0, 1, 1, 1),
(2, '人文古迹', 0, 1, 2, 1),
(3, '主题公园', 0, 1, 3, 1),
(4, '城市地标', 0, 1, 4, 1),
(5, '博物馆', 0, 1, 5, 1),
(6, '海滩岛屿', 1, 2, 1, 1),
(7, '山脉森林', 1, 2, 2, 1),
(8, '湖泊水库', 1, 2, 3, 1),
(9, '寺庙道观', 2, 2, 1, 1),
(10, '古镇老街', 2, 2, 2, 1),
(11, '历史建筑', 2, 2, 3, 1);

-- 插入默认系统配置
INSERT INTO system_configs (config_key, config_value, config_desc, config_type) VALUES
('site_name', '旅游景点地图导航系统', '系统名称', 1),
('site_logo', '', '系统logo', 1),
('contact_phone', '400-123-4567', '联系电话', 1),
('map_service_type', 'gaode', '地图服务类型：gaode-高德，baidu-百度，tencent-腾讯', 1),
('default_page_size', '10', '默认分页大小', 2),
('max_image_size', '5242880', '最大图片大小（5MB）', 2),
('allow_review_image', '1', '是否允许评论上传图片', 3),
('max_review_images', '9', '评论最多上传图片数', 2),
('min_search_keyword_length', '1', '搜索关键词最小长度', 2),
('activity_max_participants', '1000', '活动最大参与人数', 2);

-- 创建存储过程：更新景点评论数和评分
DELIMITER //
CREATE PROCEDURE update_spot_rating(IN spotId BIGINT)
BEGIN
    DECLARE avgRating DECIMAL(3, 1);
    DECLARE reviewCount INT;
    
    SELECT AVG(rating), COUNT(*) 
    INTO avgRating, reviewCount 
    FROM reviews 
    WHERE target_id = spotId AND target_type = 1;
    
    UPDATE spots 
    SET rating = IFNULL(avgRating, 0), 
        review_count = IFNULL(reviewCount, 0) 
    WHERE id = spotId;
END //
DELIMITER ;

-- 创建存储过程：更新活动参与人数
DELIMITER //
CREATE PROCEDURE update_activity_participant_count(IN activityId BIGINT)
BEGIN
    DECLARE participantCount INT;
    
    SELECT COUNT(*) 
    INTO participantCount 
    FROM activity_participants 
    WHERE activity_id = activityId AND status = 1;
    
    UPDATE activities 
    SET current_participants = IFNULL(participantCount, 0) 
    WHERE id = activityId;
END //
DELIMITER ;

-- 创建触发器：评论后更新景点评分
DELIMITER //
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    IF NEW.target_type = 1 THEN
        CALL update_spot_rating(NEW.target_id);
    END IF;
END //
DELIMITER ;

-- 创建触发器：评论更新后更新景点评分
DELIMITER //
CREATE TRIGGER trg_after_review_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    IF NEW.target_type = 1 THEN
        CALL update_spot_rating(NEW.target_id);
    END IF;
END //
DELIMITER ;

-- 创建触发器：评论删除后更新景点评分
DELIMITER //
CREATE TRIGGER trg_after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    IF OLD.target_type = 1 THEN
        CALL update_spot_rating(OLD.target_id);
    END IF;
END //
DELIMITER ;

-- 创建触发器：参与活动后更新活动参与人数
DELIMITER //
CREATE TRIGGER trg_after_activity_participant_insert
AFTER INSERT ON activity_participants
FOR EACH ROW
BEGIN
    CALL update_activity_participant_count(NEW.activity_id);
END //
DELIMITER ;

-- 创建触发器：更新活动参与状态后更新活动参与人数
DELIMITER //
CREATE TRIGGER trg_after_activity_participant_update
AFTER UPDATE ON activity_participants
FOR EACH ROW
BEGIN
    CALL update_activity_participant_count(NEW.activity_id);
END //
DELIMITER ;

-- 创建触发器：取消活动参与后更新活动参与人数
DELIMITER //
CREATE TRIGGER trg_after_activity_participant_delete
AFTER DELETE ON activity_participants
FOR EACH ROW
BEGIN
    CALL update_activity_participant_count(OLD.activity_id);
END //
DELIMITER ;

-- 创建视图：热门景点
CREATE VIEW view_hot_spots AS
SELECT s.* 
FROM spots s
ORDER BY s.visit_count DESC, s.review_count DESC
LIMIT 20;

-- 创建视图：最新活动
CREATE VIEW view_latest_activities AS
SELECT a.* 
FROM activities a
WHERE a.status IN (0, 1)
ORDER BY a.created_at DESC
LIMIT 20;

-- 创建视图：用户活动列表
CREATE VIEW view_user_activities AS
SELECT 
    ap.id, 
    ap.activity_id, 
    a.name AS activity_name, 
    a.start_time, 
    a.end_time, 
    a.location, 
    a.image, 
    ap.user_id, 
    ap.join_time, 
    ap.status AS participant_status
FROM 
    activity_participants ap
JOIN 
    activities a ON ap.activity_id = a.id;

-- 创建视图：用户收藏列表
CREATE VIEW view_user_favorites AS
SELECT 
    f.id, 
    f.user_id, 
    f.spot_id, 
    s.name AS spot_name, 
    s.cover_image, 
    s.address, 
    s.rating, 
    s.ticket_price,
    f.create_time
FROM 
    favorites f
JOIN 
    spots s ON f.spot_id = s.id;

-- 创建视图：用户订单列表
CREATE VIEW view_user_orders AS
SELECT 
    o.id, 
    o.order_no, 
    o.user_id, 
    o.spot_id, 
    s.name AS spot_name,
    s.cover_image,
    o.ticket_type,
    o.quantity,
    o.total_amount,
    o.actual_amount,
    o.status,
    o.visit_date,
    o.contact_name,
    o.contact_phone,
    o.created_at
FROM 
    orders o
JOIN 
    spots s ON o.spot_id = s.id;

-- 创建用户权限相关函数（可选）
DELIMITER //
CREATE FUNCTION check_user_permission(user_id BIGINT, required_role TINYINT)
RETURNS BOOLEAN
DETERMINISTIC
BEGIN
    DECLARE user_role TINYINT;
    
    SELECT role INTO user_role FROM users WHERE id = user_id;
    
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN user_role >= required_role;
END //
DELIMITER ;

-- 插入测试数据（可选）
-- 注意：生产环境请移除以下测试数据

-- 插入测试用户（密码：123456）
INSERT INTO users (username, password, nickname, phone, email, role, status) VALUES
('testuser', '$2a$10$F4F3Jg3E4D5C2B1A6Z7Y8X9W0V1U2T3S4', '测试用户', '13800138000', 'test@example.com', 0, 1),
('admin', '$2a$10$F4F3Jg3E4D5C2B1A6Z7Y8X9W0V1U2T3S4', '管理员', '13900139000', 'admin@example.com', 1, 1);

-- 插入测试景点数据
INSERT INTO spots (name, description, category_id, cover_image, latitude, longitude, address, city, ticket_price, open_time, rating, review_count, status) VALUES
('故宫博物院', '中国明清两代的皇家宫殿，世界上现存规模最大、保存最为完整的木质结构古建筑之一。', 11, '/upload/spots/forbidden_city.jpg', 39.916345, 116.397155, '北京市东城区景山前街4号', '北京', 60.00, '08:30-17:00', 4.8, 15680, 1),
('长城', '中国古代的军事防御工程，是一道高大、坚固而连绵不断的长垣。', 11, '/upload/spots/great_wall.jpg', 40.431908, 116.570374, '北京市延庆区八达岭镇', '北京', 40.00, '07:30-18:00', 4.7, 23540, 1),
('西湖', '中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。', 8, '/upload/spots/west_lake.jpg', 30.259233, 120.149710, '浙江省杭州市西湖区龙井路1号', '杭州', 0.00, '全天开放', 4.9, 32450, 1),
('黄山', '世界文化与自然双重遗产，世界地质公园，国家5A级旅游景区。', 7, '/upload/spots/huangshan.jpg', 30.131435, 118.175399, '安徽省黄山市黄山区汤口镇', '黄山', 190.00, '06:30-16:30', 4.9, 18760, 1),
('兵马俑', '世界第八大奇迹，第一批全国重点文物保护单位。', 11, '/upload/spots/terracotta_army.jpg', 34.385308, 109.278147, '陕西省西安市临潼区秦始皇陵', '西安', 120.00, '08:30-17:30', 4.8, 16320, 1);

-- 插入测试活动数据
INSERT INTO activities (name, description, image, start_time, end_time, location, price, max_participants, current_participants, organizer, status) VALUES
('春季赏花摄影活动', '春天来了，一起去公园赏花拍照吧！', '/upload/activities/spring_flowers.jpg', '2024-04-15 09:00:00', '2024-04-15 16:00:00', '北京市奥林匹克森林公园', 0.00, 100, 35, '摄影爱好者协会', 1),
('夏日海滩度假', '享受阳光沙滩，体验夏日清凉！', '/upload/activities/beach_vacation.jpg', '2024-07-20 08:00:00', '2024-07-22 18:00:00', '海南省三亚市亚龙湾', 599.00, 50, 28, '旅行社', 0),
('秋季登山活动', '秋季登山，欣赏红叶美景。', '/upload/activities/autumn_hiking.jpg', '2024-10-10 07:30:00', '2024-10-10 17:00:00', '北京市香山公园', 20.00, 80, 52, '户外运动俱乐部', 0);

-- 为每个景点插入特色标签
INSERT INTO spot_features (spot_id, feature) VALUES
(1, '世界文化遗产'),
(1, '皇家建筑'),
(1, '博物馆'),
(2, '世界文化遗产'),
(2, '古代建筑'),
(2, '自然风光'),
(3, '世界文化遗产'),
(3, '自然风光'),
(3, '免费'),
(4, '世界文化与自然双重遗产'),
(4, '自然风光'),
(4, '登山'),
(5, '世界文化遗产'),
(5, '博物馆'),
(5, '历史古迹');

-- 插入测试评论数据
INSERT INTO reviews (content, rating, user_id, target_id, target_type) VALUES
('非常震撼的建筑，历史感十足！', 5, 1, 1, 1),
('人太多了，建议淡季去。', 4, 1, 1, 1),
('风景如画，值得一去！', 5, 2, 3, 1),
('活动组织得很好，玩得很开心。', 5, 1, 1, 2),
('价格有点贵，但体验不错。', 4, 2, 2, 2);

-- 插入测试收藏数据
INSERT INTO favorites (user_id, spot_id) VALUES
(1, 1),
(1, 3),
(2, 2),
(2, 4);

-- 插入测试活动参与数据
INSERT INTO activity_participants (activity_id, user_id, status) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 1, 1),
(3, 2, 1);

-- 更新数据
CALL update_spot_rating(1);
CALL update_spot_rating(2);
CALL update_spot_rating(3);
CALL update_spot_rating(4);
CALL update_spot_rating(5);

CALL update_activity_participant_count(1);
CALL update_activity_participant_count(2);
CALL update_activity_participant_count(3);

-- 最后优化表
OPTIMIZE TABLE users, spots, categories, spot_features, activities, activity_participants, reviews, favorites, orders, routes, browse_history, system_configs;

-- 授权（可选）
-- GRANT ALL PRIVILEGES ON travel_spot_system.* TO 'travel_user'@'localhost' IDENTIFIED BY 'password';
-- FLUSH PRIVILEGES;

SELECT 'Database initialization completed successfully!' AS status;