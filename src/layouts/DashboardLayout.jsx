import { NavLink, Outlet } from "react-router";
import ProShiftly from "../pages/shared/ProShiftlyLogo/ProShiftly";
import {
  FiHome,
  FiPackage,
  FiClock,
  FiSearch,
  FiUser,
  FiUsers,
  FiUserPlus,
} from "react-icons/fi";

const DashboardLayout = () => {
  const navLinks = [
    { to: "", label: "Home", icon: <FiHome /> },
    { to: "/dashboard/myParcels", label: "My Parcels", icon: <FiPackage /> },
    {
      to: "/dashboard/paymentHistory",
      label: "Payment History",
      icon: <FiClock />,
    },
    { to: "/dashboard/track", label: "Track a Package", icon: <FiSearch /> },
    { to: "/dashboard/profile", label: "Update Profile", icon: <FiUser /> },
    {
      to: "/dashboard/activeRiders",
      label: "Active Riders",
      icon: <FiUsers />,
    },
    {
      to: "/dashboard/pendingRiders",
      label: "Pending Riders",
      icon: <FiUserPlus />,
    },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      {/* Toggle for mobile */}
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main content area */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="navbar bg-base-300 border-b border-base-200 lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-ghost btn-square"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>
          <div className="flex-1 text-lg font-semibold px-2">Dashboard</div>
        </div>

        {/* Main dashboard content */}
        <div className="p-4 lg:p-8 w-full h-full">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <ul className="menu p-4 w-72 min-h-full bg-base-200 text-base-content space-y-2">
          {/* Logo section */}
          <div className="mb-6 ">
            <ProShiftly />
          </div>

          {/* Navigation links */}
          {/* {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-base-300"
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))} */}

          {navLinks.map(({ to, label, icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end
                onClick={() => {
                  // Close drawer on mobile by unchecking the checkbox
                  const drawerCheckbox = document.getElementById("my-drawer-2");
                  if (drawerCheckbox) drawerCheckbox.checked = false;
                }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-base-300"
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span className="font-medium">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
