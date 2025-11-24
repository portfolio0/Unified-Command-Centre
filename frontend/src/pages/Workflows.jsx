// src/pages/Workflows.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Workflows() {
  const [workflows, setWorkflows] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    steps: [],
  });

  const [newStep, setNewStep] = useState({
    template_id: "",
    delay_minutes: "",
  });

  // For running workflows
  const [selectedUserId, setSelectedUserId] = useState("");
  const [runChannel, setRunChannel] = useState("email");

  // Load workflows
  const loadWorkflows = async () => {
    const res = await api.get("/workflows");
    setWorkflows(res.data);
  };

  // Load templates
  const loadTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data);
  };

  // Load users
  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    const fetchAll = async () => {
      await loadWorkflows();
      await loadTemplates();
      await loadUsers();
    };
    fetchAll();
  }, []);

  // Add step to current form
  const addStep = () => {
    if (!newStep.template_id || !newStep.delay_minutes) {
      alert("Fill all step fields");
      return;
    }

    setForm({
      ...form,
      steps: [...form.steps, newStep],
    });

    setNewStep({ template_id: "", delay_minutes: "" });
  };

  // Save or update workflow
  const saveWorkflow = async () => {
    if (!form.name) return alert("Workflow name required");

    const payload = {
      name: form.name,
      steps: form.steps,
      active: true,
    };

    if (editingId) {
      await api.put(`/workflows/${editingId}`, payload);
      setEditingId(null);
    } else {
      await api.post("/workflows", payload);
    }

    setForm({ name: "", steps: [] });
    loadWorkflows();
  };

  // Edit workflow
  const editWorkflow = (wf) => {
    setEditingId(wf.id);
    setForm({
      name: wf.name,
      steps: wf.steps ?? [],
    });
  };

  // Delete workflow
  const deleteWorkflow = async (id) => {
    if (!confirm("Are you sure you want to delete this workflow?")) return;
    await api.delete(`/workflows/${id}`);
    loadWorkflows();
  };

  // Run workflow for selected user
  const runWorkflow = async (workflowId) => {
    if (!selectedUserId) {
      alert("Select a user first");
      return;
    }

    try {
      const payload = {
        workflow_id: workflowId,
        user_id: Number(selectedUserId),
        channel: runChannel, // "email" / "whatsapp" / "voice" (for future)
      };

      const res = await api.post("/workflows/run", payload);
      console.log("Workflow run result:", res.data);
      alert("Workflow executed successfully!");
    } catch (err) {
      console.error("Error running workflow:", err);
      alert("Failed to run workflow");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Workflows</h1>

      {/* RUN WORKFLOW AREA */}
      <div className="bg-white p-4 shadow rounded mb-6 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Run Workflow</h2>

        <label className="block mb-1">Select User</label>
        <select
          className="border p-2 w-full mb-3"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- Select user --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} - {u.email || u.phone}
            </option>
          ))}
        </select>

        <label className="block mb-1">Channel</label>
        <select
          className="border p-2 w-full mb-3"
          value={runChannel}
          onChange={(e) => setRunChannel(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp (future)</option>
          <option value="voice">Voice (future)</option>
        </select>

        <p className="text-sm text-gray-500">
          Select a user here, then click &quot;Run&quot; on any workflow in the
          list below.
        </p>
      </div>

      {/* WORKFLOW FORM */}
      <div className="bg-white p-6 shadow rounded mb-8 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Workflow" : "Create Workflow"}
        </h2>

        {/* Name */}
        <input
          className="border p-2 w-full mb-4"
          placeholder="Workflow Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* Add Step Section */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Add Step</h3>

          <select
            className="border p-2 w-full mb-3"
            value={newStep.template_id}
            onChange={(e) =>
              setNewStep({ ...newStep, template_id: e.target.value })
            }
          >
            <option value="">Select Template</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.language})
              </option>
            ))}
          </select>

          <input
            type="number"
            className="border p-2 w-full mb-3"
            placeholder="Delay (minutes) - currently informational"
            value={newStep.delay_minutes}
            onChange={(e) =>
              setNewStep({ ...newStep, delay_minutes: e.target.value })
            }
          />

          <button
            onClick={addStep}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Step
          </button>
        </div>

        {/* Steps Preview */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Workflow Steps:</h3>

          {form.steps.length === 0 ? (
            <p className="text-gray-500">No steps added yet.</p>
          ) : (
            form.steps.map((s, i) => (
              <div
                key={i}
                className="p-3 bg-gray-200 rounded mb-2 flex justify-between"
              >
                <span>
                  Step {i + 1}: Template <b>{s.template_id}</b> after{" "}
                  <b>{s.delay_minutes} minutes</b>
                </span>
              </div>
            ))
          )}
        </div>

        <button
          onClick={saveWorkflow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Workflow" : "Save Workflow"}
        </button>
      </div>

      {/* Workflows Table */}
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Steps</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {workflows.map((wf) => (
            <tr key={wf.id} className="border-b">
              <td className="p-2">{wf.name}</td>
              <td className="p-2">{wf.steps?.length || 0}</td>
              <td className="p-2 space-x-3">
                <button
                  className="text-blue-600"
                  onClick={() => editWorkflow(wf)}
                >
                  Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deleteWorkflow(wf.id)}
                >
                  Delete
                </button>
                <button
                  className="text-green-700 font-semibold"
                  onClick={() => runWorkflow(wf.id)}
                >
                  Run
                </button>
              </td>
            </tr>
          ))}

          {workflows.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-center text-gray-500">
                No workflows created yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
