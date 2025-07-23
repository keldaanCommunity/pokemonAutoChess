export enum Emotion {
  NORMAL = "Normal",
  HAPPY = "Happy",
  PAIN = "Pain",
  ANGRY = "Angry",
  WORRIED = "Worried",
  SAD = "Sad",
  CRYING = "Crying",
  SHOUTING = "Shouting",
  TEARY_EYED = "Teary-Eyed",
  DETERMINED = "Determined",
  JOYOUS = "Joyous",
  INSPIRED = "Inspired",
  SURPRISED = "Surprised",
  DIZZY = "Dizzy",
  SPECIAL0 = "Special0",
  SPECIAL1 = "Special1",
  SIGH = "Sigh",
  STUNNED = "Stunned",
  SPECIAL2 = "Special2",
  SPECIAL3 = "Special3"
}

export const AvatarEmotions: Emotion[] = [
  Emotion.HAPPY,
  Emotion.JOYOUS,
  Emotion.DETERMINED,
  Emotion.PAIN,
  Emotion.ANGRY,
  Emotion.CRYING,
  Emotion.SURPRISED,
  Emotion.STUNNED,
  Emotion.DIZZY
]

/*
IMPORTANT: 
This list of emotions is used in UserMetadata pokemonCollection unlocked as byte array mask.
It is important to not edit it to keep the order consistent with the CollectionUtils.
*/
export const CollectionEmotions: Emotion[] = [
  Emotion.NORMAL,
  Emotion.HAPPY,
  Emotion.PAIN,
  Emotion.ANGRY,
  Emotion.WORRIED,
  Emotion.SAD,
  Emotion.CRYING,
  Emotion.SHOUTING,
  Emotion.TEARY_EYED,
  Emotion.DETERMINED,
  Emotion.JOYOUS,
  Emotion.INSPIRED,
  Emotion.SURPRISED,
  Emotion.DIZZY,
  Emotion.SIGH,
  Emotion.STUNNED,
  Emotion.SPECIAL0,
  Emotion.SPECIAL1,
  Emotion.SPECIAL2,
  Emotion.SPECIAL3
]