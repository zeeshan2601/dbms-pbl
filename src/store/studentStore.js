import { create } from "zustand";
import axios from "axios";

const api = axios.create({ baseURL: "/api" });

function getErrorMessage(error) {
  return error.response?.data?.error || "Could not connect to the server. Please try again.";
}

const useStudentStore = create((set) => ({
  students: [],
  loading: false,
  saving: false,
  error: "",
  success: "",

  fetchStudents: async () => {
    set({ loading: true, error: "", success: "" });
    try {
      const response = await api.get("/students");
      set({ students: response.data, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  addStudent: async (student) => {
    set({ saving: true, error: "", success: "" });
    try {
      const response = await api.post("/students", student);
      set((state) => ({
        students: [response.data, ...state.students],
        saving: false,
        success: "Student added successfully.",
      }));
      return true;
    } catch (error) {
      set({ error: getErrorMessage(error), saving: false });
      return false;
    }
  },

  editStudent: async (id, student) => {
    set({ saving: true, error: "", success: "" });
    try {
      const response = await api.put(`/students/${id}`, student);
      set((state) => ({
        students: state.students.map((current) =>
          current.id === id ? response.data : current,
        ),
        saving: false,
        success: "Student updated successfully.",
      }));
      return true;
    } catch (error) {
      set({ error: getErrorMessage(error), saving: false });
      return false;
    }
  },

  removeStudent: async (id) => {
    set({ error: "", success: "" });
    try {
      await api.delete(`/students/${id}`);
      set((state) => ({
        students: state.students.filter((student) => student.id !== id),
        success: "Student deleted successfully.",
      }));
      return true;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      return false;
    }
  },

  clearStudents: async () => {
    set({ error: "", success: "" });
    try {
      await api.delete("/students");
      set({ students: [], success: "All student records cleared." });
      return true;
    } catch (error) {
      set({ error: getErrorMessage(error) });
      return false;
    }
  },

  clearMessages: () => set({ error: "", success: "" }),
}));

export default useStudentStore;
