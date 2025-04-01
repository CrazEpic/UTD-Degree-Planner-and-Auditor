// progress => [completed, planned, unplanned]
function ProgressBar({progress} : {progress: number[]}) {

  const total = progress.reduce((sum, current) => sum = sum + current, 0)

  /*  
    Using the fraction style for the percentages works, but it does not load
    until it is manually used elsewhere. I find this highly strange, I tried to
    pull this out and create the strings ahead of time, this did not work.

    Will end up using something else if this problem persists
  */
  const completed = "w-" + progress[0].toString() + "/" + total.toString()
  const planned = "w-" + progress[1].toString() + "/" + total.toString()
  const unplanned = "w-" + progress[2].toString() + "/" + total.toString()

  return (
    <>
      <div className="h-[30px]">
        <p className="text-xs text-center">{(progress[0] + progress[1]).toString() + "/" + total.toString() + " " + ((progress[0]) == total ? ("Completed") : ("Planned"))}</p>
        <div className="flex flex-row border rounded-[20px] h-[12px] overflow-hidden">
          <div className={completed + " bg-green-200"}></div>
          <div className={planned + " bg-yellow-100"}></div>
          <div className={unplanned +  " bg-red-200"}></div>
        </div>
      </div>
    </>
  )
}

export default ProgressBar