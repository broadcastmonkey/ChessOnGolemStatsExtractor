/*jshint esversion: 6 */
const fs = require("fs");

const ChessTempPathHelper = require("./helpers/chess-temp-path-helper");
const { GameType, PlayerType,TurnType } = require("./helpers/enums");
const ChessGame = require("./chess-game");
const Day = require("./day");
class StatsManager {
  constructor() {
    this.games = [];
    this.days = [];
    this.currentGameId = 0; 
  }

  loadGamesFromDisk = () => {
    console.log("loading games from disk...");
    const paths = new ChessTempPathHelper(0, 0);
    if (fs.existsSync(paths.GamesFolder)) {
      const filenames = fs.readdirSync(paths.GamesFolder);
     // console.log("filenames");
     // console.log(filenames);
      filenames
        .filter((x) => x.includes("game_") && x.includes(".json"))
        .forEach((x) => {
          let id = parseInt(
            x.substring(x.lastIndexOf("game_") + 5, x.lastIndexOf(".json"))
          );
       //   console.log("loading file : " + x);
        //  console.log("id: " + id);
          let game = this.addGame(GameType.UNKNOWN, { id });
          game.loadFromFile();

          this.currentGameId = Math.max(this.currentGameId, id + 1);
        });
    }
  };
  addGame = (gameType, options) => {
    let id = 0;
    if (options === undefined || options.id === undefined) {
      id = this.currentGameId++;
    } else {
      id = options.id;
    }

    if (this.getGame(id) !== undefined) {
      console.log(`!!! game with id: ${id} already exists`);
      return undefined;
    }

 //   console.log(`options: ` + JSON.stringify(options, null, 4));

    const game = new ChessGame(id, this.chessServer, gameType, options);
    this.games.push(game);

    return game;
  };
  getGame = (id) => {
    return this.games.find((x) => x.gameId === id);
  };
  getDay = (dateString) => {
     var day =  this.days.find((x) => x.dateString === dateString);
     if(day===undefined)
     {
        var newDay = new Day(dateString);
        this.days.push(newDay);
        return newDay;
     }
     return day;
  };


  getGames = () => {
    const games = [];
    this.games.forEach((x) => {
      const vals = x.getGameObject(false);
      const { moves, gameType, gameStartedTimeString, ...game } = vals;
      game.movesCount = moves.length;
      game.moves = moves;
      game.golemGames = gameType === GameType.GOLEM_VS_GOLEM ? 1 : 0;
      game.playerGames = gameType === GameType.PLAYER_VS_GOLEM ? 1 : 0;
      game.gameStartedTimeString = gameStartedTimeString;
      games.push(game);
    });
    return games;
  };
  getStats = () => {
    let gameStats = this.getGames();
    let movesCount = 0;
    let golemGames = 0;
    let playerGames = 0;
    gameStats.forEach((x) => {
      movesCount += x.movesCount;
      golemGames += x.golemGame;
      playerGames += x.playerGame;
   
      var day = this.getDay(x.gameStartedTimeString);


      day.gamesCreated.total+=x.golemGames + x.playerGames;
      day.gamesCreated.golem+=x.golemGames;
      day.gamesCreated.human+=x.playerGames;

        x.moves.forEach(move=>
        {
          var moveDay = this.getDay(move.dateString);
          moveDay.movesPerformed.total++;
          if(move.playerType===TurnType.PLAYER)
              moveDay.movesPerformed.human++;
          else   {
              moveDay.movesPerformed.golem++;
              moveDay.golemCalculationTimes.push(move.total_time/1000);
            
              if(move.cost>0){moveDay.golemCosts.push(parseFloat(move.cost));}
          }
        })
      //moves performed

    });
    console.log("total moves count: " + movesCount);
    console.log("total golem games: " + golemGames);
    console.log("total player games: " + playerGames);
  };
  getLineForStatsObject(date,data)
  {
    return `${date},${data.golem},${data.human},${data.total}\n`;
  }
  getMovesCountStats = () =>
  {
      var lines="";
      this.days.forEach(day=>lines+=this.getLineForStatsObject(day.dateString,day.movesPerformed));
      return lines;
  }
  getGamesCreatedStats = () =>
  {
      var lines="";
      this.days.forEach(day=>lines+=this.getLineForStatsObject(day.dateString,day.gamesCreated));
      return lines;
  }
  getGolemTimeStats = ()=>
  {
    var lines="";
    this.days.forEach(day=>lines+=day.getAvgMinMaxRounded(day.golemCalculationTimes));
    return lines;
  }
  getGolemCostsStats = ()=>
  {
    var lines="";
    this.days.forEach(day=>lines+=day.getAvgMinMax(day.golemCosts));
    return lines;
  }
}
module.exports = StatsManager;
