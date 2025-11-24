// src/pages/Users.jsx
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  // Load users
  const loadUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ---------------------------------------------------
  // ADD USER
  // ---------------------------------------------------
  const addUser = async () => {
    try {
      await api.post("/users", form);

      alert("User added successfully!");
      setShowAddForm(false);
      setForm({ name: "", email: "", phone: "" });

      loadUsers();
    } catch (err) {
      console.error("Add user error:", err);
      alert("Failed to add user");
    }
  };

  // ---------------------------------------------------
  // SEND WHATSAPP
  // ---------------------------------------------------
  const sendWhatsApp = async (phone) => {
    const msg = prompt("Enter WhatsApp message:");
    if (!msg) return;

    try {
      await api.post("/whatsapp/send", { number: phone, message: msg });
      alert("WhatsApp message sent!");
    } catch (err) {
      console.error("WhatsApp send error:", err);
      alert("Failed to send WhatsApp message");
    }
  };

  // ---------------------------------------------------
  // EDIT USER
  // ---------------------------------------------------
  const startEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
  };

  const saveUser = async () => {
    try {
      await api.put(`/users/${editingUser}`, form);
      alert("User updated successfully!");

      setEditingUser(null);
      setForm({ name: "", email: "", phone: "" });

      loadUsers();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update user");
    }
  };

  // ---------------------------------------------------
  // DELETE USER
  // ---------------------------------------------------
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Cannot delete — user has linked conversations or notifications");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Users</h1>

      {/* ADD USER BUTTON */}
      <button
        onClick={() => setShowAddForm(true)}
        className="bg-green-700 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add User
      </button>

      {/* ADD USER FORM */}
      {showAddForm && (
        <div className="bg-white shadow p-4 rounded mb-6">
          <h2 className="text-xl font-medium mb-4">Add New User</h2>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border px-2 py-1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="border px-2 py-1"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              type="text"
              placeholder="Phone (91XXXXXXXXXX)"
              className="border px-2 py-1"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={addUser}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save User
            </button>

            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div className="bg-white shadow rounded p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                {editingUser === u.id ? (
                  <>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border px-2 py-1 w-full"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="email"
                        className="border px-2 py-1 w-full"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        className="border px-2 py-1 w-full"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                      />
                    </td>

                    <td className="p-2 flex gap-2">
                      <button
                        onClick={saveUser}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingUser(null)}
                        className="bg-gray-600 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.phone}</td>

                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => startEdit(u)}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(u.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => sendWhatsApp(u.phone)}
                        className="bg-green-700 text-white px-3 py-1 rounded"
                      >
                        WhatsApp
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
