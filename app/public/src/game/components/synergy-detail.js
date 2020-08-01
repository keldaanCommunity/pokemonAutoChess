/* eslint-disable max-len */

import {GameObjects} from 'phaser';

export default class SynergyDetail extends GameObjects.Container {
  constructor(scene, x, y, type, color) {
    super(scene, x, y);

    this.textStyle =
    {
      font: '18px Arial',
      fill: 'white',
      wordWrap: {width: 295}
    };

    this.bigTextStyle =
    {
      font: '20px bold Arial',
      fill: 'white'
    };

    this.typeDescription= {
      NORMAL:
        `Normal (3): Stamina - Your normal types have 300 extra health.

Normal (6): Strength - Increase all stats of your normal types by 10%.
        
Normal (9): Pure Power - Attack is doubled for all your allies.`,
      GRASS:
        `Grass (3): Ingrain - Restore 5% health per second to every Grass Type.

Grass (6): Growth - Gain +25% defenses to every friendly Grass Type.
        
Grass (9): Stun Spore - Non-grass enemies are paralyzed (50% Speed).`,
      FIRE: `Fire (3): Blaze - Increase attacks of allies in a pinch (50% or less health) by 50%.

Fire (6): Drought* - Creates heavy sun and increases fire damage by 35%.`,
      WATER: `Water (3): Drizzle - Increase all water damage by 30%.

 Water (6): Rain Dance* - Increase all water damage by an additional 30%.
        
Water (9): Primordial Sea - Summon Kyogre if your entire party faints.`,
      ELECTRIC: `Electric: Agility - Attack Speed and Evasion increased by 10% for each other friendly Electric type.`,
      FIGHTING: `Fighting (2): Revenge - Deals 20% extra damage to the enemy that hit it.

Fighting (4): Punishment - Deals 10% extra damage for each synergy buff the enemy has.`,
      PSYCHIC: `Psychic (2): Psywave - Special resistance of foes reduced 30%.

Psychic (4): Magic Room - Special resistance of foes reduced an extra 30%.`,
      DARK: `Dark (2): Mean Look - Defenses reduced by 20% to all enemies.

Dark (4): Scary Face - Defenses reduced by an extra 25% to all enemies.`,
      METAL: `Metal (2): Iron Defense - 50% bonus defense for your Minerals.

Metal (4): Autotomize - 100% extra attack speed for your Minerals.`,
      GROUND: `Ground (2): Spikes - Scatters 4-7 spikes on the battlefield, damaging enemies that step on them.

Ground (4): Stealth Rock - Deals 5% damage per second to all enemies.
        
Ground (6): Sandstorm - Deals 10% damage per second to non-Ground/Metal Types.`,
      POISON: `Poison (3): Poison Gas - Deals 10% damage per second to a random enemy.

Poison (6): Toxic - Deals 4 damage per second to all enemies. Doubles every second.`,
      DRAGON: `Dragon (2): Intimidate - Attack of foes reduced by 30%.

Dragon (4): Draco Meteor - Cast a Meteor when the round starts.`,
      FIELD: `Field (3): Work Up - Increase friendly field types’ damage by 4% for every enemy pokemon.

Field (6): Rage - Damage of friendly field types increased by 5% for every hit received.
        
Field (9): Anger Point - Attack is doubled if below 50% health.`,
      MONSTER: `Monster (3): Pursuit - enemies below 25% health are one shot by your Monsters.

Monster (6): Brutal Swing - each KO by a Monster restores 40% Health to itself.
        
Monster (9): Power Trip - each KO by a Monster adds 25% attack for the rest of the round.`,
      HUMAN: `Humanoid (2): Meditate - Attacks and Speed of allies increased by 15%.

Humanoid (4): Focus Energy - 50% chance for allies to cause a critical hit.
        
Humanoid (6): Calm Mind - Attacks and Defenses of allies increased by 20%.`,
      AQUATIC: `Aquatic (3): Swift Swim - Speed of friendly Water Types increased by 30% in rain.

Aquatic (6): Hydro Cannon - Special attack of friendly water types increased by 30%.`,
      BUG: `Bug (2): Swarm - 2 Pokemon to evolve stage 1 instead of 3, if two Bugs are in play.

Bug (4): Sticky Web - Movement Speed reduced by 33% to opposing team.`,
      FLYING: `Flying (2): Razor Wind - At the start of the round a hurricane hits, slightly damaging and slowing down all enemies (10%).

Flying (4): Hurricane - Doubles the effect of the Hurricane.`,
      FLORA: `Flora (2): Rain Dish - Restore 10% health per second in rain.

Flora (4): Flower Shield - Reduce Special Damage of enemies by 30%.`,
      MINERAL: `Mineral: Battle Armor - Defenses increased by 25% to all your other minerals.`,
      AMORPH: `Amorphous (x): Phantom Force - Materialize behind an opposing pokemon, stunning it for x/2 seconds.`,
      FAIRY: `Fairy (2): Attract - 25% chance for all Fairies to Infatuate target, making it unable to attack for 3 seconds.

Fairy (4): Baby-Doll Eyes - if your Fairy is attacked, the attacker has 20% reduced damage for the rest of the round.`
    };

    this.add(new GameObjects.Rectangle(scene, 0, 125, 300, 300, color));
    this.add(new GameObjects.Text(scene, -145, -5, type, this.bigTextStyle));
    this.add(new GameObjects.Text(scene, -140, 20, this.typeDescription[type], this.textStyle));
    this.setScale(0, 0);
    scene.add.existing(this);
  }
}
