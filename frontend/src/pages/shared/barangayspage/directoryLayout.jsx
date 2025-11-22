import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DirectoryLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getBasePath = () => {
    if (location.pathname.includes("/superadmin")) {
      return "/superadmin";
    } else if (location.pathname.includes("/cityadmin")) {
      return "/cityadmin";
    }
    return "";
  };

  const basePath = getBasePath();

  const sidebarItems = [
    { id: "barangays", label: "Barangays", path: `${basePath}/barangays` },
    {
      id: "departments",
      label: "Departments",
      path: `${basePath}/departments`,
    },
    { id: "hotline", label: "Hotline Directory", path: `${basePath}/hotline` },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1591px] mx-auto flex">
        <aside className="w-70 p-6 pt-8 pl-8">
          <ul className="space-y-6">
            {sidebarItems.map((item) => (
              <li key={item.id} className="list-disc ml-5">
                <button
                  onClick={() => navigate(item.path)}
                  className={`text-left text-xl transition-colors ${
                    location.pathname === item.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-800 hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 pt-8 pr-8">{children}</main>
      </div>
    </div>
  );
};

export default DirectoryLayout;
