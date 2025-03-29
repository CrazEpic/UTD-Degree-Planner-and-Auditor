import {} from "@heroicons/react/24/solid"

function RequirementCourse({border_style}: {border_style: string}) {
  return (
    <>
      <div className={border_style + " grid grid-cols-6"}>
        <p className="col-span-5">Course!</p>
        <img className="size-[24px] justify-self-end mr-[15px]" src="" alt="" />
      </div>
    </>
  )
}

export default RequirementCourse