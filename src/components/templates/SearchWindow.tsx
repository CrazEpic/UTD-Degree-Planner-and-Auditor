import { ChevronDoubleUpIcon } from "@heroicons/react/24/solid"

function SearchWindow() {
  return (
    <>
      <div className="border rounded-[10px] grid grid-cols-3 items-center ml-[15px] mr-[15px] p-[15px]">
        <p className="col-span-2">Search Bar</p>
        <ChevronDoubleUpIcon className="size-[24px] justify-self-end"></ChevronDoubleUpIcon>
      </div>
    </>
  )
}

export default SearchWindow