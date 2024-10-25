create table users
(
    id         SERIAL PRIMARY KEY,
    first_name VARCHAR(50)         NOT NULL,
    last_name  VARCHAR(50)         NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(100)        NOT NULL
);
create table authorities
(
    email VARCHAR(50),
    authority VARCHAR(50) NOT NULL,
    FOREIGN KEY (email) REFERENCES users(email)
);

create table refugees
(
    id            SERIAL PRIMARY KEY,
    user_id       INT NOT NULL,
    nationality   VARCHAR(50),
    date_of_birth DATE,
    gender        VARCHAR(10),
    contact_info  VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
create table applications
(
    id              SERIAL PRIMARY KEY,
    refugee_id      INT NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status          VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    description     TEXT,
    FOREIGN KEY (refugee_id) REFERENCES Refugees (id) ON DELETE CASCADE
);