"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const PRAYER_METHODS = [
  { id: 2, name: "ISNA" },
  { id: 1, name: "MWL" },
  { id: 3, name: "Egyptian" },
  { id: 4, name: "Umm al-Qura" },
  { id: 5, name: "Makkah" },
  { id: 7, name: "Karachi" },
  { id: 8, name: "Tehran" },
  { id: 9, name: "Gulf" },
  { id: 11, name: "Kuwait" },
  { id: 12, name: "Qatar" },
  { id: 13, name: "Singapore" },
  { id: 14, name: "Turkey" },
  { id: 15, name: "Jakarta" },
];

const PRAYER_DESCRIPTIONS: Record<string, string> = {
  Fajr: "Dawn prayer",
  Sunrise: "Sunrise",
  Dhuhr: "Noon prayer",
  Asr: "Afternoon prayer",
  Maghrib: "Sunset prayer",
  Isha: "Night prayer",
  Imsak: "Time to stop eating (fasting)",
  Midnight: "Islamic midnight",
  Firstthird: "First third of the night",
  Lastthird: "Last third of the night",
  Sunset: "Sunset",
};

function getNextPrayer(timings: Record<string, string>) {
  const order = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  for (const name of order) {
    const time = timings[name];
    if (!time) continue;
    const [h, m] = time.split(":");
    const t = new Date(today + "T" + h.padStart(2, "0") + ":" + m.padStart(2, "0") + ":00");
    if (t > now) return { name, time: t, label: name };
  }
  // If all passed, return Fajr of next day
  const [h, m] = timings["Fajr"].split(":");
  const t = new Date(today + "T" + h.padStart(2, "0") + ":" + m.padStart(2, "0") + ":00");
  t.setDate(t.getDate() + 1);
  return { name: "Fajr", time: t, label: "Fajr" };
}

function Countdown({ to }: { to: Date }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const diff = Math.max(0, Math.floor((to.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return <span>{h.toString().padStart(2, "0")}:{m.toString().padStart(2, "0")}:{s.toString().padStart(2, "0")}</span>;
}

export default function PrayerTimesPage() {
  const [timings, setTimings] = useState<Record<string, string> | null>(null);
  const [date, setDate] = useState<any>(null);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState(2); // ISNA default
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`);
          const data = await res.json();
          setTimings(data.data.timings);
          setDate(data.data.date);
          setMeta(data.data.meta);
        } catch (e) {
          setError("Failed to fetch prayer times.");
        }
        setLoading(false);
      }, () => {
        setError("Location not available.");
        setLoading(false);
      });
    } else {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, [method]);

  const nextPrayer = timings ? getNextPrayer(timings) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-sky-700 dark:text-emerald-300 drop-shadow">Today's Prayer Times</h2>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-2">
        <div>
          <span className="font-semibold">Calculation Method:</span>
          <select
            className="ml-2 border rounded px-2 py-1 focus:ring-2 focus:ring-sky-400"
            value={method}
            onChange={e => setMethod(Number(e.target.value))}
          >
            {PRAYER_METHODS.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
        {meta && (
          <div className="text-sm text-muted-foreground mt-1 md:mt-0 md:ml-4 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Location: {meta.latitude.toFixed(3)}, {meta.longitude.toFixed(3)} ({meta.timezone})</span>
          </div>
        )}
      </div>
      {date && (
        <div className="mb-6 flex flex-col md:flex-row gap-2">
          <div className="flex-1 bg-gradient-to-r from-sky-100/80 to-emerald-100/80 dark:from-[#1e293b]/80 dark:to-[#0f766e]/80 rounded-xl p-4 shadow">
            <div className="font-semibold text-sky-700 dark:text-emerald-300">Gregorian:</div>
            <div className="text-lg">{parseInt(date.gregorian.date.split('-')[0], 10)} {date.gregorian.month.en}</div>
          </div>
          <div className="flex-1 bg-gradient-to-r from-emerald-100/80 to-sky-100/80 dark:from-[#0f766e]/80 dark:to-[#1e293b]/80 rounded-xl p-4 shadow">
            <div className="font-semibold text-emerald-700 dark:text-sky-300">Hijri:</div>
            <div className="text-lg">{parseInt(date.hijri.date.split('-')[0], 10)} {date.hijri.month.en}</div>
          </div>
        </div>
      )}
      <Card className="card hover:shadow-2xl transition-shadow duration-200">
        <CardContent>
          {loading ? (
            <div className="flex flex-col items-center gap-2 animate-pulse text-sky-400">
              <span className="w-32 h-6 bg-sky-100 dark:bg-sky-900 rounded mb-2"></span>
              <span className="w-24 h-4 bg-emerald-100 dark:bg-emerald-900 rounded"></span>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : timings ? (
            <div>
              <table className="w-full text-center mb-4 rounded-xl overflow-hidden shadow">
                <thead className="bg-sky-100 dark:bg-emerald-900">
                  <tr>
                    <th className="py-2 text-sky-700 dark:text-emerald-300">Prayer</th>
                    <th className="py-2 text-sky-700 dark:text-emerald-300">Time</th>
                    <th className="py-2 text-sky-700 dark:text-emerald-300">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(timings)
                    .filter(([name]) => ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].includes(name))
                    .map(([name, time]) => (
                      <tr key={name} className={nextPrayer && name === nextPrayer.name ? "bg-emerald-100/60 dark:bg-sky-900/60 font-bold" : "hover:bg-sky-50 dark:hover:bg-emerald-950/40 transition-colors"}>
                        <td className="py-2">{name}</td>
                        <td>{time}</td>
                        <td className="text-xs text-muted-foreground">{PRAYER_DESCRIPTIONS[name] || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {nextPrayer && (
                <div className="text-center mb-2 text-lg">
                  <span className="font-semibold text-emerald-700 dark:text-sky-300">Next Prayer: {nextPrayer.name}</span>
                  <span className="ml-2">in <span className="font-mono"><Countdown to={nextPrayer.time} /></span></span>
                </div>
              )}
              {meta && (
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Method: <span className="font-semibold">{meta.method.name}</span> | School: <span className="font-semibold">{meta.school}</span> | Midnight: <span className="font-semibold">{timings.Midnight}</span>
                </div>
              )}
            </div>
          ) : (
            <div>No timings available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}