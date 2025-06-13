-- RESETTING the DB if u run out of tables while testing (U can mark the orders ready also on UI to avoid this)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE orders;
TRUNCATE TABLE order_item; 
TRUNCATE TABLE tables;
insert into tables(table_id, isAvailable) values(1,1),(2,1), (3,1),(4,1), (5,1),(6,1),(7,1),(8,1), (9,1),(10,1), (11,1),(12,1);
SET FOREIGN_KEY_CHECKS = 1;