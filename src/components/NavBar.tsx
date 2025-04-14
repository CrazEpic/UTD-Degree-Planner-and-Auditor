import { Button, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { UserCircleIcon, Bars3Icon } from "@heroicons/react/24/outline"

function NavBar() {
    return (
        <>
            <div className="flex flex-row px-4 justify-between items-center bg-[#154734] w-full h-[55px] border">
                <Menu as="div" className="lg:hidden">
                    <MenuButton className="hover:bg-blue-200">
                        <Bars3Icon className="size-8" color="white"></Bars3Icon>
                    </MenuButton>
                    <MenuItems className="absolute left-0 border-2 rounded-lg bg-white flex flex-col z-10">
                        <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => console.log("One")}>
                            Setting 1
                        </MenuItem>
                        <hr />
                        <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => console.log("Two")}>
                            Setting 2
                        </MenuItem>
                        <hr />
                        <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => console.log("Three")}>
                            Setting 3
                        </MenuItem>
                        <hr />
                        <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => console.log("Three")}>
                            Place
                        </MenuItem>
                        <hr />
                        <MenuItem as="button" className="text-xl mx-2 my-3 text-nowrap" onClick={() => console.log("Three")}>
                            Holder
                        </MenuItem>
                    </MenuItems>
                </Menu>
                <div className="flex flex-row gap-4 max-lg:hidden">
                    <Button className="text-white hover:bg-red-300 py-3">
                        Place
                    </Button>
                    <Button className="text-white hover:bg-red-300 py-3">
                        Holder
                    </Button>
                </div>
                <UserCircleIcon className="hover:bg-red-300 size-8" color="white"></UserCircleIcon>
            </div>
        </>
    )
}

export default NavBar