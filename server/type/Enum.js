const TYPE = Object.freeze(
    {
        NORMAL:'normal',
        FIGHTING:'fighting',
        FLYING:'flying',
        POISON:'poison',
        GROUND:'ground',
        ROCK:'rock',
        BUG:'bug',
        GHOST:'ghost',
        STEEL:'steel',
        FIRE:'fire',
        WATER:'water',
        GRASS:'grass',
        ELECTRIC:'electric',
        PSYCHIC:'psychic',
        ICE:'ice',
        DRAGON:'dragon',
        DARK:'dark',
        FAIRY:'fairy',
        UNKNOWN:'unknown',
        SHADOW:'shadow'
    }
);

const RARITY = Object.freeze({
	COMMON:'common',
	UNCOMMON:'uncommon',
	RARE:'rare',
	EPIC:'epic',
	LEGENDARY:'legendary'
});

module.exports = {TYPE, RARITY};