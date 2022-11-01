Database table structure:-

Tables name:-
1>users:-To store data related to user registeration
2>user_session:-To store data related to the user login user_session
3>power_usage:-This method is to keep track of user power usage

Please use below query to create the tables:-
1>
create table users(DisplayName varchar(30),UserName varchar(40) unique,
EmailId varchar(40) unique,
MobileNumber varchar(10) unique,Password varchar(40),
UUID varchar(40) primary key);
2>
create table user_session(user_session_id int auto_increment primary key,
UUID varchar(40),login_date datetime,app_name varchar(600),
jwttoken varchar(700));

3>
create table power_usage(pu_id int auto_increment primary key,UUID varchar(50),
fromTime datetime,toTime datetime,duration int,
unitConsumed int,appliance varchar(100));

----------------------------------------------------------------------------------------------------------
Flow of the application:-
app.js--->This is the main file the execution starts
app.js--calls-->user.router.js
user.router.js-----calls---->user.controller.js and pass token_validation.js (as a middleware to authenticate each api)
user.controller.js---calls---->user.service.js(In this file main business logic is written this interate with database.js for database details)
AppError class is used to pass custom exception message
-----------------------------------------------------------------------------------------------------------

