import db from '../../config/db/psql';
/*
    Database code for storing users informations. it stores the name, email and password of a user
*/
export const UserModel = db.model('users', `CREATE TABLE IF NOT EXISTS USERS(
  ID SERIAL PRIMARY KEY,
  NAME VARCHAR(255),
  EMAIL VARCHAR(255) NOT NULL UNIQUE,
  CREATED_AT TIMESTAMP DEFAULT NOW(),
  PASSWORD VARCHAR(255) NOT NULL
 )`);

/*
  Database code for storing questions posted by the user. It stores, the question,
   and the id of the creator of the question.
  */
export const QuestionModel = db.model('questions', `CREATE TABLE IF NOT EXISTS QUESTIONS(
  ID SERIAL PRIMARY KEY,
  QUESTION VARCHAR NOT NULL,
  USERID INT,
  CREATED_AT TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (USERID) REFERENCES USERS(ID) ON DELETE CASCADE 
 )`);

/*
Database code for storing answers to questions. It stores the answer,
number of upvote and downvote, and wether the answer is accepted or not
 */
export const AnswerModel = db.model('answers', `CREATE TABLE IF NOT EXISTS ANSWERS(
  ID SERIAL PRIMARY KEY,
  ANSWER VARCHAR NOT NULL,
  ACCEPTED BOOLEAN DEFAULT FALSE,
  UPVOTE INT DEFAULT 0,
  DOWNVOTE INT DEFAULT 0,
  CREATED_AT TIMESTAMP DEFAULT NOW(),
  USERID INT REFERENCES USERS(ID) ON DELETE CASCADE,
  QUESTIONID INT REFERENCES QUESTIONS(ID) ON DELETE CASCADE
 )`);

/*
    Databae code for storing user comments on an answer. It stores the comment,
    the id of the question and answer and the id of the person that post the comment
 */
export const CommentModel = db.model('comments', `CREATE TABLE IF NOT EXISTS COMMENTS(
  ID SERIAL PRIMARY KEY,
  COMMENT TEXT NOT NULL,
  CREATED_AT TIMESTAMP DEFAULT NOW(),
  USERID INT REFERENCES USERS(ID) ON DELETE CASCADE,
  ANSWERID INT REFERENCES ANSWERS(ID) ON DELETE CASCADE
 )`);

// Exectute our database command
db.sync();
