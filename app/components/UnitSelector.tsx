"use client";

import { units } from "../data/kanji";

interface UnitSelectorProps {
  selectedUnits: number[];
  onChange: (units: number[]) => void;
}

export default function UnitSelector({ selectedUnits, onChange }: UnitSelectorProps) {
  const toggle = (id: number) => {
    if (selectedUnits.includes(id)) {
      onChange(selectedUnits.filter((u) => u !== id));
    } else {
      onChange([...selectedUnits, id]);
    }
  };

  const allSelected = selectedUnits.length === units.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-600">単元を選択</span>
        <button
          onClick={() => onChange(allSelected ? [] : units.map((u) => u.id))}
          className="text-xs text-indigo-600 hover:underline"
        >
          {allSelected ? "全て解除" : "全て選択"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {units.map((u) => {
          const active = selectedUnits.includes(u.id);
          return (
            <button
              key={u.id}
              onClick={() => toggle(u.id)}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${
                active
                  ? "border-indigo-500 bg-indigo-50 text-indigo-800"
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
              }`}
            >
              <div className="font-semibold text-sm">Unit {u.id}</div>
              <div className="text-xs mt-0.5 opacity-80">{u.title}</div>
              <div className="text-xs opacity-60">{u.pages}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
