import { NavLink } from "react-router"
import { ArrowRightStartOnRectangleIcon, ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline"

const NavBar = ({ userRole, updateRole }: { userRole: string, updateRole: Function }) => {
	return (
		<>
			<nav className="flex flex-row justify-between items-center px-4 bg-[#154734] w-full h-[55px] border">
				<div className="flex flex-row gap-4">
					{userRole !== "" ? (
						<>
							<NavLink to={`/${userRole}`} end className="text-white text-2xl font-bold">Home</NavLink>
						</>
					) : (
						<>
							<NavLink onClick={() => updateRole("student")} to="/student" end className="text-white text-2xl font-bold">
								Student View
							</NavLink>
							<NavLink onClick={() => updateRole("advisor")} to="/advisor" end className="text-white text-2xl font-bold">
								Advisor View
							</NavLink>
						</>
					)}
					{userRole === "advisor" &&
						<>
							<NavLink to="/buildDegree" end className="text-white text-2xl font-bold">
								Build Degree
							</NavLink>
							<NavLink to="/buildCourse" end className="text-white text-2xl font-bold">
								Build Course
							</NavLink>
						</>
					}
				</div>

				<p className="text-white text-2xl font-bold">{"Role: " + userRole}</p>

				{/* TODO: Signout the user on button press */}
				<NavLink onClick={() => updateRole("")} to="/login" end className="text-white text-2xl font-bold">
					<div className="flex flex-row gap-2">
						{userRole === "" ? (
							<>
								<ArrowRightEndOnRectangleIcon className="size-8" color="white"></ArrowRightEndOnRectangleIcon>
								<p>Login</p>
							</>
						) : (
							<>
								<ArrowRightStartOnRectangleIcon className="size-8" color="white"></ArrowRightStartOnRectangleIcon>
								<p>Sign Out</p>
							</>
						)}
					</div>
				</NavLink>
			</nav>
		</>
	)
}

export default NavBar
