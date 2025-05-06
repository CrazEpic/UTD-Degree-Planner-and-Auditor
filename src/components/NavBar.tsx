import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline"
import { NavLink } from "react-router"

function NavBar() {
	return (
		<>
			<nav className="flex flex-row justify-between items-center px-4 bg-[#154734] w-full h-[55px] border">
				<div className="flex flex-row gap-4">
					<NavLink to="/" end className="text-white text-2xl font-bold">
						Home
					</NavLink>
					<NavLink to="/buildDegree" end className="text-white text-2xl font-bold">
						Build Degree
					</NavLink>
					<NavLink to="/buildCourse" end className="text-white text-2xl font-bold">
						Build Course
					</NavLink>
				</div>

				{/* TODO: Signout the user on button press */}
				<NavLink to="/login" end className="text-white text-2xl font-bold">
					<div className="flex flex-row gap-2">
						<p>Sign Out</p>
						<ArrowRightStartOnRectangleIcon className="size-8" color="white"></ArrowRightStartOnRectangleIcon>
					</div>
				</NavLink>
			</nav>
		</>
	)
}

export default NavBar
