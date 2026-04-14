-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: expense_mvp
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `approval_rules`
--

DROP TABLE IF EXISTS `approval_rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approval_rules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `auto_approve_limit` decimal(10,2) DEFAULT '1000.00',
  `escalation_days` int DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_rules`
--

LOCK TABLES `approval_rules` WRITE;
/*!40000 ALTER TABLE `approval_rules` DISABLE KEYS */;
INSERT INTO `approval_rules` VALUES (1,1000.00,2),(2,300.00,5),(3,1000.00,5),(4,1000.00,5),(5,1000.00,5),(6,1000.00,5),(7,1000.00,5),(8,1000.00,5),(9,500.00,2);
/*!40000 ALTER TABLE `approval_rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text,
  `status` enum('pending','manager_approved','approved','rejected','escalated') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `department` varchar(100) DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `receipt` varchar(255) DEFAULT NULL,
  `receipt_amount` decimal(10,2) DEFAULT NULL,
  `verification_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,8,500.00,'Food','Lunch','approved','2026-02-21 15:22:32','IT',NULL,NULL,NULL,NULL,NULL),(2,8,5000.00,'Travel','Flight','approved','2026-02-21 15:22:46','IT',4,'2026-02-21 21:06:31',NULL,NULL,NULL),(3,9,100.00,'travel','test1','manager_approved','2026-03-19 13:51:20','IT',11,'2026-03-19 19:26:55',NULL,NULL,NULL),(4,4,100.00,'twt','test','manager_approved','2026-03-19 13:59:47','IT',11,'2026-03-20 01:13:09',NULL,NULL,NULL),(5,4,99.00,'twt','test','rejected','2026-03-19 13:59:57','IT',NULL,NULL,NULL,NULL,NULL),(7,9,123.00,'travel','this is travel expense','manager_approved','2026-03-19 20:04:48',NULL,12,'2026-03-20 02:53:39','1773950688973-0d4d68d3-db09-4117-a77b-a8c79cf09d97.jpg',NULL,NULL),(12,9,120.00,'fert','rtrt','rejected','2026-03-19 20:40:35',NULL,NULL,NULL,NULL,NULL,NULL),(13,9,100.00,'test','test1','approved','2026-03-20 07:29:40',NULL,NULL,NULL,'67a9d3764267054372f5c3e7da876111',NULL,NULL),(14,9,100.00,'testwe','fe','rejected','2026-03-22 20:57:02',NULL,NULL,NULL,'1774213022341.jpg',NULL,NULL),(15,9,100.00,'testwe','fe','approved','2026-03-22 21:03:45',NULL,NULL,NULL,'1774213425888.jpg',NULL,NULL),(16,12,50.00,'test','test','rejected','2026-03-22 21:20:02',NULL,NULL,NULL,'1774214402613.jpg',NULL,NULL),(17,12,30.00,'test','test','approved','2026-03-22 21:39:43',NULL,NULL,NULL,NULL,NULL,NULL),(18,12,200.00,'test','test','rejected','2026-03-22 21:39:59',NULL,NULL,NULL,NULL,NULL,NULL),(19,9,50.00,'test','test','approved','2026-03-22 21:47:15',NULL,NULL,NULL,'1774216034986.jpg',NULL,NULL),(20,9,50.00,'','','rejected','2026-03-22 21:49:17',NULL,NULL,NULL,NULL,NULL,NULL),(21,12,20.00,'test','test','approved','2026-03-22 21:56:20',NULL,NULL,NULL,NULL,NULL,NULL),(22,4,100.00,'travel','test','rejected','2026-03-23 06:11:28',NULL,NULL,NULL,NULL,NULL,NULL),(23,4,50.00,'test','cahi','approved','2026-03-23 06:13:23',NULL,NULL,NULL,NULL,NULL,NULL),(24,4,500.00,'food','dal chaval','rejected','2026-03-23 06:18:13',NULL,NULL,NULL,'1774246693774.jpg',NULL,NULL),(25,9,500.00,'test','test','approved','2026-03-23 06:20:04',NULL,NULL,NULL,'1774246804037.jpg',NULL,NULL),(26,9,1000.00,'teat','teat','approved','2026-03-23 06:51:33',NULL,NULL,NULL,'1774248693935.jpg',NULL,NULL),(27,9,100.00,'ravelte','travel','approved','2026-03-23 07:02:09',NULL,NULL,NULL,'1774249329777.jpg',NULL,NULL),(28,9,2000.00,'test','test','approved','2026-03-23 07:03:25',NULL,NULL,NULL,'1774249405003.jpg',NULL,NULL),(29,12,180.00,'food','food','rejected','2026-04-02 20:18:33',NULL,NULL,NULL,'1775161111179.jpg',NULL,NULL),(30,4,180.00,'food','food','rejected','2026-04-02 20:25:13',NULL,NULL,NULL,'1775161511663.jpg',1.00,'flagged'),(31,12,253.00,'food','food','rejected','2026-04-02 20:33:35',NULL,NULL,NULL,'1775162011559.jpeg',1.00,'flagged'),(32,9,235.00,'test','test','rejected','2026-04-02 20:42:11',NULL,NULL,NULL,'1775162526400.jpeg',9924.00,'flagged'),(33,9,235.00,'test','test','approved','2026-04-02 20:42:15',NULL,NULL,NULL,'1775162531123.jpeg',9924.00,'flagged'),(34,12,45.00,'food','food','approved','2026-04-02 21:11:09',NULL,NULL,NULL,'1775164267882.webp',5678.00,'flagged'),(35,9,45.00,'food','food','approved','2026-04-02 21:26:13',NULL,NULL,NULL,'1775165172395.webp',10.00,'flagged'),(36,9,0.00,'','','approved','2026-04-02 22:25:36',NULL,NULL,NULL,NULL,NULL,'manual-review'),(37,9,0.00,'','','approved','2026-04-02 23:04:32',NULL,NULL,NULL,'1775171071801.webp',49.50,'auto-ai-verified'),(38,9,180.00,'test','test','pending','2026-04-14 11:42:20',NULL,NULL,NULL,NULL,NULL,'manual-review'),(39,12,315.00,'food','curry restraunt','pending','2026-04-14 12:06:20',NULL,NULL,NULL,'1776168379021.png',2015.00,'ai-flagged'),(40,12,315.00,'food','curry restraunt','pending','2026-04-14 12:16:22',NULL,NULL,NULL,'1776168979797.png',NULL,'ai-flagged'),(41,12,315.00,'fod','curry','approved','2026-04-14 12:25:13',NULL,NULL,NULL,'1776169510725.png',7.50,'auto-ai-verified'),(42,4,315.00,'food','curry','approved','2026-04-14 12:48:15',NULL,NULL,NULL,'1776170886857.png',300.00,'auto-ai-verified');
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','manager','employee') DEFAULT 'employee',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `department` varchar(100) DEFAULT NULL,
  `monthly_limit` decimal(10,2) DEFAULT '10000.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Almond','almond@test.com','1234','admin','2026-02-21 08:38:56',NULL,10000.00),(2,'Secure','secure@test.com','$2b$10$Q77XeJsgUDvnC83.sncjge/ECQNzsAHdY28bpAw7L5fTzrbP20eX2','manager','2026-02-21 09:50:03',NULL,10000.00),(4,'Admin','admin@test.com','$2b$10$d/H66aFnyZZ0xnp.8Ca2nuVqqzbsesfmmGL1MnF1n2a9BXvNBR3Om','admin','2026-02-21 15:14:51','IT',10000.00),(7,'Manager','manager2@test.com','$2b$10$1ghX9lenXp68h.I0rcXw2eq7ADpd46bbhHvEZO39Q7eZnQEyulTlu','manager','2026-02-21 15:17:50','IT',10000.00),(8,'Employee','emp1@test.com','$2b$10$077R7aW5yk/B0cPBcLX/XuPi5YlaKCuHql3ynlKMGxZqITV2YeiVO','employee','2026-02-21 15:18:33','IT',10000.00),(9,'Employee','employee@test.com','$2b$10$896Dr1mNcZ2rY8VZXCGKNO36SDwLjTD1kHtYhsiRPXwJI8fWGZ.Ku','employee','2026-03-15 19:40:35','IT',10000.00),(12,'Manager','managerNEW@test.com','$2b$10$4AO/bwMRbII/OofPg/QyWOnT5p1GcEf4.6pyKJqrRtwDFRVptqtNu','manager','2026-03-19 21:18:55','IT',10000.00);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-14 18:42:29
