import { EllipsisVerticalIcon } from "@heroicons/react/24/solid"
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

function click(message: string) {
  console.log(message)
}

function PlannerCourse({prefix, number, name, tag}: {prefix: string, number: string, name: string, tag: string}) {
  return (
    <>
      <div className="border-3 rounded-[10px] w-full h-[125px] p-[3px] flex flex-col">
        <div className="flex flex-row justify-between p-1">
          <p className="">{tag}</p>
          <div className="relative">
            <Menu as="div" className="w-fit">
              <MenuButton>
                <EllipsisVerticalIcon className="size-[24px] hover:bg-blue-200"></EllipsisVerticalIcon>
              </MenuButton>
              <MenuItems className="absolute right-0 border-2 rounded-[10px] bg-white flex flex-col z-10">
                <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("Move")}>
                  Move Course
                </MenuItem>
                <hr />
                <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("Link")}>
                  Link Course
                </MenuItem>
                <hr />
                <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => click("Remove")}>
                  Remove Course
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
        <h1 className="text-xl text-center self-center">{prefix + " " + number}</h1>
        <p className="text-md text-center self-center line-clamp-2 max-w-8/10">{name}</p>
      </div>
    </>
  )
}

// Learn to create a default version
// Course Name CR 1234

export default PlannerCourse