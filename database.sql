-- ========================================================
-- STUDENT ATTENDANCE MANAGEMENT SYSTEM
-- B.Tech Final Year Project - MySQL Database Script
-- Database Name: student_attendance_system
-- ========================================================

CREATE DATABASE IF NOT EXISTS `student_attendance_system` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `student_attendance_system`;

-- --------------------------------------------------------
-- Table structure for table `faculty`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `attendance_details`;
DROP TABLE IF EXISTS `attendance`;
DROP TABLE IF EXISTS `students`;
DROP TABLE IF EXISTS `subjects`;
DROP TABLE IF EXISTS `departments`;
DROP TABLE IF EXISTS `faculty`;

CREATE TABLE `faculty` (
  `faculty_id` INT NOT NULL AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(15) DEFAULT NULL,
  `designation` VARCHAR(50) DEFAULT 'Assistant Professor',
  `department` VARCHAR(100) DEFAULT 'Computer Science & Engineering',
  `photo` VARCHAR(255) DEFAULT 'default_avatar.png',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`faculty_id`),
  INDEX `idx_faculty_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `departments`
-- --------------------------------------------------------
CREATE TABLE `departments` (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_code` VARCHAR(20) NOT NULL UNIQUE,
  `department_name` VARCHAR(100) NOT NULL,
  `hod_name` VARCHAR(100) DEFAULT NULL,
  `intake_capacity` INT DEFAULT 120,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `subjects`
