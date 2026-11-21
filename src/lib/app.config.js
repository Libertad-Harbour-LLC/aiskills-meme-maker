// Meme Maker — meme pictures with captions and short meme videos from a photo.
// Models: nano-banana-2-1 (meme picture from an idea, writes the caption on the image),
// nano-banana-2-1-edit (meme picture from your photo), grok-imagine-video-1-5-image-to-video
// (meme video from a photo, 480p, with sound; price per second).

export const MODELS = { picture: "nano-banana-2-1", pictureEdit: "nano-banana-2-1-edit", video: "grok-imagine-video-1-5-image-to-video" };

export const FORMATS = [
  { id: "classic", label: { en: "Classic top/bottom", ru: "Классика: верх и низ" },
    prompt: "a classic meme: one funny picture with the caption in bold white uppercase Impact-style letters with a thick black outline, top text at the top edge and bottom text at the bottom edge" },
  { id: "reaction", label: { en: "Reaction face", ru: "Реакция" },
    prompt: "a reaction meme: a close-up of an over-the-top exaggerated facial expression that perfectly matches the situation, the caption in bold white outlined letters" },
  { id: "two-panel", label: { en: "Two panels: no / yes", ru: "Две панели: нет / да" },
    prompt: "a two-panel comparison meme: left or top panel shows rejecting the first option with a disgusted gesture, the second panel shows happily approving the second option; short caption next to each panel" },
  { id: "expect", label: { en: "Expectation vs reality", ru: "Ожидание и реальность" },
    prompt: "an 'expectation vs reality' meme split into two halves: a glamorous ideal version and a funny disappointing real version, each half labeled" },
  { id: "levels", label: { en: "Levels of…", ru: "Уровни…" },
    prompt: "a four-level escalation meme: four stacked panels that get more and more extreme and absurd, short label on each panel" },
  { id: "comic", label: { en: "Comic strip", ru: "Комикс" },
    prompt: "a short three-panel comic strip meme with simple bold cartoon drawing, speech bubbles and a punchline in the last panel" },
];

export const MOTIONS = [
  { id: "reaction", label: { en: "Over-the-top reaction", ru: "Бурная реакция" },
    prompt: "the character makes an exaggerated comedic reaction: eyes widen, jaw drops, then a dramatic slow head turn to the camera" },
  { id: "zoom", label: { en: "Dramatic zoom", ru: "Драматичный зум" },
    prompt: "a sudden dramatic crash zoom into the character's face, intense stare, then a tiny awkward smile" },
  { id: "dance", label: { en: "Silly dance", ru: "Смешной танец" },
    prompt: "the character starts a silly, energetic, slightly clumsy victory dance, keeping their appearance exactly the same" },
  { id: "shock", label: { en: "Slow-motion shock", ru: "Шок в замедлении" },
    prompt: "slow-motion shocked reaction: hands to the face, confetti-like debris floating, cinematic dramatic light" },
  { id: "cool", label: { en: "Deal with it", ru: "Крутой выход" },
    prompt: "the character slowly puts on dark sunglasses with a smug confident look while the camera slowly pushes in" },
];

export const ASPECTS = ["1:1", "4:5", "9:16", "16:9"];
export const DURATIONS = [6, 10];

export const APP = {
  id: "meme-maker",
  name: "Meme Maker",
  theme: "cyberpunk",
  tagline: { en: "AI memes and meme videos", ru: "Мемы и мем-видео с ИИ" },
  kicker: { en: "Made for sharing", ru: "Чтобы делиться" },
  headline: { en: "Funny memes and meme videos in a minute", ru: "Смешные мемы и мем-видео за минуту" },
  description: {
    en: "Describe the joke and the caption — get a ready meme picture. Or add a photo and turn it into a short meme video with sound.",
    ru: "Опишите шутку и подпись — получите готовый мем. Или добавьте фото и превратите его в короткое мем-видео со звуком.",
  },
  cta: { en: "Make meme", ru: "Сделать мем" },
  models: Object.values(MODELS),
  upload: { types: ["image/jpeg", "image/png", "image/webp"], maxBytes: 20 * 1024 * 1024 },
  modes: [
    { id: "picture", label: { en: "Meme picture", ru: "Мем-картинка" },
      desc: { en: "From an idea, or from your photo. The caption is written on the image.", ru: "По идее или из вашего фото. Подпись пишется прямо на картинке." } },
    { id: "video", label: { en: "Meme video", ru: "Мем-видео" },
      desc: { en: "Your photo comes alive: a 6 or 10-second funny clip with sound.", ru: "Ваше фото оживает: смешной ролик на 6 или 10 секунд со звуком." } },
  ],
  slots: [
    { key: "photo", kind: "image", min: 0, max: 1, modes: ["picture"],
      label: { en: "Photo (optional)", ru: "Фото (необязательно)" },
      hint: { en: "Use a photo of yourself, a friend who agreed, or your pet.", ru: "Своё фото, фото друга с его согласия или питомца." } },
    { key: "vphoto", kind: "image", min: 1, max: 1, modes: ["video"],
      label: { en: "Photo to animate", ru: "Фото для оживления" },
      hint: { en: "One clear face or character. Only photos you may use — no strangers or celebrities.", ru: "Одно чёткое лицо или персонаж. Только фото, которые вам можно использовать — без чужих людей и знаменитостей." } },
  ],
  counts: [1, 2],
  compare: false,
  initialState: () => ({ mode: "picture", idea: "", top: "", bottom: "", format: "classic", motion: "reaction", aspect: "1:1", duration: 6, count: 1 }),
  check: (s) => (s.mode === "picture" && !s.idea.trim() && !s.top.trim() && !s.bottom.trim()
    ? { en: "Describe the joke or write a caption.", ru: "Опишите шутку или напишите подпись." } : null),
  priceModel: (s) => (s.mode === "video" ? MODELS.video : MODELS.picture),
  priceText: (s, price) => {
    if (s.mode !== "video" || price?.cents_per_second == null) return null;
    const n = s.count || 1;
    const sum = ((price.cents_per_second * s.duration * n) / 100).toFixed(2);
    const per = (price.cents_per_second / 100).toFixed(2);
    return { en: `$${sum} · $${per}/s × ${s.duration} s${n > 1 ? ` × ${n}` : ""}`, ru: `$${sum} · $${per}/с × ${s.duration} с${n > 1 ? ` × ${n}` : ""}` };
  },
  label: (s, tx) => (s.mode === "video" ? tx(MOTIONS.find((m) => m.id === s.motion)?.label) : (s.top || s.idea).slice(0, 40)) || "",
};
