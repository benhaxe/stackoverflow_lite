import db from '../../config/db/psql';
/*
    Database code for storing users informations. it stores the name, email and password of a user
*/
exports.UserModel = db.model('users', `CREATE TABLE IF NOT EXISTS USERS(
  ID SERIAL PRIMARY KEY,
  NAME VARCHAR(255),
  EMAIL VARCHAR(255) NOT NULL UNIQUE,
  CREATED_AT TIMESTAMP DEFAULT NOW(),
  PASSWORD VARCHAR(255) NOT NULL
 )`);


// Exectute our database command
db.sync();
