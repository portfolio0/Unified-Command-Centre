import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    body: "",
    language: "",
    variables: "",
  });

  // =====================
  // LOAD TEMPLATES
  // =====================
  const loadTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // =====================
  // SAFE JSON PARSER
  // =====================
  const parseVariables = () => {
    if (!form.variables.trim()) return null;

    try {
      return JSON.parse(form.variables);
    } catch {
      alert(
        'Variables must be valid JSON.\nExample:\n{ "name": "", "date": "" }'
      );
      return "__INVALID__";
    }
  };

  // =====================
  // SAVE / UPDATE
  // =====================
  const saveTemplate = async () => {
    if (!form.title || !form.body || !form.language) {
      alert("Please fill all required fields");
      return;
    }

    const parsedVariables = parseVariables();
    if (parsedVariables === "__INVALID__") return;

    const payload = {
      title: form.title,
      body: form.body,
      language: form.language,
      variables: parsedVariables,
    };

    if (editingId) {
      await api.put(`/templates/${editingId}`, payload);
      setEditingId(null);
    } else {
      await api.post("/templates", payload);
    }

    setForm({
      title: "",
      body: "",
      language: "",
      variables: "",
    });

    loadTemplates();
  };

  // =====================
  // DELETE
  // =====================
  const deleteTemplate = async (id) => {
    if (!confirm("Delete this template?")) return;
    await api.delete(`/templates/${id}`);
    loadTemplates();
  };

  // =====================
  // EDIT
  // =====================
  const editTemplate = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      body: t.body,
      language: t.language,
      variables: t.variables ? JSON.stringify(t.variables, null, 2) : "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      body: "",
      language: "",
      variables: "",
    });
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl md:text-3xl font-semibold">Templates</h1>

      {/* ================= FORM ================= */}
      <div className="bg-white p-4 md:p-6 rounded shadow max-w-2xl">
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          {editingId ? "Edit Template" : "Create Template"}
        </h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Template Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="border p-2 w-full mb-3"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        >
          <option value="">Select Language</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Kannada</option>
          <option>Nepali</option>
        </select>

        <textarea
          className="border p-2 w-full mb-3 h-28"
          placeholder="Message body (use {name}, {date})"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-4 h-24 font-mono text-sm"
          placeholder={`Variables (JSON)\nExample:\n{\n  "name": "",\n  "date": ""\n}`}
          value={form.variables}
          onChange={(e) => setForm({ ...form, variables: e.target.value })}
        />

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={saveTemplate}
            className="bg-blue-600 text-white px-5 py-2 rounded"
          >
            {editingId ? "Update Template" : "Save Template"}
          </button>

          {editingId && (
            <button onClick={cancelEdit} className="border px-5 py-2 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {templates.map((t) => (
          <div key={t.id} className="bg-white shadow rounded p-4 space-y-2">
            <h3 className="font-semibold text-lg">{t.title}</h3>
            <p className="text-sm text-gray-600">Language: {t.language}</p>

            <p className="text-sm break-words">
              <span className="font-medium">Variables:</span>{" "}
              {t.variables ? JSON.stringify(t.variables) : "None"}
            </p>

            <div className="flex gap-3 pt-2">
              <button onClick={() => editTemplate(t)} className="text-blue-600">
                Edit
              </button>
              <button
                onClick={() => deleteTemplate(t.id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <p className="text-center text-gray-400">No templates created yet</p>
        )}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Language</th>
              <th className="p-3 text-left">Variables</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="p-3">{t.title}</td>
                <td className="p-3">{t.language}</td>
                <td className="p-3 text-sm text-gray-600">
                  {t.variables ? JSON.stringify(t.variables) : "None"}
                </td>
                <td className="p-3 space-x-4">
                  <button
                    onClick={() => editTemplate(t)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTemplate(t.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {templates.length === 0 && (
              <tr>
                <td colSpan="4" className="p-5 text-center text-gray-400">
                  No templates created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
