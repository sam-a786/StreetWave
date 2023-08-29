-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.7.4-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for streetwave_db
DROP DATABASE IF EXISTS `streetwave_db`;
CREATE DATABASE IF NOT EXISTS `streetwave_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_520_ci */;
USE `streetwave_db`;

-- Dumping structure for table streetwave_db.contracts
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_id` int(11) DEFAULT NULL,
  `title` varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `data_allowance` int(11) DEFAULT NULL,
  `minutes` int(11) DEFAULT NULL,
  `texts` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `pay_interval` int(11) DEFAULT NULL,
  `length` int(11) DEFAULT NULL,
  `contract_url` varchar(200) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `streetwave_score` int(11) DEFAULT NULL,
  `last_update` datetime NOT NULL,
  `up_to_date` int(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_contracts_contracts_suppliers` (`supplier_id`),
  CONSTRAINT `FK_contracts_contracts_suppliers` FOREIGN KEY (`supplier_id`) REFERENCES `contracts_suppliers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table streetwave_db.contracts: ~0 rows (approximately)
/*!40000 ALTER TABLE `contracts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contracts` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.contracts_bonuses
CREATE TABLE IF NOT EXISTS `contracts_bonuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id` int(11) DEFAULT NULL,
  `bonus_desc` varchar(100) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `bonus_val` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_contracts_bonuses_contracts` (`contract_id`),
  CONSTRAINT `FK_contracts_bonuses_contracts` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table streetwave_db.contracts_bonuses: ~0 rows (approximately)
/*!40000 ALTER TABLE `contracts_bonuses` DISABLE KEYS */;
/*!40000 ALTER TABLE `contracts_bonuses` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.contracts_suppliers
CREATE TABLE IF NOT EXISTS `contracts_suppliers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `supplier_name` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table streetwave_db.contracts_suppliers: ~4 rows (approximately)
/*!40000 ALTER TABLE `contracts_suppliers` DISABLE KEYS */;
INSERT INTO `contracts_suppliers` (`id`, `supplier_name`) VALUES
	(1, 'Vodafone'),
	(2, 'Three'),
	(3, 'EE'),
	(4, 'O2');
/*!40000 ALTER TABLE `contracts_suppliers` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.stations
CREATE TABLE IF NOT EXISTS `stations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `lat` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `long` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `crsCode` varchar(3) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table streetwave_db.stations: ~0 rows (approximately)
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.filters
CREATE TABLE IF NOT EXISTS `filters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filter_name` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `isBool` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

-- Dumping data for table streetwave_db.filters: ~11 rows (approximately)
/*!40000 ALTER TABLE `filters` DISABLE KEYS */;
INSERT INTO `filters` (`id`, `filter_name`, `isBool`) VALUES
	(1, '1 Month', 1),
	(2, '12 Months', 1),
	(3, '24 Months', 1),
	(4, 'O2', 1),
	(5, 'EE', 1),
	(6, 'Vodafone', 1),
	(7, 'Three', 1),
	(8, 'DataMin', 0),
	(9, 'DataMax', 0),
	(10, 'PriceMin', 0),
	(11, 'PriceMax', 0);
/*!40000 ALTER TABLE `filters` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.searches
CREATE TABLE IF NOT EXISTS `searches` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT 0,
  `home_addr` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `work_addr` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `first_station` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `second_station` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL DEFAULT '0',
  `datetime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;


-- Dumping data for table streetwave_db.searches: ~0 rows (approximately)
/*!40000 ALTER TABLE `searches` DISABLE KEYS */;
/*!40000 ALTER TABLE `searches` ENABLE KEYS */;

-- Dumping structure for table streetwave_db.searches_filters
CREATE TABLE IF NOT EXISTS `searches_filters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `searches_id` int(11) DEFAULT NULL,
  `filters_id` int(11) DEFAULT NULL,
  `value` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_searches_filters_searches` (`searches_id`),
  KEY `FK_searches_filters_filters` (`filters_id`),
  CONSTRAINT `FK_searches_filters_filters` FOREIGN KEY (`filters_id`) REFERENCES `filters` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_searches_filters_searches` FOREIGN KEY (`searches_id`) REFERENCES `searches` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
