-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 09, 2026 at 04:13 PM
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
(2, 3, 'อำนวย หัวคาด', 'ล้างจาน', 12000.00, 0, 'อุดรธานี', NULL),
(3, 4, 'เอกรินทร์ จูใจบุญ', 'Angular,DevOps,Html,Typescript', 35000.00, 1, 'อุดรธานี', '2026-07-14 23:57:10.507900'),
(4, 6, 'นายสมชาย ใจดี', 'ขับรถยนต์,นำเสนอสินค้า,เเก้ปัญหาเฉพาะหน้า,ตรงต่อเวลา', 20000.00, 1, 'อุดรธานี', '2026-08-09 19:08:41.808781'),
(5, 18, 'สมชาย ใจดี', 'การบริการลูกค้า, การสื่อสาร, ทำงานเป็นทีม', 12000.00, 1, 'อุดรธานี', NULL),
(6, 19, 'สมหญิง รักเรียน', 'HTML, CSS, JavaScript, Angular, TypeScript, Git', 22000.00, 1, 'อุดรธานี', NULL),
(7, 20, 'ธนกร มั่นคง', 'C#, ASP.NET Core, SQL, MySQL, Git, Docker', 25000.00, 2, 'อุดรธานี', NULL),
(8, 21, 'วิภาวรรณ สวยงาม', 'ตัดผม, ทำสีผม, การบริการลูกค้า', 13000.00, 3, 'อุดรธานี', NULL),
(9, 22, 'ปิยะดา คำนวณดี', 'บัญชี, Excel, การเงิน, ภาษี', 18000.00, 2, 'อุดรธานี', NULL),
(10, 23, 'อนุชา ขับดี', 'ขับรถยนต์ได้, ขับรถบรรทุก, ตรงต่อเวลา', 15000.00, 4, 'อุดรธานี', NULL),
(11, 24, 'กมลชนก ขายเก่ง', 'การนำเสนอสินค้า, การเจรจาต่อรอง, การบริการลูกค้า, Microsoft Excel', 13500.00, 1, 'อุดรธานี', NULL),
(12, 25, 'ณัฐพล ครีเอทีฟ', 'การตลาด, Facebook Ads, Canva, การเขียนคอนเทนต์', 17000.00, 2, 'อุดรธานี', NULL),
(13, 26, 'สุนิสา จัดการดี', 'Microsoft Excel, การจัดการเอกสาร, จัดทำบัญชีเบื้องต้น', 14000.00, 1, 'อุดรธานี', NULL),
(14, 27, 'เอกชัย ข้อมูลดี', 'Excel, MySQL, การจัดการฐานข้อมูล', 15000.00, 2, 'อุดรธานี', NULL);

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

--
-- Dumping data for table `EmployerProfiles`
--

