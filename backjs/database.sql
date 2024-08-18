CREATE DATABASE db 
USE db 

CREATE TABLE people(
    PersonId int PRIMARY KEY AUTO_INCREMENT,
    Username TEXT NOT NULL,
    Pass TEXT NOT NULL,
    Email TEXT NOT NULL
)

CREATE TABLE userData(
    DataId int PRIMARY KEY AUTO_INCREMENT,
    PersonId int,
    User_Data TEXT,
    Score int,
    Number_Of_Question int,
    Correct_Questions int,
    User_Question text,
    AI_Res text
)