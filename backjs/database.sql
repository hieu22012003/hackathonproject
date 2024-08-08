CREATE DATABASE db;
USE db;


CREATE TABLE people(
    PersonId int PRIMARY KEY AUTO_INCREMENT,
    Username TEXT NOT NULL,
    Pass TEXT NOT NULL,
    User_Data TEXT,
    Number_Of_Test int,
    Avg_Score int,
    Max_Score int,
);
