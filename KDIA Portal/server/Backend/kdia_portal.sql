-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2026 at 07:35 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kdia_portal`
--

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `adminId` int(11) NOT NULL,
  `actionType` varchar(100) NOT NULL,
  `targetId` int(11) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `timestamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `adminId`, `actionType`, `targetId`, `details`, `timestamp`) VALUES
(1, 1, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Active\",\"new\":\"Inactive\"}', '2026-01-05 10:27:15'),
(2, 1, 'ALLOCATION_CHANGE', 2, '{\"previous\":1000,\"new\":1500,\"startDate\":\"2026-02-01\"}', '2026-01-05 10:28:23'),
(3, 1, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Inactive\",\"new\":\"Active\"}', '2026-01-06 06:46:18'),
(4, 1, 'CUSTOMER_STATUS_CHANGE', 3, '{\"previous\":\"Active\",\"new\":\"Inactive\"}', '2026-01-06 06:46:21'),
(5, 8, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Active\",\"new\":\"Inactive\"}', '2026-01-09 05:02:57'),
(6, 8, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Inactive\",\"new\":\"Active\"}', '2026-01-09 05:02:59'),
(7, 8, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Active\",\"new\":\"Inactive\"}', '2026-01-09 06:43:17'),
(8, 8, 'CUSTOMER_STATUS_CHANGE', 2, '{\"previous\":\"Inactive\",\"new\":\"Active\"}', '2026-01-09 06:45:34'),
(9, 8, 'TICKET_REPLY', 3, '{\"statusChanged\":\"IN_PROGRESS\"}', '2026-01-09 10:51:20'),
(10, 8, 'TICKET_STATUS_CHANGE', 5, '{\"previous\":\"PENDING\",\"new\":\"IN_PROGRESS\"}', '2026-01-12 11:11:40'),
(11, 8, 'PROFILE_UPDATE_REJECTED', 5, '{\"reason\":\"sdfghj\"}', '2026-01-12 11:11:57'),
(12, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"PENDING\",\"new\":\"IN_PROGRESS\"}', '2026-01-12 11:45:24'),
(13, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"IN_PROGRESS\",\"new\":\"RESOLVED\"}', '2026-01-12 11:45:25'),
(14, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"RESOLVED\",\"new\":\"IN_PROGRESS\"}', '2026-01-12 11:45:28'),
(15, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"IN_PROGRESS\",\"new\":\"RESOLVED\"}', '2026-01-12 11:45:30'),
(16, 8, 'TICKET_REPLY', 4, '{\"statusChanged\":\"RESOLVED\"}', '2026-01-12 11:45:39'),
(17, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"RESOLVED\",\"new\":\"IN_PROGRESS\"}', '2026-01-12 12:20:35'),
(18, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"IN_PROGRESS\",\"new\":\"PENDING\"}', '2026-01-12 12:20:41'),
(19, 8, 'TICKET_STATUS_CHANGE', 4, '{\"previous\":\"PENDING\",\"new\":\"IN_PROGRESS\"}', '2026-01-12 12:20:42'),
(20, 8, 'TICKET_REPLY', 4, '{\"statusChanged\":\"RESOLVED\"}', '2026-01-12 12:22:15'),
(21, 8, 'VENDOR_REJECTED', 15, '{\"status\":\"REJECTED\",\"reason\":\"Insufficient experience\"}', '2026-01-16 12:13:52'),
(22, 1, 'ALLOCATION_ASSIGNED', 21, '{\"amount\":500,\"startDate\":\"2026-01-17\",\"allocationName\":\"Monthly Solar Allocation\",\"notes\":\"\"}', '2026-01-17 06:49:27'),
(23, 22, 'CUSTOMER_CREATED', 23, '{\"vendorId\":22,\"customerName\":\"TEST_DRAFT_CUSTOMER\",\"initialStatus\":\"DRAFT\"}', '2026-01-17 06:53:54'),
(24, 22, 'CUSTOMER_CREATED', 24, '{\"vendorId\":22,\"customerName\":\"TEST_PENDING_CUSTOMER\",\"initialStatus\":\"PENDING\"}', '2026-01-17 06:53:54'),
(25, 22, 'CUSTOMER_CREATED', 25, '{\"vendorId\":22,\"customerName\":\"TEST_APPROVED_CUSTOMER\",\"initialStatus\":\"APPROVED\"}', '2026-01-17 06:53:54'),
(26, 22, 'CUSTOMER_SUBMITTED_FOR_APPROVAL', 24, '{\"vendorId\":22,\"customerName\":\"TEST_PENDING_CUSTOMER\"}', '2026-01-17 06:53:54'),
(27, 1, 'CUSTOMER_APPROVED', 25, '{\"status\":\"APPROVED\",\"vendorId\":22}', '2026-01-17 06:53:54'),
(28, 8, 'ALLOCATION_ASSIGNED', 25, '{\"amount\":1500,\"startDate\":\"2026-01-17\",\"allocationName\":\"Test Solar Allocation\",\"notes\":\"E2E Test Allocation\"}', '2026-01-17 07:02:32'),
(29, 14, 'CUSTOMER_SUBMITTED_FOR_APPROVAL', 26, '{\"vendorId\":14,\"customerName\":\"Priya Verma\"}', '2026-01-26 11:01:17');

-- --------------------------------------------------------

--
-- Table structure for table `consumption_logs`
--

CREATE TABLE `consumption_logs` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `unitsConsumed` int(11) NOT NULL,
  `month` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `consumption_logs`
--

INSERT INTO `consumption_logs` (`id`, `userId`, `unitsConsumed`, `month`) VALUES
(1, 1, 150, '2025-12'),
(2, 2, 150, '2025-12'),
(3, 3, 150, '2025-12'),
(4, 4, 150, '2025-12'),
(5, 5, 150, '2025-12'),
(6, 6, 150, '2025-12'),
(7, 7, 200, '2026-01'),
(8, 9, 150, '2025-12'),
(9, 10, 150, '2025-12'),
(10, 11, 150, '2025-12'),
(11, 12, 150, '2025-12'),
(12, 13, 150, '2025-12');

-- --------------------------------------------------------

--
-- Table structure for table `leads`
--

CREATE TABLE `leads` (
  `id` int(11) NOT NULL,
  `vendorId` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `assignedDate` date NOT NULL,
  `status` varchar(50) DEFAULT 'New'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leads`
--

INSERT INTO `leads` (`id`, `vendorId`, `name`, `contact`, `location`, `assignedDate`, `status`) VALUES
(4, 14, 'Karan Malhotra', '9811000001 | karan.m@test.com', 'Cyber Hub, Gurgaon', '2026-01-20', 'New'),
(5, 14, 'Sanya Gupta', '9811000002 | sanya.g@test.com', 'Hauz Khas, Delhi', '2026-01-22', 'New'),
(6, 14, 'Rohan Mehra', '9811000003 | rohan.m@test.com', 'MG Road, Gurgaon', '2026-01-24', 'Contacted'),
(7, 14, 'Sneha Kapoor', '9811000004 | sneha.k@test.com', 'Greater Kailash, Delhi', '2026-01-25', 'Meeting Scheduled'),
(8, 14, 'Arjun Verma', '9811000005 | arjun.v@test.com', 'Vasant Vihar, Delhi', '2026-01-26', 'Meeting Scheduled'),
(9, 14, 'Deepika Joshi', '9811000006 | deepika.j@test.com', 'Sector 50, Noida', '2026-01-27', 'Contacted'),
(10, 14, 'Vikram Singh', '9811000007 | vikram.s@test.com', 'Banjara Hills, Hyderabad', '2026-01-28', 'New');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `totalUnits` int(11) NOT NULL,
  `startDate` varchar(20) NOT NULL,
  `allocation_name` varchar(255) DEFAULT 'Monthly Solar Allocation',
  `notes` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `period` varchar(20) DEFAULT 'Monthly'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `userId`, `totalUnits`, `startDate`, `allocation_name`, `notes`, `status`, `period`) VALUES
(1, 1, 1200, '2026-01-04', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(2, 2, 1500, '2026-02-01', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(3, 3, 1000, '2026-01-04', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(4, 4, 1000, '2026-01-04', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(5, 5, 1000, '2026-01-04', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(6, 6, 1000, '2026-01-04', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(7, 7, 1500, '2026-01-01', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(8, 9, 1000, '2026-01-09', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(9, 10, 1000, '2026-01-09', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(10, 11, 1000, '2026-01-09', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(11, 12, 1000, '2026-01-09', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(12, 13, 1000, '2026-01-16', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(15, 21, 500, '2026-01-17', 'Monthly Solar Allocation', '', 'ACTIVE', 'Monthly'),
(16, 23, 0, '2026-01-17', 'Monthly Solar Allocation', NULL, 'INACTIVE', 'Monthly'),
(17, 24, 0, '2026-01-17', 'Monthly Solar Allocation', NULL, 'INACTIVE', 'Monthly'),
(18, 25, 0, '2026-01-17', 'Monthly Solar Allocation', NULL, 'INACTIVE', 'Monthly'),
(19, 25, 1500, '2026-01-17', 'Test Solar Allocation', 'E2E Test Allocation', 'ACTIVE', 'Monthly'),
(21, 29, 1200, '2026-01-01', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(22, 30, 1200, '2026-01-01', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly'),
(23, 31, 1200, '2026-01-01', 'Monthly Solar Allocation', NULL, 'ACTIVE', 'Monthly');

-- --------------------------------------------------------

--
-- Table structure for table `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `customerId` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'PENDING',
  `admin_reply` text DEFAULT NULL,
  `reply_at` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `revokedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_tickets`
--

INSERT INTO `support_tickets` (`id`, `customerId`, `subject`, `category`, `description`, `status`, `admin_reply`, `reply_at`, `createdAt`, `updatedAt`, `revokedAt`) VALUES
(1, 7, 'General Question', 'General Question', 'This is a test message. ', 'REVOKED', NULL, NULL, '2026-01-09 09:44:06', '2026-01-26 10:56:10', '2026-01-26 10:56:10'),
(2, 7, 'Consumption Clarification', 'Consumption Clarification', 'This is another test message. ', 'PENDING', NULL, NULL, '2026-01-09 09:48:39', '2026-01-09 09:48:39', NULL),
(3, 7, 'Verification Test Ticket', NULL, 'This is a test ticket to verify the admin module.', 'This is an admin reply.', 'IN_PROGRESS', '2026-01-09 10:51:20', '2026-01-09 10:51:20', '2026-01-09 10:51:20', NULL),
(4, 12, 'General Question', NULL, 'something not working \n', 'This is working now ', 'RESOLVED', '2026-01-12 12:22:14', '2026-01-09 11:26:50', '2026-01-12 12:22:14', NULL),
(5, 7, 'Profile Update Request: Service Address', 'PROFILE_UPDATE_REQUEST', '{\"type\":\"address\",\"current\":{},\"requested\":{\"address1\":\"gh\",\"address2\":\"\",\"city\":\"werty\",\"state\":\"\",\"pin\":\"23456\",\"type\":\"Residential\"},\"reason\":\"wertyu\"}', 'REJECTED', NULL, NULL, '2026-01-10 09:39:29', '2026-01-12 11:11:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ticket_responses`
--

CREATE TABLE `ticket_responses` (
  `id` int(11) NOT NULL,
  `ticketId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `message` text NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ticket_responses`
--

INSERT INTO `ticket_responses` (`id`, `ticketId`, `senderId`, `message`, `createdAt`) VALUES
(1, 3, 8, 'This is an admin reply.', '2026-01-09 10:51:20'),
(2, 5, 8, 'Request Rejected. Reason: sdfghj', '2026-01-12 11:11:57'),
(3, 4, 8, 'This is working now ', '2026-01-12 11:45:39'),
(4, 4, 8, 'This is working now ', '2026-01-12 12:22:14');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `consumerId` varchar(255) DEFAULT NULL,
  `mobileNumber` varchar(20) DEFAULT NULL,
  `address_line_1` varchar(255) DEFAULT NULL,
  `address_line_2` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `pin_code` varchar(20) DEFAULT NULL,
  `location_type` varchar(50) DEFAULT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `alternate_mobile` varchar(20) DEFAULT NULL,
  `preferred_comm` varchar(50) DEFAULT NULL,
  `occupancy_type` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer',
  `isActive` tinyint(1) DEFAULT 1,
  `loginAttempts` int(11) DEFAULT 0,
  `lockUntil` bigint(20) DEFAULT 0,
  `approval_status` varchar(20) DEFAULT 'PENDING',
  `vendor_id` int(11) DEFAULT NULL,
  `onboarding_status` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `rejection_reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fullName`, `email`, `password`, `consumerId`, `mobileNumber`, `address_line_1`, `address_line_2`, `city`, `state`, `pin_code`, `location_type`, `dob`, `gender`, `alternate_mobile`, `preferred_comm`, `occupancy_type`, `role`, `isActive`, `loginAttempts`, `lockUntil`, `approval_status`, `vendor_id`, `onboarding_status`, `createdAt`, `rejection_reason`) VALUES
(1, 'Final Test', 'final@example.com', '$2b$10$Se/BdSAt9t8HvtN9nXDYP.frc2ye4K6t.0rpXvE.M5sMr3rU8QuZq', 'KDIA-FINAL', '0000000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(2, 'Test User', 'test@example.com', '$2b$10$x479NQ0akwOggeqEcvMPMuHkXsrtd0FnwAAZjsCLyXTk9kPsbGlP.', 'KDIA-1767506236325-163', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(3, 'New User', 'test1@example.com', '$2b$10$PziSI0aWMbhrWJkIMGkEQOEdqewTvI6CqdJYDL0R0uQOX0Nyj524S', 'KDIA-1767507858034-801', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 0, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(4, 'Test User', 'test_audit@example.com', '$2b$10$pa5ISkd69CypG.vLL16/CeNoJ43EwyHgxh9GYkAzKD02CqqQUAH0i', 'KDIA-1767508451414-666', '9876543210', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(5, 'Test User', 'test2@example.com', '$2b$10$3Yky5f2lxd/S3hHxj3kbte/dbeV9Wd7G8ZYbM9pIiN6eRDpE1YpQq', 'KDIA-1767508729758-433', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(6, 'Test User', 'test3@example.com', '$2b$10$359NyRAMmdeRohkBpOzL5OIlD3UN.cS699pAjoHF3RowOUFpSnL3K', 'KDIA-1767509884197-277', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(7, 'Test Customer', 'customer@test.com', '$2b$10$ge1xgMB64vHGEB/ZOJl0kO3I/We9jkMizYT55zlj8Wy3fQ7hnvUnC', 'KDIA-TEST-001', '9876543210', '123 Solar Heights', 'Near Wind Farm', 'Clean City', 'Sustainable State', '560001', 'Residential', '1990-05-15', 'Male', '9876543210', NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(8, 'Test Admin', 'admin@test.com', '$2b$10$5CvCs92Jr0PPCBw8701d1ekJkRUW67UmIfhD/JPhFw3Sjfw.yQ0DO', 'KDIA-ADMIN-001', '9876543211', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(9, 'Customer 2 ', 'customer2@test.com', '$2b$10$xVzFatz4AkE53B2KVFoWpe02XK0s5tXd4A25a51JKPkX1tN2xy3b.', 'KDIA-1767934855281-603', '1234567890', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(10, 'Customer 3', 'customer3@test.com', '$2b$10$8AxV/dsE2YRQDK2Ad92aY.hHgFzqTWjPMXXSrVJE77A1EpAi6GVEm', 'KDIA-1767940679324-679', '9876543210', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(11, 'Test User 2', 'test2@test.com', '$2b$10$12j3DQQtRKoZHcrWtYNtR.pldQE.HNjwr7fyIwR3xwwbHVu5LxHzi', 'KDIA-1767952040232-410', '79654231', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(12, 'Test User', 'sandeepbisht1208@gmail.com', '$2b$10$rE7DLLZJOftfPAAQwPjhWO7rxQarn0oR6mdGoBY9n/p41srQoogj6', 'KDIA-1767957930319-31', '8005972692', 'test adress', 'test adress', 'jaipur', 'Delhi', '203012', 'Commercial', '1999-06-16', 'Female', '', 'Email', 'Owner', 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(13, 'Test User', 'test@exmaple.com', '$2b$10$7dZpCY2BtmDno8ZbWH/DfO2oJP4Xpy.Z6H6QJwjZLt.ub.If8jFoW', 'KDIA-1768545250031-935', '9876543210', 'dfbm,mkuyhgrgfd', 'werghfhgku6yth', 'jaipur', 'Delhi', '203012', 'Residential', '2001-06-06', 'Female', '', 'Email', 'Owner', 'customer', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(14, 'Test Vendor', 'vendor@test.com', '$2b$10$Z7IRYx0CQxr.CdaV1libWO4Uig0O9XONECX4yxnzOmnQQUfCzw8GG', 'KDIA-VEND-001', '9876543212', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vendor', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-16 11:49:24', NULL),
(15, 'Pending Vendor', 'pending@test.com', '$2b$10$ZK.MR9Bs65WrcPWpOecuCeCn1OHvMxnok9J.D1T/OsxWbBnzygHgS', 'KDIA-VEND-002', '9876543213', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vendor', 1, 0, 0, 'REJECTED', NULL, NULL, '2026-01-16 11:49:24', 'Insufficient experience'),
(18, 'Test Vendor QA', 'vendor_qa@test.com', '$2b$10$.3WZErPOI0j8OQpxMILEaOh0ThmPTuqRY29oSRTBodSZAyVHJRbuS', 'QA-VND-001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vendor', 1, 1, 0, 'APPROVED', NULL, NULL, '2026-01-17 06:36:42', NULL),
(19, 'TEST_DRAFT_CUSTOMER', 'draft_qa@test.com', '$2b$10$GhC.oJUE6d1iWgHfDBtM9u0o0Ogc1jjvz5da9XbF8vLDfOrx3MHvK', 'QA-CID-DRF', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 0, 0, 0, 'DRAFT', 18, 'COMPLETED', '2026-01-17 06:36:42', NULL),
(20, 'TEST_PENDING_CUSTOMER', 'pending_qa@test.com', '$2b$10$GhC.oJUE6d1iWgHfDBtM9u0o0Ogc1jjvz5da9XbF8vLDfOrx3MHvK', 'QA-CID-PND', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 0, 0, 0, 'PENDING', 18, 'COMPLETED', '2026-01-17 06:36:42', NULL),
(21, 'TEST_APPROVED_CUSTOMER', 'approved_qa@test.com', '$2b$10$GhC.oJUE6d1iWgHfDBtM9u0o0Ogc1jjvz5da9XbF8vLDfOrx3MHvK', 'QA-CID-APP', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 1, 0, 'APPROVED', 18, 'COMPLETED', '2026-01-17 06:36:42', NULL),
(22, 'Test Vendor QA', 'test.vendor.qa@kdia.test', '$2b$10$9TGFSq2PqFADgc2xqgr1lOzhJM59OiKCVbILpexRsmX1gnVC0lN4q', 'KDIA-VENDOR-QA-001', '9999000001', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'vendor', 1, 0, 0, 'APPROVED', NULL, NULL, '2026-01-17 06:54:49', NULL),
(23, 'TEST_DRAFT_CUSTOMER', 'test.draft.customer@kdia.test', '$2b$10$UvRb886FO5E6Ek3co1SWJu0i6bkdUkOAY5H0zYg2hsxmKYAdmTNiK', 'KDIA-TEST-DRAFT-001', '9999000002', '123 Test Street', NULL, 'Test City', 'Test State', '110001', 'Residential', '1990-01-01', 'Other', NULL, NULL, NULL, 'customer', 0, 0, 0, 'DRAFT', 22, 'DRAFT', '2026-01-17 06:54:49', NULL),
(24, 'TEST_PENDING_CUSTOMER', 'test.pending.customer@kdia.test', '$2b$10$xj2r6l0Jv.XL1AZrC3nh6ei8PeM..Cvt55ZXeSrREMVBY/fSBI9lC', 'KDIA-TEST-PENDING-001', '9999000003', '456 Test Avenue', NULL, 'Test City', 'Test State', '110002', 'Residential', '1991-01-01', 'Other', NULL, NULL, NULL, 'customer', 0, 0, 0, 'PENDING', 22, 'PENDING', '2026-01-17 06:54:49', NULL),
(25, 'TEST_APPROVED_CUSTOMER', 'test.approved.customer@kdia.test', '$2b$10$tSiLS0L9.aKovz70fBuOO.zi/XjwTjRqLfGnGDhH31mTaux0cd.w2', 'KDIA-TEST-APPROVED-001', '9999000004', '789 Test Boulevard', NULL, 'Test City', 'Test State', '110003', 'Residential', '1992-01-01', 'Other', NULL, NULL, NULL, 'customer', 1, 2, 0, 'APPROVED', 22, 'APPROVED', '2026-01-17 06:54:49', NULL),
(27, 'Ananya Iyer', 'ananya.i@test.com', '$2b$10$rHXFX3RVb2RTCejpoFimV.2.rUP/v/OTky5GSaEWHtaY5otogAMkS', 'KDIA-CUST-DRF-01', '9822000001', '123 clean energy way', NULL, 'New Delhi', 'Delhi', '110001', NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'DRAFT', 14, 'DRAFT', '2026-01-30 09:14:31', NULL),
(28, 'Kabir Batra', 'kabir.b@test.com', '$2b$10$rHXFX3RVb2RTCejpoFimV.2.rUP/v/OTky5GSaEWHtaY5otogAMkS', 'KDIA-CUST-DRF-02', '9822000002', '123 clean energy way', NULL, 'New Delhi', 'Delhi', '110001', NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'DRAFT', 14, 'DRAFT', '2026-01-30 09:14:31', NULL),
(29, 'Meera Nair', 'meera.n@test.com', '$2b$10$rHXFX3RVb2RTCejpoFimV.2.rUP/v/OTky5GSaEWHtaY5otogAMkS', 'KDIA-CUST-APP-01', '9822000003', '123 clean energy way', NULL, 'New Delhi', 'Delhi', '110001', NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', 14, 'ONBOARDED', '2026-01-30 09:14:31', NULL),
(30, 'Siddharth Bose', 'siddhartha.b@test.com', '$2b$10$rHXFX3RVb2RTCejpoFimV.2.rUP/v/OTky5GSaEWHtaY5otogAMkS', 'KDIA-CUST-APP-02', '9822000004', '123 clean energy way', NULL, 'New Delhi', 'Delhi', '110001', NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', 14, 'ONBOARDED', '2026-01-30 09:14:31', NULL),
(31, 'Zoya Khan', 'zoya.k@test.com', '$2b$10$rHXFX3RVb2RTCejpoFimV.2.rUP/v/OTky5GSaEWHtaY5otogAMkS', 'KDIA-CUST-APP-03', '9822000005', '123 clean energy way', NULL, 'New Delhi', 'Delhi', '110001', NULL, NULL, NULL, NULL, NULL, NULL, 'customer', 1, 0, 0, 'APPROVED', 14, 'ONBOARDED', '2026-01-30 09:14:31', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `adminId` (`adminId`),
  ADD KEY `actionType` (`actionType`),
  ADD KEY `timestamp` (`timestamp`);

--
-- Indexes for table `consumption_logs`
--
ALTER TABLE `consumption_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `month` (`month`);

--
-- Indexes for table `leads`
--
ALTER TABLE `leads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendorId` (`vendorId`),
  ADD KEY `status` (`status`),
  ADD KEY `assignedDate` (`assignedDate`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `status` (`status`);

--
-- Indexes for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customerId` (`customerId`),
  ADD KEY `status` (`status`),
  ADD KEY `category` (`category`);

--
-- Indexes for table `ticket_responses`
--
ALTER TABLE `ticket_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `ticketId` (`ticketId`),
  ADD KEY `createdAt` (`createdAt`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `consumerId` (`consumerId`),
  ADD KEY `role` (`role`),
  ADD KEY `approval_status` (`approval_status`),
  ADD KEY `vendor_id` (`vendor_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `consumption_logs`
--
ALTER TABLE `consumption_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `leads`
--
ALTER TABLE `leads`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `ticket_responses`
--
ALTER TABLE `ticket_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `users` (`id`);

--
-- Constraints for table `consumption_logs`
--
ALTER TABLE `consumption_logs`
  ADD CONSTRAINT `consumption_logs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `leads`
--
ALTER TABLE `leads`
  ADD CONSTRAINT `leads_ibfk_1` FOREIGN KEY (`vendorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`customerId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ticket_responses`
--
ALTER TABLE `ticket_responses`
  ADD CONSTRAINT `ticket_responses_ibfk_1` FOREIGN KEY (`ticketId`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ticket_responses_ibfk_2` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
