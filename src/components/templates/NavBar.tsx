function NavBar() {
  return (
    <>
      <div className="bg-[#154734] w-full h-[55px] border">
        <ul className="bg-black">
          <li className="float-left hover:bg-red-300"><p className="py-3 px-4">Place</p></li>
          <li className="float-left hover:bg-red-300"><p className="py-3 px-4">Holder</p></li>
          <li className="float-right hover:bg-red-300"><p className="py-3 px-4">Text</p></li>
        </ul>
      </div>
    </>
  )
}

export default NavBar