import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Workflowinstances() {
  const [instances, setInstances] = useState([]);

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Workflow Instances</h1>

      <div className="bg-white shadow rounded p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="p-2">Workflow</th>
              <th className="p-2">User</th>
              <th className="p-2">Status</th>
              <th className="p-2">Current Step</th>
              <th className="p-2">Started At</th>
              <th className="p-2">Last Run At</th>
            </tr>
          </thead>

          <tbody>
            {instances.map((ins) => (
              <tr key={ins.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{ins.workflow_name}</td>
                <td className="p-2">{ins.user_name}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      ins.status === "running"
                        ? "bg-blue-600"
                        : ins.status === "completed"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {ins.status}
                  </span>
                </td>
                <td className="p-2 text-center">{ins.current_step}</td>
                <td className="p-2">
                  {new Date(ins.started_at).toLocaleString()}
                </td>
                <td className="p-2">
                  {ins.last_run_at
                    ? new Date(ins.last_run_at).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}

            {instances.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
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
