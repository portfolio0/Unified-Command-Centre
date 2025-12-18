import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // =====================
  // LOAD USERS
  // =====================
  const loadUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =====================
  // VALIDATION
  // =====================
  const validateUser = () => {
    if (!form.name.trim() || form.name.length < 3) {
      alert("Name must be at least 3 characters");
      return false;
    }

    if (!/^(\d{10}|91\d{10})$/.test(form.phone)) {
      alert("Phone must be 10 digits or start with 91XXXXXXXXXX");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(form.email)) {
      alert("Invalid email address");
      return false;
    }

    return true;
  };

  // =====================
  // ADD USER
  // =====================
  const addUser = async () => {
    if (!validateUser()) return;

    await api.post("/users", form);

    setShowAddForm(false);
    setForm({ name: "", email: "", phone: "" });
    loadUsers();
  };

  // =====================
  // EDIT USER
  // =====================
  const startEdit = (u) => {
    setEditingUser(u.id);
    setForm({
      name: u.name,
      email: u.email,
      phone: u.phone,
    });
  };

  const saveUser = async () => {
    if (!validateUser()) return;

    await api.put(`/users/${editingUser}`, form);

    setEditingUser(null);
    setForm({ name: "", email: "", phone: "" });
    loadUsers();
  };

  // =====================
  // DELETE USER
  // =====================
  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    loadUsers();
  };

  // =====================
  // SEND WHATSAPP
  // =====================
  const sendWhatsApp = async (phone) => {
    const msg = prompt("Enter WhatsApp message:");
    if (!msg) return;
    await api.post("/whatsapp/send", { number: phone, message: msg });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users</h1>

      {/* ADD USER BUTTON */}
      <button
        onClick={() => {
          setShowAddForm(true);
          setEditingUser(null);
          setForm({ name: "", email: "", phone: "" });
        }}
        className="bg-green-700 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add User
      </button>

      {/* ADD USER FORM */}
      {showAddForm && (
        <div className="bg-white shadow p-4 rounded mb-6 space-y-3">
          <input
            className="border p-2 w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border p-2 w-full"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <div className="flex gap-2">
            <button
              onClick={addUser}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Save
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

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {users.map((u) => (
          <div key={u.id} className="bg-white shadow rounded p-4">
            {editingUser === u.id ? (
              <>
                <input
                  className="border p-2 w-full mb-2"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="border p-2 w-full mb-2"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="border p-2 w-full mb-2"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <div className="flex gap-2">
                  <button
                    onClick={saveUser}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="font-semibold">{u.name}</p>
                <p className="text-sm">{u.email}</p>
                <p className="text-sm">{u.phone}</p>

                <div className="flex gap-2 pt-3">
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
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:block bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Phone</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) =>
              editingUser === u.id ? (
                <tr key={u.id}>
                  <td className="p-2">
                    <input
                      className="border p-1 w-full"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border p-1 w-full"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </td>
                  <td className="p-2">
                    <input
                      className="border p-1 w-full"
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
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ) : (
                <tr key={u.id} className="border-t">
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
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
