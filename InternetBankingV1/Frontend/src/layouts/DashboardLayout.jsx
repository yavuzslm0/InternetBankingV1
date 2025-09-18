import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Notifications from "../components/Notifications";

export default function DashboardLayout() {
  return (
    <div className="container">
      <Sidebar />
      <div className="content">
        <Navbar />
        <Notifications />
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
