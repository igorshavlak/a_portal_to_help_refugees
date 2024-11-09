CREATE EXTENSION pgcrypto;
INSERT INTO users (email,password) VALUES ('dimafedorenko@gmail.com',crypt('zxcasdqwe', gen_salt('bf')));
INSERT INTO users (email,password) VALUES ('igorshavlak8@gmail.com',crypt('zxcasdqwe', gen_salt('bf')));
INSERT INTO users (email,password) VALUES ('vladkovbasa@gmail.com', crypt('zxcasdqwe', gen_salt('bf')));

INSERT INTO authorities (email, authority) VALUES ('igorshavlak8@gmail.com', 'ROLE_ADMIN');
INSERT INTO authorities (email, authority) VALUES ('vladkovbasa@gmail.com', 'ROLE_USER');
INSERT INTO authorities (email, authority) VALUES ('dimafedorenko@gmail.com', 'ROLE_VOLUNTEER');

INSERT INTO refugees (user_id,first_name,last_name,birth_date,status,phone_number,city,country) VALUES (3,'Влад','Ковбаса','2003-01-01','confirmed','+3805323435','Черкаси','Україна');
INSERT INTO volunteer (user_id,first_name,last_name,birth_date,status,phone_number,city,country) VALUES (1,'Діма','Федоренко','2003-01-01','немає','+380536231','Черкаси','Україна');