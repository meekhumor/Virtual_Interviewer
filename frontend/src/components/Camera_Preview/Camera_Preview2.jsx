import {Link} from "react-router-dom"

export default function Camera_Preview2() {

  return (
    <div className="mx-auto w-full max-w-xl flex flex-col gap-10 items-center bg-darkblue bg-opacity-40 rounded-3xl py-14 my-16">
      <h1 className="text-white text-2xl">Get Ready...</h1>
      <div className="bg-darkblue bg-opacity-60 w-96 h-80 rounded-xl flex items-center justify-center text-white">VIDEO</div>
      <Link to="/interview-simulator" className="bg-blue1 hover:bg-darkblue text-white rounded-3xl px-6 py-3 text-sm">Start Interview Simulator</Link>
    </div>
  );
}
