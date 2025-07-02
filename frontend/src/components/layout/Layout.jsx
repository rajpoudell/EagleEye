import React, { useState } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";
import bgImage from "../../assets/background image.png";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      className="min-h-screen bg-center  bg-fixed bg-no-repeat bg-cover "
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${bgImage})`,
      }}
    >
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Header toggleSidebar={toggleSidebar} />

      <main className="pt-16 lg:pl-64  ">
        <div className="p-6 ">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
