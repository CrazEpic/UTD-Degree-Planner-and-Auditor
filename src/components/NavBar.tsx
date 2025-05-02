import { UserCircleIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router"

function NavBar() {
	return (
		<>
			<div className="flex flex-row px-4 justify-end items-center bg-[#154734] w-full h-[55px] border">
				<nav className="flex flex-row gap-4">
					<NavLink to="/" end className="text-white text-2xl font-bold">
						Home
					</NavLink>
					<NavLink to="/buildDegree" end className="text-white text-2xl font-bold">
						Build Degree
					</NavLink>
					<NavLink to="/buildCourse" end className="text-white text-2xl font-bold">
						Build Course
					</NavLink>
				</nav>
				<UserCircleIcon className="ml-auto hover:bg-red-300 size-8" color="white"></UserCircleIcon>
			</div>
		</>
	)
}

export default NavBar
