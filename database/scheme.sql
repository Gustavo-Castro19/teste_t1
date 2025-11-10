CREATE DATABASE IF NOT EXISTS db_teste CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_teste;

DROP TABLE IF EXISTS product;

CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    value DECIMAL(10, 2) NOT NULL CHECK (value >= 0),
    quantity INT NOT NULL CHECK (quantity >= 0),
    image_path VARCHAR(500),
    tag VARCHAR(50) DEFAULT 'no_category',
    atributes JSON,
    meta JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tag (tag),
    INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO product (nome, value, quantity, tag, atributes, meta) VALUES
('Caneta Azul', 1.50, 100, 'no_category', '{}', '{}'),
('iPhone 15', 7999.00, 10, 'electronics', '{"brand":"Apple","manufacturer":"Foxconn","model":"A2849","releaseDate":"2023-09-22"}', '{}'),
('Mesa de Escritório', 899.90, 5, 'furniture', '{"dimensions":"120x60x75cm","material":"MDP"}', '{}'),
('Maçã Gala', 8.99, 50, 'fruits', '{"weight":0.15}', '{}');
