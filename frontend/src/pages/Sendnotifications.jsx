import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function SendNotification() {
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);

  const [form, setForm] = useState({
    user_id: "",
    template_id: "",
    channel: "whatsapp",
    override_message: "",
    variablesJson: "",
  });

  const [preview, setPreview] = useState("");

  // Load users + templates on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await api.get("/users");
        const t = await api.get("/templates");
        setUsers(u.data);
        setTemplates(t.data);
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    fetchData();
  }, []);

  // Build preview for UI
  const buildPreview = () => {
    if (!form.user_id) {
      setPreview("Select a user");
      return;
    }

    let vars = {};
    try {
      vars = form.variablesJson ? JSON.parse(form.variablesJson) : {};
    } catch {
      setPreview("Invalid JSON in variables");
      return;
    }

    const user = users.find((u) => u.id === Number(form.user_id));

    // Base replacements available
    const baseVars = {
      name: user?.name || "",
      phone: user?.phone || "",
      language: user?.language || "",
      ...vars,
    };

    let message = "";

    // If override is used
    if (form.override_message.trim()) {
      message = form.override_message;
    } else {
      // Use template text
      const template = templates.find((t) => t.id === Number(form.template_id));

      if (!template) {
        setPreview("Select a template or write a manual message");
        return;
      }

      message = template.body || "";
    }

    // Replace {variables}
    Object.keys(baseVars).forEach((key) => {
      message = message.split(`{${key}}`).join(baseVars[key]);
    });

    setPreview(message);
  };

  // Rebuild preview whenever form changes
  useEffect(() => {
    buildPreview();
  }, [form, users, templates]);

  const send = async () => {
    if (!form.user_id) {
      alert("Select a user");
      return;
    }

    if (!form.template_id && !form.override_message.trim()) {
      alert("Select a template or provide a manual message");
      return;
    }

    let variables = {};
    try {
      variables = form.variablesJson ? JSON.parse(form.variablesJson) : {};
    } catch {
      alert("Invalid JSON in variables");
      return;
    }

    const payload = {
      user_id: Number(form.user_id),
      template_id: form.template_id ? Number(form.template_id) : null,
      channel: form.channel,
      override_message: form.override_message.trim()
        ? form.override_message
        : null,
      variables,
    };

    try {
      await api.post("/notifications/send", payload);
      alert("Notification saved & conversation updated!");

      // Clear form
      setForm({
        user_id: "",
        template_id: "",
        channel: "whatsapp",
        override_message: "",
        variablesJson: "",
      });

      setPreview("");
    } catch (err) {
      console.error("Send notification error:", err);
      alert("Failed to send notification");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Send Notification</h1>

      <div className="bg-white p-6 shadow rounded max-w-2xl mb-6">
        {/* User */}
        <label className="block mb-2 font-semibold">User</label>
        <select
          className="border p-2 w-full mb-4"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.phone}
            </option>
          ))}
        </select>

        {/* Template */}
        <label className="block mb-2 font-semibold">Template (optional)</label>
        <select
          className="border p-2 w-full mb-4"
          value={form.template_id}
          onChange={(e) => setForm({ ...form, template_id: e.target.value })}
        >
          <option value="">Select template</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title} ({t.language})
            </option>
          ))}
        </select>

        {/* Override Message */}
        <label className="block mb-2 font-semibold">
          Override Message (optional)
        </label>
        <textarea
          className="border p-2 w-full mb-3 h-24"
          placeholder="Manual message. You can use {name}, {phone}, or custom variables."
          value={form.override_message}
          onChange={(e) =>
            setForm({ ...form, override_message: e.target.value })
          }
        />

        {/* Variables JSON */}
        <label className="block mb-2 font-semibold">
          Variables (JSON format)
        </label>
        <textarea
          className="border p-2 w-full mb-3 h-20"
          placeholder='Example: { "date": "2025-11-30", "amount": "5000" }'
          value={form.variablesJson}
          onChange={(e) => setForm({ ...form, variablesJson: e.target.value })}
        />

        {/* Channel */}
        <label className="block mb-2 font-semibold">Channel</label>
        <select
          className="border p-2 w-full mb-4"
          value={form.channel}
          onChange={(e) => setForm({ ...form, channel: e.target.value })}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="voice">Voice</option>
        </select>

        {/* Preview */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Preview</h3>
          <div className="p-3 bg-gray-100 rounded min-h-[80px] whitespace-pre-wrap">
            {preview || "Type message or select template"}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={send}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Notification
        </button>
      </div>
    </div>
  );
}
