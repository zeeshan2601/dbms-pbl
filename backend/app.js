const express = require("express");
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  clearStudents,
} = require("./db");

const app = express();
app.use(express.json());

function validateStudent(body) {
  const student = {
    name: typeof body.name === "string" ? body.name.trim() : "",
    email: typeof body.email === "string" ? body.email.trim() : "",
    course: typeof body.course === "string" ? body.course.trim() : "",
    graduation_year: Number(body.graduation_year),
    placement_status: body.placement_status,
    company_name:
      typeof body.company_name === "string" ? body.company_name.trim() : "",
  };

  if (!student.name || !student.email || !student.course) {
    return { error: "Name, email, and course are required." };
  }
  if (!Number.isInteger(student.graduation_year)) {
    return { error: "Graduation year must be a whole number." };
  }
  if (!["Not Placed", "Placed"].includes(student.placement_status)) {
    return { error: "Placement status must be Not Placed or Placed." };
  }
  if (!student.company_name) {
    student.company_name = null;
  }

  return { student };
}

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// GET returns every student so the client can render the records table.
app.get("/api/students", async (req, res, next) => {
  try {
    res.json(await getStudents());
  } catch (error) {
    next(error);
  }
});

// POST validates and creates one student, returning the newly saved record.
app.post("/api/students", async (req, res, next) => {
  const result = validateStudent(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    res.status(201).json(await createStudent(result.student));
  } catch (error) {
    next(error);
  }
});

// PUT replaces the editable fields for an existing student.
app.put("/api/students/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Student id must be a positive integer." });
  }
  const result = validateStudent(req.body || {});
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const student = await updateStudent(id, result.student);
    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
});

// DELETE all student records while keeping the database table.
app.delete("/api/students", async (req, res, next) => {
  try {
    await clearStudents();
    res.json({ message: "All student records cleared." });
  } catch (error) {
    next(error);
  }
});

// DELETE removes a student selected by primary key.
app.delete("/api/students/:id", async (req, res, next) => {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ error: "Student id must be a positive integer." });
  }

  try {
    const deleted = await deleteStudent(id);
    if (!deleted) {
      return res.status(404).json({ error: "Student not found." });
    }
    res.json({ message: "Student deleted." });
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.message && error.message.includes("UNIQUE constraint failed")) {
    return res.status(409).json({ error: "That email address is already in use." });
  }
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error("API request failed:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

module.exports = app;
