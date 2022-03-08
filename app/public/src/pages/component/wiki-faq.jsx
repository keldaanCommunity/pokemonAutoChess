import React, { Component } from 'react';

class WikiFaq extends Component{

    render(){
        return <div style={{overflowY: 'scroll', height: '80vh'}}>
            <h5 class="nes-text is-primary">Is this an official game ?</h5>
            <p>No, this is a fan game; made by fans, for fans. All rights/credits to Pokemon Company.</p>
            <h5 class="nes-text is-primary">How do pokemon evolves ?</h5>
            <p>You need 3 copies of the same pokemon to get the evolution. The 3 pokemons will merge to give the evolved pokemon.</p>
            <h5 class="nes-text is-primary">Why is there field/flora/human/aquatic synergies ? They don't match any of pokemon types</h5>
            <p>Field/Flora/Human/Aquatic are not pokemon types, but egg groups. Moreover, Fairy and Amorph/Ghost are both egg groups and synergies.</p>
            <h5 class="nes-text is-primary">How does the income works ?</h5>
            <p>You get 5 gold per round whether you draw, win or lose. You get 1 bonus income per 10 gold saved. A maximum of 5 bonus income accrued at 50 saved gold. You get 1 bonus gold if you win. If you win multiple times, you will also gain extra gold; one bonus gold for every victory/defeat, up to 5 bonus gold for 5 streak wins/ 5 streak defeat. Wins/Defeats against PVE are not taken into account.</p>
            <h5 class="nes-text is-primary">What/When is PVE ?</h5>
            <p>PVE are predefined waves of enemies. If you win against PVE, you'll get one Tier 1 item and you will have to choose one of the 3 item propositions. PVE occurs at turn 1,2,3,10,15,20,25,30,35,40.</p>
            <h5 class="nes-text is-primary">What are those mythical pokemons ? When can I buy them ?</h5>
            <p>At turn 10 and 20, you'll have to choose between 6 mythical pokemons. Those mythical pokemons are very strong.</p>
            <h5 class="nes-text is-primary">How does Ditto work ?</h5>
            <p>Ditto creates a plain copy of the unit you hover and drop it over. Ditto can't fight. Each pokemon in shop has a 0.6% chance to be a ditto at every roll. You can't copy fossils/mythical pokemon.</p>
            <h5 class="nes-text is-primary">How do the items works ?</h5>
            <p>After winning a PVE round, you will get a random basic item and you will be able to choose from 3 choices another basic item that suits you. You can combine two basic items to create a powerfull tier 2 items. The crafting list of all items is available in the wiki, in the items section.</p>
            <h5 class="nes-text is-primary">How do the fossils works ?</h5>
            <p>Fossils are special pokemons. Give the basic item "fossil stone" to a ditto and it will create a random fossil. Fossils evolve with time. Uncommon in 4 turns, Rare in 6 turns, Epic in 8 turns.</p>
            <h5 class="nes-text is-primary">How do bots works ?</h5>
            <p>Bots are created by other players. Bots are theme-based, a mewtwo bot will always have an mewtwo in its team at a certain time in the game. Bots follows a list of predefined patterns. But they will not behave the same from one game to an other. To improve their team, they need to win matches against other bots/players. If they always loose, they'll improve much more slowly.</p>
            <h5 class="nes-text is-primary">Can i create my own bot ?</h5>
            <p>Sure. Go to the bot builder in the lobby and try to make your own bot. If you submit your bot, it'll be send in the #bot-creation channel for a review by the bot reviewer team.</p>
            <h5 class="nes-text is-primary">How does the elo system work ?</h5>
            <p>The elo system in Pokemon Auto Chess works the same as in other elo based games like Chess, Lol, Starcraft etc... To gain elo points, you need to beat other bots/players. For example, if you finish 3rd, you won against 4th,5th,6th,7th,8th place and lost to 1st and 2nd place.</p>
            <h5 class="nes-text is-primary">I didn't get elo points in my last game, why ?</h5>
            <p>The game needs to be finished in order to win/lose elo points. If someone is still in game, you need to wait. Only 8-players/bots game count are eligible to elo rating.</p>
            <h5 class="nes-text is-primary">What are the special damages and physical damages ?</h5>
            <p>ranged units are usually special on their basics. 1 range are physical. Spells/abilities can however be true/special/or physical.</p>
            <h5 class="nes-text is-primary">Where do primal groudon and primal kyogre come in are they something you can get or are they just pve ?</h5>
            <p>Give a delta orb to Rayaquaza, a red orb to Groudon or a blue orb to Kyogre.</p>
            <h5 class="nes-text is-primary">How can i support the game ?</h5>
            <p>You can donate on the tipee: <a href="https://en.tipeee.com/pokemon-auto-chess">https://en.tipeee.com/pokemon-auto-chess</a>.</p>
            <h5 class="nes-text is-primary">What language is used to code the game ?</h5>
            <p>JavaScript.</p>
        </div>
    }
}

export default WikiFaq;