import "server-only";
import { MODELS, FORMATS, MOTIONS, ASPECTS, DURATIONS } from "@/lib/app.config";
import { PlanError, pick, urls, text } from "@/lib/plan-helpers";

const q = (v, max) => text(v, max).replace(/["“”«»]/g, "'");
const SAFE = "Harmless, friendly humor: no insults to real people, no hate, no violence, no nudity.";

export function plan(body) {
  const count = pick(Number(body.count), [1, 2], 1);
  if (body.mode === "video") {
    const [photo] = urls(body.inputs, "vphoto", { name: "photo" });
    const motion = MOTIONS.find((m) => m.id === body.motion) || MOTIONS[0];
    const idea = text(body.idea, 300);
    const job = {
      model: MODELS.video,
      prompt: `A short funny meme video from this photo: ${motion.prompt}. ` +
        (idea ? `The joke: ${idea}. ` : "") +
        `Keep the character's face and look exactly as in the photo, comedic timing, punchy and shareable, fun sound effects. ${SAFE}`,
      params: { duration: pick(Number(body.duration), DURATIONS, 6), resolution: "480p" },
      fields: { generate_audio: true },
      inputs: { image_urls: [photo] },
    };
    return Array.from({ length: count }, () => job);
  }
  const idea = text(body.idea, 300);
  const top = q(body.top, 80);
  const bottom = q(body.bottom, 80);
  if (!idea && !top && !bottom) throw new PlanError("Describe the joke or write a caption", "missing_field");
  const format = FORMATS.find((f) => f.id === body.format) || FORMATS[0];
  const photo = urls(body.inputs, "photo", { min: 0, max: 1 });
  const caption = top || bottom
    ? ` Caption text, spelled exactly${top ? `, top: "${top}"` : ""}${bottom ? `, bottom: "${bottom}"` : ""}; no other text.`
    : " Write one short, punchy caption that fits the joke, in the same language as the joke description.";
  const job = {
    model: photo.length ? MODELS.pictureEdit : MODELS.picture,
    prompt: (photo.length
      ? `Turn the reference photo into ${format.prompt}; keep the person or pet recognizable. `
      : `Create ${format.prompt}. `) +
      (idea ? `The joke: ${idea}.` : "") + caption +
      ` Big, perfectly legible letters with correct spelling, internet meme look, high contrast. ${SAFE}`,
    params: { aspect_ratio: pick(body.aspect, ASPECTS, "1:1"), resolution: "1k" },
    ...(photo.length ? { inputs: { image_urls: photo } } : {}),
  };
  return Array.from({ length: count }, () => job);
}
