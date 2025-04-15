import NavBar from "./components/NavBar"
import LargeWindow from "./components/Large/LargeWindow"
import SmallWindow from "./components/Small/SmallWindow"
import { UserContext } from "./contexts/UserContext"
import { useEffect, useState } from "react"
import axios from "axios"
import SearchWindow from "./components/Small/SearchWindow"
import { MatcherContext } from "./contexts/MatcherContext"
import { BrowserRouter, Routes, Route } from "react-router"
import DegreeBuildingWindow from "./components/DegreeBuilding/DegreeBuildingWindow"

function App() {
	const [user, setUser] = useState(null)
	const [matcher, setMatcher] = useState(false)

	const fetchUser = async () => {
		try {
			const response = await axios.get("http://localhost:3000/api/user/craz")
			setUser(response.data)
		} catch (error) {
			console.error("Error fetching user data:", error)
		}
	}

	useEffect(() => {
		fetchUser()
	}, [])

	const conditions = {}

	// currently a string, but could be different later
	const searchCourses = (matcher: string) => {
		setMatcher(true)
		console.log(matcher)
		// modify conditions in here
	}

	const endSearch = () => {
		setMatcher(false)
	}

	return (
		<>
			<BrowserRouter>
				<UserContext.Provider value={{ user, fetchUser }}>
					<NavBar></NavBar>
					<Routes>
						<Route
							path="/"
							element={
								<div className="flex flex-row h-[calc(100vh-55px)]">
									<LargeWindow></LargeWindow>
									<MatcherContext.Provider value={{ conditions: null, search: searchCourses, end: endSearch }}>
										<div className="max-lg:hidden">
											{matcher ? <SearchWindow conditions={conditions}></SearchWindow> : <SmallWindow></SmallWindow>}
										</div>
									</MatcherContext.Provider>
								</div>
							}
						/>
						<Route path="/buildDegree" element={<DegreeBuildingWindow></DegreeBuildingWindow>} />
					</Routes>
				</UserContext.Provider>
			</BrowserRouter>
		</>
	)
}

export default App
