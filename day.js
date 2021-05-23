createStatsObject= ()=>
{
  var obj={};
  obj.total=0
  obj.golem=0;
  obj.human=0;
  return obj;
}

class Day {
  constructor(dateString) {
    this.dateString = dateString;
    this.gamesCreated = createStatsObject();
    this.movesPerformed = createStatsObject();
    this.golemCalculationTimes = [];
    this.golemCosts = [];



    
  }
  getAvg = (array)=> array.length===0?0: array.reduce((a, b) => a + b) / array.length;
  getMax = (array) => Math.max.apply(Math, array);
  getMin = (array) => Math.min.apply(Math, array);
  getAvgMinMaxRounded = (array) => [this.dateString,Math.round(this.getAvg(array)),Math.round(this.getMin(array)),Math.round(this.getMax(array))].join(",")+"\n"
  getAvgMinMax = (array) => [this.dateString,this.getAvg(array),this.getMin(array),this.getMax(array)].join(",")+"\n"

}

module.exports = Day;
