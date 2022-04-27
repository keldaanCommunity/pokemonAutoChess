import {Command} from '@colyseus/command';
import { COST, NEUTRAL_STAGE } from '../../models/enum';
import { ITEM_RECIPE } from '../../types/Config';
import { Item, BasicItem } from '../../types/enum/Item';
import { BattleResult } from '../../types/enum/Game';
import Player from '../../models/colyseus-models/player';
import PokemonFactory from '../../models/pokemon-factory';
import ItemFactory from '../../models/item-factory';
import UserMetadata from '../../models/mongo-models/user-metadata';
import GameRoom from '../game-room';
import { Client } from "colyseus";
import {MapSchema} from '@colyseus/schema';
import { GamePhaseState, Rarity } from '../../types/enum/Game';
import {IDragDropMessage, IDragDropItemMessage, IDragDropCombineMessage, IClient, IPokemonEntity} from '../../types';
import { Synergy } from '../../types/enum/Synergy';
import {Pkm, PokemonIndex} from '../../types/enum/Pokemon';
import { Pokemon } from '../../models/colyseus-models/pokemon';
export class OnShopCommand extends Command<GameRoom, {
  id: string,
  index: number
}> {
  execute({id, index}) {
    if (id !== undefined && index !== undefined && this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.shop[index]) {
        const name = player.shop[index];
        let pokemon = PokemonFactory.createPokemonFromName(name, player.pokemonCollection.get(PokemonIndex[name]));
        if (pokemon.name !== Pkm.MAGIKARP &&
          (player.money >= pokemon.cost && (this.room.getBoardSize(player.board) < 8 ||
        (this.room.getPossibleEvolution(player.board, pokemon.name) && this.room.getBoardSize(player.board) == 8)))) {
          player.money -= pokemon.cost;
          if (pokemon.name == Pkm.CASTFORM) {
            if (player.synergies.get(Synergy.FIRE) > 0 || player.synergies.get(Synergy.WATER) > 0 || player.synergies.get(Synergy.ICE)) {
              const rankArray = [{s: Synergy.FIRE, v: player.synergies.get(Synergy.FIRE)}, {s: Synergy.WATER, v: player.synergies.get(Synergy.WATER)}, {s: Synergy.ICE, v: player.synergies.get(Synergy.ICE)}];
              rankArray.sort((a, b)=>{
                return b.v -a.v;
              });
              switch (rankArray[0].s) {
                case Synergy.FIRE:
                  pokemon = PokemonFactory.createPokemonFromName(Pkm.CASTFORM_SUN, player.pokemonCollection.get(PokemonIndex[Pkm.CASTFORM_SUN]));
                  break;
                case Synergy.WATER:
                  pokemon = PokemonFactory.createPokemonFromName(Pkm.CASTFORM_RAIN, player.pokemonCollection.get(PokemonIndex[Pkm.CASTFORM_RAIN]));
                  break;
                case Synergy.ICE:
                  pokemon = PokemonFactory.createPokemonFromName(Pkm.CASTFORM_HAIL, player.pokemonCollection.get(PokemonIndex[Pkm.CASTFORM_HAIL]));
                  break;
              }
            }
          }
          pokemon.positionX = this.room.getFirstAvailablePositionInBoard(player.id);
          pokemon.positionY = 0;
          player.board.set(pokemon.id, pokemon);
          if (pokemon.rarity == Rarity.MYTHICAL) {
            this.state.shop.assignShop(player);
          } else {
            player.shop[index] = Pkm.DEFAULT;
          }
          this.room.updateEvolution(id);
          this.room.updateEvolution(id);
        }
      }
    }
  }
}

export class OnItemCommand extends Command<GameRoom, {
  playerId: string,
  id: string
}> {
  execute({playerId, id}) {
    if (this.state.players.has(playerId)) {
      const player = this.state.players.get(playerId);
      if (player.itemsProposition.includes(id)) {
        player.items.add(id);
      }
      while (player.itemsProposition.length > 0) {
        player.itemsProposition.pop();
      }
    }
  }
}

