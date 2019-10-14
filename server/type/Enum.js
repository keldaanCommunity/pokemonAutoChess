const TYPE = Object.freeze(
    {
        NORMAL:'NORMAL',
        FIGHTING:'FIGHTING',
        FLYING:'FLYING',
        POISON:'POISON',
        GROUND:'GROUND',
        ROCK:'ROCK',
        BUG:'BUG',
        GHOST:'GHOST',
        STEEL:'STEEL',
        FIRE:'FIRE',
        WATER:'WATER',
        GRASS:'GRASS',
        ELECTRIC:'ELECTRIC',
        PSYCHIC:'PSYCHIC',
        ICE:'ICE',
        DRAGON:'DRAGON',
        DARK:'DARK',
        FAIRY:'FAIRY'
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