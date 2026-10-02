# Balance updates

- Fairy 8 Moon Force: 20 → 5 LUCK
- Loaded Dice: LUCK 30 → 20
- Lucky Ribbon: LUCK 30 → 20
- Nerf SURROUND_WAND: +10 → +5% SPECIAL per adjacent enemy
- Nerf WHIRLWIND_WAND: max fly away distance 3 → 2 cells

# Bugfixes

Fixed 3 bugs on HP_SWAP_WAND (sorry I really messed up with that one):
- Max HP stolen by HP_SWAP_WAND were removed as actual HP as well after damage was already applied, effectively doubling the HP loss
- Max HP stolen by HP_SWAP_WAND were based on wands damage **before** reduction (SPE_DEF, flat reduction...) instead of **after**
- HP_SWAP_WAND effect on an enemy wearing TWIST_BAND now correctly prevents the attacker to steal max HP
