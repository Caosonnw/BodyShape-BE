-- -------------------------------------------------------------
-- TablePlus 6.0.0(550)
--
-- https://tableplus.com/
--
-- Database: db_bodyshape
-- Generation Time: 2025-06-06 22:11:54.9940
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

CREATE TABLE `coach_customers` (
  `coach_id` int NOT NULL,
  `customer_id` int NOT NULL,
  PRIMARY KEY (`coach_id`,`customer_id`),
  KEY `customer_id` (`customer_id`),
  KEY `coach_id` (`coach_id`) USING BTREE,
  CONSTRAINT `coach_customers_ibfk_1` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`user_id`),
  CONSTRAINT `coach_customers_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`)
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
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `last_maintenance_date` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`equipment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `customer_id` int DEFAULT NULL,
  `total_amount` int DEFAULT NULL,
  `issued_date` datetime DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`invoice_id`),
  KEY `user_id` (`customer_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `membership_cards` (
  `card_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`card_id`),
  KEY `package_id` (`package_id`),
  KEY `user_id` (`customer_id`),
  CONSTRAINT `membership_cards_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `membership_cards_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `packages` (
  `package_id` int NOT NULL AUTO_INCREMENT,
  `package_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `duration_days` int DEFAULT NULL,
  PRIMARY KEY (`package_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `package_id` int DEFAULT NULL,
  `amount` int DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `method` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `package_id` (`package_id`),
  KEY `user_id` (`customer_id`),
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`),
  CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`)
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
  `customer_id` int DEFAULT NULL,
  `coach_id` int DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`schedule_id`),
  KEY `user_id` (`customer_id`),
  KEY `coach_id` (`coach_id`),
  CONSTRAINT `training_schedules_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`user_id`),
  CONSTRAINT `training_schedules_ibfk_2` FOREIGN KEY (`coach_id`) REFERENCES `coaches` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `coach_customers` (`coach_id`, `customer_id`) VALUES
(3, 4),
(3, 8),
(3, 9);

INSERT INTO `coaches` (`user_id`, `specialization`, `bio`, `rating_avg`) VALUES
(3, NULL, NULL, NULL),
(5, NULL, NULL, NULL),
(6, NULL, NULL, NULL);

INSERT INTO `customers` (`user_id`, `health_info`, `goals`) VALUES
(4, NULL, NULL),
(8, NULL, NULL),
(9, NULL, NULL);

INSERT INTO `equipments` (`equipment_id`, `equipment_name`, `description`, `location`, `status`, `last_maintenance_date`, `created_at`) VALUES
(3, 'Treadmill X3000', 'Cardio machine with heart rate sensors', 'Room 2 - 3rd floor - Cardio zone - Brand: BodyShape - District 1', 'ACTIVE', NULL, NULL),
(4, 'Treadmill X3000', 'Cardio machine with heart rate sensors', 'Room 2 - 3rd floor - Cardio zone - Brand: BodyShape - District 1', 'ACTIVE', '2025-06-06 07:11:13', '2025-06-06 07:11:13'),
(7, 'Vivian Copeland', 'Delectus officia no', 'Omnis deserunt labor', 'MAINTENANCE', '2025-06-06 15:06:02', '2025-06-06 15:05:51'),
(8, 'Arsenio Chavez', 'Id nostrud aut vitae', 'Quia officiis dignis', 'BROKEN', '2025-06-06 15:06:11', '2025-06-06 15:06:11');

INSERT INTO `healths` (`health_id`, `user_id`, `weight`, `height`, `step`, `heartRate`, `standHours`, `exerciseTime`, `activeEnergy`) VALUES
(2, 1, 58, 1.68, 225, 98.7137, 0, 1, 3.856);

INSERT INTO `membership_cards` (`card_id`, `customer_id`, `package_id`, `start_date`, `end_date`, `status`) VALUES
(1, 9, 4, '2025-07-05 00:00:00', '2025-07-05 00:00:00', 'ACTIVE'),
(2, 8, 1, '2025-06-05 09:55:29', '2025-07-05 09:55:29', 'ACTIVE'),
(3, 4, 1, '2025-06-05 16:40:04', '2025-07-05 16:40:04', 'ACTIVE');

