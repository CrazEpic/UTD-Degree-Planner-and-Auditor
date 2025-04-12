import { UserCircleIcon } from "@heroicons/react/24/outline"

function NavBar() {
    return (
        <>
            <div className="flex flex-row justify-between items-center bg-[#154734] w-full h-[55px] border">
                <div className="flex flex-row">
                    <p className="text-white hover:bg-red-300 py-3 px-4">Place</p>
                    <p className="text-white hover:bg-red-300 py-3 px-4">Holder</p>
                </div>
                <UserCircleIcon className="hover:bg-red-300 size-8 m-4" color="#ffffff"></UserCircleIcon>
            </div>
        </>
    )
}

export default NavBar