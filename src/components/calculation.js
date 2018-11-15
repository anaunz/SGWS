let cal = function (api, before, after, moisture) {
  const timeNow = new Date()
  const hour = timeNow.getHours()
  let predict = 0
  if(hour > after && hour < before){
    predict = 100
  }
  return predict
}

export default cal