export class OnDragDropCommand extends Command<GameRoom, {
  client: IClient,
  detail: IDragDropMessage
}> {
  execute({client, detail}) {
    const commands = [];
    let success = false;
    let dittoReplaced = false;
    const message = {
      'updateBoard': true,
      'updateItems': true
    };
    const playerId = client.auth.uid;
    if (this.state.players.has(playerId)) {
      const player = this.state.players.get(playerId);
      message.updateItems = false;
      if (this.state.players.get(playerId).board.has(detail.id)) {
        const pokemon = this.state.players.get(playerId).board.get(detail.id);
        const x = parseInt(detail.x);
        const y = parseInt(detail.y);
        if (pokemon.name == Pkm.DITTO) {
          const pokemonToClone = this.room.getPokemonByPosition(playerId, x, y);
          if (pokemonToClone && pokemonToClone.rarity != Rarity.MYTHICAL && !pokemonToClone.types.includes(Synergy.FOSSIL)) {
            dittoReplaced = true;
            const replaceDitto = PokemonFactory.createPokemonFromName(PokemonFactory.getPokemonBaseEvolution(pokemonToClone.name), player.pokemonCollection.get(PokemonIndex[pokemonToClone.name]));
            this.state.players.get(playerId).board.delete(detail.id);
            const position = this.room.getFirstAvailablePositionInBoard(playerId);
            if (position !== undefined) {
              replaceDitto.positionX = position;
              replaceDitto.positionY = 0;
              this.state.players.get(playerId).board.set(replaceDitto.id, replaceDitto);
              success = true;
              message.updateBoard = false;
            }
          }
        } else {
          if ( y == 0 && pokemon.positionY == 0) {
            this.room.swap(playerId, pokemon, x, y);
            success = true;
          } else if (this.state.phase == GamePhaseState.PICK) {
            const teamSize = this.room.getTeamSize(this.state.players.get(playerId).board);
            if (teamSize < this.state.players.get(playerId).experienceManager.level) {
              this.room.swap(playerId, pokemon, x, y);
              success = true;
            } else if (teamSize == this.state.players.get(playerId).experienceManager.level) {
              const empty = this.room.isPositionEmpty(playerId, x, y);
              if (!empty) {
                this.room.swap(playerId, pokemon, x, y);
                success = true;
                message.updateBoard = false;
              } else {
                if ((pokemon.positionY != 0 && y != 0) || y == 0) {
                  this.room.swap(playerId, pokemon, x, y);
                  success = true;
                  message.updateBoard = false;
                }
              }
            }
          }
        }
        this.state.players.get(playerId).synergies.update(this.state.players.get(playerId).board);
        this.state.players.get(playerId).effects.update(this.state.players.get(playerId).synergies);
        this.state.players.get(playerId).boardSize = this.room.getTeamSize(this.state.players.get(playerId).board);
      }

      if (!success && client.send) {
        client.send('DragDropFailed', message);
      }
      if (dittoReplaced) {
        this.room.updateEvolution(playerId);
        this.room.updateEvolution(playerId);
      }

      player.synergies.update(player.board);
      player.effects.update(player.synergies);
    }
    if (commands.length > 0) {
      return commands;
    }
  }
}

