import { DegreePlanCourse } from "../../../types/degreeTest"
import PlannerCourse from "./PlannerCourse"
import { PlusIcon } from "@heroicons/react/24/outline"
import { Button } from "@headlessui/react"
import { useContext } from "react"
import { CreditContext } from "../../../contexts/CreditContext"

// Grabbing the second number in the of the course.number
// This does not work for internship and other similar course requirements (V)
function currentHours(courseList: DegreePlanCourse[]) {
	let total = 0
	for (let i = 0; i < courseList.length; i++) total += parseInt(courseList[i].Course.number.split("")[1])
	return total
}

function PlannerSection({ name, courseList }: { name: string; courseList: DegreePlanCourse[] }) {
	
	const findCredit = useContext(CreditContext)?.find
	
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
						// Key could be the prefix + number (there should be no duplicate in a degree plan)
						<PlannerCourse course={course}></PlannerCourse>
					))}
				</div>
			</div>
		</>
	)
}

export default PlannerSection
