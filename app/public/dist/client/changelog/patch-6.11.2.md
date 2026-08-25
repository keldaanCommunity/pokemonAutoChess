# Balance & Gameplay

- Unit selling prices have been increased, especially for third stage of evolution Pokémon. Previous formula: RarityCost * stars → New formula: RarityCost * 3^(stars-1) * 0.75, rounded up.
- Change level 7 rarity odds in shop: 16%/33%/35%/15%/1% → 15%/35%/35%/15%/0%
- Regular item carousels before stage 20 now have ~~40~~ → 80% chance to contain an additional fossil stone
- The chance to find a Ditto in the shop has been increased: 0.5% → 0.5% + 0.01% per reroll since last Ditto found.
- Smoke Ball now activates even if the holder is KO without having had the chance to trigger it

# Bugfixes

- Fixed BLACK_BELT SHIELD being based on pre-mitigation damage instead of post-mitigation (taking into account target defenses)
- Fixed some cases of scarves duplication
- Fixed trick or treat cast when already transformed leading to being stuck as Magikarp
- Fixed Dream Eater wrong target put to sleep
- Fixed abilities with effect in lines that did not hit in the last two columns of the board
- Fixed a possible crash when Wish was casted no ally is on the board
- Fixed a timer bug on Sudowoodo and Galarian Darmanitan zen passives
- Fixed Thief infinite loop when self-targeting when confused
- Fixed a possible crash when Petal Dance was casted without enemies left on the board
- Fixed some bots at specific elo numbers not being found
- Fixed a case of Palafin duplication