let cal = function (api, timeSet, moisture) {
  const timeNow = new Date()
  const hour = timeNow.getHours()
  let predict = 0
  if(hour > timeSet.after && hour < timeSet.before){
    predict = 100
  }
  return predict
}

export default cal
