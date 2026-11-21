"use client";

import { FORMATS, MOTIONS, ASPECTS, DURATIONS } from "@/lib/app.config";
import { useLang } from "@/lib/i18n";
import { PresetGrid, TextField } from "./Fields";

export default function Options({ state, set, Chips }) {
  const { t, lang } = useLang();
  if (state.mode === "video") {
    return (
      <>
        <PresetGrid label={{ en: "What happens", ru: "Что происходит" }} items={MOTIONS} value={state.motion} onChange={(v) => set({ motion: v })} />
        <TextField id="idea" rows={2} label={{ en: "The joke (optional)", ru: "Шутка (необязательно)" }} value={state.idea} max={300}
          placeholder={{ en: "e.g. me when the code works on the first try", ru: "например: я, когда код заработал с первого раза" }}
          onChange={(v) => set({ idea: v })} />
        <Chips label={lang === "ru" ? "Длина" : "Length"} options={DURATIONS} value={state.duration}
          onChange={(v) => set({ duration: v })} render={(v) => (lang === "ru" ? `${v} с` : `${v} s`)} />
      </>
    );
  }
  return (
    <>
      <TextField id="idea" rows={2} label={{ en: "The joke", ru: "Шутка" }} value={state.idea} max={300}
        placeholder={{ en: "e.g. a cat realizing it's Monday again", ru: "например: кот понимает, что снова понедельник" }}
        onChange={(v) => set({ idea: v })} />
      <TextField id="top" label={{ en: "Top text (optional)", ru: "Текст сверху (необязательно)" }} value={state.top} max={80}
        placeholder={{ en: "WHEN YOU SEE THE BUG", ru: "КОГДА УВИДЕЛ БАГ" }} onChange={(v) => set({ top: v })} />
      <TextField id="bottom" label={{ en: "Bottom text (optional)", ru: "Текст снизу (необязательно)" }} value={state.bottom} max={80}
        placeholder={{ en: "AND IT'S IN PRODUCTION", ru: "И ОН УЖЕ В ПРОДЕ" }} onChange={(v) => set({ bottom: v })} />
      <PresetGrid label={{ en: "Meme format", ru: "Формат мема" }} items={FORMATS} value={state.format} onChange={(v) => set({ format: v })} />
      <Chips label={t("aspect")} options={ASPECTS} value={state.aspect} onChange={(v) => set({ aspect: v })} />
    </>
  );
}
