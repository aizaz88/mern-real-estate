import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3 ">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl  flex flex-wrap">
            <span className="text-slate-500">AU</span>
            <span className="text-slate-700 ml-1">Estate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form className="bg-slate-100 p-3 sm:p-3 rounded-lg flex items-center w-32 sm:w-48 md:w-64 lg:w-80">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm w-24 sm:w-64 text-slate-700"
          />
          <FaSearch className="text-slate-600 ml-2" />
        </form>
        <ul className="gap-4 flex">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/sign-in">
            <li className=" sm:inline text-slate-700 hover:underline">
              SignIn
            </li>
          </Link>
        </ul>
      </div>
    </header>
  );
}
