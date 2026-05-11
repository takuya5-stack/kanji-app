"use client";

import { useState } from "react";
import type { KanjiEntry } from "../data/kanji";

interface FlashCardProps {
  kanji: KanjiEntry;
  onNext: () => void;
  onPrev: () => void;
  current: number;
  total: number;
}

export default function FlashCard({ kanji, onNext, onPrev, current, total }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleNext = () => {
    setFlipped(false);
    setTimeout(onNext, 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(onPrev, 150);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-sm text-gray-500">{current} / {total}</div>

      {/* Card */}
      <div
        className="w-80 h-64 cursor-pointer perspective-1000"
        onClick={() => setFlipped(!flipped)}
        style={{ perspective: "1000px" }}
      >
        <div
          className="relative w-full h-full transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-white rounded-2xl shadow-lg border-2 border-indigo-100"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-9xl font-bold text-indigo-800">{kanji.character}</div>
            <div className="mt-4 text-gray-400 text-sm">タップして答えを確認</div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-50 rounded-2xl shadow-lg border-2 border-indigo-200 gap-3 px-6"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-5xl font-bold text-indigo-800">{kanji.character}</div>
            {kanji.on.length > 0 && (
              <div className="text-center">
                <span className="text-xs font-semibold text-red-500 mr-1">音</span>
                <span className="text-lg text-gray-700">{kanji.on.join("・")}</span>
              </div>
            )}
            {kanji.kun.length > 0 && (
              <div className="text-center">
                <span className="text-xs font-semibold text-blue-500 mr-1">訓</span>
                <span className="text-lg text-gray-700">{kanji.kun.join("・")}</span>
              </div>
            )}
            <div className="text-sm text-gray-600 text-center">{kanji.meaning}</div>
          </div>
        </div>
      </div>

      {/* Examples */}
      {flipped && (
        <div className="w-80 bg-white rounded-xl shadow p-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">用例</div>
          {kanji.examples.map((ex, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="font-bold text-indigo-700">{ex.word}</span>
              <span className="text-sm text-gray-500">（{ex.reading}）</span>
              <span className="text-sm text-gray-600">— {ex.meaning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handlePrev}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          ← 前へ
        </button>
        <button
          onClick={() => setFlipped(!flipped)}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          {flipped ? "閉じる" : "答えを見る"}
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
