import { UserCircleIcon } from "@heroicons/react/24/outline"

function NavBar() {
    return (
        <>
            <div className="flex flex-row px-4 justify-end items-center bg-[#154734] w-full h-[55px] border">
                <UserCircleIcon className="hover:bg-red-300 size-8" color="white"></UserCircleIcon>
            </div>
        </>
    )
}

export default NavBar