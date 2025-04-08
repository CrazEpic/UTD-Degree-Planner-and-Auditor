import NavBar from "./components/NavBar"
import LargeWindow from "./components/Large/LargeWindow"
import SmallWindow from "./components/Small/SmallWindow"
 
function App() {
	return (
		<>
			<div className="">
				<NavBar></NavBar>
				<div className="flex flex-row h-[calc(100vh-55px)]">
					<LargeWindow></LargeWindow>
					<SmallWindow></SmallWindow>
				</div>
			</div>
		</>
	)
}

export default App
