    create table users
    (
        id       SERIAL PRIMARY KEY,
        email    VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100)        NOT NULL
    );
    create table authorities
    (
        email     VARCHAR(50),
        authority VARCHAR(50) NOT NULL,
        FOREIGN KEY (email) REFERENCES users (email)
    );

    create table refugees
    (
        user_id      INT NOT NULL,
        first_name   VARCHAR(50),
        last_name    VARCHAR(50),
        birth_date   DATE,
        status       VARCHAR(20),
        phone_number VARCHAR(50),
        city         VARCHAR(50),
        country      VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    create table applications
    (
        id              SERIAL PRIMARY KEY,
        user_id         INT         NOT NULL,
        volunteer_id    INT,
        type            VARCHAR(100),
        description     TEXT,
        additional_data VARCHAR(200),
        status          VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
        created_at      TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (volunteer_id) REFERENCES users (id) ON DELETE CASCADE

    );
    create table messages
    (
        id      SERIAL PRIMARY KEY,
        user_id INT NOT NULL,

        content TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,

    );
    create table volunteer
    (
        user_id              INT NOT NULL,
        first_name           VARCHAR(50),
        last_name            VARCHAR(50),
        birth_date           DATE,
        skills_or_experience TEXT,
        phone_number         VARCHAR(50),
        city                 VARCHAR(50),
        country              VARCHAR(50),
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );
    create table chat
    (
        id           SERIAL PRIMARY KEY,
        volunteer_id INT NOT NULL,
        refugee_id   INT NOT NULL,
        FOREIGN KEY (volunteer_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (refugee_id) REFERENCES users (id) ON DELETE CASCADE

    );
    create table chat_messages
    (
        chat_id    INT NOT NULL,
        message_id INT NOT NULL,
        FOREIGN KEY (chat_id) REFERENCES chat (id) ON DELETE CASCADE,
        FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE
    )