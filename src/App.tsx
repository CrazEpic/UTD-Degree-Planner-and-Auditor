import NavBar from "./components/templates/NavBar"
import PlannerWindow from "./components/templates/PlannerWindow"
import RequirementWindow from "./components/templates/RequirementWindow"
 
function App() {
	return (
		<>
			<div className="">
				<NavBar></NavBar>
				<div className="flex flex-row h-[calc(100vh-55px)]">
					<PlannerWindow></PlannerWindow>
					<RequirementWindow></RequirementWindow>
				</div>
			</div>
		</>
	)
}

export default App
