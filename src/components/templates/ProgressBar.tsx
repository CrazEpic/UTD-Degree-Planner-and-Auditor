function ProgressBar() {
  return (
    <>
      <div className="h-[30px]">
        <p className="text-xs text-center">##/## Planned</p>
        <div className="flex flex-row border rounded-[20px] h-[12px] overflow-hidden">
          {/* Can use the w-fraction style for progress bar completion*/}
          <div className="w-2/10 bg-red-200"></div>
          <div className="w-4/10 bg-yellow-100"></div>
          <div className="w-4/10 bg-green-200"></div>
        </div>
      </div>
    </>
  )
}

export default ProgressBar