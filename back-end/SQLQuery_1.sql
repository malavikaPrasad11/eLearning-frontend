CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(100),
    email NVARCHAR(100) UNIQUE,
    phone NVARCHAR(15),
    password_hash NVARCHAR(255),
    role NVARCHAR(20) DEFAULT 'student',
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Courses (
    course_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200),
    category NVARCHAR(100),
    description NVARCHAR(MAX),
    image_url NVARCHAR(500),
    video_url NVARCHAR(500),
    price DECIMAL(10,2),
    total_students INT DEFAULT 0,
    duration NVARCHAR(50),
    created_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Enrollments (
    enrollment_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    course_id INT FOREIGN KEY REFERENCES Courses(course_id),
    enrolled_at DATETIME DEFAULT GETDATE(),
    payment_status NVARCHAR(20) DEFAULT 'pending'
);