export class OnDragDropCombineCommand extends Command<GameRoom, {
    client: Client,
    detail: IDragDropCombineMessage
}> {
    execute({client, detail}){
        const playerId = client.auth.uid;
        const message = {
            'updateBoard': true,
            'updateItems': true
        };
        if (this.state.players.has(playerId)) {
            
            message.updateBoard = false;
            message.updateItems = true;
    
            const itemA = detail.itemA
            const itemB = detail.itemB
    
            //verify player has both items
            
            const player = this.state.players.get(playerId);
            if(!player.items.has(itemA) || !player.items.has(itemB)){
                client.send('DragDropFailed', message);
                return;
            }
            // check for two if both items are same
            else if(itemA == itemB){
                let count = 0;
                player.items.forEach((item) => {
                if(item == itemA){
                    count++;
                }
                })
    
                if(count < 2){
                client.send('DragDropFailed', message);
                return;
                }
            }
    
    
            // find recipe result
            let result = null;
            for (const [key, value] of Object.entries(ITEM_RECIPE)) {
                if ((value[0] == itemA && value[1] == itemB) || (value[0] == itemB && value[1] == itemA)) {
                result = key;
                break;
                }
            }
    
            if(!result){
                client.send('DragDropFailed', message);
                return;
            }
    
            // schema changes
            player.items.add(result)
            player.items.delete(itemA)
            player.items.delete(itemB)

            player.synergies.update(player.board);
            player.effects.update(player.synergies);
        }
    }

}
export class OnDragDropItemCommand extends Command<GameRoom, {
    client: Client,
    detail: IDragDropItemMessage
}> {
    execute({client, detail}){
        const commands = [];
        const playerId = client.auth.uid;
        const message = {
            'updateBoard': true,
            'updateItems': true
          };
        if (this.state.players.has(playerId)) {
          const player = this.state.players.get(playerId);
            message.updateBoard = false;
            message.updateItems = true;

            const item = detail.id;

            if (!player.items.has(item) && !detail.bypass) {
                client.send('DragDropFailed', message);
                return;
            }

            const x = parseInt(detail.x);
            const y = parseInt(detail.y);

            const pokemon = player.getPokemonAt(x, y) as Pokemon;

            if (pokemon === null) {
                client.send('DragDropFailed', message);
                return;
            }
            // check if full items
            if (pokemon.items.size >= 3) {
                if (Object.keys(BasicItem).includes(item)) {
                let includesBasicItem = false;
                pokemon.items.forEach((i)=>{
                    if (Object.keys(BasicItem).includes(i)) {
                    includesBasicItem = true;
                    }
                });
                if (!includesBasicItem) {
                    client.send('DragDropFailed', message);
                    return;
                }
                } else {
                client.send('DragDropFailed', message);
                return;
                }
            }

            // SPECIAL CASES: create a new pokemon on item equip
            let newItemPokemon = null;
            let equipAfterTransform = true;
            switch (pokemon.name) {
                case Pkm.EEVEE:
                switch (item) {
                    case Item.WATER_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.VAPOREON);
                    break;
                    case Item.FIRE_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.FLAREON);
                    break;
                    case Item.THUNDER_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.JOLTEON);
                    break;
                    case Item.DUSK_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.UMBREON);
                    break;
                    case Item.MOON_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.SYLVEON);
                    break;
                    case Item.LEAF_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.LEAFEON);
                    break;
                    case Item.DAWN_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.ESPEON);
                    break;
                    case Item.ICY_ROCK:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.GLACEON);
                    break;
                }
                break;
                case Pkm.DITTO:
                equipAfterTransform = false;
                switch (item) {
                    case Item.FOSSIL_STONE:
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, PokemonFactory.getRandomFossil(player.board));
                    break;
                    default:
                    client.send('DragDropFailed', message);
                    break;
                }
                break;
                case Pkm.GROUDON:
                if (item == Item.RED_ORB) {
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.PRIMAL_GROUDON);
                }
                break;
                case Pkm.KYOGRE:
                if (item == Item.BLUE_ORB) {
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.PRIMAL_KYOGRE);
                }
                break;
                case Pkm.RAYQUAZA:
                if (item == Item.DELTA_ORB) {
                    newItemPokemon = PokemonFactory.transformPokemon(pokemon, Pkm.MEGA_RAYQUAZA);
                }
                break;
            }

            if (newItemPokemon) {
                // delete the extra pokemons
                player.board.delete(pokemon.id);
                player.board.set(newItemPokemon.id, newItemPokemon);
                player.synergies.update(player.board);
                player.effects.update(player.synergies);
                player.boardSize = this.room.getTeamSize(player.board);
                if (equipAfterTransform) {
                newItemPokemon.items.add(item);
                }
                player.items.delete(item);
                return;
            }

            // regular equip
            switch (item) {
                case Item.WATER_STONE:
                if(!pokemon.types.includes(Synergy.WATER)){
                    pokemon.types.push(Synergy.WATER)
                }
                break;
                case Item.FIRE_STONE:
                if(!pokemon.types.includes(Synergy.FIRE)){
                    pokemon.types.push(Synergy.FIRE)
                }
                break;
                case Item.THUNDER_STONE:
                if(!pokemon.types.includes(Synergy.ELECTRIC)){
                    pokemon.types.push(Synergy.ELECTRIC)
                }
                break;
                case Item.DUSK_STONE:
                if(!pokemon.types.includes(Synergy.DARK)){
                    pokemon.types.push(Synergy.DARK)
                }
                break;
                case Item.MOON_STONE:
                if(!pokemon.types.includes(Synergy.FAIRY)){
                    pokemon.types.push(Synergy.FAIRY)
                }
                break;
                case Item.LEAF_STONE:
                if(!pokemon.types.includes(Synergy.GRASS)){
                    pokemon.types.push(Synergy.GRASS)
                }
                break;
                case Item.DAWN_STONE:
                if(!pokemon.types.includes(Synergy.PSYCHIC)){
                    pokemon.types.push(Synergy.PSYCHIC)
                }
                break;
                case Item.ICY_ROCK:
                if(!pokemon.types.includes(Synergy.ICE)){
                    pokemon.types.push(Synergy.ICE)
                }
                break;
                case Item.OLD_AMBER:
                if(!pokemon.types.includes(Synergy.FOSSIL)){
                    pokemon.types.push(Synergy.FOSSIL)
                }
                break;
            }

            if (Object.keys(BasicItem).includes(item)) {
                let itemToCombine;
                pokemon.items.forEach( (i)=>{
                if (Object.keys(BasicItem).includes(i)) {
                    itemToCombine = i;
                }
                });
                if (itemToCombine) {
                (Object.keys(ITEM_RECIPE) as Item[]).forEach((name) => {
                    const recipe = ITEM_RECIPE[name];
                    if ((recipe[0] == itemToCombine && recipe[1] == item) || (recipe[0] == item && recipe[1] == itemToCombine)) {
                    pokemon.items.delete(itemToCombine);
                    player.items.delete(item);

                    if (pokemon.items.has(name)) {
                        player.items.add(name);
                    } else {
                        const detail: IDragDropItemMessage = {
                        id: name,
                        x: pokemon.positionX,
                        y: pokemon.positionY,
                        bypass: true
                        };
                        commands.push(new OnDragDropItemCommand().setPayload({client: client, detail: detail}));
                    }
                    }
                });
                } else {
                pokemon.items.add(item);
                player.items.delete(item);
                }
            } else {
                if (pokemon.items.has(item)) {
                    client.send('DragDropFailed', message);
                    return;
                } 
                else {
                    pokemon.items.add(item);
                    player.items.delete(item);
                }
            }

            player.synergies.update(player.board);
            player.effects.update(player.synergies);
            if (commands.length > 0) {
                return commands;
            }
        }
    }
}

