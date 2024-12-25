import CardDash1 from "./CardDash1";
import { Link, NavLink } from "react-router-dom";

const interview = [
    {
        title: 'General Interviews',
        description: 'Covers the questions you are most likely to get while interviewing.',
        tagline: 'Start Interview',
        image: '/dashboard/icon1.svg'
    },
    {
        title: 'Interview by Job Position',
        description: 'Our AI selects the most relevant questions based on your job position',
        tagline: 'Choose Job Position',
        image: '/dashboard/icon2.svg'
    },
    {
        title: 'Custom-Built Interviews',
        description: 'Interview with your own questions, or take assigned interviews.',
        tagline: 'Start Interview',
        image: '/dashboard/icon3.svg'
    }
]


export default function Dashboard() {
    return (
        <div className="w-full max-w-4xl mb-36 mx-auto">
            <div className='flex justify-center items-center'>
                <div className='flex flex-col mt-12 mb-5' id="hero">
                    <h1 className='text-white text-2xl text-center'>Simulate an Interview</h1>
                </div>
            </div> 

            <div className="flex justify-center items-center gap-6">
                {interview.map((step, index) => (
                    <div key={index} >
                        <div>
                            <CardDash1
                                title={step.title}
                                description={step.description}
                                tagline={step.tagline}
                                image={step.image}
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-8 mt-16">
                <div className="bg-darkblue bg-opacity-60 w-80 flex items-center justify-center text-white">VIDEO</div>
                <div className="flex flex-col pt-4">
                    <p className='text-gray-500 text-sm'>VIDEO COURSE</p>
                    <h1 className='text-white text-lg mt-4 '>Master the Interview</h1>
                    <p className='text-gray-400 text-sm mt-4 mb-6 w-52'>Take our online course and learn everything you need to know to ace the interview.</p>
                    <button className="bg-blue1 text-white rounded-3xl py-3 mb-6 w-44 text-md">Take the Class</button>

                </div>
            </div>

            <div className="flex flex-col mt-16 px-10 gap-4">
                <div className='flex justify-between'>
                    <h1 className='text-white text-2xl'>Review Your Interview</h1>
                    <NavLink to="/review-interview" className= "text-blue1 text-md hover:text-gray-400"> VIEW ALL </NavLink>
                </div>
                <div className="bg-darkblue bg-opacity-60 flex flex-row p-4 rounded-lg px-6 justify-between items-center">
                    <div className="flex text-gray-400 gap-8">

                        <p className="text-gray-200">General Interview</p>
                        <p className="text-sm"><span>1</span> Month Ago</p>
                        <p className="text-sm"><span>2</span> min</p>
                        <p className="text-sm">Entry Level</p>
                    </div>

                    <Link to="/review-interview" className="text-white p-1 rounded-lg px-3  bg-blue1 hover:bg-darkblue">Review</Link>
                </div>

                <div className="flex mt-16 gap-6">
                    <div className="bg-darkblue bg-opacity-60 w-1/3 rounded-lg flex gap-3 flex-col px-3 justify-center items-center">
                        <img src="/dashboard/icon3.svg" alt="" className="w-44"/>
                        <h1 className="text-white text-xl">Build an Interview</h1>
                        <p className="text-gray-400 text-sm text-center">Add your own questions and build your own interview from scratch</p>
                        <button className="bg-blue1 text-white rounded-3xl py-2 my-3 px-4 text-sm">Take the Class</button>
                    </div>
                    <div className="flex flex-col gap-4 w-2/3">
                        <div className='flex justify-between items-center'>
                            <h1 className='text-white text-2xl'>Featured Interviews</h1>
                            <NavLink to="/interview-category" className= "text-blue1 text-md hover:text-gray-400"> VIEW ALL </NavLink>
                        </div>
                        <div className="bg-darkblue bg-opacity-60 w-full h-1/2 rounded-lg flex gap-2 py-4">
                            <img src="/category/icon2.svg" alt="" className="w-14 h-14 m-4 mx-6" />
                            <div className="flex flex-col gap-1 my-auto">

                                <h1 className="text-xl text-white">Brainteaser</h1>
                                <p className="text-gray-400 text-sm pr-3">Brainteasers are question that make you think and arrive at reasonable answer.</p>

                                <Link to="" className="hover:cursor-pointer text-sm text-blue1 mt-3">Take Interview</Link>
                            </div>
                        </div>
                        <div className="bg-darkblue bg-opacity-60 w-full h-1/2 rounded-lg flex gap-2 py-4">
                            <img src="/category/icon3.svg" alt="" className="w-14 h-14 m-4 mx-6" />
                            <div className="flex flex-col gap-1 my-auto">

                                <h1 className="text-xl text-white">Critical Thinking</h1>
                                <p className="text-gray-400 text-sm pr-3">Critical Thinking is becoming more important in today&apos;s data driven environment</p>

                                <Link to="" className="hover:cursor-pointer text-sm text-blue1 mt-3">Take Interview</Link>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}



   


