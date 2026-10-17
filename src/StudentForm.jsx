import { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  course: "",
  graduation_year: "",
  placement_status: "Not Placed",
  company_name: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

function Field({ label, name, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700" htmlFor={name}>
      {label}
      {children}
    </label>
  );
}

export default function StudentForm({ student, saving, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    setForm(
      student
        ? {
            name: student.name,
            email: student.email,
            course: student.course,
            graduation_year: String(student.graduation_year),
            placement_status: student.placement_status,
            company_name: student.company_name || "",
          }
        : emptyForm,
    );
  }, [student]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit({
      ...form,
      graduation_year: Number(form.graduation_year),
      company_name: form.company_name.trim() || null,
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student name" name="name">
          <input
            className={inputClass}
            id="name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="e.g. Aisha Khan"
            maxLength={100}
            required
          />
        </Field>
        <Field label="Email address" name="email">
          <input
            className={inputClass}
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="aisha@example.com"
            maxLength={254}
            required
          />
        </Field>
        <Field label="Course" name="course">
          <input
            className={inputClass}
            id="course"
            name="course"
            value={form.course}
            onChange={updateField}
            placeholder="e.g. Computer Science"
            maxLength={100}
            required
          />
        </Field>
        <Field label="Graduation year" name="graduation_year">
          <input
            className={inputClass}
            id="graduation_year"
            name="graduation_year"
            type="number"
            min="1900"
            max="2200"
            step="1"
            value={form.graduation_year}
            onChange={updateField}
            placeholder="e.g. 2026"
            required
          />
        </Field>
        <Field label="Placement status" name="placement_status">
          <select
            className={inputClass}
            id="placement_status"
            name="placement_status"
            value={form.placement_status}
            onChange={updateField}
          >
            <option>Not Placed</option>
            <option>Placed</option>
          </select>
        </Field>
        <Field label="Company name (optional)" name="company_name">
          <input
            className={inputClass}
            id="company_name"
            name="company_name"
            value={form.company_name}
            onChange={updateField}
            placeholder="e.g. Acme Inc."
            maxLength={100}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <button
          className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          className="rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : student ? "Save changes" : "Add student"}
        </button>
      </div>
    </form>
  );
}
