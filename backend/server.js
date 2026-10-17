const app = require("./app");
const { initializeDatabase } = require("./db");

const port = Number(process.env.PORT) || 3001;

async function startServer() {
  await initializeDatabase();
  app.listen(port, () => {
    console.log(`Student Placement API listening on http://localhost:${port}`);
    console.log("SQLite database: backend/students.sqlite");
  });
}

startServer().catch((error) => {
  console.error("Could not initialize the SQLite database:", error);
  process.exitCode = 1;
});
