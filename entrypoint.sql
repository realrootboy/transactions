/* create ignite and ignite_test if they don't exist */
CREATE DATABASE if not exists ignite;
CREATE DATABASE if not exists ignite_test;
/* create a ignite user */
GRANT ALL PRIVILEGES ON ignite.* TO 'ignite'@'%' IDENTIFIED BY 'ignite';
GRANT ALL PRIVILEGES ON ignite_test.* TO 'ignite_test'@'%' IDENTIFIED BY 'ignite_test';
/* root protection */
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');
/* flush privileges */
FLUSH PRIVILEGES;