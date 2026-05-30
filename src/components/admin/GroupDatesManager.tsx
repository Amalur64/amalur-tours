"use client";

import { useState, useEffect } from "react";
import { CalendarPlus, Trash2, RefreshCw } from "lucide-react";

function formatDateFR(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

export function GroupDatesManager() {
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/group-dates");
      const data = await res.json();
      setDates(data.dates || []);
    } catch {
      setError("Impossible de charger les dates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDates();
  }, []);

  const addDate = async () => {
    if (!newDate) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/group-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setDates(data.dates || []);
        setNewDate("");
      }
    } catch {
      setError("Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  const removeDate = async (date: string) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/group-dates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      const data = await res.json();
      setDates(data.dates || []);
    } catch {
      setError("Erreur lors de la suppression.");
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-800">🗓️ Dates San Sebastián Groupe</h3>
          <p className="text-xs text-gray-500 mt-0.5">Dates disponibles à la réservation en ligne</p>
        </div>
        <button
          onClick={fetchDates}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          title="Rafraîchir"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Add date */}
      <div className="flex gap-2 mb-5">
        <input
          type="date"
          value={newDate}
          min={today}
          onChange={(e) => setNewDate(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-basque-red/30"
        />
        <button
          onClick={addDate}
          disabled={!newDate || saving}
          className="flex items-center gap-1.5 bg-basque-red text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-basque-red/90 disabled:opacity-40 transition-colors"
        >
          <CalendarPlus size={16} />
          Ajouter
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-3">{error}</p>
      )}

      {/* Date list */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : dates.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          Aucune date configurée. Ajoutez des dates ci-dessus.
        </p>
      ) : (
        <ul className="space-y-2">
          {dates.map((d) => {
            const isPast = d < today;
            return (
              <li
                key={d}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm ${
                  isPast
                    ? "bg-gray-50 border-gray-100 text-gray-400"
                    : "bg-green-50 border-green-100 text-gray-700"
                }`}
              >
                <span>
                  {isPast ? "⏳ " : "✅ "}
                  <strong>{formatDateFR(d)}</strong>
                  {isPast && <span className="ml-2 text-xs">(passée)</span>}
                </span>
                <button
                  onClick={() => removeDate(d)}
                  disabled={saving}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                  title="Supprimer cette date"
                >
                  <Trash2 size={15} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
