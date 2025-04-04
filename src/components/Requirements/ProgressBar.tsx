// progress => [completed, planned, unplanned]
function ProgressBar({progress} : {progress: number[]}) {

  const total = progress.reduce((sum, current) => sum = sum + current, 0)
  
  return (
    <>
      <div className="min-w-min h-[30px]">
        <p className="text-xs text-center text-nowrap">{(progress[0] + progress[1]).toString() + "/" + total.toString() + " " + ((progress[0]) == total ? ("Completed") : ("Planned"))}</p>
        <div className="flex flex-row border rounded-[20px] h-[12px] overflow-hidden">
          <div className="bg-green-200" style={{ width: `${(progress[0] / total) * 100}%`}}></div>
          <div className="bg-yellow-100" style={{ width: `${(progress[1] / total) * 100}%`}}></div>
          <div className="bg-red-200" style={{ width: `${(progress[2] / total) * 100}%`}}></div>
        </div>
      </div>
    </>
  )
}

export default ProgressBar