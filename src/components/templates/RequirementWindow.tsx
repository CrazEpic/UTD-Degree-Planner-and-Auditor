import Requirement from "./Requirement"
import SearchWindow from "./SearchWindow"

function RequirementWindow() {
  return (
    <> 
      <div className="w-3/10 border-l-2 flex flex-col gap-[15px] pt-[15px] pb-[15px]">
        <div className="flex flex-col gap-[15px] overflow-auto h-[calc(100vh-145px)] pl-[15px] pr-[15px]">
          <Requirement toggle={false} depth={1}></Requirement>
        </div>
        <hr className="w-full"/>
        <SearchWindow></SearchWindow>
      </div>
    </>
  )
}

export default RequirementWindow