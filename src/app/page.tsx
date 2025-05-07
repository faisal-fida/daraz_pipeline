"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  // State for features
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [dailyVerse, setDailyVerse] = useState<{ text: string; surah: string; ayah: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user location and fetch prayer times
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        // Fetch prayer times from Aladhan API
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`);
        const data = await res.json();
        setPrayerTimes(data.data.timings);
        setLoading(false);
      }, () => setLoading(false));
    } else {
      setLoading(false);
    }
    // Fetch Hijri date
    fetch("https://api.aladhan.com/v1/gToH?date=" + new Date().toISOString().slice(0, 10))
      .then(res => res.json())
      .then(data => {
        if (data.data && data.data.hijri) {
          setHijriDate(`${data.data.hijri.day} ${data.data.hijri.month.en} ${data.data.hijri.year} AH`);
        }
      });
    // Fetch daily Quran verse
    fetch("https://api.alquran.cloud/v1/ayah/random/en.asad")
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setDailyVerse({
            text: data.data.text,
            surah: data.data.surah.englishName,
            ayah: data.data.numberInSurah
          });
        }
      });
  }, []);

  return (
    <div>
      <section className="hero flex flex-col items-center justify-center animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-2 text-sky-700 dark:text-emerald-300 drop-shadow">Muslim All-in-One</h1>
        <p className="text-xl text-sky-900/80 dark:text-emerald-100/80 mb-2">Welcome! Today is Wednesday, 7 May 2025</p>
        <p className="text-base text-muted-foreground mb-4">Your daily Islamic dashboard: Prayer times, Quran, Hadith, Events & more</p>
        <Image src="/globe.svg" alt="Islamic Globe" width={64} height={64} className="mb-2 animate-bounce-slow" />
      </section>
      <div className="card-grid gap-10 md:gap-12">
        {/* Next Prayer Time */}
        <div className="card hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center p-6 min-h-[260px] animate-fade-in">
          <CardHeader className="w-full flex flex-col items-center">
            <CardTitle className="text-xl font-bold text-sky-700 dark:text-emerald-300 border-b border-sky-100 dark:border-emerald-900 pb-2 mb-2 w-full text-center">Next Prayer</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center w-full">
            {prayerTimes ? (
              <div>
                {/* Show the next prayer time (simple logic: first time after now) */}
                {(() => {
                  const now = new Date();
                  const today = now.toISOString().slice(0, 10);
                  const times = Object.entries(prayerTimes).map(([name, time]) => ({ name, time }));
                  const next = times.find(({ time }) => {
                    const [h, m] = (time as string).split(":");
                    const t = new Date(today + "T" + h.padStart(2, "0") + ":" + m.padStart(2, "0") + ":00");
                    return t > now;
                  }) || times[0];
                  return (
                    <div className="text-center">
                      <div className="text-2xl font-bold">{next.name}</div>
                      <div className="text-lg">{next.time as string}</div>
                    </div>
                  );
                })()}
                <div className="mt-6 w-full flex justify-center">
                  <Link href="/prayer-times" className="btn btn-primary w-full max-w-xs">View all prayer times</Link>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </CardContent>
        </div>
        {/* Hijri Date */}
        <div className="card hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center p-6 min-h-[260px] animate-fade-in">
          <CardHeader className="w-full flex flex-col items-center">
            <CardTitle className="text-xl font-bold text-emerald-700 dark:text-sky-300 border-b border-emerald-100 dark:border-sky-900 pb-2 mb-2 w-full text-center flex items-center justify-center gap-2">
              <span>Hijri Date</span>
              <span role="img" aria-label="moon">🌙</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-center text-lg font-semibold min-h-[32px] flex items-center justify-center">
              {hijriDate ? (
                <span>{hijriDate}</span>
              ) : (
                <span className="animate-pulse text-sky-400 flex items-center gap-2"><span role="img" aria-label="moon">🌙</span> Loading…</span>
              )}
            </div>
            <div className="mt-6 w-full flex justify-center">
              <Link href="/events" className="btn btn-primary w-full max-w-xs">View Islamic events</Link>
            </div>
          </CardContent>
        </div>
        {/* Daily Quran Verse */}
        <div className="card hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center p-6 min-h-[260px] animate-fade-in">
          <CardHeader className="w-full flex flex-col items-center">
            <CardTitle className="text-xl font-bold text-sky-700 dark:text-emerald-300 border-b border-sky-100 dark:border-emerald-900 pb-2 mb-2 w-full text-center flex items-center justify-center gap-2">
              <span>Daily Quran Verse</span>
              <span role="img" aria-label="quran">📖</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center w-full">
            {dailyVerse ? (
              <div className="text-center">
                <p className="italic text-lg mb-2">"{dailyVerse.text}"</p>
                <p className="mb-2">- {dailyVerse.surah}, Ayah {dailyVerse.ayah}</p>
              </div>
            ) : (
              <div className="text-center animate-pulse text-sky-400 flex items-center gap-2"><span role="img" aria-label="quran">📖</span> Loading…</div>
            )}
            <div className="mt-6 w-full flex justify-center">
              <Link href="/quran" className="btn btn-primary w-full max-w-xs">Read more Quran</Link>
            </div>
          </CardContent>
        </div>
        {/* Daily Hadith */}
        <div className="card hover:shadow-2xl transition-shadow duration-200 flex flex-col items-center p-6 min-h-[260px] animate-fade-in">
          <CardHeader className="w-full flex flex-col items-center">
            <CardTitle className="text-xl font-bold text-emerald-700 dark:text-sky-300 border-b border-emerald-100 dark:border-sky-900 pb-2 mb-2 w-full text-center flex items-center justify-center gap-2">
              <span>Daily Hadith</span>
              <span role="img" aria-label="hadith">💬</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center w-full">
            <div className="text-center text-lg text-muted-foreground mb-4 flex flex-col items-center gap-2">
              <span>Discover a new hadith every day to inspire your faith.</span>
            </div>
            <div className="mt-6 w-full flex justify-center">
              <Link href="/hadith" className="btn btn-primary w-full max-w-xs">Read hadith of the day</Link>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}

const hadithBooks = [
  { key: "bukhari", label: "Sahih Al-Bukhari" },
  { key: "muslim", label: "Sahih Muslim" },
  { key: "abudawud", label: "Abu Dawud" },
  { key: "ibnmajah", label: "Ibn Majah" },
  { key: "tirmidhi", label: "Al-Tirmidhi" },
];

function HadithSection() {
  const [selectedBook, setSelectedBook] = useState("bukhari");
  const [hadith, setHadith] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://random-hadith-generator.vercel.app/${selectedBook}`)
      .then(res => res.json())
      .then(data => {
        setHadith(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedBook]);

  return (
    <div>
      <ul className="flex flex-wrap gap-2 justify-center mb-4">
        {hadithBooks.map(book => (
          <li key={book.key}>
            <button
              className={`btn btn-sm ${selectedBook === book.key ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedBook(book.key)}
            >
              {book.label}
            </button>
          </li>
        ))}
      </ul>
      {loading ? (
        <div className="italic text-center">Loading...</div>
      ) : hadith ? (
        <div className="text-center">
          <div className="font-semibold mb-1">{hadith.header?.replace(/\n/g, " ")}</div>
          <div className="italic mb-2">{hadith.hadith_english}</div>
          <div className="text-xs text-muted-foreground mb-1">{hadith.book} - {hadith.bookName?.replace(/\n/g, " ")}</div>
          <div className="text-xs text-muted-foreground">{hadith.chapterName?.replace(/\n/g, " ")}</div>
          <div className="text-xs text-muted-foreground">Ref: {hadith.refno}</div>
        </div>
      ) : (
        <div className="italic text-center">No hadith found.</div>
      )}
    </div>
  );
}

function IslamicEvents() {
  // Example static events, can be replaced with API in future
  const events = [
    { date: "2025-05-26", name: "Eid al-Adha" },
    { date: "2025-06-27", name: "Islamic New Year" },
    { date: "2025-07-05", name: "Ashura" },
  ];
  return (
    <div>
      <ul className="list-disc pl-4">
        {events.map(event => (
          <li key={event.date}><span className="font-semibold">{event.name}</span> – {event.date}</li>
        ))}
      </ul>
    </div>
  );
}
