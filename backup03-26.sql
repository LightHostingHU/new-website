-- --------------------------------------------------------
-- Gazdagép:                     127.0.0.1
-- Szerver verzió:               11.6.2-MariaDB - mariadb.org binary distribution
-- Szerver OS:                   Win64
-- HeidiSQL Verzió:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Adatbázis struktúra mentése a lighthosting.
CREATE DATABASE IF NOT EXISTS `lighthosting` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `lighthosting`;

-- Struktúra mentése tábla lighthosting. bans
CREATE TABLE IF NOT EXISTS `bans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `reason` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.bans: ~0 rows (hozzávetőleg)

-- Struktúra mentése tábla lighthosting. cdn
CREATE TABLE IF NOT EXISTS `cdn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `url` varchar(255) NOT NULL,
  `type` text NOT NULL,
  `filename` varchar(255) NOT NULL,
  `deletion_date` datetime NOT NULL,
  `delete_hash` varchar(255) NOT NULL,
  `expire` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.cdn: ~0 rows (hozzávetőleg)

-- Struktúra mentése tábla lighthosting. coupons
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expire` datetime NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `discount` float NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Coupons_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.coupons: ~0 rows (hozzávetőleg)

-- Struktúra mentése tábla lighthosting. news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `admin_id` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.news: ~1 rows (hozzávetőleg)
INSERT IGNORE INTO `news` (`id`, `title`, `description`, `admin_id`, `createdAt`) VALUES
	(1, 'tgesgdf', 'ga', 4, '2025-03-26 21:41:30.802');

-- Struktúra mentése tábla lighthosting. resetpassword
CREATE TABLE IF NOT EXISTS `resetpassword` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `toke` varchar(255) NOT NULL,
  `token_expire` datetime NOT NULL,
  `email` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.resetpassword: ~0 rows (hozzávetőleg)

-- Struktúra mentése tábla lighthosting. service
CREATE TABLE IF NOT EXISTS `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `buy_date` datetime NOT NULL,
  `expire_date` datetime NOT NULL,
  `expired` tinyint(1) NOT NULL DEFAULT 0,
  `more_info` longtext NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(191) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Service_user_id_fkey` (`user_id`),
  CONSTRAINT `Service_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.service: ~1 rows (hozzávetőleg)
INSERT IGNORE INTO `service` (`id`, `user_id`, `service_id`, `type`, `buy_date`, `expire_date`, `expired`, `more_info`, `price`, `status`) VALUES
	(1, 4, 2, 'vps', '2025-03-22 17:32:14', '2025-04-22 16:32:14', 0, '{"Szerver ram":1024,"Szerver tárhely":1024,"CPU mag":1,"Operációs rendszer":0}', 805, 'active');

