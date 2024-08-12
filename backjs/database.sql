CREATE DATABASE db;
USE db;


CREATE TABLE people(
    PersonId int PRIMARY KEY AUTO_INCREMENT,
    Username TEXT NOT NULL,
    Pass TEXT NOT NULL
);

CREATE TABLE userData(
    PersonId int PRIMARY KEY,
    User_Data TEXT,
    Score int,
    Number_Of_Question int,
    Correct_Questions int
);