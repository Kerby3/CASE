CREATE DATABASE clients;
use clients;

create table clients (
ID INT PRIMARY KEY AUTO_INCREMENT,
FIRST_NAME VARCHAR(25),
SURNAME VARCHAR(25)
);

DELETE FROM clients WHERE ID = 1 OR ID = 2 OR ID = 3 OR ID = 4 OR ID = 6 OR ID = 7;
SELECT * FROM clients;