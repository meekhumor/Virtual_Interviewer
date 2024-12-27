import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LoginModal from "../Login/LoginModal";

export default function RegisterHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  return (
    <header className="shadow sticky z-50 top-0 max-w-6xl mx-auto">
      <nav className="bg-black border-gray-200 py-6 max-w-screen-xl">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="text-2xl text-white font-bold">
              Virtual <span className="text-blue1">AI</span>
            </div>
          </Link>
          <div className="flex items-center justify-end gap-4">
            <p className="text-gray-400 ">Already have an account?</p>
            <button 
              className="rounded-full text-sm text-black1 bg-white hover:bg-black1 hover:text-white px-3 py-1.5"
              onClick={() => setIsModalOpen(true)} 
            >
              Sign In
            </button>
          </div>
         </div>
      </nav>

      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
}
