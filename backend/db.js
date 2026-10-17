const fs = require("node:fs");
const path = require("node:path");
const initSqlJs = require("sql.js");

const file = process.env.VERCEL
  ? "/tmp/students.sqlite"
  : path.join(__dirname, "students.sqlite");

let databasePromise;

async function getDatabase() {
  if (!databasePromise) {
    databasePromise = (async () => {
      const SQL = await initSqlJs({
        locateFile: (name) => require.resolve(`sql.js/dist/${name}`),
      });
      const db = fs.existsSync(file)
        ? new SQL.Database(fs.readFileSync(file))
        : new SQL.Database();

      // A simple table: each student has an automatically numbered id.
      db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          course TEXT NOT NULL,
          graduation_year INTEGER NOT NULL,
          placement_status TEXT NOT NULL,
          company_name TEXT
        )
      `);
      saveDatabase(db);
      return db;
    })();
  }

  return await databasePromise;
}

function saveDatabase(db) {
  fs.writeFileSync(file, Buffer.from(db.export()));
}

function getRows(db, sql, values = []) {
  const result = db.exec(sql, values)[0];
  if (!result) return [];

  return result.values.map((row) => {
    const student = {};
    result.columns.forEach((column, index) => {
      student[column] = row[index];
    });
    return student;
  });
}

// SELECT all students for the table.
async function getStudents() {
  const db = await getDatabase();
  return getRows(db, "SELECT * FROM students ORDER BY id DESC");
}

// INSERT a student using ? placeholders for its values.
async function createStudent(student) {
  const db = await getDatabase();
  db.run(
    `INSERT INTO students
      (name, email, course, graduation_year, placement_status, company_name)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      student.name,
      student.email,
      student.course,
      student.graduation_year,
      student.placement_status,
      student.company_name,
    ],
  );
  const id = getRows(db, "SELECT last_insert_rowid() AS id")[0].id;
  saveDatabase(db);
  return getRows(db, "SELECT * FROM students WHERE id = ?", [id])[0];
}

// UPDATE one student; return null if the id does not exist.
async function updateStudent(id, student) {
  const db = await getDatabase();
  db.run(
    `UPDATE students
     SET name = ?, email = ?, course = ?, graduation_year = ?,
         placement_status = ?, company_name = ?
     WHERE id = ?`,
    [
      student.name,
      student.email,
      student.course,
      student.graduation_year,
      student.placement_status,
      student.company_name,
      id,
    ],
  );
  if (!db.getRowsModified()) return null;
  saveDatabase(db);
  return getRows(db, "SELECT * FROM students WHERE id = ?", [id])[0];
}

// DELETE one student and report whether it existed.
async function deleteStudent(id) {
  const db = await getDatabase();
  db.run("DELETE FROM students WHERE id = ?", [id]);
  const deleted = db.getRowsModified() > 0;
  if (deleted) saveDatabase(db);
  return deleted;
}

// Remove all student records without deleting the table.
async function clearStudents() {
  const db = await getDatabase();
  db.run("DELETE FROM students");
  saveDatabase(db);
}

module.exports = {
  initializeDatabase: getDatabase,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  clearStudents,
};