-- --------------------------------------------------------
CREATE TABLE `subjects` (
  `subject_id` INT NOT NULL AUTO_INCREMENT,
  `subject_code` VARCHAR(20) NOT NULL UNIQUE,
  `subject_name` VARCHAR(100) NOT NULL,
  `department_id` INT NOT NULL,
  `semester` INT NOT NULL CHECK (`semester` BETWEEN 1 AND 8),
  `credits` INT DEFAULT 4,
  `subject_type` ENUM('Theory', 'Lab', 'Seminar', 'Project') DEFAULT 'Theory',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_subject_dept_sem` (`department_id`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `students`
-- --------------------------------------------------------
CREATE TABLE `students` (
  `student_id` INT NOT NULL AUTO_INCREMENT,
  `roll_number` VARCHAR(30) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `date_of_birth` DATE NOT NULL,
  `department_id` INT NOT NULL,
  `year` VARCHAR(20) NOT NULL, -- e.g., '1st Year', '2nd Year', '3rd Year', '4th Year'
  `semester` INT NOT NULL CHECK (`semester` BETWEEN 1 AND 8),
  `section` VARCHAR(5) NOT NULL DEFAULT 'A',
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone_number` VARCHAR(15) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `parent_name` VARCHAR(100) DEFAULT NULL,
  `parent_phone` VARCHAR(15) DEFAULT NULL,
  `photo` VARCHAR(255) DEFAULT 'default_student.png',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_student_roll` (`roll_number`),
  INDEX `idx_student_filter` (`department_id`, `semester`, `section`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `attendance`
-- --------------------------------------------------------
CREATE TABLE `attendance` (
  `attendance_id` INT NOT NULL AUTO_INCREMENT,
  `department_id` INT NOT NULL,
  `semester` INT NOT NULL,
  `section` VARCHAR(5) NOT NULL,
  `subject_id` INT NOT NULL,
  `faculty_id` INT NOT NULL,
  `attendance_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_attendance_record` (`department_id`, `semester`, `section`, `subject_id`, `attendance_date`),
  FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE,
  FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`faculty_id`) ON DELETE CASCADE,
  INDEX `idx_attendance_date` (`attendance_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `attendance_details`
-- --------------------------------------------------------
CREATE TABLE `attendance_details` (
  `detail_id` INT NOT NULL AUTO_INCREMENT,
  `attendance_id` INT NOT NULL,
  `student_id` INT NOT NULL,
  `status` ENUM('Present', 'Absent', 'Late') NOT NULL DEFAULT 'Present',
  `remarks` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`detail_id`),
  UNIQUE KEY `unique_student_attendance` (`attendance_id`, `student_id`),
  FOREIGN KEY (`attendance_id`) REFERENCES `attendance` (`attendance_id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE,
  INDEX `idx_student_status` (`student_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- SAMPLE DATA INSERTION
-- ========================================================

-- Insert Sample Faculty
INSERT INTO `faculty` (`faculty_id`, `full_name`, `email`, `password_hash`, `phone`, `designation`, `department`) VALUES
(1, 'Dr. Rajesh Sharma', 'rajesh.sharma@college.edu', 'pbkdf2:sha256:260000$saltsample$hashsample123', '+91 9876543210', 'Professor & HOD', 'Computer Science & Engineering'),
(2, 'Prof. Ananya Roy', 'ananya.roy@college.edu', 'pbkdf2:sha256:260000$saltsample$hashsample123', '+91 9876543211', 'Assistant Professor', 'Electronics & Communication Engineering');

-- Insert Sample Departments
INSERT INTO `departments` (`department_id`, `department_code`, `department_name`, `hod_name`, `intake_capacity`) VALUES
(1, 'CSE', 'Computer Science & Engineering', 'Dr. Rajesh Sharma', 180),
(2, 'ECE', 'Electronics & Communication Engineering', 'Dr. Vikram Varma', 120),
(3, 'ME', 'Mechanical Engineering', 'Dr. Suresh Kumar', 90),
(4, 'EEE', 'Electrical & Electronics Engineering', 'Dr. Meena Iyer', 60);

-- Insert Sample Subjects
INSERT INTO `subjects` (`subject_id`, `subject_code`, `subject_name`, `department_id`, `semester`, `credits`, `subject_type`) VALUES
(1, 'CS701', 'Artificial Intelligence & Machine Learning', 1, 7, 4, 'Theory'),
(2, 'CS702', 'Cloud Computing Architecture', 1, 7, 3, 'Theory'),
(3, 'CS703', 'Compiler Design', 1, 7, 4, 'Theory'),
(4, 'CS791', 'AI Lab', 1, 7, 2, 'Lab'),
(5, 'EC701', 'VLSI Design', 2, 7, 4, 'Theory'),
(6, 'EC702', 'Wireless Communication', 2, 7, 3, 'Theory');

-- Insert Sample Students
INSERT INTO `students` (`student_id`, `roll_number`, `full_name`, `gender`, `date_of_birth`, `department_id`, `year`, `semester`, `section`, `email`, `phone_number`, `address`, `parent_name`, `parent_phone`) VALUES
(1, '210101', 'Aarav Patel', 'Male', '2003-05-14', 1, '4th Year', 7, 'A', 'aarav.patel@student.edu', '+91 9123456780', '12 Park Street, Tech Zone, City', 'Ramesh Patel', '+91 9811122233'),
(2, '210102', 'Ananya Deshmukh', 'Female', '2003-08-22', 1, '4th Year', 7, 'A', 'ananya.d@student.edu', '+91 9123456781', '45 Green Park, Block B', 'Suresh Deshmukh', '+91 9811122234'),
(3, '210103', 'Rohan Gupta', 'Male', '2002-11-10', 1, '4th Year', 7, 'A', 'rohan.g@student.edu', '+91 9123456782', '89 Station Road, Sector 4', 'Mahesh Gupta', '+91 9811122235'),
(4, '210104', 'Priya Sharma', 'Female', '2003-02-19', 1, '4th Year', 7, 'A', 'priya.s@student.edu', '+91 9123456783', '102 Lake View Apartments', 'Vinod Sharma', '+91 9811122236'),
(5, '210105', 'Vikram Singh', 'Male', '2003-07-04', 1, '4th Year', 7, 'A', 'vikram.s@student.edu', '+91 9123456784', '56 Civil Lines, City', 'Harpreet Singh', '+91 9811122237'),
(6, '210106', 'Sneha Kulkarni', 'Female', '2003-09-30', 1, '4th Year', 7, 'A', 'sneha.k@student.edu', '+91 9123456785', '77 Ring Road, North Enclave', 'Prakash Kulkarni', '+91 9811122238'),
(7, '210107', 'Aditya Verma', 'Male', '2003-01-15', 1, '4th Year', 7, 'A', 'aditya.v@student.edu', '+91 9123456786', '23 Sunrise Colony', 'Sunil Verma', '+91 9811122239'),
(8, '210108', 'Kavya Nair', 'Female', '2003-12-05', 1, '4th Year', 7, 'A', 'kavya.n@student.edu', '+91 9123456787', '90 Palm Grove Estate', 'Gopal Nair', '+91 9811122240');

-- Insert Sample Attendance Record
INSERT INTO `attendance` (`attendance_id`, `department_id`, `semester`, `section`, `subject_id`, `faculty_id`, `attendance_date`) VALUES
(1, 1, 7, 'A', 1, 1, CURDATE());

-- Insert Sample Attendance Details
INSERT INTO `attendance_details` (`attendance_id`, `student_id`, `status`, `remarks`) VALUES
(1, 1, 'Present', 'On time'),
(1, 2, 'Present', 'On time'),
(1, 3, 'Absent', 'Informed sickness'),
(1, 4, 'Present', 'On time'),
(1, 5, 'Late', '10 mins late'),
(1, 6, 'Present', 'On time'),
(1, 7, 'Present', 'On time'),
(1, 8, 'Absent', 'No intimation');
