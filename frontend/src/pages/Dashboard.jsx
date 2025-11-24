import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    workflows: 0,
    notifications: 0,
    conversations: 0,
  });

  const [recentConversations, setRecentConversations] = useState([]);
  const [chartData, setChartData] = useState({});

  const loadDashboardData = async () => {
    try {
      const [usersRes, wfRes, notifRes, convRes] = await Promise.all([
        api.get("/users"),
        api.get("/workflows"),
        api.get("/notifications"),
        api.get("/conversations"),
      ]);

      setStats({
        users: usersRes.data.length,
        workflows: wfRes.data.length,
        notifications: notifRes.data.length,
        conversations: convRes.data.length,
      });

      // Last 10 conversations
      setRecentConversations(convRes.data.slice(0, 10));

      // Create chart data (dummy simple count per day)
      const notifCount = notifRes.data.slice(0, 7).map((n) => n.id);
      setChartData({
        labels: notifCount.map((_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: "Notifications Sent",
            data: notifCount.map(() => Math.floor(Math.random() * 10) + 1),
          },
        ],
      });
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow p-5 rounded text-center">
          <h2 className="text-4xl font-bold">{stats.users}</h2>
          <p className="text-gray-600">Users</p>
        </div>

        <div className="bg-white shadow p-5 rounded text-center">
          <h2 className="text-4xl font-bold">{stats.workflows}</h2>
          <p className="text-gray-600">Workflows</p>
        </div>

        <div className="bg-white shadow p-5 rounded text-center">
          <h2 className="text-4xl font-bold">{stats.notifications}</h2>
          <p className="text-gray-600">Notifications</p>
        </div>

        <div className="bg-white shadow p-5 rounded text-center">
          <h2 className="text-4xl font-bold">{stats.conversations}</h2>
          <p className="text-gray-600">Conversations</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white shadow p-6 rounded mb-8">
        <h2 className="text-xl font-semibold mb-3">Notifications Trend</h2>

        {chartData.labels ? <Line data={chartData} /> : <p>Loading chart...</p>}
      </div>

      {/* Recent Conversations */}
      <div className="bg-white shadow p-6 rounded">
        <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>

        {recentConversations.length === 0 ? (
          <p>No recent conversations</p>
        ) : (
          <ul className="space-y-2">
            {recentConversations.map((c) => (
              <li key={c.id} className="p-3 border rounded hover:bg-gray-100">
                <p className="font-semibold">{c.message}</p>
                <p className="text-sm text-gray-500">User ID: {c.user_id}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
