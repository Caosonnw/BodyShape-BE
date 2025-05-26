-- -------------------------------------------------------------
-- TablePlus 6.0.0(550)
--
-- https://tableplus.com/
--
-- Database: db_bodyshape
-- Generation Time: 2025-05-26 14:13:10.6960
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


CREATE TABLE `checkins` (
  `checkin_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL,
  PRIMARY KEY (`checkin_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `checkins_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `coaches` (
  `user_id` int NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `rating_avg` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `coaches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `customers` (
  `user_id` int NOT NULL,
  `health_info` varchar(255) DEFAULT NULL,
  `goals` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipment_issues` (
  `issue_id` int NOT NULL AUTO_INCREMENT,
  `equipment_id` int DEFAULT NULL,
  `reported_by` int DEFAULT NULL,
  `issue_description` varchar(255) DEFAULT NULL,
  `reported_at` datetime DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `resolved_at` datetime DEFAULT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `equipment_id` (`equipment_id`),
  KEY `reported_by` (`reported_by`),
  CONSTRAINT `equipment_issues_ibfk_1` FOREIGN KEY (`equipment_id`) REFERENCES `equipments` (`equipment_id`),
  CONSTRAINT `equipment_issues_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `equipments` (
  `equipment_id` int NOT NULL AUTO_INCREMENT,
  `equipment_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_maintenance_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `healths` (
  `health_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `step` float DEFAULT NULL,
  `heartRate` float DEFAULT NULL,
  `standHours` float DEFAULT NULL,
  `exerciseTime` float DEFAULT NULL,
  `activeEnergy` float DEFAULT NULL,
  PRIMARY KEY (`health_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `healths_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoices` (
  `invoice_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` int DEFAULT NULL,
  `issued_date` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `membership_cards` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  KEY `package_id` (`package_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `membership_cards_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `membership_cards_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `package_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  PRIMARY KEY (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `package_id` (`package_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `coach_id` int DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`),
  CONSTRAINT `reviews_ibfk_4` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `training_plans` (
  `plan_id` int NOT NULL AUTO_INCREMENT,
  `coach_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `video_links` varchar(255) DEFAULT NULL,
  `diet_plan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`plan_id`),
  KEY `user_id` (`user_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `training_plans_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`),
  CONSTRAINT `training_plans_ibfk_3` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `training_schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `coach_id` int DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `user_id` (`user_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `training_schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `customers` (`user_id`),
  CONSTRAINT `training_schedules_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `full_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `phone_number` varchar(10) DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'CUSTOMER',
  `created_by` int DEFAULT NULL,
  `refresh_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`user_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `coaches` (`user_id`, `specialization`, `bio`, `rating_avg`) VALUES
(3, NULL, NULL, NULL);

INSERT INTO `customers` (`user_id`, `health_info`, `goals`) VALUES
(4, NULL, NULL);

INSERT INTO `healths` (`health_id`, `user_id`, `weight`, `height`, `step`, `heartRate`, `standHours`, `exerciseTime`, `activeEnergy`) VALUES
(2, 1, 58, 1.68, 225, 98.7137, 0, 1, 3.856);

INSERT INTO `packages` (`package_id`, `package_name`, `description`, `price`, `duration_days`) VALUES
(1, 'Student Membership', 'Ưu đãi cho sinh viên, giới hạn giờ truy cập nhưng giá rẻ', 300000, 30),
(2, 'Basic Membership', 'Truy cập phòng gym trong giờ hành chính, không có huấn luyện viên riêng', 500000, 30),
(3, 'Standard Membership', 'Truy cập không giới hạn giờ, được tham gia lớp nhóm cơ bản', 900000, 30),
(4, 'Premium Membership', 'Truy cập 24/7, lớp nhóm đa dạng, 1 buổi PT cá nhân miễn phí mỗi tháng', 1500000, 30),
(5, 'Quarterly Pass', 'Gói 3 tháng, có quyền truy cập toàn bộ tiện ích phòng gym', 4000000, 90),
(6, 'Annual Pass', 'Gói 12 tháng, ưu đãi tốt nhất, kèm tư vấn sức khỏe định kỳ', 15000000, 365),
(7, 'Family Package', 'Gói cho nhóm gia đình, giảm giá khi đăng ký từ 2 người trở lên', 2500000, 30);

INSERT INTO `users` (`user_id`, `email`, `password`, `full_name`, `gender`, `date_of_birth`, `phone_number`, `avatar`, `role`, `created_by`, `refresh_token`) VALUES
(1, 'son@gmail.com', '$2b$10$R/wwoI3iQ4zxlhyI2hS8kez9CttChYThFXAw8/R3U5jalh5aB9wja', 'Owner', 1, '2004-04-15', '0336114129', '1748243169165_418232525_Goofy_Dog.jpeg', 'OWNER', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiT1dORVIiLCJrZXkiOiIzS2lYN0YiLCJpYXQiOjE3NDgyNDMzNzIsImV4cCI6MTc0ODMyOTc3Mn0.IKT_0ydeiTWWLoN9td43LUsdCVizwX-DEbQM50nx_Ds'),
(2, 'test@gmail.com', '$2b$10$Jy8aqlRe7QNOTxVn5HSUYuhqkbqhp6kE3apTmM2iVUwbtrO2YZ4s.', 'test', 1, '2025-05-18', '0123123123', NULL, 'ADMIN', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoiQ1VTVE9NRVIiLCJrZXkiOiJiYmFjNEciLCJpYXQiOjE3NDc1ODEzMzgsImV4cCI6MTc0NzY2NzczOH0.HUbBYuk6DMf_TGy9tzu5uTJcVac-ccOBSYuy7eK8SJo'),
(3, 'sun@gmail.com', '$2b$10$gXkXsRDMcMAhYBa15aFx8..BA4FzYf0pLtQ.aUWc6Mop70DECG.cu', 'sun', 0, '2025-05-18', '0987654321', NULL, 'COACH', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJyb2xlIjoiQ1VTVE9NRVIiLCJrZXkiOiJzMWg1V3YiLCJpYXQiOjE3NDc1ODI3ODcsImV4cCI6MTc0NzY2OTE4N30.a4IP7HQva8dUnHYiIMBr5uB9KBD-EcNQC8dAp1Sy2UQ'),
(4, 'test123@gmail.com', '$2b$10$s/v9sBAlu0RkqJ.LPtPuoOelTev2hrVMmroZe25yVVRJAtAfkYJjC', 'Nguyen Van A', 1, '2000-01-01', '0123123123', NULL, 'CUSTOMER', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJyb2xlIjoiQ1VTVE9NRVIiLCJrZXkiOiJqT1BNdmIiLCJpYXQiOjE3NDc1ODc4MzEsImV4cCI6MTc0NzY3NDIzMX0.gWggxKd9Dr8vP97iOYOL2frqvb-zezJErEicNBdg8nA');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;