-- Struktúra mentése tábla lighthosting. servicelist
CREATE TABLE IF NOT EXISTS `servicelist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `options` longtext NOT NULL,
  `type` varchar(255) NOT NULL,
  `offer` longtext DEFAULT NULL,
  `other` longtext DEFAULT NULL,
  `gradientColors` longtext DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `features` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.servicelist: ~15 rows (hozzávetőleg)
INSERT IGNORE INTO `servicelist` (`id`, `name`, `image`, `options`, `type`, `offer`, `other`, `gradientColors`, `description`, `features`) VALUES
	(1, 'Minecraft szerver', 'minecraft.png', '[\n    {\n        "label": "Szerver ram",\n        "placeholder": "Válassz egy opciót.",\n        "price": 633,\n        "min": 1024,\n        "max": 18432,\n        "step": 1024,\n        "default": 1024,\n        "suffix": "GB"\n    },\n    {\n        "label": "Szerver tárhely",\n        "placeholder": "Válassz egy opciót.",\n        "price": 35,\n        "min": 1024,\n        "max": 60416,\n        "step": 1024,\n        "default": 1024,\n        "suffix": "GB"\n    },\n    {\n        "label": "CPU használat",\n        "placeholder": "Válassz egy opciót.",\n        "price": 115,\n        "min": 100,\n        "max": 400,\n        "step": 100,\n        "default": 100,\n        "suffix": "%"\n    },\n    {\n        "label": "Szerver verzió",\n        "placeholder": "Válassz egy verizó számot.",\n        "price": 0,\n        "options": [\n            "1.21.1",\n            "1.21",\n            "1.20.2",\n            "1.20.1",\n            "1.20",\n            "1.19.4",\n            "1.19.3",\n            "1.19.2",\n            "1.19.1",\n            "1.19",\n            "1.18.2",\n            "1.18.1",\n            "1.18",\n            "1.17.1",\n            "1.17",\n            "1.16.5",\n            "1.16.4",\n            "1.16.3",\n            "1.16.2",\n            "1.16.1",\n            "1.16",\n            "1.15.2",\n            "1.15.1",\n            "1.15",\n            "1.14.4",\n            "1.14.3",\n            "1.14.2",\n            "1.14.1",\n            "1.14",\n            "1.13.2",\n            "1.13.1",\n            "1.13",\n            "1.12.2",\n            "1.12.1",\n            "1.12",\n            "1.11.2",\n            "1.11.1",\n            "1.11",\n            "1.10.2",\n            "1.10.1",\n            "1.10",\n            "1.9.4",\n            "1.9.3",\n            "1.9.2",\n            "1.9.1",\n            "1.9",\n            "1.8.9",\n            "1.8.8",\n            "1.8.7",\n            "1.8.6",\n            "1.8.5",\n            "1.8.4",\n            "1.8.3",\n            "1.8.2",\n            "1.8.1",\n            "1.8"\n        ]\n    }\n]\n', 'game', NULL, '{\n    "eggId": 4,\n    "nodeId": 1,\n    "nestId": 1,\n    "variables": {\n        "MINECRAFT_VERSION": "{{option3}}",\n        "BUILD_NUMBER": "latest",\n        "SERVER_JARFILE": "server.jar"\n    }\n}', 'from-red-400 to-yellow-500', 'Indítsa el saját Minecraft világát!', '["Dedikált erőforrások", "DDoS védelem", "Napi mentések", "24/7 támogatás", "Egyedi domain név"]'),
	(2, 'Ryzen 9 7900x VPS', 'amd-ryzen.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "price": 645,\r\n        "min": 1024,\r\n        "max": 32768,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "price": 40,\r\n        "min": 1024,\r\n        "max": 512000,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU mag",\r\n        "price": 120,\r\n        "min": 1,\r\n        "max": 6,\r\n        "step": 1,\r\n        "default": 1,\r\n        "suffix": "db"\r\n    },\r\n    {\r\n        "label": "Operációs rendszer",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 0,\r\n        "options": [\r\n            "AlmaLinux 8.9 (x86_64)",\r\n            "AlmaLinux 9.4 (x86_64)",\r\n            "CentOS 7.9 (x86_64)",\r\n            "CentOS 8.9 (x86_64)",\r\n            "Debian 10 (x86_64)",\r\n            "Debian 11 (x86_64)",\r\n            "Debian 12 (x86_64)",\r\n            "Ubuntu 20.04 (x86_64)",\r\n            "Ubuntu 22.04 (x86_64)",\r\n            "Ubuntu 24.04 (x86_64)",\r\n            "Windows 2022 (SCSI VirtIO)"\r\n        ]\r\n    }\r\n]\r\n', 'vps', NULL, '{\r\n    "server_id": 0,\r\n    "storage_id": 2,\r\n    "storage_uuid": "yKGbmqmt2F9gB3f5"\r\n}', 'from-blue-600 to-indigo-800', 'Építsen és fedezzen fel a barátaival!', '["Automatikus mentések",\n            "Mod támogatás",\n            "Egyedi világ generátor",\n            "24/7 üzemidő",\n            "Könnyű kezelőfelület"]'),
	(3, 'Terraria', 'terraria.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 31,\r\n    "nodeId": 1,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "TERRARIA_VERSION": "latest",\r\n        "WORLD_NAME": "world",\r\n        "MAX_PLAYERS": 8,\r\n        "WORLD_SIZE": 1,\r\n        "WORLD_DIFFICULTY": 3,\r\n        "SERVER_MOTD": "www.lighthosting.hu",\r\n        "NPCSTREAM": 0\r\n    }\r\n}', 'from-blue-600 to-indigo-600', 'Realisztikus autós élmény többjátékos módban', '[\n            "Nagy teljesítményű CPU",\n            "Széles sávszélesség",\n            "Egyedi pályák támogatása",\n            "Automatikus frissítések",\n            "Játékos statisztikák"\n        ]'),
	(7, 'BeamNG Drive', 'beamng.jpg', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "BeamNG Szerver Token",\r\n        "placeholder": "Add meg a BeamNG szerver tokenedet.",\r\n        "price": 0\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 30,\r\n    "nodeId": 1,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "NAME": "BeamMP Server",\r\n        "DESCRIPTION": "www.lighthosting.hu",\r\n        "VERSION": "latest",\r\n        "AUTHKEY": "{{option3}}",\r\n        "MAX_PLAYER": 8\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(13, 'Escape From Tarkov', 'eft.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 32,\r\n    "nodeId": 1,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "SPT_VERSION": "40b999d04c68f1f52ab152d163c086a1c50f489b",\r\n        "SIT_VERSION": "latest",\r\n        "SIT_PACKAGE": "stayintarkov/SIT.Aki-Server-Mod",\r\n        "SIT_NAME": "SITCoop.zip"\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(16, 'Factorio', 'factorio.jpg', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 33,\r\n    "nodeId": 1,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "SPT_VERSION": "40b999d04c68f1f52ab152d163c086a1c50f489b",\r\n        "FACTORIO_VERSION": "latest",\r\n        "MAX_SLOTS": 20,\r\n        "SERVER_NAME": "Factorio Server",\r\n        "SERVER_DESC": "www.lighthosting.hu",\r\n        "SERVER_USERNAME": "unnamed",\r\n        "SAVE_INTERVAL": 10,\r\n        "SAVE_SLOTS": 5,\r\n        "AFK_KICK": 0,\r\n        "SAVE_NAME": "gamesave",\r\n        "SERVER_TOKEN": "undefined"\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(20, 'Multi Theft Auto', 'mta.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 22,\r\n    "nodeId": 1,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "SERVER_WEBPORT": 22005\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(21, 'Counter-Strike: Global Offensive', 'csgo.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Steam fiók token",\r\n        "placeholder": "Add meg a steam fiók tokenedet.",\r\n        "price": 0\r\n    }\r\n]\r\n', 'game', NULL, '{\n    "eggId": 7,\n    "nodeId": 8,\n    "nestId": 2,\n    "variables": {\n        "SRCDS_MAP": 22005,\n        "SRCDS_APPID": 740,\n        "STEAM_ACC": "{{option3}}"\n    }\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(23, 'ALT:V', 'altv.jpg', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 20,\r\n    "nodeId": 8,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "LD_LIBRARY_PATH": ".",\r\n        "BUILD": "release",\r\n        "PASSWORD": "ChangeMe",\r\n        "SERVER_DESC": "www.lighthosting.hu"\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(24, 'Rust', 'rust.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Szerver Slot",\r\n        "placeholder": "Válassz egy slot számot.",\r\n        "price": 0,\r\n        "options": [\r\n            "5",\r\n            "10",\r\n            "15",\r\n            "20",\r\n            "25",\r\n            "30",\r\n            "35",\r\n            "40",\r\n            "45",\r\n            "50",\r\n            "55",\r\n            "60",\r\n            "65",\r\n            "70"\r\n        ]\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 14,\r\n    "nodeId": 1,\r\n    "nestId": 4,\r\n    "variables": {\r\n        "HOSTNAME": "Rust Server Powered By lighthosting",\r\n        "FRAMEWORK": "vanilla",\r\n        "LEVEL": "Procedural Map",\r\n        "DESCRIPTION": "www.lighthosting.hu",\r\n        "SERVER_URL": "https://ugyfelkapu.lighthosting.hu/",\r\n        "WORLD_SIZE": "2000",\r\n        "MAX_PLAYERS": "{{option3}}",\r\n        "QUERY_PORT": "27017",\r\n        "RCON_PORT": "28016",\r\n        "RCON_PASS": "defaultpass",\r\n        "SAVEINTERVAL": "60",\r\n        "APP_PORT": "28082"\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(25, 'Counter-Strike 2', 'cs2.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Steam fiók token",\r\n        "placeholder": "Add meg a steam fiók tokenedet.",\r\n        "price": 0\r\n    },\r\n    {\r\n        "label": "Szerver Slot",\r\n        "placeholder": "Válassz egy slot számot.",\r\n        "price": 0,\r\n        "options": [\r\n            "70",\r\n            "65",\r\n            "60",\r\n            "55",\r\n            "50",\r\n            "45",\r\n            "40",\r\n            "35",\r\n            "30",\r\n            "25",\r\n            "20",\r\n            "15",\r\n            "10",\r\n            "5"\r\n        ]\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 26,\r\n    "nodeId": 8,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "SRCDS_MAP": "de_dust2",\r\n        "SRCDS_APPID": 730,\r\n        "SRCDS_MAXPLAYERS": "{{option4}}",\r\n        "SRCDS_STOP_UPDATE": 0,\r\n        "SRCDS_VALIDATE": 0,\r\n        "STEAM_ACC": "{{option3}}",\r\n        "GAME_TYPE": 0,\r\n        "GAME_MODE": 0,\r\n        "CLEANUP_ENABLED": 1,\r\n        "CSS_AUTOUPDATE": 0,\r\n        "METAMOD_AUTOUPDATE": 0,\r\n        "ENABLE_FILTER": 0,\r\n        "FILTER_PREVIEW_MODE": 0\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(26, '7 Days To Die', '7days.jpg', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Steam fiók token",\r\n        "placeholder": "Add meg a steam fiók tokenedet.",\r\n        "price": 0\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 19,\r\n    "nodeId": 8,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "MAX_PLAYERS": 8,\r\n        "GAME_DIFFICULTY": 3,\r\n        "SRCDS_APPID": 294420,\r\n        "AUTO_UPDATE": 1\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(28, 'Teamspeak3 Server', 'ts3.jpg', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    }\r\n]\r\n', 'game', NULL, '{\n    "eggId": 13,\n    "nodeId": 1,\n    "nestId": 3,\n    "variables": {\n        "TS_VERSION": "latest",\n        "FILE_TRANSFER": 30033,\n        "QUERY_PORT": 10011,\n        "QUERY_PROTOCOLS_VAR": "http",\n        "QUERY_SSH": 10022,\n        "QUERY_HTTP": 10080\n    }\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(29, 'Euro Truck Simulator Dedikált szerver', 'ets2.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 633,\r\n        "min": 1024,\r\n        "max": 18432,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 35,\r\n        "min": 1024,\r\n        "max": 60416,\r\n        "step": 1024,\r\n        "default": 1024,\r\n        "suffix": "GB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 115,\r\n        "min": 100,\r\n        "max": 400,\r\n        "step": 100,\r\n        "default": 100,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Steam fiók token",\r\n        "placeholder": "Add meg a steam fiók tokenedet.",\r\n        "price": 0\r\n    }\r\n]\r\n', 'game', NULL, '{\r\n    "eggId": 29,\r\n    "nodeId": 8,\r\n    "nestId": 2,\r\n    "variables": {\r\n        "AUTO_UPDATE": 1,\r\n        "SRCDS_APPID": 1948160,\r\n        "LOBBY_NAME": "Euro Truck Simulator 2 szerver",\r\n        "STEAM_TOKEN": "{{option3}}"\r\n    }\r\n}', 'from-red-400 to-yellow-500', NULL, NULL),
	(30, 'Discord Szolgáltatás', 'discord.png', '[\r\n    {\r\n        "label": "Szerver ram",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 47,\r\n        "min": 64,\r\n        "max": 1024,\r\n        "step": 64,\r\n        "default": 64,\r\n        "suffix": "MB"\r\n    },\r\n    {\r\n        "label": "Szerver tárhely",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 10,\r\n        "min": 128,\r\n        "max": 3584,\r\n        "step": 128,\r\n        "default": 128,\r\n        "suffix": "MB"\r\n    },\r\n    {\r\n        "label": "CPU használat",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 40,\r\n        "min": 50,\r\n        "max": 200,\r\n        "step": 50,\r\n        "default": 50,\r\n        "suffix": "%"\r\n    },\r\n    {\r\n        "label": "Verzió",\r\n        "placeholder": "Válassz egy opciót.",\r\n        "price": 0,\r\n        "options": [\r\n            "NodeJs",\r\n            "Python"\r\n        ]\r\n    }\r\n]\r\n', 'game', NULL, '{\n    "nodeId": 8,\n    "nestId": 5,\n    "nodejs": 17,\n    "python": 16,\n    "nodejs_variables": {\n        "USER_UPLOAD": 0,\n        "AUTO_UPDATE": 0,\n        "JS_FILE": "index.js"\n    },\n    "python_variables": {\n        "USER_UPLOAD": 0,\n        "AUTO_UPDATE": 0,\n        "PY_FILE": "app.py",\n        "REQUIREMENTS_FILE": "requirements.txt"\n    }\n}', 'from-red-400 to-yellow-500', NULL, NULL);

-- Struktúra mentése tábla lighthosting. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) NOT NULL,
  `username` varchar(191) NOT NULL,
  `firstname` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `discord` longtext NOT NULL,
  `money` int(11) NOT NULL DEFAULT 0,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.user: ~1 rows (hozzávetőleg)
INSERT IGNORE INTO `user` (`id`, `email`, `username`, `firstname`, `lastname`, `password`, `avatar`, `discord`, `money`, `role`, `verified`, `createdAt`, `updatedAt`) VALUES
	(4, 'illes.akos@illesinnovate.hu', 'illesa', 'Ákos', 'illesa', '$2b$12$r53..RWzWleFsehOU1mdSeIEJxI9Pqir7keVYcJ5j1Qzd2e.AjmrW', '', '', 7410, 'admin', 0, '2025-03-22 06:27:11.216', '2025-03-26 21:20:31.902'),
	(5, 'illes.a@illesinnovate.hu', 'akosilles', 'Ákos', 'Illés', '$2b$10$.pkTlD.gr57OZQXukLCymuzxtLS8buzbCpI5FykowZkhBzWx7JRLK', '', '', 0, 'user', 0, '2025-03-22 11:23:37.202', '2025-03-22 11:23:37.202');

-- Struktúra mentése tábla lighthosting. _prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting._prisma_migrations: ~18 rows (hozzávetőleg)
INSERT IGNORE INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('05319c8b-a8c9-4369-9f78-40bb8dea2614', '34e1a4f78a246e0e8ef091d985bec18c1576b9dc6ff45ef367092effde0462b9', '2025-03-23 00:23:52.089', '20250323002352_add_price_to_service', NULL, NULL, '2025-03-23 00:23:52.049', 1),
	('0a2f685a-f6aa-40d6-8136-3ce78cad91c1', 'b68e7888883dd8eab42ade9a64c14667a0023b6388855dd9cf0a38f5c47a09f0', '2025-03-22 15:23:16.043', '20250322152315_add_price_to_service', NULL, NULL, '2025-03-22 15:23:15.987', 1),
	('0fab9bc9-579a-43ba-a556-7ac696b6e727', 'd2e0fdd2018ea3a95f0abab696a40348d93120253271e64b68c4c5c9a309616f', '2025-03-26 21:34:57.884', '20250326213457_add_price_to_service', NULL, NULL, '2025-03-26 21:34:57.836', 1),
	('191b2bc6-64a6-488c-931b-639416185f49', 'f907222688da62a0a9672762752973d9adde8c5018f19f89e5393895b7350af7', '2025-03-22 13:51:18.686', '20250322135118_add_longtext_field', NULL, NULL, '2025-03-22 13:51:18.639', 1),
	('1bbef823-253b-4622-94ab-d9e67e5bce62', 'aed8acc5d7fdc463ec26d3f01123f383e32af534da1315d3b8f5f2590f4b6772', '2025-03-22 14:50:24.777', '20250322145024_add_longtext_field', NULL, NULL, '2025-03-22 14:50:24.739', 1),
	('269d56a4-d7ca-4d18-a0d3-c2b489ad4aa5', '85bdd0027838dd0238626b766558f0183cda16e1fd57ba05996dbd6d5015ff46', '2025-03-22 13:43:27.218', '20250322134303_create_table', NULL, NULL, '2025-03-22 13:43:27.170', 1),
	('33a4ec60-9dbe-4653-8067-1f83b4f00dd6', '37c8e1aa163a96904f8aa60925fbd928c1ed7aa768775b25f720ba9f2f6fe670', '2025-03-22 13:46:53.761', '20250322134653_add_longtext_field', NULL, NULL, '2025-03-22 13:46:53.715', 1),
	('48961ea0-1d9c-4fac-9c83-213b32c19a91', '1900b01f176b4f2cb2be3d76d46bebe7dc9ea6d44d314ce4e01f254face5990d', '2025-03-22 15:21:02.365', '20250322152102_add_price_to_service', NULL, NULL, '2025-03-22 15:21:02.309', 1),
	('4e7a46e8-4523-45d6-9b60-885ccb6509b8', '364abef82feb5ea12d2bbc9fad06463719f81ee5483293832266acf9093de7bc', '2025-03-22 17:33:34.066', '20250322173333_add_price_to_service', NULL, NULL, '2025-03-22 17:33:34.006', 1),
	('60dec584-aa0a-4238-a64f-6b3115636b0f', '49bd48bf2062bed80b08cbc6256d26db32a7f6d2100ac0a9cb700724e0c217df', '2025-03-26 21:34:22.616', '20250326213422_add_price_to_service', NULL, NULL, '2025-03-26 21:34:22.568', 1),
	('66762d06-c883-4330-970e-6cf4541b4e5c', '3f2929975b2ff42ddbc88d01af968ee35a517059123cccbb5f9364cdfa9fd1f4', '2025-03-26 21:36:19.370', '20250326213619_add_price_to_service', NULL, NULL, '2025-03-26 21:36:19.327', 1),
	('89ade3d0-2e3c-4c5f-8955-8b9d0b41e9ea', 'ddde54c37c62ba2b11e99c77a17f1bc46e93b8587d2c17464c0dfb07f889dad4', '2025-03-22 05:39:05.650', '20250322053905_init', NULL, NULL, '2025-03-22 05:39:05.637', 1),
	('8add2508-4c99-4eb8-8fc5-d082eeb2d78c', '15051faaa417602768b11468d94b3849cfc4b2f63fa235df2867bb61f86a2ee4', '2025-03-22 13:50:09.324', '20250322135009_add_longtext_field', NULL, NULL, '2025-03-22 13:50:09.279', 1),
	('b1802f92-75a5-461a-81a2-81d590a2975a', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-03-22 13:43:27.497', '20250322134327_add_longtext_field', NULL, NULL, '2025-03-22 13:43:27.463', 1),
	('b7743927-b452-490f-b480-297aa025d941', 'dae4d6c8f285a64c5ce95e807e69f1405e32c09a184a931e0bd0f1f4e1940e16', '2025-03-22 17:31:16.952', '20250322173116_add_price_to_service', NULL, NULL, '2025-03-22 17:31:16.916', 1),
	('d088a05b-5d4f-42eb-ae11-640ade6b0f6c', '2770507d84cb507aa91b0d0aadacb368955e83347b6d1a82f22cd0391671d15f', '2025-03-23 00:23:07.291', '20250323002307_add_price_to_service', NULL, NULL, '2025-03-23 00:23:07.249', 1),
	('d3410325-36b3-466e-8298-486d22e22f9f', '1b12e78a753414d87a969daa914721f836eed4c6381c11ee5350bbdb34ed10a2', '2025-03-22 13:44:31.081', '20250322134431_add_longtext_field', NULL, NULL, '2025-03-22 13:44:31.037', 1),
	('d53fc2d5-086e-4e25-97a9-724e8f057d48', 'c711c331ed1b1ad8794a15e6a2f72863827543a207cb7d2188ed6b782cdd24e3', '2025-03-22 13:51:50.338', '20250322135150_add_longtext_field', NULL, NULL, '2025-03-22 13:51:50.289', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
