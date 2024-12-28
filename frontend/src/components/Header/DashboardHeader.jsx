import { Link, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserDetails } from "../../api";

export default function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails();
        setUserDetails(data);
      } catch (error) {
        console.log("Failed to fetch user details");
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <header className="shadow sticky z-50 top-0">
      <nav className="bg-black px-4 py-4">
        <div className="flex flex-wrap justify-evenly items-center mx-auto mt-2 ">
          <button type="button" className="text-white" onClick={toggleMenu}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <Link to="/" className="flex items-center">
            <img className=" w-8 rounded-full bg-transparent bg-darkblue bg-opacity-40" src="https://d154zarmrcpu4a.cloudfront.net/60fe828b-2ebf-4dd2-9b4d-d78f771b83cc.png" />
            <div className="text-2xl ml-4 text-white font-extrabold">
              Virtual <span className="text-blue1">AI</span>
            </div>
          </Link>

          <div className="flex items-center gap-3 px-2 py-1.5 bg-darkblue bg-opacity-50 rounded-2xl">
                <div className="bg-gray-300 w-6 h-6 rounded-full flex justify-center items-center font-semibold text-xs">{userDetails ? userDetails.username.charAt(0).toUpperCase(): 'O'}</div>
                <img src="/down-arrow.png" className="w-4 h-4" alt="" />
          </div>
        </div>
        
        <div className={`bg-black2 ${isMenuOpen ? 'block' : 'hidden'} h-screen w-1/3 lg:w-1/4 xl:w-1/5 z-10 absolute top-0 left-0`}>
          <div className="flex justify-end mt-4 mr-4">
            <img src="/close.svg" className="flex w-8 h-8 opacity-75 cursor-pointer" alt="" onClick={toggleMenu} />
          </div>

          <div className={`{isMenuOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col mt-12 text-lg gap-1">
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue1" : "text-gray-100"} hover:bg-blue1`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/practice"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue2" : "text-gray-100"} hover:bg-blue1`
                  }
                >
                  Practice
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/analysis"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue2" : "text-gray-100"} hover:bg-blue1 `
                  }
                >
                  Analysis
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/review-interview"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue2" : "text-gray-100"} hover:bg-blue1 `
                  }
                >
                  Review Interviews
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/interview-category"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue2" : "text-gray-100"} hover:bg-blue1 `
                  }
                >
                  General Interviews
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    `block py-2 text-center duration-200 ${isActive ? "text-blue2" : "text-gray-100"} hover:bg-blue1 `
                  }
                >
                  Courses
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
