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
CREATE DATABASE IF NOT EXISTS `lighthosting` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci */;
USE `lighthosting`;

-- Struktúra mentése tábla lighthosting. account
CREATE TABLE IF NOT EXISTS `account` (
  `id` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `access_token` varchar(191) DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `refresh_token` varchar(191) DEFAULT NULL,
  `id_token` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  KEY `Account_userId_fkey` (`userId`),
  CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.account: ~0 rows (hozzávetőleg)

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.cdn: ~2 rows (hozzávetőleg)
INSERT IGNORE INTO `cdn` (`id`, `user_id`, `url`, `type`, `filename`, `deletion_date`, `delete_hash`, `expire`) VALUES
	(1, 4, 'https://i.imgur.com/isFDtBg.png', 'avatar', 'eed3dd9eaa0b10bbd0e54c83.png', '2025-04-02 16:49:50', 'bDXJUMA7aMqDSl4', '2025-05-02 16:49:50'),
	(2, 6, 'https://i.imgur.com/Tca99bR.png', 'avatar', 'f660dc0590c49e7f43343907.png', '2025-04-02 17:56:37', 'lr3PtQNcwsb6Ab1', '2025-05-02 17:56:37');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.news: ~0 rows (hozzávetőleg)

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
  `pterodactyl_id` varchar(191) DEFAULT NULL,
  `vm_id` int(11) DEFAULT NULL,
  `service_name` varchar(255) NOT NULL,
  `panel_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Service_pterodactyl_id_key` (`pterodactyl_id`),
  UNIQUE KEY `Service_vm_id_key` (`vm_id`),
  UNIQUE KEY `Service_panel_id_key` (`panel_id`),
  KEY `Service_user_id_fkey` (`user_id`),
  CONSTRAINT `Service_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.service: ~0 rows (hozzávetőleg)

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

-- Struktúra mentése tábla lighthosting. session
CREATE TABLE IF NOT EXISTS `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` int(11) NOT NULL,
  `expires` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  KEY `Session_userId_fkey` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.session: ~0 rows (hozzávetőleg)

-- Struktúra mentése tábla lighthosting. transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `userEmail` varchar(255) NOT NULL,
  `partnerName` varchar(255) NOT NULL,
  `amount` int(11) NOT NULL,
  `billingoId` int(11) NOT NULL,
  `invoiceNumber` varchar(255) NOT NULL,
  `invoiceDate` datetime NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Transactions_invoiceNumber_key` (`invoiceNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.transactions: ~1 rows (hozzávetőleg)
INSERT IGNORE INTO `transactions` (`id`, `userId`, `userEmail`, `partnerName`, `amount`, `billingoId`, `invoiceNumber`, `invoiceDate`, `createdAt`, `updatedAt`, `status`) VALUES
	(1, 6, 'illes.akos@illesinnovate.hu', 'Ákos Illés', 185000, 96984143, 'IN-2025-29', '2025-04-08 00:50:57', '2025-04-08 00:50:57.895', '2025-04-08 00:50:57.895', 'paid');

-- Struktúra mentése tábla lighthosting. user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(191) DEFAULT NULL,
  `username` varchar(191) NOT NULL,
  `firstname` varchar(191) NOT NULL,
  `lastname` varchar(191) NOT NULL,
  `password` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `discord` longtext NOT NULL,
  `money` int(11) NOT NULL DEFAULT 0,
  `role` varchar(191) NOT NULL DEFAULT 'user',
  `name` varchar(191) DEFAULT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `emailVerified` datetime(3) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `resetToken` varchar(191) DEFAULT NULL,
  `resetTokenExpires` datetime(3) DEFAULT NULL,
  `discordData` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`discordData`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.user: ~1 rows (hozzávetőleg)
INSERT IGNORE INTO `user` (`id`, `email`, `username`, `firstname`, `lastname`, `password`, `createdAt`, `updatedAt`, `avatar`, `discord`, `money`, `role`, `name`, `verified`, `emailVerified`, `image`, `resetToken`, `resetTokenExpires`, `discordData`) VALUES
	(6, 'illes.akos@illesinnovate.hu', 'illesa', 'Ákos', 'Illés', '$2b$12$A/bD8jTh8n7u3kWBtTMuxeYCJrbCfyv0cquTfeMaPataK9f9UGIQa', '2025-04-02 16:57:58.880', '2025-04-08 00:50:57.064', 'f660dc0590c49e7f43343907.png', '', 285500, 'admin', NULL, 0, NULL, NULL, NULL, NULL, NULL);

-- Struktúra mentése tábla lighthosting. verificationtoken
CREATE TABLE IF NOT EXISTS `verificationtoken` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL,
  UNIQUE KEY `VerificationToken_token_key` (`token`),
  UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tábla adatainak mentése lighthosting.verificationtoken: ~0 rows (hozzávetőleg)

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

-- Tábla adatainak mentése lighthosting._prisma_migrations: ~40 rows (hozzávetőleg)
INSERT IGNORE INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
	('0264661d-ddf0-4c65-904d-00fab46099aa', 'd2e0fdd2018ea3a95f0abab696a40348d93120253271e64b68c4c5c9a309616f', '2025-04-08 00:44:04.519', '20250326213457_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.474', 1),
	('03248be8-87b5-4d20-89e6-da06e01132d0', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-04-08 00:44:04.964', '20250402160301_create_user', NULL, NULL, '2025-04-08 00:44:04.930', 1),
	('082ea4c5-089f-4392-9d9e-1472b6f7039b', '15051faaa417602768b11468d94b3849cfc4b2f63fa235df2867bb61f86a2ee4', '2025-04-08 00:44:04.037', '20250322135009_add_longtext_field', NULL, NULL, '2025-04-08 00:44:03.993', 1),
	('0a7cab2f-9e23-4200-ae1b-9c4434ffd44c', '2770507d84cb507aa91b0d0aadacb368955e83347b6d1a82f22cd0391671d15f', '2025-04-08 00:44:04.396', '20250323002307_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.360', 1),
	('1530a835-b048-4ce4-b27d-d8e203062eeb', '34e1a4f78a246e0e8ef091d985bec18c1576b9dc6ff45ef367092effde0462b9', '2025-04-08 00:44:04.433', '20250323002352_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.397', 1),
	('2109c961-62c9-42cb-aaf9-bc354ad3253a', 'f907222688da62a0a9672762752973d9adde8c5018f19f89e5393895b7350af7', '2025-04-08 00:44:04.083', '20250322135118_add_longtext_field', NULL, NULL, '2025-04-08 00:44:04.038', 1),
	('23653980-1409-42f8-a6e4-acd877020932', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-04-08 00:44:04.928', '20250402160158_add_pterodactyl_id_column', NULL, NULL, '2025-04-08 00:44:04.894', 1),
	('264d9d27-5144-4e5c-bc24-4c19f74eb7fc', 'a76b1d7b8450eeb4a5a9a9cb59a6a97c1383f5f0a2bf37e2c2d0c7bcb1fd0414', '2025-04-08 00:44:05.210', '20250402170226_fix_relations', NULL, NULL, '2025-04-08 00:44:05.084', 1),
	('3404fde2-6754-4a1a-8d4d-2b9420347881', '3f2929975b2ff42ddbc88d01af968ee35a517059123cccbb5f9364cdfa9fd1f4', '2025-04-08 00:44:04.563', '20250326213619_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.520', 1),
	('39e8a024-dd1c-41ba-8c04-ac958c984618', '49bd48bf2062bed80b08cbc6256d26db32a7f6d2100ac0a9cb700724e0c217df', '2025-04-08 00:44:04.474', '20250326213422_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.434', 1),
	('3cb945da-f710-47be-9153-14776a73bc36', '1900b01f176b4f2cb2be3d76d46bebe7dc9ea6d44d314ce4e01f254face5990d', '2025-04-08 00:44:04.210', '20250322152102_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.169', 1),
	('3e0e89a3-a031-4676-bf51-69c85cc05368', 'f13ed489446c57068f0dd6b32136dfc8beedfdc0441ed91d924dd133d7850337', '2025-04-08 00:44:05.332', '20250405130902_add_vmid_fields', NULL, NULL, '2025-04-08 00:44:05.297', 1),
	('49ef59fa-64c1-4a5c-8cf8-9036b3b17809', 'b68e7888883dd8eab42ade9a64c14667a0023b6388855dd9cf0a38f5c47a09f0', '2025-04-08 00:44:04.264', '20250322152315_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.211', 1),
	('52dd51bf-60ac-4bb2-b4cb-ee446d295675', '06fe23bfc80ce61d2cfe0a2993dbcfab744855ff5a6769fbf4af9146aeb4a47a', '2025-04-08 00:44:05.547', '20250406170633_add_service_name_field', NULL, NULL, '2025-04-08 00:44:05.501', 1),
	('56319fdd-cff7-4aa6-85d6-944bf62c63cd', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-04-08 00:44:03.893', '20250322134327_add_longtext_field', NULL, NULL, '2025-04-08 00:44:03.859', 1),
	('580a0449-6527-4398-bc1d-ffe31283a29c', '0950d191d3470f1fcf422750b6529e0f4424fc34e2a413c82f0bdde967e5037b', '2025-04-08 00:44:04.785', '20250402152623_add_nextauth_models', NULL, NULL, '2025-04-08 00:44:04.681', 1),
	('5c10c662-3eac-4cb1-9c62-3a40fe9f5320', '8c347785b7f19d353a98137902ab21008cde4b6fc4fe19eb99720a2969350232', '2025-04-08 00:44:04.857', '20250402160046_discord', NULL, NULL, '2025-04-08 00:44:04.786', 1),
	('6b5b66d1-dd4d-478a-a5a0-7bf0ffed8db1', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-04-08 00:44:04.893', '20250402160128_add_pterodactyl_id_column', NULL, NULL, '2025-04-08 00:44:04.858', 1),
	('733358da-23e8-4e23-8c26-1e7c3adfc7fe', 'cda64d34f83dc7b4bcbbe5f8bb7b257f0962eb064d4dadf9e0156e5d96097a08', '2025-04-08 00:44:04.644', '20250327183303_add_reset_token_exp', NULL, NULL, '2025-04-08 00:44:04.611', 1),
	('765bed72-f017-4126-ba50-666958c619c6', 'aed8acc5d7fdc463ec26d3f01123f383e32af534da1315d3b8f5f2590f4b6772', '2025-04-08 00:44:04.168', '20250322145024_add_longtext_field', NULL, NULL, '2025-04-08 00:44:04.130', 1),
	('7ed1ce42-671a-47b7-abe7-1de1d6a6db9f', '587788ae41de7429ff332404f0a91f8af07e7aa358420022ae95b9cc05c0d20f', '2025-04-08 00:44:05.500', '20250406065947_service_name', NULL, NULL, '2025-04-08 00:44:05.467', 1),
	('8f6ba122-ddd1-4a06-b6cf-8fcdbcc14e2e', '320f7fb500b2fbb8b2226880b767c12e6854258b11b9572881f300bd03855d21', '2025-04-08 00:44:05.626', '20250407235640_add_transaction_table', NULL, NULL, '2025-04-08 00:44:05.583', 1),
	('9adc5e51-73c1-4e40-b5c4-07ceadd070d9', '8dbb72c7d59b5b042b996046f21984bbb0540c87e0d65a7ccae8a89ffa07501b', '2025-04-08 00:44:05.431', '20250406061650_change_vmid_pteroid', NULL, NULL, '2025-04-08 00:44:05.375', 1),
	('9d7572f8-daeb-4863-8257-697d3ea39156', 'fd1d2b392551db19a6e10bea00fed4c68c11ae1278eb4d8d0a06a34c78f878eb', '2025-04-08 00:44:05.374', '20250405131326_add_vmid_fields', NULL, NULL, '2025-04-08 00:44:05.333', 1),
	('9dc232e1-d1ea-4101-8a8f-86ada530de60', 'b316e4b098e137f5acd42c388d97f934c470c29c91b658ea1fb2c5c9cb2e295e', '2025-04-08 00:44:05.040', '20250402165529_add_discord_data_field', NULL, NULL, '2025-04-08 00:44:04.965', 1),
	('b511aac4-4a36-4362-94ca-be945a1f0f4a', 'a3f9593038940ec563444509b725bba563cd1522858ea79c83749e255e19a9d8', '2025-04-08 00:44:05.084', '20250402165744_add_discord_data_field', NULL, NULL, '2025-04-08 00:44:05.041', 1),
	('bc3e1831-8eb7-4337-a4c9-8b906792fa18', '8b6980fcd9448e262ff5f604a3f44b3595e6f4ec323e5ca400eb6d9536c404f5', '2025-04-08 00:44:56.086', '20250408004456_transaction_status', NULL, NULL, '2025-04-08 00:44:56.020', 1),
	('bef5a662-01f8-4fcd-9194-a988254a19f3', 'c711c331ed1b1ad8794a15e6a2f72863827543a207cb7d2188ed6b782cdd24e3', '2025-04-08 00:44:04.129', '20250322135150_add_longtext_field', NULL, NULL, '2025-04-08 00:44:04.084', 1),
	('c225bd84-2408-4291-b14d-e144fd7eb454', '587788ae41de7429ff332404f0a91f8af07e7aa358420022ae95b9cc05c0d20f', '2025-04-08 00:44:05.583', '20250406170800_add_service_panelid_field', NULL, NULL, '2025-04-08 00:44:05.548', 1),
	('cce2b7c1-1a00-4743-99ec-6e0ffeebb9c2', '85bdd0027838dd0238626b766558f0183cda16e1fd57ba05996dbd6d5015ff46', '2025-04-08 00:44:03.858', '20250322134303_create_table', NULL, NULL, '2025-04-08 00:44:03.812', 1),
	('cd664d86-947a-4ee3-bed5-f881ea76484c', '37c8e1aa163a96904f8aa60925fbd928c1ed7aa768775b25f720ba9f2f6fe670', '2025-04-08 00:44:03.993', '20250322134653_add_longtext_field', NULL, NULL, '2025-04-08 00:44:03.944', 1),
	('e0342548-9df4-48af-b4b2-c708f5cd38d0', '575e10bfba144bdd948b02dce0b5c1c1eb97f48dda74eabf61004ab650d9916a', '2025-04-08 00:44:05.253', '20250402170608_fix_relations', NULL, NULL, '2025-04-08 00:44:05.211', 1),
	('e24da718-f648-4ae1-856d-67e285e68b4f', 'ddde54c37c62ba2b11e99c77a17f1bc46e93b8587d2c17464c0dfb07f889dad4', '2025-04-08 00:44:03.811', '20250322053905_init', NULL, NULL, '2025-04-08 00:44:03.801', 1),
	('e568f513-02e8-4df2-ac3b-f1954ac8efd1', '0ff054e9be795de2fd004267c14d29fb60330a9f4fc04cadaf20b7589912760a', '2025-04-08 00:44:05.296', '20250402171928_add_discord_fields', NULL, NULL, '2025-04-08 00:44:05.254', 1),
	('e8e0e080-1ff1-45ab-aef9-4e460c60c039', '1b12e78a753414d87a969daa914721f836eed4c6381c11ee5350bbdb34ed10a2', '2025-04-08 00:44:03.943', '20250322134431_add_longtext_field', NULL, NULL, '2025-04-08 00:44:03.893', 1),
	('ecf3b20a-90bb-4a50-812b-b565d42f4c25', '364abef82feb5ea12d2bbc9fad06463719f81ee5483293832266acf9093de7bc', '2025-04-08 00:44:04.359', '20250322173333_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.316', 1),
	('ed8910cc-0729-49c7-bff1-ceb794b539c4', '2f298a43dc31c6a724048455e89da1b1626ca3fb02230d7125ab1e60e0c1afe3', '2025-04-08 00:44:05.466', '20250406065928_add_service_name_field', NULL, NULL, '2025-04-08 00:44:05.432', 1),
	('f46bbc02-f887-4c83-b9c7-8a1753506e3a', 'dae4d6c8f285a64c5ce95e807e69f1405e32c09a184a931e0bd0f1f4e1940e16', '2025-04-08 00:44:04.315', '20250322173116_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.264', 1),
	('fbd4e683-a25f-4ec3-a525-43e86663c6a3', '575e10bfba144bdd948b02dce0b5c1c1eb97f48dda74eabf61004ab650d9916a', '2025-04-08 00:44:04.610', '20250327181419_add_price_to_service', NULL, NULL, '2025-04-08 00:44:04.564', 1),
	('fc9b2b40-8926-4de7-b465-9f0595450c18', 'eb1e391021144d14387205d08edfe2b288764ee79f95c4dc78d04ef46bbf0b5d', '2025-04-08 00:44:04.680', '20250329070410_add_pterodactyl_id_column', NULL, NULL, '2025-04-08 00:44:04.645', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
