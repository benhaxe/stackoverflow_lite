import { Pool } from 'pg';

/*
  Get the variable
 */
const {
  DB_PASS,
} = process.env;

/*
 This class is created to help us abstract the code for querying the database;
 */
class QueryHelper {
  // It take the db table name and the connection pool as parameters
  constructor(tableName, pool) {
    this.tableName = tableName;
    this.pool = pool;
    this.query = pool.query.bind(pool);
  }

  /*
      This method is used for selecting information from the db
   */
  async find(obj) {
    let query = `select * from ${this.tableName} `;
    let result;
    /*
      Loopng through an Object
     */
    Object.entries(obj).forEach((entry) => {
      if (entry[0] === 'where') {
        query += 'where ';
        // Looping through the value of where which is also an object
        Object.keys(entry[1]).forEach((key) => {
          query += `${key}='${entry[1][key]}' AND `;
        });
        query = query.replace(/and $/i, ' ');
      } else if (entry[0] === 'order') {
        query += `order by ${entry[1].join(' ')} `;
      } else {
        query += `${entry[0]} ${entry[1]} `;
      }
    });
    query = query.replace(/where *$/i, ';');
    try {
      result = await this.pool.query(query);
    } catch (e) {
      return Promise.reject(e);
    }

    return result.rows;
  }

  /*
      For selecting only one document from the database
   */
  async findOne(obj) {
    let result;
    // Add a new property to our obj
    const newObj = Object.assign({}, obj, { limit: 1 });
    try {
      // Maakes use of our find method underneath
      result = await this.find(newObj);
    } catch (e) {
      return Promise.reject(e);
    }
    return result[0];
  }

  // For storing information
  async create(obj) {
    let result;
    let keys = '';
    let values = '';
    /*
      Looping through an object
     */
    Object.keys(obj).forEach((key) => {
      keys += `${key},`;
      values += `'${obj[key]}',`;
    });
    keys = keys.replace(/,$/, '');
    values = values.replace(/,$/, '');
    const query = `insert into ${this.tableName}(${keys}) values(${values})`;
    try {
      await this.pool.query(query);
      result = await this.findOne({ where: obj, order: ['id', 'DESC'] });
    } catch (err) {
      return Promise.reject(err);
    }

    return Promise.resolve(result);
  }

  // For updating values  stored in the db
  async update(condition, queryObj) {
    const where = condition.where || false;
    let query = `UPDATE ${this.tableName} SET `;
    if (!queryObj || Object.keys(queryObj).length === 0) {
      const error = new Error('data object must be present');
      return Promise.reject(error);
    }
    Object.keys(queryObj).forEach((key) => {
      query += `${key} = '${queryObj[key]} ',`;
    });
    query = query.replace(/,$/, '');
    if (where) {
      const keys = Object.keys(where);
      query += `where ${keys[0]} = '${where[keys[0]]}'`;
    }
    let result;
    try {
      result = await this.pool.query(query);
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(result);
  }

  // For removing only one item from the database
  async deleteOne(obj) {
    let query = `delete from ${this.tableName} `;
    let result;
    Object.entries(obj).forEach((entry) => {
      if (entry[0] !== 'where') {
        const error = new Error('Where clause must be provided');
        return Promise.reject(error);
      }
      query += 'where ';
      Object.keys(entry[1]).forEach((key) => {
        query += `${key}='${entry[1][key]}' AND `;
      });
      query = query.replace(/and $/i, ' ');
    });
    // remove the ending where if no value is passed for the where paraneter
    query = query.replace(/where *$/i, ';');
    try {
      result = await this.pool.query(query);
    } catch (e) {
      return Promise.reject(e);
    }

    return result.rows;
  }

  // For deleting all rows in the specified database table
  async delete() {
    let result;
    const query = `delete from ${this.tableName};`;
    try {
      result = await this.pool.query(query);
    } catch (e) {
      return Promise.reject(e);
    }

    return result.rows;
  }
}

/*
    This class  is used to handle our database connection logic
 */
class Model {
  constructor() {
    this.tableName = [];
    this.queries = [];
    // create connection
    this.pool = new Pool({
      host: 'localhost',
      user: 'postgres',
      database: 'stackoverflow',
      password: DB_PASS,
      idleTimeoutMillis: 10000,
      max: 10,
    });
  }

  // This method is called to connect to the db
  connect() {
    return this.pool.connect();
  }

  // This method is used for storing db table creation code
  model(name, query) {
    this.queries.push({ name, query });
    return new QueryHelper(name, this.pool);
  }

  // This method help in executing our stored table code and thus create db tables
  sync() {
    let tables = '';
    let tableNames = '';
    this.queries.forEach((queryObj) => {
      const { query, name } = queryObj;
      tables += `${query};`;
      tableNames += `${name}, `;
    });

    this.pool.query(tables)
      .then(() => console.log(`table ${tableNames} created successfully`))
      .catch(err => console.log('unable to create tables', err));
  }
}
export default new Model();