export class OnSellDropCommand extends Command<GameRoom, {
  client: Client,
  detail: {pokemonId: string}
}> {
  execute({client, detail}) {
    if (this.state.players.has(client.auth.uid) &&
      this.state.players.get(client.auth.uid).board.has(detail.pokemonId)) {
      const pokemon = this.state.players.get(client.auth.uid).board.get(detail.pokemonId);
      const player = this.state.players.get(client.auth.uid);

      if (PokemonFactory.getPokemonBaseEvolution(pokemon.name) == Pkm.EEVEE) {
        player.money += COST[pokemon.rarity];
      } else if (pokemon.types.includes(Synergy.FOSSIL)) {
        player.money += 5 + COST[pokemon.rarity] * pokemon.stars;
      } else {
        player.money += COST[pokemon.rarity] * pokemon.stars;
      }

      pokemon.items.forEach((it)=>{
        player.items.add(it);
      });

      player.board.delete(detail.pokemonId);

      player.synergies.update(player.board);
      player.effects.update(player.synergies);
      player.boardSize = this.room.getTeamSize(player.board);
    }
  }
}

export class OnRefreshCommand extends Command<GameRoom, {
  id: string
}> {
  execute(id) {
    if (this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.money >= 2) {
        this.state.shop.assignShop(player);
        player.money -= 2;
      }
    }
  }
}

