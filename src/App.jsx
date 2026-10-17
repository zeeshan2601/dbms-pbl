import { useEffect, useState } from "react";
import StudentForm from "./StudentForm";
import useStudentStore from "./store/studentStore";

function StatusBadge({ status }) {
  const placed = status === "Placed";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        placed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${placed ? "bg-emerald-500" : "bg-amber-500"}`} />
      {status}
    </span>
  );
}

function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
          <span className="text-xl font-semibold">+</span>
        </div>
        <h3 className="font-semibold text-slate-800">No students yet</h3>
        <p className="mt-1 text-sm text-slate-500">Add your first student to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-6 py-3.5 font-semibold">Student</th>
            <th className="px-6 py-3.5 font-semibold">Course</th>
            <th className="px-6 py-3.5 font-semibold">Graduation</th>
            <th className="px-6 py-3.5 font-semibold">Status</th>
            <th className="px-6 py-3.5 font-semibold">Company</th>
            <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {students.map((student) => (
            <tr className="transition hover:bg-slate-50/70" key={student.id}>
              <td className="px-6 py-4">
                <div className="font-semibold text-slate-800">{student.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">{student.email}</div>
              </td>
              <td className="px-6 py-4 text-slate-600">{student.course}</td>
              <td className="px-6 py-4 text-slate-600">{student.graduation_year}</td>
              <td className="px-6 py-4"><StatusBadge status={student.placement_status} /></td>
              <td className="px-6 py-4 text-slate-600">{student.company_name || "—"}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    className="font-semibold text-blue-700 hover:text-blue-900"
                    type="button"
                    onClick={() => onEdit(student)}
                    aria-label={`Edit ${student.name}`}
                  >
                    Edit
                  </button>
                  <button
                    className="font-semibold text-rose-600 hover:text-rose-800"
                    type="button"
                    onClick={() => onDelete(student)}
                    aria-label={`Delete ${student.name}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const {
    students,
    loading,
    saving,
    error,
    success,
    fetchStudents,
    addStudent,
    editStudent,
    removeStudent,
    clearStudents,
    clearMessages,
  } = useStudentStore();
  const [editingStudent, setEditingStudent] = useState(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  function openAddForm() {
    clearMessages();
    setEditingStudent(null);
    setFormOpen(true);
  }

  function openEditForm(student) {
    clearMessages();
    setEditingStudent(student);
    setFormOpen(true);
  }

  async function handleSubmit(student) {
    const saved = editingStudent
      ? await editStudent(editingStudent.id, student)
      : await addStudent(student);
    if (saved) {
      setFormOpen(false);
      setEditingStudent(null);
    }
  }

  async function handleDelete(student) {
    if (window.confirm(`Delete ${student.name}'s record? This cannot be undone.`)) {
      await removeStudent(student.id);
    }
  }

  async function handleClearStudents() {
    if (
      window.confirm(
        `Clear all ${students.length} student records? This cannot be undone.`,
      )
    ) {
      await clearStudents();
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              STUDENT RECORDS
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Placement manager
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Keep student details and placement outcomes organized in one simple place.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            type="button"
            onClick={openAddForm}
          >
            <span className="text-lg leading-none">+</span>
            Add student
          </button>
        </header>

        {(error || success) && (
          <div
            className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
            role="status"
          >
            {error || success}
          </div>
        )}

        {formOpen && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {editingStudent ? "Edit student" : "Add a student"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Enter the student's placement record below.</p>
            </div>
            <StudentForm
              student={editingStudent}
              saving={saving}
              onSubmit={handleSubmit}
              onCancel={() => {
                setFormOpen(false);
                setEditingStudent(null);
              }}
            />
          </section>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="font-bold text-slate-900">All students</h2>
              <p className="mt-1 text-sm text-slate-500">
                {students.length} {students.length === 1 ? "record" : "records"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 sm:block">
                {loading ? "Loading..." : "Placement records"}
              </div>
              <button
                className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={handleClearStudents}
                disabled={loading || students.length === 0}
              >
                Clear database
              </button>
            </div>
          </div>
          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-slate-500" role="status">
              Loading student records...
            </div>
          ) : (
            <StudentTable students={students} onEdit={openEditForm} onDelete={handleDelete} />
          )}
        </section>

        <footer className="mt-5 text-center text-xs text-slate-500">
          A small DBMS learning project · Student records are stored locally in SQLite
        </footer>
      </div>
    </main>
  );
}
