import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function IslamicEvents() {
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

export default function EventsPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl font-extrabold mb-6 text-sky-700 dark:text-emerald-300 drop-shadow">Upcoming Islamic Events</h2>
      <Card className="card hover:shadow-2xl transition-shadow duration-200">
        <CardContent>
          <IslamicEvents />
        </CardContent>
      </Card>
    </div>
  );
}