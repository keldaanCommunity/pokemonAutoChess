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
	COMMON:'COMMON',
	UNCOMMON:'UNCOMMON',
	RARE:'RARE',
	EPIC:'EPIC',
	LEGENDARY:'LEGENDARY'
});

const COST = Object.freeze({
	COMMON:1,
	UNCOMMON:2,
	RARE:3,
	EPIC:4,
	LEGENDARY:5
});

module.exports = {TYPE, RARITY, COST};