import { FaAngleLeft } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { GrUserPolice } from "react-icons/gr";
import {
  MdAdd,
  MdLiveTv,
  MdLocalPolice,
  MdManageAccounts,
  MdOutlineAddHome,
  MdOutlineMarkUnreadChatAlt,
} from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../assets/Logo.png";
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <MdOutlineAddHome className="h-5 w-5" />,
    },
    {
      name: "Live feeds",
      path: "/live-feeds",
      icon: <MdLiveTv className="h-5 w-5" />,
    },
    {
      name: "Criminals",
      path: "/criminals",
      icon: <MdManageAccounts className="h-5 w-5" />,
    },
    {
      name: "Add Criminal ",
      path: "/add-criminal",
      icon: <MdAdd className="h-5 w-5" />,
    },
    {
      name: "IO ",
      path: "/IO",
      icon: <GrUserPolice className="h-5 w-5" />,
    },
    {
      name: "Station",
      path: "/station",
      icon: <MdLocalPolice className="h-5 w-5" />,
    },
    { name: "Search", path: "/search", icon: <FiSearch className="h-5 w-5" /> },
    {
      name: "Logs",
      path: "/logs",
      icon: <MdOutlineMarkUnreadChatAlt className="h-5 w-5" />,
    },
  ];
  return (
    <aside
      className={`  fixed top-0 z-20 h-screen w-64 bg-white shadow-lg transition-all duration-300 lg:left-0 
      ${isOpen ? "left-0" : "-left-64"}`}
    >
      <div className="flex h-full flex-col ">
        <div className="flex h-18 lg:justify-center justify-between  items-center  px-4 border-b">
          <Link to={"/"}>
            <img src={Logo} alt="logo" srcSet={Logo} className="h-12 w-24  " />
          </Link>

          <FaAngleLeft
            className="h-4 w-4 lg:hidden  "
            onClick={toggleSidebar}
          />
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={toggleSidebar}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg px-4 py-3 transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-slate-900   "
                        : " text-slate-900  "
                    }`
                  }
                >
                  <span className="mr-3 text-red-600">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
