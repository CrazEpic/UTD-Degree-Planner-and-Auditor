import NavBar from "./components/NavBar"
import PlannerWindow from "./components/planner/PlannerWindow"
import RequirementWindow from "./components/requirements/RequirementWindow"
 
function App() {
	return (
		<>
			<div className="">
				<NavBar></NavBar>

				{/* Since there is two possibilities for content in each pane
					changing their names to Large/Small or Left/Right may be 
					more clear
				*/}
				<div className="flex flex-row h-[calc(100vh-55px)]">
					<PlannerWindow></PlannerWindow>
					<RequirementWindow></RequirementWindow>
				</div>
			</div>
		</>
	)
}

export default App
