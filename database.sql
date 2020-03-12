GRANT ALL PRIVILEGES ON datematch.* TO datematch@localhost IDENTIFIED BY 'asdf';

DROP DATABASE IF EXISTS datematch;
CREATE DATABASE datematch;
USE datematch;

CREATE TABLE survey (
    id INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    /* participant_id INT NOT NULL, */

    PRIMARY KEY (id) -- ,
    /* FOREIGN KEY (participant_id) REFERENCES participant(id) */
);

CREATE TABLE available_day (
    id INT AUTO_INCREMENT,
    date DATE NOT NULL,
    survey_id INT NOT NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (survey_id) REFERENCES survey(id)
);

CREATE TABLE picked_day (
    id INT AUTO_INCREMENT,
    date DATE NOT NULL,
    /* participant_id INT NOT NULL, */
    survey_id INT NOT NULL,

    PRIMARY KEY (id),
    /* FOREIGN KEY (participant_id) REFERENCES participant(id), */
    FOREIGN KEY (survey_id) REFERENCES survey(id)
);

/* CREATE TABLE participant (
    id INT AUTO_INCREMENT,

    PRIMARY KEY (id)
); */