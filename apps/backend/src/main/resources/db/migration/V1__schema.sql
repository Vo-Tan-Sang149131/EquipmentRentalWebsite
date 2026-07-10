SET
FOREIGN_KEY_CHECKS = 0;
-- 1. Drop sub tables (contain foreign keys)
DROP TABLE IF EXISTS user_social_accounts;
DROP TABLE IF EXISTS user_kyc_verifications;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS user_addresses;
DROP TABLE IF EXISTS device_images;
DROP TABLE IF EXISTS device_calendars;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS user_reviews;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS issue_reports;
DROP TABLE IF EXISTS order_details;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;

DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_rooms;

DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS devices;

-- 2. Drop main tables
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;
SET
FOREIGN_KEY_CHECKS = 1;

CREATE TABLE roles
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name  VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP          NOT NULL,
    updated_at TIMESTAMP          NOT NULL
);

CREATE TABLE users
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name    VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NULL,
    full_name    VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(15) NULL UNIQUE,
    avatar_url   VARCHAR(255) NULL,
    trust_score  DECIMAL(3, 2)         DEFAULT 5.00,
    enabled      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP    NOT NULL,
    updated_at   TIMESTAMP    NOT NULL,

    INDEX        idx_email (email),
    INDEX        idx_username (user_name)
);

CREATE TABLE user_profiles
(
    user_id BIGINT PRIMARY KEY,
    gender  ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    dob     DATE NULL, -- Date of birth
    address VARCHAR(255) NULL,
    bio     TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE user_social_accounts
(
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT       NOT NULL,
    provider         VARCHAR(50)  NOT NULL,                  -- 'GOOGLE', 'FACEBOOK'
    provider_user_id VARCHAR(255) NOT NULL,                  -- ID độc nhất (sub/id) nhận từ phía Google/Facebook
    avatar_url       VARCHAR(255) NULL,                      -- Đường dẫn ảnh đại diện từ mạng xã hội
    created_at       TIMESTAMP    NOT NULL,
    updated_at       TIMESTAMP    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY uq_provider_user (provider, provider_user_id) -- Đảm bảo không bị trùng lặp tài khoản social
);

CREATE TABLE user_addresses
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id        BIGINT       NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,             -- Tên người nhận (có thể nhờ người khác nhận)
    phone_number   VARCHAR(15)  NOT NULL,             -- Số điện thoại nhận hàng riêng cho địa chỉ này
    province       VARCHAR(100) NOT NULL,
    district       VARCHAR(100) NOT NULL,
    ward           VARCHAR(100) NOT NULL,
    detail_address VARCHAR(255) NOT NULL,             -- Số nhà, tên đường
    is_default     BOOLEAN DEFAULT FALSE,             -- Địa chỉ mặc định
    created_at     TIMESTAMP    NOT NULL,
    updated_at     TIMESTAMP    NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE user_kyc_verifications
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT    NOT NULL,
    id_card_number    VARCHAR(12) NULL,
    id_card_front_url VARCHAR(255) NULL, -- Ảnh mặt trước
    id_card_back_url  VARCHAR(255) NULL, -- Ảnh mặt sau
    status            ENUM('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
    verified_by       BIGINT NULL,       -- admin nào duyệt
    verified_at       TIMESTAMP NULL,
    created_at        TIMESTAMP NOT NULL,
    updated_at        TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);


CREATE TABLE user_roles
(
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
);

CREATE TABLE brands
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    slug       VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP           NOT NULL,
    updated_at TIMESTAMP           NOT NULL
);

CREATE TABLE categories
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) UNIQUE NOT NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at  TIMESTAMP           NOT NULL,
    updated_at  TIMESTAMP           NOT NULL
);

CREATE TABLE products
(
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id          BIGINT         NOT NULL,
    brand_id             BIGINT         NOT NULL,
    name                 VARCHAR(255)   NOT NULL,
    slug                 VARCHAR(255)   NOT NULL UNIQUE,
    description          TEXT,
    base_price           DECIMAL(15, 2) NOT NULL,
    specifications       JSON,
    accessories_included TEXT,
    INDEX                idx_base_price (base_price),
    created_at           TIMESTAMP      NOT NULL,
    updated_at           TIMESTAMP      NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories (id),
    FOREIGN KEY (brand_id) REFERENCES brands (id)
);

CREATE TABLE devices
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id        BIGINT         NOT NULL,
    owner_id          BIGINT         NOT NULL,
    serial_number     VARCHAR(100)   NOT NULL,
    condition_percent INT            NOT NULL DEFAULT 100,
    price_per_day     DECIMAL(15, 2) NOT NULL,
    deposit_value     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    -- P2P: Cần trạng thái kiểm duyệt bài đăng của chủ máy
    status            ENUM('PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'HIDDEN') DEFAULT 'PENDING_APPROVAL',
    created_at        TIMESTAMP      NOT NULL,
    updated_at        TIMESTAMP      NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    INDEX             idx_serial_number (serial_number)
);

