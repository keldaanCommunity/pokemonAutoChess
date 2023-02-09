import React, { Component } from "react"

class WikiFaq extends Component {
  render() {
    return (
      <div style={{ overflowY: "scroll", height: "80vh" }}>
        <h4 className="nes-text is-success">Is this an official game ?</h4>
        <p>
          No, this is a fan game; made by fans, for fans. All rights/credits to
          Pokemon Company.
        </p>
        <h4 className="nes-text is-success">How do pokemon evolves ?</h4>
        <p>
          You need 3 copies of the same pokemon to get the evolution. The 3
          pokemons will merge to give the evolved pokemon.
        </p>
        <h4 className="nes-text is-success">
          Why is there field/flora/human/aquatic synergies ? They don't match
          any of pokemon types
        </h4>
        <p>
          Field/Flora/Human/Aquatic are not pokemon types, but egg groups.
          Moreover, Fairy and Amorph/Ghost are both egg groups and synergies.
        </p>
        <h4 className="nes-text is-success">How does the income works ?</h4>
        <p>
          You get 5 gold per round whether you draw, win or lose. You get 1
          bonus income per 10 gold saved. A maximum of 5 bonus income accrued at
          50 saved gold. You get 1 bonus gold if you win. If you win multiple
          times, you will also gain extra gold; one bonus gold for every
          victory/defeat, up to 5 bonus gold for 5 streak wins/ 5 streak defeat.
          Wins/Defeats against PVE are not taken into account.
        </p>
        <h4 className="nes-text is-success">
          What is the purpose of the collection/booster ?
        </h4>
        <p>
          When opening boosters, you get pokemon shards. Those shards are
          specific to every pokemon. In the collection tab, you can buy pokemon
          emotions with those shards. You can see pokemon emotions as a
          detailled customization. When selecting an emotion pokemon portrait,
          the pokemon will appear everywhere with the same emotion portrait that
          you have selected. Eveyone will see the emotion that you picked for
          this pokemon. Moreover, if you have selected a shiny emotion, the
          pokemon will appear shiny to everyone else.
        </p>
        <h4 className="nes-text is-success">
          How do i get more profile icons ?
        </h4>
        <p>
          When buying a pokemon emotion, it'll be available in the profile icon
          list.
        </p>
        <h4 className="nes-text is-success">How do i gain boosters ?</h4>
        <p>You gain boosters each time you level up.</p>
        <h4 className="nes-text is-success">How do i level up ?</h4>
        <p>
          You gain experience each time you finish a game. If you finish first,
          you'll get 900 xp, if you finish last, you'll get 100 xp.
        </p>
        <h4 className="nes-text is-success">
          It seems some sprites are missing ?
        </h4>
        <p>
          Sprites of pokemon auto chess are based on the collaborative project:{" "}
          <a href="https://github.com/PMDCollab/SpriteCollab">
            https://github.com/PMDCollab/SpriteCollab
          </a>
          . If you want the missing sprites to be added, please consider
          donating to pokemon autochess. Every donation will be used to pay
          spriters to make sprites for everyone.
        </p>
        <h4 className="nes-text is-success">What/When is PVE ?</h4>
        <p>
          PVE are predefined waves of enemies. If you win against PVE, you'll
          get one Tier 1 item and you will have to choose one of the 3 item
          propositions. PVE occurs at turn 1,2,3,10,15,20,25,30,35,40.
        </p>
        <h4 className="nes-text is-success">
          What are those mythical pokemons ? When can I buy them ?
        </h4>
        <p>
          At turn 10 and 20, you'll have to choose between 6 mythical pokemons.
          Those mythical pokemons are very strong.
        </p>
        <h4 className="nes-text is-success">How does Ditto work ?</h4>
        <p>
          Ditto creates a plain copy of the unit you hover and drop it over.
          Ditto can't fight. Each pokemon in shop has a 0.6% chance to be a
          ditto at every roll. You can't copy mythical pokemon.
        </p>
        <h4 className="nes-text is-success">How do the items works ?</h4>
        <p>
          After winning a PVE round, you will get a random basic item and you
          will be able to choose from 3 choices another basic item that suits
          you. You can combine two basic items to create a powerfull tier 2
          items. The crafting list of all items is available in the wiki, in the
          items section.
        </p>
        <h4 className="nes-text is-success">How do bots works ?</h4>
        <p>
          Bots are created by other players. Bots are theme-based, a mewtwo bot
          will always have an mewtwo in its team at a certain time in the game.
          Bots follows a list of predefined patterns. But they will not behave
          the same from one game to an other. To improve their team, they need
          to win matches against other bots/players. If they always loose,
          they'll improve much more slowly.
        </p>
        <h4 className="nes-text is-success">Can i create my own bot ?</h4>
        <p>
          Sure. Go to the bot builder in the lobby and try to make your own bot.
          If you submit your bot, it'll be send in the #bot-creation channel for
          a review by the bot reviewer team.
        </p>
        <h4 className="nes-text is-success">How does the elo system work ?</h4>
        <p>
          The elo system in Pokemon Auto Chess works the same as in other elo
          based games like Chess, Lol, Starcraft etc... To gain elo points, you
          need to beat other bots/players. For example, if you finish 3rd, you
          won against 4th,5th,6th,7th,8th place and lost to 1st and 2nd place.
        </p>
        <h4 className="nes-text is-success">
          I didn't get elo points in my last game, why ?
        </h4>
        <p>
          The game needs to be finished in order to win/lose elo points. If
          someone is still in game, you need to wait. Only 8-players/bots game
          count are eligible to elo rating.
        </p>
        <h4 className="nes-text is-success">
          What are the special damages and physical damages ?
        </h4>
        <p>
          ranged units are usually special on their basics. 1 range are
          physical. Spells/abilities can however be true/special/or physical.
        </p>
        <h4 className="nes-text is-success">
          Can you also tell me how defense works? Is it flat dmg reduction?
        </h4>
        <p>
          Same system as league of legends: damage = atk * (hp / hp *
          (1+(0.1*def))). Defense work on physical attack, special defense on
          special attack
        </p>
        <h4 className="nes-text is-success">how much mana does a hit grant?</h4>
        <p>
          Damage after reduction / 10 for the pokemon being attacked 5 mana for
          the attacker
        </p>
        <h4 className="nes-text is-success">
          Why do legendaries have scaled skill descriptions like 10/20/30 damage
          or sth when they cant evolve? which one is the right value?
        </h4>
        <p>Turn 10 mythical is second value, Turn 20 mythical is third value</p>
        <h4 className="nes-text is-success">
          Where do primal groudon and primal kyogre come in are they something
          you can get or are they just pve ?
        </h4>
        <p>
          Give a delta orb to Rayaquaza, a red orb to Groudon or a blue orb to
          Kyogre.
        </p>
        <h4 className="nes-text is-success">How do you get shinys</h4>
        <p>
          So when you play games with 8 players/bots you get exp. When you get
          1000 exp you get a booster pack, each booster pack gives 4 40x tokens
          for random pokemon. Then if you purchase the shiny emotes of a pokemon
          (the normal one is 150) you get that one pokemon as a shiny.
        </p>
        <h4 className="nes-text is-success">How can i support the game ?</h4>
        <p>
          You can donate on the tipee:
          <a href="https://en.tipeee.com/pokemon-auto-chess">
            https://en.tipeee.com/pokemon-auto-chess
          </a>
          .
        </p>
        <h4 className="nes-text is-success">
          Will there be a mobile version one day ?
        </h4>
        <p>No.</p>
        <h4 className="nes-text is-success">
          What language is used to code the game ?
        </h4>
        <p>TypeScript</p>
      </div>
    )
  }
}

export default WikiFaq
