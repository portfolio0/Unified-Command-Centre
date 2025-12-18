import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function WorkflowInstances() {
  const [instances, setInstances] = useState([]);

  // =====================
  // LOAD INSTANCES
  // =====================
  const loadInstances = async () => {
    try {
      const res = await api.get("/workflow-instances");
      setInstances(res.data);
    } catch (err) {
      console.error("Failed to load workflow instances:", err);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const statusColor = (status) => {
    if (status === "running") return "bg-blue-600";
    if (status === "completed") return "bg-green-600";
    return "bg-red-600";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Workflow Instances</h1>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {instances.map((ins) => (
          <div key={ins.id} className="bg-white shadow rounded p-4 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{ins.workflow_name}</h2>
              <span
                className={`px-2 py-1 text-xs rounded text-white ${statusColor(
                  ins.status
                )}`}
              >
                {ins.status}
              </span>
            </div>

            <p className="text-sm">
              <span className="font-medium">User:</span> {ins.user_name}
            </p>

            <p className="text-sm">
              <span className="font-medium">Current Step:</span>{" "}
              {ins.current_step}
            </p>

            <p className="text-sm">
              <span className="font-medium">Started At:</span>{" "}
              {new Date(ins.started_at).toLocaleString()}
            </p>

            <p className="text-sm">
              <span className="font-medium">Last Run:</span>{" "}
              {ins.last_run_at
                ? new Date(ins.last_run_at).toLocaleString()
                : "-"}
            </p>
          </div>
        ))}

        {instances.length === 0 && (
          <p className="text-center text-gray-500">
            No workflow instances found.
          </p>
        )}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block bg-white shadow rounded overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="p-3 text-left">Workflow</th>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Current Step</th>
              <th className="p-3 text-left">Started At</th>
              <th className="p-3 text-left">Last Run At</th>
            </tr>
          </thead>

          <tbody>
            {instances.map((ins) => (
              <tr key={ins.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{ins.workflow_name}</td>
                <td className="p-3">{ins.user_name}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${statusColor(
                      ins.status
                    )}`}
                  >
                    {ins.status}
                  </span>
                </td>
                <td className="p-3 text-center">{ins.current_step}</td>
                <td className="p-3">
                  {new Date(ins.started_at).toLocaleString()}
                </td>
                <td className="p-3">
                  {ins.last_run_at
                    ? new Date(ins.last_run_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}

            {instances.length === 0 && (
              <tr>
                <td colSpan="6" className="p-5 text-center text-gray-500">
                  No workflow instances found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
