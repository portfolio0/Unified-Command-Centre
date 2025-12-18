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

  const [selectedUserId, setSelectedUserId] = useState("");
  const [runChannel, setRunChannel] = useState("email");

  // Load data
  const loadWorkflows = async () => {
    const res = await api.get("/workflows");
    setWorkflows(res.data);
  };

  const loadTemplates = async () => {
    const res = await api.get("/templates");
    setTemplates(res.data);
  };

  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadWorkflows();
    loadTemplates();
    loadUsers();
  }, []);

  // Helpers
  const getTemplateTitle = (id) =>
    templates.find((t) => t.id === id)?.title || "Unknown";

  // Add step
  const addStep = () => {
    if (!newStep.template_id) {
      alert("Please select a template");
      return;
    }

    setForm((prev) => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          template_id: Number(newStep.template_id),
          delay_minutes: Number(newStep.delay_minutes) || 0,
        },
      ],
    }));

    setNewStep({ template_id: "", delay_minutes: "" });
  };

  // Save workflow
  const saveWorkflow = async () => {
    if (!form.name) {
      alert("Workflow name required");
      return;
    }

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
      steps: wf.steps || [],
    });
  };

  // Delete workflow
  const deleteWorkflow = async (id) => {
    if (!confirm("Delete this workflow?")) return;
    await api.delete(`/workflows/${id}`);
    loadWorkflows();
  };

  // Run workflow
  const runWorkflow = async (workflowId) => {
    if (!selectedUserId) {
      alert("Select a user first");
      return;
    }

    try {
      await api.post("/workflows/run", {
        workflow_id: workflowId,
        user_id: Number(selectedUserId),
        channel: runChannel,
      });

      alert("Workflow executed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to run workflow");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">Workflows</h1>

      {/* RUN WORKFLOW */}
      <div className="bg-white shadow rounded p-5 max-w-2xl">
        <h2 className="text-xl font-semibold mb-3">Run Workflow</h2>

        <select
          className="border p-2 w-full mb-3"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(Number(e.target.value))}
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email || u.phone})
            </option>
          ))}
        </select>

        <select
          className="border p-2 w-full mb-3"
          value={runChannel}
          onChange={(e) => setRunChannel(e.target.value)}
        >
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <p className="text-sm text-gray-500">
          Choose a user and click Run on a workflow below
        </p>
      </div>

      {/* CREATE / EDIT WORKFLOW */}
      <div className="bg-white shadow rounded p-6 max-w-2xl">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit Workflow" : "Create Workflow"}
        </h2>

        <input
          className="border p-2 w-full mb-4"
          placeholder="Workflow Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* ADD STEP */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="font-semibold mb-2">Add Step</h3>

          <select
            className="border p-2 w-full mb-3"
            value={newStep.template_id}
            onChange={(e) =>
              setNewStep({
                ...newStep,
                template_id: Number(e.target.value),
              })
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
            placeholder="Delay (minutes – optional)"
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

        {/* STEPS PREVIEW */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Workflow Steps</h3>

          {form.steps.length === 0 ? (
            <p className="text-gray-500">No steps added</p>
          ) : (
            form.steps.map((s, i) => (
              <div key={i} className="p-3 bg-gray-200 rounded mb-2">
                Step {i + 1}: <b>{getTemplateTitle(s.template_id)}</b> (Delay:{" "}
                {s.delay_minutes} min)
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

      {/* WORKFLOWS LIST */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Steps</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((wf) => (
              <tr key={wf.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{wf.name}</td>
                <td className="p-3">{wf.steps?.length || 0}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => editWorkflow(wf)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteWorkflow(wf.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => runWorkflow(wf.id)}
                    className="text-green-700 font-semibold"
                  >
                    Run
                  </button>
                </td>
              </tr>
            ))}

            {workflows.length === 0 && (
              <tr>
                <td colSpan="3" className="p-5 text-center text-gray-400">
                  No workflows created yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
