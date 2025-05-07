"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function QuranPage() {
  const [dailyVerse, setDailyVerse] = useState<{
    text: string;
    surah: string;
    ayah: number;
    surahNumber: number;
    arabic?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchVerse = async () => {
    setLoading(true);
    const res = await fetch("https://api.alquran.cloud/v1/ayah/random/en.asad");
    const data = await res.json();
    if (data.data) {
      // Fetch Arabic text for the same ayah
      const arabicRes = await fetch(`https://api.alquran.cloud/v1/ayah/${data.data.number}/ar`);
      const arabicData = await arabicRes.json();
      setDailyVerse({
        text: data.data.text,
        surah: data.data.surah.englishName,
        ayah: data.data.numberInSurah,
        surahNumber: data.data.surah.number,
        arabic: arabicData.data?.text || undefined,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVerse();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-2">
      <h2 className="text-4xl font-extrabold mb-8 text-sky-700 dark:text-emerald-300 drop-shadow-lg text-center">Daily Quran Verse</h2>
      <Card className="w-full max-w-xl shadow-xl rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <CardContent className="py-8 px-6 flex flex-col items-center">
          {loading || !dailyVerse ? (
            <div className="text-center animate-pulse text-sky-400 text-lg">Loading a beautiful verse…</div>
          ) : (
            <>
              {dailyVerse.arabic && (
                <p className="text-2xl font-quran text-right mb-4 leading-relaxed text-gray-800 dark:text-emerald-200">{dailyVerse.arabic}</p>
              )}
              <p className="italic text-lg mb-3 text-gray-700 dark:text-gray-200">"{dailyVerse.text}"</p>
              <p className="mb-4 font-semibold text-sky-700 dark:text-emerald-300 text-base">{dailyVerse.surah} (Surah {dailyVerse.surahNumber}), Ayah {dailyVerse.ayah}</p>
              <button onClick={fetchVerse} className="mt-2 px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow transition">Next Verse</button>
              <a href="https://quran.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sky-600 dark:text-emerald-300 underline hover:text-sky-800">Read Full Quran</a>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}