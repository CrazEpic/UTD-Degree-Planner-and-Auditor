import NavBar from "./components/NavBar"
import LargeWindow from "./components/Large/LargeWindow"
import SmallWindow from "./components/Small/SmallWindow"
import { UserContext } from "./contexts/UserContext"
import { useEffect, useState } from "react"
import axios from "axios"

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
				<div className="">
					<NavBar></NavBar>
					<div className="flex flex-row h-[calc(100vh-55px)]">
						<LargeWindow></LargeWindow>
						<SmallWindow></SmallWindow>
					</div>
				</div>
			</UserContext.Provider>
		</>
	)
}

export default App
