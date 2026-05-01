const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

function runScript(db, script) {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

describe('the SQL UPDATE command in the `exercise.sql` file', () => {
  let db;
  let scriptPath;

  beforeAll(async () => {
    const dbPath = path.resolve(__dirname, '..', 'lesson28.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');

    await new Promise((resolve, reject) => {
      const sql = `UPDATE Employee SET NAME = 'John Doe', SALARY = 1000, LOCATION = 'Old Location', DATE_OF_BIRTH = '1990-01-01', EDUCATION = 'Bachelor' WHERE ID = 1017;`;
      db.exec(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });

  afterAll(() => {
    db.close();
  });

  test('Should correctly update the employee with ID 1017.', async () => {
    await runScript(db, scriptPath);

    const updatedEmployee = await new Promise((resolve, reject) => {
      db.get("SELECT NAME, SALARY, LOCATION, DATE_OF_BIRTH, EDUCATION FROM Employee WHERE ID = 1017", (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    expect(updatedEmployee).toEqual({
      NAME: 'Thomas',
      SALARY: 1212,
      LOCATION: 'New York',
      DATE_OF_BIRTH: '1975-11-08',
      EDUCATION: 'Masters'
    });
  });
});