export class OnLockCommand extends Command<GameRoom, {
  id: string
}> {
  execute(id) {
    if (this.state.players.has(id)) {
      this.state.players.get(id).shopLocked = !this.state.players.get(id).shopLocked;
    }
  }
}

export class OnLevelUpCommand extends Command<GameRoom, {
  id: string
}> {
  execute(id) {
    if (this.state.players.has(id)) {
      const player = this.state.players.get(id);
      if (player.money >= 4 && player.experienceManager.canLevel()) {
        player.experienceManager.addExperience(4);
        player.money -= 4;
      }
    }
  }
}

export class OnJoinCommand extends Command<GameRoom, {
  client: Client,
  options: any,
  auth: any
}> {
  execute({client, options, auth}) {
    UserMetadata.findOne({'uid': auth.uid}, (err, user)=>{
      if (user) {
        this.state.players.set(client.auth.uid, new Player(
            user.uid,
            user.displayName,
            user.elo,
            user.avatar,
            false,
            this.state.players.size + 1,
            user.pokemonCollection
        ));
        if (client && client.auth && client.auth.displayName) {
          console.log(`${client.auth.displayName} ${client.id} join game room`);
        }

        // console.log(this.state.players.get(client.auth.uid).tileset);
        this.state.shop.assignShop(this.state.players.get(client.auth.uid));
        if (this.state.players.size >= 8) {
        // console.log('game elligible to xp');
          this.state.elligibleToXP = true;
        }
      }
    });
  }
}

export class OnUpdateCommand extends Command<GameRoom, {
  deltaTime: number
}> {
  execute({deltaTime}) {
    if (deltaTime) {
      let updatePhaseNeeded = false;
      this.state.time -= deltaTime;
      if (Math.round(this.state.time/1000) != this.state.roundTime) {
        this.state.roundTime = Math.round(this.state.time/1000);
      }
      if (this.state.time < 0) {
        updatePhaseNeeded = true;
      } else if (this.state.phase == GamePhaseState.FIGHT) {
        let everySimulationFinished = true;

        this.state.players.forEach((player, key) => {
          if (!player.simulation.finished) {
            if (everySimulationFinished) {
              everySimulationFinished = false;
            }
            player.simulation.update(deltaTime);
          }
        });

        if (everySimulationFinished) {
          updatePhaseNeeded = true;
        }
      }
      if (updatePhaseNeeded) {
        return [new OnUpdatePhaseCommand()];
      }
    }
  }
}

export class OnUpdatePhaseCommand extends Command<GameRoom, any> {
  execute() {
    if (this.state.phase == GamePhaseState.PICK) {
      const commands = this.checkForLazyTeam();
      if (commands.length != 0) {
        return commands;
      }
      this.initializeFightingPhase();
    } else if (this.state.phase == GamePhaseState.FIGHT) {
      this.computeStreak();
      this.computeLife();
      this.rankPlayers();
      this.checkDeath();
      const kickCommands = this.checkEndGame();
      if (kickCommands.length != 0) {
        return kickCommands;
      }
      this.computeIncome();
      this.initializePickingPhase();
    }
  }

  checkEndGame() {
    const commands = [];
    const numberOfPlayersAlive = this.room.getNumberOfPlayersAlive(this.state.players);

    if (numberOfPlayersAlive <= 1) {
      this.state.gameFinished = true;
      this.room.broadcast('info',
          {
            title: 'End of the game',
            info: 'We have a winner !'
          });
      // commands.push(new OnKickPlayerCommand());
    }
    return commands;
  }

  computePlayerDamage(redTeam: MapSchema<IPokemonEntity>, playerLevel: number, stageLevel: number) {
    let damage = playerLevel - 2;
    let multiplier = 1;
    if (stageLevel >= 10) {
      multiplier = 1.25;
    } else if (stageLevel >= 15) {
      multiplier = 1.5;
    } else if (stageLevel >= 20) {
      multiplier = 2.0;
    } else if (stageLevel >= 25) {
      multiplier = 3;
    } else if (stageLevel >= 30) {
      multiplier = 5;
    } else if (stageLevel >= 35) {
      multiplier = 8;
    }
    damage = damage * multiplier;
    if (redTeam.size > 0) {
      redTeam.forEach((pokemon, key) => {
        damage += pokemon.stars;
      });
    }
    damage = Math.max(Math.round(damage), 0);
    return damage;
  }

