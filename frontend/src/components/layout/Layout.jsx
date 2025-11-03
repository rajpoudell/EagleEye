import { useState } from "react";

import { Toaster } from "react-hot-toast";
import bgImage from "../../assets/background image.png";
import Header from "./Header";
import Sidebar from "./Sidebar";

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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Layout;