INSERT INTO `packages` (`package_id`, `package_name`, `description`, `price`, `duration_days`) VALUES
(1, 'Student Membership', 'Ưu đãi cho sinh viên, giới hạn giờ truy cập nhưng giá rẻ', 300000, 30),
(2, 'Basic Membership', 'Truy cập phòng gym trong giờ hành chính, không có huấn luyện viên riêng', 500000, 30),
(3, 'Standard Membership', 'Truy cập không giới hạn giờ, được tham gia lớp nhóm cơ bản', 900000, 30),
(4, 'Premium Membership', 'Truy cập 24/7, lớp nhóm đa dạng, 1 buổi PT cá nhân miễn phí mỗi tháng', 1500000, 30),
(5, 'Quarterly Pass', 'Gói 3 tháng, có quyền truy cập toàn bộ tiện ích phòng gym', 4000000, 90),
(6, 'Annual Pass', 'Gói 12 tháng, ưu đãi tốt nhất, kèm tư vấn sức khỏe định kỳ', 15000000, 365),
(7, 'Family Package', 'Gói cho nhóm gia đình, giảm giá khi đăng ký từ 2 người trở lên', 2500000, 30);

INSERT INTO `training_schedules` (`schedule_id`, `customer_id`, `coach_id`, `title`, `start_date`, `end_date`, `description`, `color`) VALUES
(1, 4, 3, 'Morning Workout', '2025-06-01 08:00:00', '2025-06-03 08:30:00', 'Morning workout session for customer', 'red'),
(2, 8, 3, 'Evening Cardio', '2025-06-05 17:00:00', '2025-06-05 18:00:00', 'Cardio session to improve stamina', 'blue'),
(3, 9, 3, 'Yoga Class', '2025-06-07 07:00:00', '2025-06-07 08:00:00', 'Morning yoga to improve flexibility', 'green'),
(9, 9, 3, 'Test1123', '2025-06-04 00:30:00', '2025-06-04 02:30:00', 'Test đó nha', 'green'),
(10, 4, 3, 'Hello', '2025-06-07 19:30:00', '2025-06-08 20:09:00', '123', 'blue'),
(11, 8, 3, 'Dưa hấu', '2025-06-08 21:05:00', '2025-06-08 22:10:00', 'Hấu văn dưa', 'yellow'),
(12, 4, 3, '123', '2025-06-10 17:12:00', '2025-06-11 17:12:00', '12', 'purple'),
(13, 4, 3, 'Hahaa', '2025-06-18 20:53:00', '2025-06-19 20:53:00', '3535', 'orange'),
(14, 9, 3, 'Hẹ hẹ hẹ', '2025-06-16 21:06:00', '2025-06-16 23:04:00', 'hẹ hẹ hẹ thế thôi', 'gray'),
(15, 4, 3, 'Anh em mình cứ thế thôi', '2025-06-11 19:03:00', '2025-06-12 19:03:00', 'Hẹ hẹ hẹ', 'red');

