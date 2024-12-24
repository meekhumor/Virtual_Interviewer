const LoginModal = ({ isOpen, onClose}) => {
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white px-14 py-6 rounded shadow-lg max-w-md w-full relative">
        <div className="relative left-80 px-4 cursor-pointer">
            <img src="/close.svg" onClick={onClose} alt="" />
        </div>

        <div className="flex flex-col gap-3 items-center justify-center mb-8 mt-4">
          <h1 className="text-3xl font-semibold">Welcome back!</h1>
          <div className="flex gap-1 text-sm">
            <p className="text-gray-700">Don&apos;t have an account?</p> 
            <button className="text-blue1">Sign Up</button>
          </div>
        </div>

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-800 font-semibold">
              Email
            </label>
            <input type="email" id="email" name="email" placeholder="Enter your email"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4"> 
            <label htmlFor="password" className="block text-sm text-gray-800 font-semibold">
              Password
            </label>
            <input type="password" id="password" name="password" placeholder="Enter your password"
              className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <button type="submit" className="w-full py-2 px-4 bg-blue1 text-white rounded-xl hover:bg-darkblue">
            Submit
          </button>

          <p className="text-sm text-center mt-7 mb-6 text-darkblue cursor-pointer">Forgot your password?</p>

        </form>
      </div>
    </div>
  );
};
export default LoginModal;
