const course = {
  name: 'Course Name',
  dept: 'CR',
  number: '1234',
};

function PlannerCourse() {
  return (
    <>
      <div className="border-3 rounded-[10px] w-[220px] h-[125px] p-[3px] flex flex-col">
        <div>
          <p className="float-left">##</p>
          <img className="size-5 float-right" src="" alt="" />
        </div>
        <h1 className="text-xl text-center self-center">{course.dept + " " + course.number}</h1>
        <p className="text-md text-center self-center line-clamp-2 max-w-8/10">{course.name}</p>
      </div>
    </>
  )
}

export default PlannerCourse