INSERT INTO `users` (`user_id`, `email`, `password`, `full_name`, `gender`, `date_of_birth`, `phone_number`, `avatar`, `role`, `created_by`, `refresh_token`) VALUES
(1, 'son@gmail.com', '$2b$10$R/wwoI3iQ4zxlhyI2hS8kez9CttChYThFXAw8/R3U5jalh5aB9wja', 'Owner', 1, '2004-04-15', '0336114129', '1748862274581_383007449_Cute_Memes.jpeg', 'OWNER', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiT1dORVIiLCJrZXkiOiJoSXZiRW4iLCJpYXQiOjE3NDkyMjA4OTMsImV4cCI6MTc0OTMwNzI5M30.Q5JCy9ShepWoKCNUAhYGNsyCmC1_fAcCiyqeNAlhV-0'),
(2, 'test@gmail.com', '$2b$10$Jy8aqlRe7QNOTxVn5HSUYuhqkbqhp6kE3apTmM2iVUwbtrO2YZ4s.', 'test', 1, '2025-05-18', '0123123123', '1748862293327_159108676_ironman.jpg', 'ADMIN', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoiQURNSU4iLCJrZXkiOiJScFI5dEkiLCJpYXQiOjE3NDg4NzczNDcsImV4cCI6MTc0ODk2Mzc0N30.2IaJsvy-opmJMi1E_C91LaqmB2hmqbb8ntQjh3fSrLY'),
(3, 'sun@gmail.com', '$2b$10$gXkXsRDMcMAhYBa15aFx8..BA4FzYf0pLtQ.aUWc6Mop70DECG.cu', 'sun', 0, '2025-05-18', '0987654321', '1748862315263_115293305_captain.jpg', 'COACH', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJyb2xlIjoiQ09BQ0giLCJrZXkiOiI5YUwxdHoiLCJpYXQiOjE3NDkyMTQ3NDUsImV4cCI6MTc0OTMwMTE0NX0.Nl9vlmmpVYMUwlO92Kl-mZWD5Dlx97V8JZHk5WMcAd8'),
(4, 'test123@gmail.com', '$2b$10$s/v9sBAlu0RkqJ.LPtPuoOelTev2hrVMmroZe25yVVRJAtAfkYJjC', 'Nguyen Van A', 1, '2000-01-01', '0123123123', '1748872732883_28103112_hulk.jpg', 'CUSTOMER', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJyb2xlIjoiQ1VTVE9NRVIiLCJrZXkiOiJqT1BNdmIiLCJpYXQiOjE3NDc1ODc4MzEsImV4cCI6MTc0NzY3NDIzMX0.gWggxKd9Dr8vP97iOYOL2frqvb-zezJErEicNBdg8nA'),
(5, 'vikimavir@mailinator.com', '$2b$10$.8EA.9Sab0WEm/1cZhlZk.PtmLJIR1fnXK9SpcrB7lKSkk9kzdkAe', 'Harriet Heath', 1, '2000-05-26', '0625589439', NULL, 'COACH', 1, NULL),
(6, 'halo@gmail.com', '$2b$10$g6o6zWmu9vdfs2vVIJnAfOHqn3LyXbfbnatLj.DX4KJuFqfhKDL52', 'Halo Hola', 1, '2000-03-01', '0456789123', '1748277790479_475466991_cute-raccoon-d-cartoon.png', 'COACH', 1, NULL),
(7, 'spiderman@gmail.com', '$2b$10$nRSfiGwYAKmjE/NGfgVmyuxAbug/gEdsY3A5Eoq4dx0e.YHA.f2/e', 'Spider Man', 1, '1999-06-30', '0123918412', '1748278050639_707057150_spiderMan.png', 'ADMIN', 1, NULL),
(8, 'hau@gmail.com', '$2b$10$FYHzK70Dpfanxrpww2DyV..r.M1CUBQP5U2yhkCqxVYsNAOPt33V6', 'Dưa Văn Hấu', 1, '2001-02-08', '0981234675', '1748278142241_552433402_Cute_Memes.jpeg', 'CUSTOMER', 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJyb2xlIjoiQ1VTVE9NRVIiLCJrZXkiOiJ0TTVxdkQiLCJpYXQiOjE3NDg3OTI1NTcsImV4cCI6MTc0ODg3ODk1N30.LL3v4xR6GQYwcTKxnLw_fBqO1Pa5sNDcuyqpTlnkl2Q'),
(9, 'cangao@gmail.com', '$2b$10$Kk.iyPVGVd4OMv06xN7m3.USLq0g4A5AxQDBL52BayzkltlspVVgy', 'Cá Ngáo', 0, '1995-04-23', '0413568823', '1748862348715_227385886_cangao.png', 'CUSTOMER', 1, NULL);



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;