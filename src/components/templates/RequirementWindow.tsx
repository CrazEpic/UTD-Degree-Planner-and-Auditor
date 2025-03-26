import Requirement from "./Requirement"

function RequirementWindow() {
  return (
    <> 
      <div className="w-3/10 border-l-2 flex flex-col gap-[15px]">
        <div className="flex flex-col gap-[15px] overflow-auto h-[calc(100vh-145px)] p-[15px]">
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
          <Requirement></Requirement>
        </div>
        <div className="border-t-2 mt-auto min-h-[90px] p-[15px] grid grid-cols-3 items-center">
          <p className="col-span-2">Search Bar</p>
          <img className="size-5 justify-self-end" src="" alt="" />
        </div>
      </div>
    </>
  )
}

export default RequirementWindow