INSERT INTO `EmployerProfiles` (`Id`, `UserId`, `CompanyName`, `CompanyDescription`, `Address`, `Website`, `IsVerified`, `VerifiedAt`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 5, 'บริษัทเคซอฟท์จำกัดมหาชน', 'Software House ที่มากประสบการณ์ในการพัฒนาซอฟต์เเวร์ระดับ Enterpirse ', '41000 จ.อุดรธานี อ.เมือง ซอย ประชาอุทิศ', 'www.ksoft.co.th', 1, '2026-07-14 23:46:55.114492', '2026-07-14 23:42:35.217021', '2026-07-14 23:42:38.378465'),
(2, 7, 'บริษัท เคเคพีเซอร์วิส จำกัด', 'บริการขายเครื่องใช้ไฟฟ้าครบวงจร', 'อุดรธานี', 'www.kkpserivce.co.th', 0, NULL, '2026-08-09 19:12:11.622444', '2026-08-09 19:12:13.373678'),
(3, 8, 'ร้านครัวอีสานอุดร', 'ร้านอาหารอีสานแท้ ให้บริการมากว่า 10 ปี', '123 ถ.โพศรี ต.หมากแข้ง อ.เมือง จ.อุดรธานี', NULL, 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(4, 9, 'บริษัท อุดรไอทีโซลูชั่น จำกัด', 'บริษัทพัฒนาซอฟต์แวร์และเว็บแอปพลิเคชันในภาคอีสาน', '45 ถ.นิตโย ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.udonitsolution.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(5, 10, 'บริษัท โค้ดอุดร ดีเวลลอปเมนท์ จำกัด', 'รับพัฒนาระบบซอฟต์แวร์ให้องค์กรภาครัฐและเอกชน', '78 ถ.อุดรดุษฎี ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.codeudon.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(6, 11, 'ร้านเสริมสวยบิวตี้อุดร', 'ร้านเสริมสวยครบวงจร ตัดผม ทำสี สปา', '22 ถ.ทหาร ต.หมากแข้ง อ.เมือง จ.อุดรธานี', NULL, 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(7, 12, 'บริษัท อุดรบัญชีและภาษี จำกัด', 'ให้บริการด้านบัญชีและภาษีแก่ SME ในพื้นที่', '56 ถ.ประจักษ์ศิลปาคม ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.udonaccount.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(8, 13, 'บริษัท ขนส่งอุดรเอ็กซ์เพรส จำกัด', 'ให้บริการขนส่งสินค้าทั่วภาคอีสาน', '99 ถ.มิตรภาพ ต.หนองบัว อ.เมือง จ.อุดรธานี', NULL, 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(9, 14, 'ห้างสรรพสินค้าอุดรพลาซ่า', 'ห้างสรรพสินค้าครบวงจรใจกลางเมืองอุดรธานี', '200 ถ.โพศรี ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.udonplaza.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(10, 15, 'บริษัท ดิจิทัลมาร์เก็ตติ้ง อุดร จำกัด', 'เอเจนซี่การตลาดออนไลน์ครบวงจร', '33 ถ.ศรีสุข ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.udondigimarketing.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(11, 16, 'โรงพยาบาลอุดรรักษ์', 'โรงพยาบาลเอกชนขนาดกลาง ให้บริการด้านสุขภาพครบวงจร', '11 ถ.รอบเมือง ต.หมากแข้ง อ.เมือง จ.อุดรธานี', 'www.udonrak.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL),
(12, 17, 'บริษัท สมาร์ทฟาร์มอุดรธานี จำกัด', 'พัฒนาเทคโนโลยีเกษตรอัจฉริยะและระบบข้อมูลฟาร์ม', '5 หมู่ 3 ต.นาข่า อ.เมือง จ.อุดรธานี', 'www.smartfarmudon.example.com', 0, NULL, '2026-08-09 19:34:37.000000', NULL);

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

--
-- Dumping data for table `JobApplications`
--

INSERT INTO `JobApplications` (`Id`, `JobPostId`, `CandidateProfileId`, `Status`, `AppliedAt`, `UpdatedAt`) VALUES
(1, 1, 3, 'Applied', '2026-07-14 23:59:32.333209', NULL),
(2, 2, 4, 'Applied', '2026-08-09 19:16:38.421878', NULL);

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
(9, 'งานบัญชี'),
(10, 'งานธุรการ'),
(11, 'งานโฆษณา งานศิลปะ งานสื่อ'),
(12, 'งานธนาคาร'),
(13, 'งานการเงิน'),
(14, 'งานก่อสร้าง'),
(15, 'งานการตลาด'),
(16, 'งานกฏหมาย'),
(17, 'งานราชการ'),
(18, 'งานบริการ งานท่องเที่ยว'),
(19, 'งานขาย'),
(20, 'งานกีฬา งานสันทนาการ');

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

--
-- Dumping data for table `JobPosts`
--

INSERT INTO `JobPosts` (`Id`, `Title`, `Description`, `CompanyName`, `RequiredSkills`, `OfferedSalary`, `Location`, `EmployerId`, `CreatedAt`, `CategoryId`, `IsActive`, `UpdatedAt`) VALUES
(2, 'พนักงานฝ่ายขาย', 'มีใบขับขี่สามารถออกนอกพื้นที่ได้ \n- นำเสนอสินค้า\n- เเละทำยอดขายให้ตรงตามบริษัทคาดหวัง\n\nสวัสดิการ\n-ประกันสังคม\n-ชุดยูนิฟอร์ม\n-วันหยุดตาม ปฏิทิน', 'KKP SERVICE', 'ขับรถยนต์,การเจรจาต่อรอง,word,excel', 22000.00, 'อุดรธานี', 7, '2026-08-09 19:15:21.044917', 13, 1, NULL),
(3, 'พนักงานเสิร์ฟ/บริกร', 'ดูแลลูกค้าหน้าร้าน เสิร์ฟอาหาร จัดโต๊ะ ทำความสะอาดพื้นที่ให้บริการ', 'ร้านครัวอีสานอุดร', 'การบริการลูกค้า, การสื่อสาร, ทำงานเป็นทีม, ขับรถยนต์ได้', 12000.00, 'อุดรธานี', 8, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(4, 'Frontend Developer', 'พัฒนาเว็บแอปพลิเคชันฝั่ง Frontend ด้วย Angular ร่วมกับทีม', 'บริษัท อุดรไอทีโซลูชั่น จำกัด', 'HTML, CSS, JavaScript, Angular, Git', 22000.00, 'อุดรธานี', 9, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(5, 'Backend Developer', 'พัฒนาและดูแลระบบ API ด้วย ASP.NET Core และฐานข้อมูล MySQL', 'บริษัท โค้ดอุดร ดีเวลลอปเมนท์ จำกัด', 'C#, ASP.NET Core, SQL, MySQL, Git', 25000.00, 'อุดรธานี', 10, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(6, 'ช่างเสริมสวย', 'ตัดผม ทำสีผม ให้คำแนะนำลูกค้า ดูแลความสะอาดร้าน', 'ร้านเสริมสวยบิวตี้อุดร', 'ตัดผม, ทำสีผม, การบริการลูกค้า, การขาย', 13000.00, 'อุดรธานี', 11, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(7, 'นักบัญชี', 'จัดทำบัญชีรายรับรายจ่าย ยื่นภาษี ตรวจสอบเอกสารทางการเงิน', 'บริษัท อุดรบัญชีและภาษี จำกัด', 'บัญชี, Excel, การเงิน, ภาษี, การตรวจสอบบัญชี', 18000.00, 'อุดรธานี', 12, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(8, 'พนักงานขับรถส่งของ', 'ขับรถส่งสินค้าตามเส้นทางที่กำหนด ดูแลรักษารถ', 'บริษัท ขนส่งอุดรเอ็กซ์เพรส จำกัด', 'ขับรถยนต์ได้, ขับรถบรรทุก, การวางแผนเส้นทาง, ตรงต่อเวลา', 15000.00, 'อุดรธานี', 13, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(9, 'พนักงานขาย', 'แนะนำสินค้า ปิดการขาย ดูแลความเรียบร้อยของเคาน์เตอร์', 'ห้างสรรพสินค้าอุดรพลาซ่า', 'การนำเสนอสินค้า, การเจรจาต่อรอง, การบริการลูกค้า, Microsoft Excel', 13500.00, 'อุดรธานี', 14, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(10, 'นักการตลาดออนไลน์', 'วางแผนและดูแลแคมเปญโฆษณาออนไลน์ให้ลูกค้า', 'บริษัท ดิจิทัลมาร์เก็ตติ้ง อุดร จำกัด', 'การตลาด, Facebook Ads, Canva, Photoshop, การเขียนคอนเทนต์', 17000.00, 'อุดรธานี', 15, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(11, 'เจ้าหน้าที่ธุรการ', 'จัดการเอกสาร ประสานงานภายในแผนก บันทึกข้อมูลเบื้องต้น', 'โรงพยาบาลอุดรรักษ์', 'จัดทำบัญชีเบื้องต้น, Microsoft Excel, การจัดการเอกสาร, สื่อสารภาษาอังกฤษ', 14000.00, 'อุดรธานี', 16, '2026-08-09 19:34:37.000000', NULL, 1, NULL),
(12, 'เจ้าหน้าที่ข้อมูล (Data Entry / IT Support)', 'บันทึกและดูแลฐานข้อมูลฟาร์ม ช่วยงานด้าน IT เบื้องต้น', 'บริษัท สมาร์ทฟาร์มอุดรธานี จำกัด', 'Excel, การจัดการฐานข้อมูล, MySQL, การพิมพ์ดีด', 15000.00, 'อุดรธานี', 17, '2026-08-09 19:34:37.000000', NULL, 1, NULL);

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

--
-- Dumping data for table `Notifications`
--

INSERT INTO `Notifications` (`Id`, `UserId`, `Message`, `Type`, `IsRead`, `CreatedAt`) VALUES
(1, 5, 'บัญชีบริษัท \"บริษัทเคซอฟท์จำกัดมหาชน\" ของคุณได้รับการยืนยันตัวตนแล้ว', 'EmployerVerified', 0, '2026-07-14 23:46:55.123058'),
(2, 5, 'มีผู้สมัครงานใหม่สำหรับตำแหน่ง \"Software Engineer\"', 'NewApplication', 0, '2026-07-14 23:59:32.350966'),
(3, 7, 'มีผู้สมัครงานใหม่สำหรับตำแหน่ง \"พนักงานฝ่ายขาย\"', 'NewApplication', 0, '2026-08-09 19:16:38.439955');

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
(3, 3, 'QYqT9hIkWEnDUFk0fg6XJZDyu/zjl3Qwzy0raqzNij7r3tDHaimyxv0nAaPCs9V+d17JzzRrGuYgUFGJkfauOg==', '2026-07-21 01:28:06.146531', '2026-07-14 01:28:06.146526', NULL, NULL),
(4, 4, 'T8AyQrNKdwCb+D1oRSmJEvzOqlge8NXaTWFvH/9PQmEHoA/x+RywEu4fD32/qMd5oRDSQysX0Pkq07g3ZrtIsA==', '2026-07-21 21:33:27.316688', '2026-07-14 21:33:27.316662', NULL, NULL),
(5, 1, '/5UCks7q4X+UhhiUoCuITSLh9ZXsJeoCegBKEx1920RSZf7NTBup8nPFtZCuPNjGFHD1msnmLmT+M1+GCZymKw==', '2026-07-21 21:40:45.224652', '2026-07-14 21:40:45.224648', '2026-07-14 22:27:21.664067', 'S8QPQBDPMbsz56A498ou0H+KXlY3vDxvplkuJCpEqv8/TJ/cMmmHFMdOnMg8FxuhKFUZUKgm36xl6jo8HUx03g=='),
(6, 1, 'S8QPQBDPMbsz56A498ou0H+KXlY3vDxvplkuJCpEqv8/TJ/cMmmHFMdOnMg8FxuhKFUZUKgm36xl6jo8HUx03g==', '2026-07-21 22:27:21.664275', '2026-07-14 22:27:21.664274', '2026-07-14 23:18:53.498652', 'eHwHV0SV3IWqt/ZDPKN6923coNt1zvucKo95eK/R2DG/Q7iLyyHeg70lLwgNhFXlwaGUMYtmZF3MWZz8Bo46dg=='),
(7, 1, 'eHwHV0SV3IWqt/ZDPKN6923coNt1zvucKo95eK/R2DG/Q7iLyyHeg70lLwgNhFXlwaGUMYtmZF3MWZz8Bo46dg==', '2026-07-21 23:18:53.498828', '2026-07-14 23:18:53.498827', NULL, NULL),
(8, 5, '6ZPfeIzTHufmyAdqhGQcbJBW7YFQWy21XHoCDmGjDjmWmBTp4rDxa/yWyBh9hMJgExTOjaT1+xlO+v/V6phm5A==', '2026-07-21 23:40:14.133491', '2026-07-14 23:40:14.133484', NULL, NULL),
(9, 4, 'rApwoca+bjfvKlYI53JgVuGTTSF87ypW0fIpIpFa/qSDd2SBoHT/AIqt7pYNKtxMi4qavnt639wEEA9avjIneQ==', '2026-07-21 23:46:22.216995', '2026-07-14 23:46:22.216987', NULL, NULL),
(10, 1, '+Hj+/bAaL3Yi0qPT//jzNFstkJGf6WZIFhpA/qLZMR2zhHVzioZS5m6akRhZ38LQuGi+CeREYFLfIQwVGfk8JA==', '2026-07-21 23:46:45.525146', '2026-07-14 23:46:45.525145', NULL, NULL),
(11, 4, 'A5i1VdsSjQx9x7tNmfkniVe3n5bG+s6rkZI/SDGc+zmRUuqKw8oKn+CLRsI6C8VmLCJnHmPuT1AWWJ3HYBH/YA==', '2026-07-21 23:47:18.475176', '2026-07-14 23:47:18.475174', NULL, NULL),
(12, 1, 'A+IAiyJtA9RFgNQsvvLeLi2MLxz0IR3ySB7nw+DLy3IRiUQ5hOvZrtb+CTzokUffo9VvRmWq/6pf1Uvb5OlG9w==', '2026-07-22 00:01:03.639877', '2026-07-15 00:01:03.639875', NULL, NULL),
(13, 4, '2w5lBzUlGbJtBHUm5iLx+hHFRVkLjiq3QEHRl6220Px29LXmT90atc5ZNLQ+Am5D3aN8A5qN+ZtxkVC3rT6+lA==', '2026-07-22 00:10:06.473641', '2026-07-15 00:10:06.473639', NULL, NULL),
(14, 1, 'CrEhewdyGh38DGrB3OKxiMIrtOG9X7apVYzWx5fce2NRaUl51aoYqybJ4kV2kqW/eEXKTtplEHGmWJkhfsTixQ==', '2026-07-22 00:10:42.922243', '2026-07-15 00:10:42.922241', NULL, NULL),
(15, 4, 'Cj6NXOTLzZSkkdry8hRWixkGlp+mwzMFgrZQ5S0oBC5zVBEDNxYXEWECeK2RmqSSopNR3djktWlnNq0deBppYg==', '2026-07-22 00:11:27.839607', '2026-07-15 00:11:27.839605', NULL, NULL),
(16, 1, 'cYOqGkDGiCrE2rVcYRO3SbLe3Uxj+QeNhbMmpp05XbWB/NafevNdL0KtVaKu12dsrHgeNoDVRoLemzFRKuHXBw==', '2026-08-01 22:11:30.561792', '2026-07-25 22:11:30.561763', '2026-07-25 23:01:14.383178', 'kXcMlvotT7JPxnmX1zuWDkZzqdmd0Uy0liiv4GN68kkrC4brwZDX5qIS95qSfRSKx7S2sckpqe5ChKiYzKdkAw=='),
(17, 1, 'kXcMlvotT7JPxnmX1zuWDkZzqdmd0Uy0liiv4GN68kkrC4brwZDX5qIS95qSfRSKx7S2sckpqe5ChKiYzKdkAw==', '2026-08-01 23:01:14.383562', '2026-07-25 23:01:14.383560', '2026-07-26 02:23:53.509906', 'aaJx3AnhcCTIswDtxvue38FNFJZRkqUbKWnuKPHVVwVoYkAzjziTKEpXYnazH1SJPoiUby0KUilGkOWr+4uhXw=='),
(18, 1, 'aaJx3AnhcCTIswDtxvue38FNFJZRkqUbKWnuKPHVVwVoYkAzjziTKEpXYnazH1SJPoiUby0KUilGkOWr+4uhXw==', '2026-08-02 02:23:53.510081', '2026-07-26 02:23:53.510081', '2026-07-26 04:50:53.726924', 'aVObmr1BMIEhou6kSKmru/oB83VCwlHMaLzKgYLvKp/655+aQKDNTUnGl7TIJhvrBZCnqU4IAab+sHt3EnRFiQ=='),
(19, 1, 'aVObmr1BMIEhou6kSKmru/oB83VCwlHMaLzKgYLvKp/655+aQKDNTUnGl7TIJhvrBZCnqU4IAab+sHt3EnRFiQ==', '2026-08-02 04:50:53.726950', '2026-07-26 04:50:53.726950', '2026-07-27 02:39:44.754043', 'mRcx61mEOCS7N/NzdEL+vDWRTkRi5vNEXjaMrWEWZZTRIDoyWwI8eMZ7biAjLRVlhgfuvs0AeeMNF4LSfxMRGg=='),
(20, 1, 'mRcx61mEOCS7N/NzdEL+vDWRTkRi5vNEXjaMrWEWZZTRIDoyWwI8eMZ7biAjLRVlhgfuvs0AeeMNF4LSfxMRGg==', '2026-08-03 02:39:44.754237', '2026-07-27 02:39:44.754236', NULL, NULL),
(21, 1, '7Bm1+P7yDQoz5CLvgEPEGJmniw+bcCZBrkXH73hX0EqmD/QOPFKu/S8O6nVWCo+TW1r6/Xn8duKjHnhTn9N7Hw==', '2026-08-16 19:03:37.473217', '2026-08-09 19:03:37.473188', NULL, NULL),
(22, 6, 'gUNtsA5GtZ9QEkcPSXOpin/Dx0BjxeNvdXq2FaSfkDQOka4S7McvF7AxgwockxcsMxu6UTGx1NiCe07FHvAr2Q==', '2026-08-16 19:06:51.289382', '2026-08-09 19:06:51.289379', NULL, NULL),
(23, 7, 'A9YsD1GVnV0gLZ/Iavcv6SZBnU1mwy4Qjb9DjMWoLv6GmNwtZWy+zJEvdwVj/GWiPXi8fA+TDwMuMd/b5oeOMQ==', '2026-08-16 19:10:33.692793', '2026-08-09 19:10:33.692789', NULL, NULL),
(24, 6, 'Dg96P+7yOcMMapsw4uKYYIW+lYYoPCQHPvxGnHyKavo6B8YdVyC0lAfQL3fqmsmi76+EDwFKI84GvSYN4n2JXw==', '2026-08-16 19:15:57.326545', '2026-08-09 19:15:57.326543', NULL, NULL),
(25, 7, 'Q8DxW/3CvHbaPNVitftrXjGeKrdlEP6fZvHp3vTrCfBeUul2K/k/lwdujRjhjASme6PVsAcLXPhAzUqVr3AfDw==', '2026-08-16 19:17:11.956515', '2026-08-09 19:17:11.956514', NULL, NULL),
(26, 1, 'dTdaadMa6raqsA+hlEwdxN6oSnKoJv7DOXrBMIbbSxMvyzdLCIug+frnulpkF+UMPPUABkT3f4ZUaPUjBDOlpA==', '2026-08-16 19:34:46.615979', '2026-08-09 19:34:46.615978', NULL, NULL),
(27, 18, 'v0i8OhTfF06XmtK10lsWDtaf8iN0EOH7Qc0Pu42YJUFvsuk2iBGfelOQmKjq4lvPnL7g0+0ijUKn9OACJVPm3A==', '2026-08-16 19:35:33.089130', '2026-08-09 19:35:33.089128', NULL, NULL),
(28, 1, 'RoClDlpalUcEBtp5Hy0MNtMoWpwuSigeA1ujRn3bHNOlyuhpy+Qjl9/3I+db0ZLj0cpQVdGp5ieuJ/LMFssKZw==', '2026-08-16 19:36:56.054144', '2026-08-09 19:36:56.054142', '2026-08-09 20:47:08.458882', 'eT/qrHVC6dXPjSulQ35XUXF1Y6Ac9nOZuLiatTGP474EdTiKlOHp2XuCx4/tZOyvO6CmIHzL5vAVGl5zBlkp4g=='),
(29, 1, 'eT/qrHVC6dXPjSulQ35XUXF1Y6Ac9nOZuLiatTGP474EdTiKlOHp2XuCx4/tZOyvO6CmIHzL5vAVGl5zBlkp4g==', '2026-08-16 20:47:08.459105', '2026-08-09 20:47:08.459104', NULL, NULL);

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
(6, 'somchai01', '$2a$11$nV2lDyBgcQH8HPpcKax9cOai6ma3YzsmBS6Ne1ExnsxgN0saFyan6', 'JobSeeker', '2026-08-09 19:06:31.390296', 'somchai01@gmail.com'),
(7, 'kkpservice01', '$2a$11$5G0JAWrlyR.y6DhLv0HqdO6CG9n9z/y6CJ0pLfYOe0vTO3iNGPBuu', 'Employer', '2026-08-09 19:10:26.328138', 'kkpservice01@gmail.com'),
(8, 'emp_krua01', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'krua.udon@example.com'),
(9, 'emp_itsol02', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'hr@udonitsolution.example.com'),
(10, 'emp_codeudon03', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'hr@codeudon.example.com'),
(11, 'emp_beauty04', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'contact@beautyudon.example.com'),
(12, 'emp_account05', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'info@udonaccount.example.com'),
(13, 'emp_transport06', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'job@udonexpress.example.com'),
(14, 'emp_plaza07', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'hr@udonplaza.example.com'),
(15, 'emp_digimark08', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'hello@udondigimarketing.example.com'),
(16, 'emp_hospital09', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'hr@udonrak.example.com'),
(17, 'emp_smartfarm10', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'Employer', '2026-08-09 19:34:37.000000', 'career@smartfarmudon.example.com'),
(18, 'seeker_somchai01', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'somchai.j@example.com'),
(19, 'seeker_somying02', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'somying.r@example.com'),
(20, 'seeker_thanakorn03', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'thanakorn.m@example.com'),
(21, 'seeker_wipawan04', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'wipawan.s@example.com'),
(22, 'seeker_piyada05', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'piyada.k@example.com'),
(23, 'seeker_anucha06', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'anucha.k@example.com'),
(24, 'seeker_kamonchanok07', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'kamonchanok.k@example.com'),
(25, 'seeker_nattapon08', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'nattapon.c@example.com'),
(26, 'seeker_sunisa09', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'sunisa.j@example.com'),
(27, 'seeker_ekkachai10', '$2b$10$Z0z3CqziqSaZWznrb4064OBl0axSzblBt51AAty7OSrtE1RxXLFFK', 'JobSeeker', '2026-08-09 19:34:37.000000', 'ekkachai.k@example.com');

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
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `EmployerProfiles`
--
ALTER TABLE `EmployerProfiles`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `JobApplications`
--
ALTER TABLE `JobApplications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `JobCategories`
--
ALTER TABLE `JobCategories`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `JobPosts`
--
ALTER TABLE `JobPosts`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `RefreshTokens`
--
ALTER TABLE `RefreshTokens`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
