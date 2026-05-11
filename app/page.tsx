"use client";

import { useState } from "react";
import { kanjiData } from "./data/kanji";
import FlashCard from "./components/FlashCard";
import QuizMode from "./components/QuizMode";
import UnitSelector from "./components/UnitSelector";

type Mode = "home" | "flash" | "quiz";

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  const [selectedUnits, setSelectedUnits] = useState<number[]>([1, 2, 3, 4]);
  const [cardIndex, setCardIndex] = useState(0);

  const filtered = kanjiData.filter((k) => selectedUnits.includes(k.unit));

  const handleStartFlash = () => {
    setCardIndex(0);
    setMode("flash");
  };

  const handleStartQuiz = () => {
    setCardIndex(0);
    setMode("quiz");
  };

  if (mode === "flash") {
    if (filtered.length === 0) {
      return <EmptyState onBack={() => setMode("home")} />;
    }
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        <Header onBack={() => setMode("home")} title="フラッシュカード" />
        <div className="flex-1 flex items-center justify-center p-6">
          <FlashCard
            kanji={filtered[cardIndex]}
            onNext={() => setCardIndex((i) => (i + 1) % filtered.length)}
            onPrev={() => setCardIndex((i) => (i - 1 + filtered.length) % filtered.length)}
            current={cardIndex + 1}
            total={filtered.length}
          />
        </div>
      </main>
    );
  }

  if (mode === "quiz") {
    if (filtered.length < 4) {
      return <EmptyState onBack={() => setMode("home")} message="クイズには4文字以上必要です" />;
    }
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
        <Header onBack={() => setMode("home")} title="クイズ" />
        <div className="flex-1 flex items-start justify-center p-6 pt-8">
          <QuizMode kanji={filtered} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-3">漢</div>
          <h1 className="text-3xl font-bold text-indigo-900">漢字学習</h1>
          <p className="text-gray-500 mt-1 text-sm">アイスプラネット</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <UnitSelector selectedUnits={selectedUnits} onChange={setSelectedUnits} />
          <div className="mt-3 text-xs text-gray-400 text-center">
            {filtered.length} 文字 選択中
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleStartFlash}
            disabled={filtered.length === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-2xl font-semibold text-lg shadow-md transition-colors"
          >
            フラッシュカード
          </button>
          <button
            onClick={handleStartQuiz}
            disabled={filtered.length < 4}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-2xl font-semibold text-lg shadow-md transition-colors"
          >
            クイズ
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          ※ 単元は随時追加予定
        </p>
      </div>
    </main>
  );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <header className="flex items-center px-4 py-4 bg-white/80 backdrop-blur shadow-sm">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
      >
        ← ホーム
      </button>
      <h2 className="flex-1 text-center font-bold text-gray-800">{title}</h2>
      <div className="w-16" />
    </header>
  );
}

function EmptyState({ onBack, message = "単元を選択してください" }: { onBack: () => void; message?: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-600">{message}</p>
      <button onClick={onBack} className="text-indigo-600 hover:underline">← 戻る</button>
    </main>
  );
}
