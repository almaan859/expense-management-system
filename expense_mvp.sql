-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: expense_mvp
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approval_rules`
--

LOCK TABLES `approval_rules` WRITE;
/*!40000 ALTER TABLE `approval_rules` DISABLE KEYS */;
INSERT INTO `approval_rules` VALUES (1,1000.00,2);
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
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
INSERT INTO `expenses` VALUES (1,8,500.00,'Food','Lunch','approved','2026-02-21 15:22:32','IT',NULL,NULL,NULL),(2,8,5000.00,'Travel','Flight','approved','2026-02-21 15:22:46','IT',4,'2026-02-21 21:06:31',NULL),(3,9,100.00,'travel','test1','manager_approved','2026-03-19 13:51:20','IT',11,'2026-03-19 19:26:55',NULL),(4,4,100.00,'twt','test','manager_approved','2026-03-19 13:59:47','IT',11,'2026-03-20 01:13:09',NULL),(5,4,99.00,'twt','test','rejected','2026-03-19 13:59:57','IT',NULL,NULL,NULL),(7,9,123.00,'travel','this is travel expense','manager_approved','2026-03-19 20:04:48',NULL,12,'2026-03-20 02:53:39','1773950688973-0d4d68d3-db09-4117-a77b-a8c79cf09d97.jpg'),(12,9,120.00,'fert','rtrt','rejected','2026-03-19 20:40:35',NULL,NULL,NULL,NULL);
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

-- Dump completed on 2026-03-20  3:04:50
