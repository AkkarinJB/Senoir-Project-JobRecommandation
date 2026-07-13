-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 13, 2026 at 08:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `JobRecommendationDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `CandidateProfiles`
--

CREATE TABLE `CandidateProfiles` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Skills` longtext NOT NULL,
  `ExpectedSalary` decimal(18,2) NOT NULL,
  `ExperienceYears` int(11) NOT NULL,
  `PreferredLocation` varchar(100) DEFAULT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `CandidateProfiles`
--

INSERT INTO `CandidateProfiles` (`Id`, `UserId`, `FullName`, `Skills`, `ExpectedSalary`, `ExperienceYears`, `PreferredLocation`, `UpdatedAt`) VALUES
(1, 2, 'เอกรินทร์ จูใจบุญ', 'Angular', 30000.00, 1, 'อุดรธานี', '2026-07-14 01:17:04.524339'),
(2, 3, 'อำนวย หัวคาด', 'ล้างจาน', 12000.00, 0, 'อุดรธานี', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `EmployerProfiles`
--

CREATE TABLE `EmployerProfiles` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `CompanyName` varchar(150) NOT NULL,
  `CompanyDescription` longtext DEFAULT NULL,
  `Address` varchar(200) DEFAULT NULL,
  `Website` varchar(100) DEFAULT NULL,
  `IsVerified` tinyint(1) NOT NULL,
  `VerifiedAt` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `JobApplications`
--

CREATE TABLE `JobApplications` (
  `Id` int(11) NOT NULL,
  `JobPostId` int(11) NOT NULL,
  `CandidateProfileId` int(11) NOT NULL,
  `Status` varchar(20) NOT NULL,
  `AppliedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `JobCategories`
--

CREATE TABLE `JobCategories` (
  `Id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `JobCategories`
--

INSERT INTO `JobCategories` (`Id`, `Name`) VALUES
(1, 'ร้านอาหาร'),
(2, 'Software Engineer'),
(3, 'Bussines Analysis'),
(4, 'นักดนตรี'),
(5, 'เเม่บ้านทำความสะอาด'),
(6, 'ครู');

-- --------------------------------------------------------

--
-- Table structure for table `JobPosts`
--

CREATE TABLE `JobPosts` (
  `Id` int(11) NOT NULL,
  `Title` varchar(100) NOT NULL,
  `Description` longtext NOT NULL,
  `CompanyName` longtext NOT NULL,
  `RequiredSkills` longtext NOT NULL,
  `OfferedSalary` decimal(18,2) NOT NULL,
  `Location` varchar(100) NOT NULL,
  `EmployerId` int(11) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `CategoryId` int(11) DEFAULT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  `UpdatedAt` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Message` varchar(500) NOT NULL,
  `Type` varchar(50) NOT NULL,
  `IsRead` tinyint(1) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RefreshTokens`
--

CREATE TABLE `RefreshTokens` (
  `Id` int(11) NOT NULL,
  `UserId` int(11) NOT NULL,
  `Token` varchar(200) NOT NULL,
  `ExpiresAt` datetime(6) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `RevokedAt` datetime(6) DEFAULT NULL,
  `ReplacedByToken` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `RefreshTokens`
--

INSERT INTO `RefreshTokens` (`Id`, `UserId`, `Token`, `ExpiresAt`, `CreatedAt`, `RevokedAt`, `ReplacedByToken`) VALUES
(1, 1, 's56bU5Ytr/SnKH9d3YATyUXO2tIELZrMz5GOahm+f86i8Ir0UI1rEXp7SYvmFfFW8SEhB39FItuKK3hKufHOZw==', '2026-07-18 02:54:19.032804', '2026-07-11 02:54:19.032778', NULL, NULL),
(2, 2, '1LOpJ0LCgZ2Pc2WGvzxeNDindgWBkQOLbzOfCibRZ8fhp5c8QA+YwYRZi/jiCUmBDwn8uRhWvvxoeGWRybMYSQ==', '2026-07-21 01:12:25.716371', '2026-07-14 01:12:25.716344', NULL, NULL),
(3, 3, 'QYqT9hIkWEnDUFk0fg6XJZDyu/zjl3Qwzy0raqzNij7r3tDHaimyxv0nAaPCs9V+d17JzzRrGuYgUFGJkfauOg==', '2026-07-21 01:28:06.146531', '2026-07-14 01:28:06.146526', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `Id` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` longtext NOT NULL,
  `Role` varchar(20) NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `Email` varchar(100) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`Id`, `Username`, `PasswordHash`, `Role`, `CreatedAt`, `Email`) VALUES
(1, 'admin', '$2a$11$TXbS9gxL5HEcinjhanwRU.rvSVCogGZ58chzVIcBqXevLK/Gx.Ft6', 'Admin', '2026-07-11 02:51:50.015337', 'admin@udonthani.link'),
(2, 'akkarin', '$2a$11$Wygrb0PC70WW32lh1scq9.Cs.aSGL4ypIheDQNNrCChOQnbNMRonK', 'JobSeeker', '2026-07-14 01:12:06.614486', 'akkarin@gmail.com'),
(3, 'test', '$2a$11$bAuWSn2XUT7kqGp1euKHnuJfTVxub8c4ypCp7ku8L4ClLkKTqhNf.', 'JobSeeker', '2026-07-14 01:27:38.198166', 'test@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `__EFMigrationsHistory`
--

CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `__EFMigrationsHistory`
--

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES
('20260710150712_InitialCreate', '8.0.28'),
('20260710172741_AddJobPostTable', '8.0.28'),
('20260710175117_AddCandidateProfileTable', '8.0.28'),
('20260710195046_AddEmployerAdminApplicationNotificationFeatures', '8.0.28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `CandidateProfiles`
--
ALTER TABLE `CandidateProfiles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_CandidateProfiles_UserId` (`UserId`);

--
-- Indexes for table `EmployerProfiles`
--
ALTER TABLE `EmployerProfiles`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_EmployerProfiles_UserId` (`UserId`);

--
-- Indexes for table `JobApplications`
--
ALTER TABLE `JobApplications`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_JobApplications_JobPostId_CandidateProfileId` (`JobPostId`,`CandidateProfileId`);

--
-- Indexes for table `JobCategories`
--
ALTER TABLE `JobCategories`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `JobPosts`
--
ALTER TABLE `JobPosts`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Notifications_UserId` (`UserId`);

--
-- Indexes for table `RefreshTokens`
--
ALTER TABLE `RefreshTokens`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_RefreshTokens_Token` (`Token`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `IX_Users_Email` (`Email`),
  ADD UNIQUE KEY `IX_Users_Username` (`Username`);

--
-- Indexes for table `__EFMigrationsHistory`
--
ALTER TABLE `__EFMigrationsHistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `CandidateProfiles`
--
ALTER TABLE `CandidateProfiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `EmployerProfiles`
--
ALTER TABLE `EmployerProfiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `JobApplications`
--
ALTER TABLE `JobApplications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `JobCategories`
--
ALTER TABLE `JobCategories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `JobPosts`
--
ALTER TABLE `JobPosts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `RefreshTokens`
--
ALTER TABLE `RefreshTokens`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
