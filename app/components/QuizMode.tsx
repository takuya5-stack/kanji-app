"use client";

import { useState, useCallback } from "react";
import type { KanjiEntry } from "../data/kanji";

interface QuizModeProps {
  kanji: KanjiEntry[];
}

type QuizQuestion = {
  kanji: KanjiEntry;
  choices: string[];
  correct: string;
  type: "reading" | "meaning";
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildQuestions(kanji: KanjiEntry[]): QuizQuestion[] {
  return shuffle(kanji).map((k) => {
    const type = Math.random() > 0.5 ? "reading" : "meaning";
    const correct = type === "reading"
      ? (k.on[0] ?? k.kun[0] ?? "")
      : k.meaning;

    const pool = kanji
      .filter((o) => o.id !== k.id)
      .map((o) => type === "reading" ? (o.on[0] ?? o.kun[0] ?? "") : o.meaning)
      .filter(Boolean);

    const choices = shuffle([correct, ...shuffle(pool).slice(0, 3)]);
    return { kanji: k, choices, correct, type };
  });
}

export default function QuizMode({ kanji }: QuizModeProps) {
  const [questions] = useState<QuizQuestion[]>(() => buildQuestions(kanji));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = questions[index];

  const handleSelect = useCallback((choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    if (choice === q.correct) setScore((s) => s + 1);
  }, [selected, q]);

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <div className="text-4xl">{pct >= 80 ? "🎉" : pct >= 50 ? "😊" : "📚"}</div>
        <div className="text-2xl font-bold text-gray-800">
          {score} / {questions.length} 正解
        </div>
        <div className="text-5xl font-bold text-indigo-600">{pct}%</div>
        <div className="text-gray-600">
          {pct >= 80 ? "素晴らしい！" : pct >= 50 ? "もう少し！" : "復習しよう！"}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          もう一度
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* Progress */}
      <div className="w-full">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>問題 {index + 1} / {questions.length}</span>
          <span>正解 {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide">
          {q.type === "reading" ? "読み方は？" : "意味は？"}
        </div>
        <div className="text-8xl font-bold text-indigo-800">{q.kanji.character}</div>
      </div>

      {/* Choices */}
      <div className="w-full grid grid-cols-2 gap-3">
        {q.choices.map((choice) => {
          let cls = "w-full py-4 px-3 rounded-xl font-medium text-center transition-colors border-2 ";
          if (selected === null) {
            cls += "bg-white border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700 cursor-pointer";
          } else if (choice === q.correct) {
            cls += "bg-green-100 border-green-500 text-green-800";
          } else if (choice === selected) {
            cls += "bg-red-100 border-red-400 text-red-800";
          } else {
            cls += "bg-white border-gray-200 text-gray-400";
          }
          return (
            <button key={choice} className={cls} onClick={() => handleSelect(choice)}>
              {choice}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
        >
          {index + 1 >= questions.length ? "結果を見る" : "次の問題 →"}
        </button>
      )}
    </div>
  );
}
