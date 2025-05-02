import { DegreePlanCourse } from "../../types/degreeTest"

function BuildCourse({ course }: { course: DegreePlanCourse }) {
	return (
		<>
			<div className="border-3 rounded-lg w-full h-[125px] p-1 flex flex-col">
				<div className="flex flex-row justify-between p-1">
					<p className="">{"Tag"}</p>
                    <div className="size-6"></div>
				</div>
				<h1 className="text-xl text-center self-center">{course.prefix + " " + course.number}</h1>
				<p className="text-md text-center self-center line-clamp-2 max-w-8/10">{course.Course.name}</p>
			</div>
		</>
	)
}

export default BuildCourse
