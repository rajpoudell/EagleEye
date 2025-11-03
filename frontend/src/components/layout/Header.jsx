import { FaBars } from "react-icons/fa6";

const Header = ({ toggleSidebar }) => {
  // const user = localStorage.getItem("user");

  // const isLoggedIn = user !== null;

  // // localStorage.getItem("token");
  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("name");
  //   window.location.reload();
  // };
  return (
    <header className="   bg-gray-50 fixed left-0 right-0 top-0 z-10 flex  h-16 items-center lg:justify-end justify-between shadow-xl/15 rounded  px-4 lg:left-64">
      <button
        onClick={toggleSidebar}
        className="rounded p-2  hover:bg-slate-200 lg:hidden"
      >
        <FaBars className="h-6 w-6" />
      </button>
      {/*
      <div className="flex  items-center  space-x-4 gap-3 ">
         {isLoggedIn ? (
          <>
            <h2 className="cursor-default">
              <span className="font-bold gap-1">Hi !</span>
              <span className=" px-2.5">
                {localStorage.getItem("name")?.split(" ")[0]}
              </span>
            </h2>

            <Link to={"/"}>
              <CgProfile className="h-8 w-8 " />
            </Link>
            <Link to={"/login"}>
              <Button clickout={() => logout()} name="Logout" />
            </Link>
          </>
        ) : (
          <Link to="/login">
            <Button name="Logout" />
          </Link>
        )} 
      </div>
         */}
      <h2 align="center" className="flex ">
        EagleEye{" "}
        <span className="hidden sm:block">
          - Criminal Tracking and Alert System
        </span>
      </h2>
    </header>
  );
};

export default Header;
