const StatsManager = new (require("./stats"))();
const fs = require("fs")
StatsManager.loadGamesFromDisk();
StatsManager.getStats();
fs.writeFileSync("moves_per_day.csv",StatsManager.getMovesCountStats());
fs.writeFileSync("avg_golem_calculation_time.csv",StatsManager.getGolemTimeStats());
fs.writeFileSync("golem_costs.csv",StatsManager.getGolemCostsStats());
fs.writeFileSync("games_created.csv",StatsManager.getGamesCreatedStats());


