import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [form, setForm] = useState({
    title: "",
    body: "",
    language: "",
    variables: "",
  });

  const [editingId, setEditingId] = useState(null);

  // Load Templates
  const loadTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      await loadTemplates();
    };
    fetchTemplates();
  }, []);

  // Add or Update Template
  const saveTemplate = async () => {
    if (!form.title || !form.body || !form.language) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      title: form.title,
      body: form.body,
      language: form.language,
      variables: form.variables ? JSON.parse(form.variables) : null,
    };

    if (editingId) {
      await api.put(`/templates/${editingId}`, payload);
      setEditingId(null);
    } else {
      await api.post("/templates", payload);
    }

    setForm({ title: "", body: "", language: "", variables: "" });
    loadTemplates();
  };

  // Delete Template
  const deleteTemplate = async (id) => {
    await api.delete(`/templates/${id}`);
    loadTemplates();
  };

  // Edit Template (fill form)
  const editTemplate = (t) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      body: t.body,
      language: t.language,
      variables: t.variables ? JSON.stringify(t.variables) : "",
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Templates</h1>

      {/* Form */}
      <div className="bg-white p-5 rounded shadow max-w-xl mb-8">
        <h2 className="text-xl font-semibold mb-3">
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
          className="border p-2 w-full mb-3 h-32"
          placeholder="Message Body (you can use variables like {name}, {date})"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        />

        <textarea
          className="border p-2 w-full mb-3 h-20"
          placeholder='Variables (JSON format), example: { "name": "", "date": "" }'
          value={form.variables}
          onChange={(e) => setForm({ ...form, variables: e.target.value })}
        />

        <button
          onClick={saveTemplate}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Template" : "Save Template"}
        </button>
      </div>

      {/* Templates Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Title</th>
            <th className="p-2 text-left">Language</th>
            <th className="p-2 text-left">Variables</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {templates.map((t) => (
            <tr key={t.id} className="border-b">
              <td className="p-2">{t.title}</td>
              <td className="p-2">{t.language}</td>
              <td className="p-2">
                {t.variables ? JSON.stringify(t.variables) : "None"}
              </td>
              <td className="p-2">
                <button
                  onClick={() => editTemplate(t)}
                  className="text-blue-600 mr-3"
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
        </tbody>
      </table>
    </div>
  );
}