  rankPlayers() {
    const rankArray = [];
    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return;
      }

      rankArray.push({
        id: player.id,
        life: player.life,
        level: player.experienceManager.level
      });
    });

    const sortPlayers = (a, b) => {
      let diff = b.life - a.life;
      if (diff == 0) {
        diff = b.level - a.level;
      }
      return diff;
    };

    rankArray.sort(sortPlayers);

    rankArray.forEach((rankPlayer, index)=>{
      if(this.state.players.has(rankPlayer.id)){
        this.state.players.get(rankPlayer.id).rank = index + 1;
      }
    });
  }

  computeLife() {
    const isPVE = this.checkForPVE();
    this.state.players.forEach((player, key) => {
      if (player.alive) {
        const currentResult = player.getCurrentBattleResult();

        if (currentResult == BattleResult.DEFEAT || currentResult == BattleResult.DRAW) {
          player.life = player.life - this.computePlayerDamage(player.simulation.redTeam, player.experienceManager.level, this.state.stageLevel);
        }
        player.addBattleResult(player.opponentName, currentResult, player.opponentAvatar, isPVE);
      }
    });
  }

  computeStreak() {
    if (this.checkForPVE()) {
      return;
    }

    this.state.players.forEach((player, key) => {
      if (!player.alive) {
        return;
      }
      const currentResult = player.getCurrentBattleResult();
      const lastPlayerResult = player.getLastPlayerBattleResult();

      if (currentResult == BattleResult.DRAW || currentResult != lastPlayerResult) {
        player.streak = 0;
      } else {
        player.streak = Math.min(player.streak + 1, 5);
      }
    });
  }

  computeIncome() {
    this.state.players.forEach((player, key) => {
      if (player.alive && !player.isBot) {
        player.interest = Math.min(Math.floor(player.money / 10), 5);
        player.money += player.interest;
        player.money += player.streak;
        if (player.getLastBattleResult() == BattleResult.WIN) {
          player.money += 1;
        }
        player.money += 5;
        player.experienceManager.addExperience(2);
      }
    });
  }

  checkDeath() {
    this.state.players.forEach((player: Player, key: string) => {
      if (player.life <= 0) {
        player.life = 0;
        player.alive = false;
      }
    });
  }

  initializePickingPhase() {
    this.state.phase = GamePhaseState.PICK;
    const isPVE = this.checkForPVE();

    this.state.time = 30000;

    this.state.players.forEach((player: Player, key: string) => {
      player.simulation.stop();
      if (player.alive) {
        if (player.isBot) {
          player.experienceManager.level = Math.min(9, Math.round(this.state.stageLevel/2));
        }
        if (isPVE && player.getLastBattleResult() == BattleResult.WIN) {
          const items = ItemFactory.createRandomItems();
          // let items = process.env.MODE == 'dev' ? ItemFactory.createRandomFossils(): ItemFactory.createRandomItem();
          items.forEach((item)=>{
            player.itemsProposition.push(item);
          });
          // const item = ItemFactory.createRandomItem();
          // const item = ItemFactory.createSpecificItems([ItemS.BLUE_ORB]);
          player.items.add(ItemFactory.createBasicRandomItem());
        }
        player.opponentName = '';

        if (!player.shopLocked) {
          if (this.state.stageLevel == 10) {
            this.state.shop.assignFirstMythicalShop(player);
          } else if (this.state.stageLevel == 20) {
            this.state.shop.assignSecondMythicalShop(player);
          } else if (this.state.stageLevel == 2) {
            this.state.shop.assignDittoShop(player);
          } else if (this.state.stageLevel == 3) {
            this.state.shop.assignDittoShop(player);
          } else {
            this.state.shop.assignShop(player);
          }
        } else {
          player.shopLocked = false;
        }
        player.board.forEach((pokemon, key)=>{
          if (pokemon.fossilTimer !== undefined) {
            if (pokemon.fossilTimer == 0) {
              const pokemonEvolved = PokemonFactory.createPokemonFromName(pokemon.evolution, player.pokemonCollection.get(pokemon.index));
              pokemon.items.forEach((i)=>{
                pokemonEvolved.items.add(i);
                switch (i) {
                  case Item.WATER_STONE:
                    pokemonEvolved.types.push(Synergy.WATER);
                    break;
                  case Item.FIRE_STONE:
                    pokemonEvolved.types.push(Synergy.FIRE);
                    break;
                  case Item.THUNDER_STONE:
                    pokemonEvolved.types.push(Synergy.ELECTRIC);
                    break;
                  case Item.DUSK_STONE:
                    pokemonEvolved.types.push(Synergy.DARK);
                    break;
                  case Item.MOON_STONE:
                    pokemonEvolved.types.push(Synergy.FAIRY);
                    break;
                  case Item.LEAF_STONE:
                    pokemonEvolved.types.push(Synergy.GRASS);
                    break;
                  case Item.DAWN_STONE:
                    pokemonEvolved.types.push(Synergy.PSYCHIC);
                    break;
                  case Item.ICY_ROCK:
                    pokemonEvolved.types.push(Synergy.ICE);
                    break;
                  case Item.OLD_AMBER:
                    pokemonEvolved.types.push(Synergy.FOSSIL);
                    break;
                }
              });
              pokemonEvolved.positionX = pokemon.positionX;
              pokemonEvolved.positionY = pokemon.positionY;
              player.board.delete(key);
              player.board.set(pokemonEvolved.id, pokemonEvolved);
            } else {
              pokemon.fossilTimer -= 1;
            }
          }
        });
      }
    });
  }

  checkForLazyTeam() {
    const commands = [];

    this.state.players.forEach((player, key) => {
      const teamSize = this.room.getTeamSize(player.board);
      if (teamSize < player.experienceManager.level) {
        const numberOfPokemonsToMove = player.experienceManager.level - teamSize;
        for (let i = 0; i < numberOfPokemonsToMove; i++) {
          const boardSize = this.room.getBoardSizeWithoutDitto(player.board);
          if (boardSize > 0) {
            const coordinate = this.room.getFirstAvailablePositionInTeam(player.id);
            const detail = {
              'id': this.room.getFirstPokemonOnBoard(player.board).id,
              'x': coordinate[0],
              'y': coordinate[1],
              'objType': 'pokemon'
            };
            const client = {
              auth: {
                'uid': key
              }
            };
            commands.push(new OnDragDropCommand().setPayload({client: client, detail: detail}));
          }
        }
      }
    });
    return commands;
  }

  getPVEIndex(stageLevel) {
    const result = NEUTRAL_STAGE.findIndex((stage)=>{
      return stage.turn == stageLevel;
    });

    return result;
  }

  checkForPVE() {
    return (this.getPVEIndex(this.state.stageLevel) >= 0);
  }

  initializeFightingPhase() {
    this.state.phase = GamePhaseState.FIGHT;
    this.state.time = 40000;
    this.state.stageLevel += 1;
    this.state.botManager.updateBots();

    const stageIndex = this.getPVEIndex(this.state.stageLevel);

    this.state.players.forEach((player: Player, key: string) => {
      if (player.alive) {
        if (player.itemsProposition.length != 0) {
          if (player.itemsProposition.length == 3) {
            player.items.add(player.itemsProposition.pop());
          }
          while (player.itemsProposition.length > 0) {
            player.itemsProposition.pop();
          }
        }

        if (stageIndex != -1) {
          player.opponentName = 'PVE';
          player.opponentAvatar = NEUTRAL_STAGE[stageIndex].avatar;
          player.simulation.initialize(player.board, PokemonFactory.getNeutralPokemonsByLevelStage(this.state.stageLevel), player.effects.list, []);
        } else {
          const opponentId = this.room.computeRandomOpponent(key);
          if (opponentId) {
            player.simulation.initialize(player.board, this.state.players.get(opponentId).board, player.effects.list, this.state.players.get(opponentId).effects.list);
          }
        }
      }
    });
  }
}