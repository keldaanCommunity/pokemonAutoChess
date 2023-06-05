import React, { Component } from "react"

export default class WikiFaq extends Component {
  render() {
    return (
      <div style={{ padding: "1em" }}>
        <h4 className="nes-text is-success">Is this an official game ?</h4>
        <p>
          No, this is a fan game; made by fans, for fans. All rights/credits to
          Pokemon Company.
        </p>
        <h4 className="nes-text is-success">How do pokemon evolve ?</h4>
        <p>
          You need 3 copies of the same pokemon to get the evolution. The 3
          pokemons will merge to give the evolved pokemon. Hatch Pokemon that
          come from eggs evolve automatically with time every 5 stages.
        </p>
        <h4 className="nes-text is-success">
          Why is there field/flora/human/aquatic synergies ? They don't match
          any of pokemon types
        </h4>
        <p>
          Field/Flora/Human/Aquatic are not pokemon types, but egg groups.
          Moreover, Fairy and Amorph/Ghost are both egg groups and synergies.
        </p>
        <h4 className="nes-text is-success">How does the income work ?</h4>
        <p>
          You get 5 gold per round whether you draw, win or lose. You get 1
          bonus income per 10 gold saved. A maximum of 5 bonus income accrued at
          50 saved gold. You get 1 bonus gold if you win. If you win multiple
          times, you will also gain extra gold; one bonus gold for every
          victory/defeat, up to 5 bonus gold for 5 streak wins / 5 streak
          defeat. Wins/Defeats against PVE are not taken into account.
        </p>
        <h4 className="nes-text is-success">
          What is the purpose of the collection/booster ?
        </h4>
        <p>
          When opening boosters, you get pokemon shards. Those shards are
          specific to every pokemon. In the collection tab, you can buy pokemon
          emotions with those shards. You can see pokemon emotions as a detailed
          customization. When selecting an emotion pokemon portrait, the pokemon
          will appear everywhere with the same emotion portrait that you have
          selected. Eveyone will see the emotion that you picked for this
          pokemon. Moreover, if you have selected a shiny emotion, the pokemon
          will appear shiny to everyone else.
        </p>
        <h4 className="nes-text is-success">How do I get new avatars ?</h4>
        <p>
          When buying a pokemon emotion, it will be available in your profile
          avatar list.
        </p>
        <h4 className="nes-text is-success">How do I gain boosters ?</h4>
        <p>You gain boosters each time you level up.</p>
        <h4 className="nes-text is-success">How do I level up ?</h4>
        <p>
          You gain experience each time you finish a game. If you finish first,
          you'll get 700 xp, if you finish last, you'll get 100 xp.
        </p>
        <h4 className="nes-text is-success">
          It seems some sprites are missing ?
        </h4>
        <p>
          Sprites of pokemon auto chess are based on{" "}
          <a href="https://github.com/PMDCollab/SpriteCollab">
            this collaborative project
          </a>
          . If you want the missing sprites to be added, please consider
          donating to pokemon autochess. Every donation will be used to pay
          spriters to make sprites for everyone.
        </p>
        <h4 className="nes-text is-success">What/When is PVE ?</h4>
        <p>
          PVE are predefined waves of enemies. If you win against PVE, you'll
          get one Tier 1 item and you will have to choose one of 3 items
          propositions. PVE occurs at turn 1,2,3,9,14,19,24,29,34,39.
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
          Ditto can't fight. Each pokemon in shop has a 0.5% chance to be a
          Ditto at every roll. You can't copy mythical pokemons.
        </p>
        <h4 className="nes-text is-success">How do the items work ?</h4>
        <p>
          After winning a PVE round, you will get a random basic item and you
          will be able to choose from 3 choices another basic item that suits
          you. You can combine two basic items to create a powerful tier 2 item.
          The crafting list of all items is available in the wiki, in the items
          section.
        </p>
        <h4 className="nes-text is-success">How do bots work ?</h4>
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
          Sure. You'll need to be at least level 10 to unlock the Bot Builder
          title. Then choose this title and a "Bot Builder" button will appear
          in the header. Read the instructions and submit your bot, it will be
          sent in the #bot-creation channel on Discord for a review by the bot
          reviewers team.
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
          Auto attacks mostly deal Physical damage, while Abilities mostly deal
          Special damage. Some abilities however can deal true damage or
          physical damage.
        </p>
        <h4 className="nes-text is-success">
          Can you tell me how defense works? Is it flat damage reduction?
        </h4>
        <p>
          Same system as League of Legends: damage = atk * (hp / hp *
          (1+(0.1*def))). Defense works for physical damage, special defense for
          special damage
        </p>
        <h4 className="nes-text is-success">How do you get shiny pokemons ?</h4>
        <p>
          So when you play games with 8 players/bots, you get experience. With
          enough experience, you level up and get a booster pack. Each booster
          pack gives shards for random pokemon. Use these shards to purchase the
          shiny emotes of a pokemon in the Collection page, then you will get
          that one pokemon as a shiny ingame.
        </p>
        <h4 className="nes-text is-success">How can i support the game ?</h4>
        <p>
          You can donate on{" "}
          <a href="https://en.tipeee.com/pokemon-auto-chess">Tipeee</a>.
        </p>
        <h4 className="nes-text is-success">
          Will there be a mobile version one day ?
        </h4>
        <p>No.</p>
        <h4 className="nes-text is-success">
          What language/library is used to code the game ?
        </h4>
        <p>
          TypeScript, Phaser, Colyseus. If you want to contribute,{" "}
          <a
            href="https://github.com/keldaanCommunity/pokemonAutoChess"
            target="_blank"
          >
            pull requests are open
          </a>{" "}
          !
        </p>
      </div>
    )
  }
}
