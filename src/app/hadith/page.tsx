"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const hadithBooks = [
  { key: "bukhari", label: "Sahih Al-Bukhari" },
  { key: "muslim", label: "Sahih Muslim" },
  { key: "abudawud", label: "Abu Dawud" },
  { key: "ibnmajah", label: "Ibn Majah" },
  { key: "tirmidhi", label: "Al-Tirmidhi" },
];

export default function HadithPage() {
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
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-sky-700 dark:text-emerald-300 drop-shadow">Random Hadith</h2>
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
      <Card className="card hover:shadow-2xl transition-shadow duration-200">
        <CardContent>
          {loading ? (
            <div className="italic text-center animate-pulse text-sky-400">Loading…</div>
          ) : hadith ? (
            <div className="text-center">
              <div className="font-semibold mb-1 text-lg text-emerald-700 dark:text-sky-300">{hadith.header?.replace(/\n/g, " ")}</div>
              <div className="italic mb-2 text-lg">{hadith.hadith_english}</div>
              <div className="text-xs text-muted-foreground mb-1">{hadith.book} - {hadith.bookName?.replace(/\n/g, " ")}</div>
              <div className="text-xs text-muted-foreground">{hadith.chapterName?.replace(/\n/g, " ")}</div>
              <div className="text-xs text-muted-foreground">Ref: {hadith.refno}</div>
            </div>
          ) : (
            <div className="italic text-center">No hadith found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}