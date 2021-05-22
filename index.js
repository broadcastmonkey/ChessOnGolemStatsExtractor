const StatsManager = new (require("./stats"))();

StatsManager.loadGamesFromDisk();
StatsManager.getStats();