CREATE TABLE product_images
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT       NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE device_images
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id  BIGINT       NOT NULL,
    image_url  VARCHAR(255) NOT NULL,
    image_type ENUM('REAL_SHOT', 'SERIAL_PROOF') DEFAULT 'REAL_SHOT',
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP    NOT NULL,
    updated_at TIMESTAMP    NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE
);

CREATE TABLE device_calendars
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    device_id  BIGINT    NOT NULL,
    event_date DATE      NOT NULL,                  -- Lưu chính xác từng ngày bận
    status     ENUM('BOOKED', 'OWNER_BLOCK', 'MAINTENANCE') NOT NULL,
    order_id   BIGINT NULL,                         -- Null nếu do chủ máy tự khóa (OWNER_BLOCK)
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE,
    UNIQUE KEY uq_item_date (device_id, event_date) -- Khóa chặn không cho trùng ngày
);

CREATE TABLE orders
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    renter_id   BIGINT         NOT NULL,
    start_date  DATE           NOT NULL,
    end_date    DATE           NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    status      ENUM('PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PICKED_UP', 'RETURNED', 'CANCELLED', 'OVERDUE') NOT NULL DEFAULT 'PENDING_PAYMENT',
    created_at  TIMESTAMP      NOT NULL,
    updated_at  TIMESTAMP      NOT NULL,
    FOREIGN KEY (renter_id) REFERENCES users (id)
);

CREATE TABLE issue_reports
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id    BIGINT       NOT NULL,
    reporter_id BIGINT       NOT NULL,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NOT NULL,
    status      ENUM('PENDING', 'PROCESSING','RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP    NOT NULL,
    updated_at  TIMESTAMP    NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (reporter_id) REFERENCES users (id)
);

-- TẠO MỚI BẢNG TRUNG GIAN: Chi tiết các thiết bị nằm trong đơn hàng đó
CREATE TABLE order_details
(
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id       BIGINT         NOT NULL,
    device_id      BIGINT         NOT NULL,
    price_per_day  DECIMAL(15, 2) NOT NULL,     -- Chốt giá thuê/ngày tại thời điểm đặt (đề phòng chủ máy tăng/giảm giá sau này)
    deposit_amount DECIMAL(15, 2) DEFAULT 0.00, -- Tiền cọc riêng của máy này
    created_at     TIMESTAMP      NOT NULL,
    updated_at     TIMESTAMP      NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (device_id) REFERENCES devices (id)
);

CREATE TABLE cart_items
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT    NOT NULL,
    device_id   BIGINT    NOT NULL,
    start_date  DATE      NOT NULL,
    end_date    DATE      NOT NULL,
    rental_days INT       NOT NULL,
    status      ENUM('ACTIVE', 'EXPIRED', 'CHECKED_OUT') DEFAULT 'ACTIVE',
    created_at  TIMESTAMP NOT NULL,
    updated_at  TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (device_id) REFERENCES devices (id) ON DELETE CASCADE
);

-- BẢNG PAYMENTS (Đã tối ưu hóa cho API MoMo/VNPay thực tế)
CREATE TABLE payments
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id          BIGINT         NOT NULL,
    amount            DECIMAL(15, 2) NOT NULL,
    payment_method    ENUM('VNPAY', 'MOMO', 'BANK_TRANSFER', 'CASH') NOT NULL,
    status            ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    provider_order_id VARCHAR(255) NULL,
    transaction_id    VARCHAR(255) NULL,
    payment_token     VARCHAR(255) NULL UNIQUE,
    request_payload   LONGTEXT NULL,
    response_metadata LONGTEXT NULL,
    failure_reason    VARCHAR(500) NULL,
    paid_at           TIMESTAMP NULL,
    created_at        TIMESTAMP      NOT NULL,
    updated_at        TIMESTAMP      NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id)
);

CREATE TABLE product_reviews
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT    NOT NULL,
    renter_id  BIGINT    NOT NULL,
    product_id BIGINT    NOT NULL,
    rating     INT       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (renter_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE user_reviews
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id   BIGINT    NOT NULL,
    owner_id   BIGINT    NOT NULL,
    renter_id  BIGINT    NOT NULL,
    rating     INT       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    FOREIGN KEY (renter_id) REFERENCES users (id)
);

-- 1. Table manages chat rooms
CREATE TABLE chat_rooms
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    renter_id  BIGINT    NOT NULL,
    owner_id   BIGINT    NOT NULL,
    product_id BIGINT    NOT NULL,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (renter_id) REFERENCES users (id),
    FOREIGN KEY (owner_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    UNIQUE KEY uq_chat_room (renter_id, owner_id, product_id) -- Avoid duplicate rooms
);

-- 2. Table stores chat messages
CREATE TABLE chat_messages
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_id      BIGINT    NOT NULL,
    sender_id    BIGINT    NOT NULL,
    message_text TEXT      NOT NULL,
    is_read      BOOLEAN DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL,
    FOREIGN KEY (room_id) REFERENCES chat_rooms (id),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    INDEX        idx_room_time (room_id, created_at)
);

