import { DegreePlanCourse } from "../../../types/degree"
import PlannerCourse from "./PlannerCourse"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@headlessui/react"
import { useContext } from "react"
import { ModalContext } from "../../../contexts/ModalContext"

// TODO: Make sure this works with non-standard courses (4V95, etc.)
function currentHours(courseList: DegreePlanCourse[]) {
	let total = 0
	for (let i = 0; i < courseList.length; i++) total += parseInt(courseList[i].Course.number.split("")[1])
	return total
}

function PlannerSection({ name, courseList }: { name: string; courseList: DegreePlanCourse[] }) {

	const findCredit = useContext(ModalContext)?.findCredit
	
	return (
		<>
			<div className="w-[100%-32px] border-3 rounded-lg min-h-52">
				<div className="flex flex-row justify-between">
					<h1 className="h-8 text-xl text-[#e87500] font-bold m-4">{name}</h1>
					{name.includes("Credits") ? (
						<Button 
							className="size-8 m-4" 
							onClick={() => {
								console.log("Add Credit")
								if (findCredit) {
									if (name.includes("Test")) {
										findCredit("Test")
									}
									else {
										findCredit("Transfer")
									}
								}
							}}
						>
							<PlusIcon></PlusIcon>
						</Button>
					) : (
						<>
							{name != "Future" && (
								<div className="flex flex-row items-center m-4 gap-2">
									{/* Make the 12 an input field */}
									<p className="text-xl">{currentHours(courseList) + "/" + 12}</p>
								</div>
							)}
						</>
					)}
				</div>
				<div className="grid gap-4 p-4 pt-0 place-items-center" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
					{courseList.map((course) => (
						
						// Key can be the courseID + year + term??
						<PlannerCourse course={course}></PlannerCourse>
					))}
				</div>
			</div>
		</>
	)
}

export default PlannerSection
