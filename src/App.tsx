import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import axios from "axios"
import NavBar from "./components/NavBar"
import DegreeBuildingWindow from "./components/Advisor/DegreeBuilding/DegreeBuildingWindow"
import CourseBuildingWindow from "./components/Advisor/CourseBuilding/CourseBuildingWindow"
import LoginWindow from "./components/Login/LoginWindow"
import StudentView from "./components/Student/StudentView"
import AdvisorView from "./components/Advisor/AdvisorView"
import { UserContext } from "./contexts/UserContext"
import { CoursesContext } from "./contexts/CoursesContext"

function App() {
	const [user, setUser] = useState(null)
	const [userRole, setUserRole] = useState("")

	const fetchUser = async () => {
		try {
			const response = await axios.get(`/api/user/craz`)
			setUser(response.data)
		} catch (error) {
			console.error("Error fetching user data:", error)
		}
	}

	const [courses, setCourses] = useState([])
	// TODO: should probably put this in a context or something
	const fetchCourses = async () => {
		try {
			const response = await axios.get("/api/course/courses")
			setCourses(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		// Replace fetch user with the userlogin
		// Let user select a degree plan
		fetchUser()

		fetchCourses()
	}, [])

	return (
		<>
			<BrowserRouter>
				<UserContext.Provider value={{ user, fetchUser }}>
					<CoursesContext.Provider value={{ courses, fetchCourses }}>
						<NavBar userRole={userRole} updateRole={setUserRole}></NavBar>
						<Routes>
							<Route path="/" element={<StudentView/>} />
							<Route path="/student" element={<StudentView/>} />
							<Route path="/advisor" element={<AdvisorView/>} />
							<Route path="/buildDegree" element={<DegreeBuildingWindow/>} />
							<Route path="/buildCourse" element={<CourseBuildingWindow/>} />

							{/* Redirect here if user is not logged in */}
							<Route path="/login" element={<LoginWindow role={userRole} updateRole={setUserRole}/>} />

							{/* Catchall route if the route doesn't exist */}
							<Route
								path="/*"
								element={
									<div className="flex min-h-screen">
										<p className="m-auto text-2xl">This route does not exist</p>
									</div>
								}
							/>
						</Routes>
					</CoursesContext.Provider>
				</UserContext.Provider>
			</BrowserRouter>
		</>
	)
}

export default App
