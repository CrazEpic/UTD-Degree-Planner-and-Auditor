import { PlusIcon } from "@heroicons/react/24/solid"
import { CourseBlock } from "../../types/degreeTest"
import { Button } from "@headlessui/react"
import { UserContext } from "../../contexts/UserContext"
import { useContext } from "react"
import axios from "axios"

function CourseBlockView({ course, name }: { course: CourseBlock; name: string }) {
	const user = useContext(UserContext)?.user
	const fetchUser = useContext(UserContext)?.fetchUser
	
	// {
		/* Replace with check in planned degree */
	// }
	
	const planned = false

	return (
		<div className="flex flex-row gap-2 border rounded-lg items-center justify-center p-2 pr-0 border-r-0 rounded-r-none">
			<p className="line-clamp-2 max-w-15/20">
				<a className="text-[#037b3f]" href="">
					{course.prefix + " " + course.number + " "}
				</a>
				{name}
			</p>
			{planned ? (
				<p className="underline ml-auto mr-4">Planned</p>
			) : (
				<Button
					className="hover:bg-blue-200 size-6 ml-auto mr-4"
					onClick={async () => {
						// TODO: check if course is already in degree plan, should not be a thing but maybe
						try {
							const response = await axios.post("http://localhost:3000/api/degreePlan/addCourse", {
								degreePlanID: user?.DegreePlan?.degreePlanID,
								course: { prefix: course.prefix, number: course.number },
							})

							// potential undefined fetchUser error
							if (fetchUser) {
								fetchUser()
							}
						} catch (error) {
							console.error("Error adding course: ", error)
						}
					}}
				>
					<PlusIcon></PlusIcon>
				</Button>
			)}
		</div>
	)
}

export default CourseBlockView
