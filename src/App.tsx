import NavBar from "./components/NavBar"
import LargeWindow from "./components/Large/LargeWindow"
import SmallWindow from "./components/Small/SmallWindow"
import { UserContext } from "./contexts/UserContext"
import { useEffect, useState } from "react"
import axios from "axios"
import MobileView from "./components/MobileView"

function App() {
	const [user, setUser] = useState(null)

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
	return (
		<>
			<UserContext.Provider value={{user, fetchUser}}>
				<div className="lg:inline sm:hidden">
					<NavBar></NavBar>
					<div className="flex flex-row lg:h-[calc(100vh-55px)] md:h-[calc(100vh-110px)]">
						<LargeWindow></LargeWindow>
						<SmallWindow></SmallWindow>
					</div>
				</div>
				<div className="lg:hidden">
					{/* Need a default view (far left?) */}
					<MobileView></MobileView>
				</div>
			</UserContext.Provider>
		</>
	)
}

export default App
