function ProgressBar() {
  return (
    <>
      <div className="border h-[30px]">
        <p className="text-xs">16/42 Planned</p>
        <div className="border rounded-[20px] h-[12px]">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  )
}

export default ProgressBar