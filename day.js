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
    
  }
}

module.exports = Day;
