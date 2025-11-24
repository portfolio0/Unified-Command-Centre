import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
