CREATE EXTENSION pgcrypto;
INSERT INTO users (first_name, last_name,email,password) VALUES ('dima','fedorenko','dimafedorenko@gmail.com',crypt('zxcasdqwe', gen_salt('bf')));
INSERT INTO users (first_name, last_name,email,password) VALUES ('igor', 'shavlak','igorshavlak8@gmail.com',crypt('zxcasdqwe', gen_salt('bf')));
INSERT INTO users (first_name, last_name,email,password) VALUES ('vlad','kovbasa','vladkovbasa@gmail.com', crypt('zxcasdqwe', gen_salt('bf')));

INSERT INTO authorities (email, authority) VALUES ('igorshavlak8@gmail.com', 'ROLE_ADMIN');
INSERT INTO authorities (email, authority) VALUES ('vladkovbasa@gmail.com', 'ROLE_USER');
INSERT INTO authorities (email, authority) VALUES ('dimafedorenko@gmail.com', 'ROLE_VOLUNTEER');