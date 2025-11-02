"use client";
import { useMemo, useState } from "react";

const QUESTIONS: string[][] = [
  ["Вовлеченный", "Сомневающийся", "Яркий", "Отзывчивый"],
  ["Прямолинейный", "Анализирующий", "Харизматичный", "Чувствующий"],
  ["Делающий", "Созерцающий", "Провоцирующий", "Сопереживающий"],
  ["Отдающий себе отчет", "Оценивающий", "Идущий на риск", "Благожелательный"],
  ["Результативный", "Логичный", "Задающий вопросы", "Интуитивный"],
  ["Упорный", "Консервативный", "Радикальный", "Общительный"],
  ["Активный", "Наблюдающий", "Абстрактный", "Взаимодействующий"],
  ["Прагматичный", "Размышляющий", "Смотрящий в будущее", "Теплый"],
  ["Побеждающий", "Точный", "Концептуальный", "Стремящийся к консенсусу"],
  ["Рациональный", "Сдержанный", "Генерирующий идеи", "Осведомленный"],
  ["Деловой", "Аккуратный", "Яркий", "Приятный"],
  ["Реалистичный", "Осторожный", "Мечтающий", "Объединяющий"],
];

// А→P, Б→A, В→E, Г→I
const ROLE_MAP = ["P", "A", "E", "I"] as const;
type Role = typeof ROLE_MAP[number];
const ROLE_DESC: Record<Role, string> = {
  P: "Производитель: результат, скорость, действие.",
  A: "Администратор: порядок, качество, минимизация рисков.",
  E: "Предприниматель: возможности, идеи, изменения.",
  I: "Интегратор: люди, доверие, сотрудничество."
};

export default function Page() {
  const [answers, setAnswers] = useState<number[][]>(
    Array.from({ length: 12 }, () => [0, 0, 0, 0])
  );
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => {
    const filled = answers.filter((r) => r.some((v) => v > 0)).length;
    return Math.round((filled / QUESTIONS.length) * 100);
  }, [answers]);

  const totals = useMemo(() => {
    const t: Record<Role, number> = { P: 0, A: 0, E: 0, I: 0 };
    answers.forEach((r) => r.forEach((val, i) => (t[ROLE_MAP[i]] += Number(val||0))));
    return t;
  }, [answers]);

  const handleInput = (qi: number, oi: number, val: number) => {
    const v = Math.max(0, Math.min(4, Math.floor(Number(val))));
    const next = answers.map((r, i) => (i === qi ? [...r] : r));
    next[qi][oi] = v;
    setAnswers(next);
  };

  const reset = () => {
    setAnswers(Array.from({ length: 12 }, () => [0, 0, 0, 0]));
    setSubmitted(false);
  };

  const maxTotal = 48;
  const leadRole = (Object.keys(totals) as Role[]).reduce((a,b)=> totals[a] >= totals[b] ? a : b, "P");
  const sortedRoles = (Object.keys(totals) as Role[]).sort((a,b)=> totals[b]-totals[a]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Мини‑тест по типологии Адизеса (PAEI)</h1>
        <p className="text-slate-600 mt-2">
          В каждом вопросе расставьте оценки от <b>1</b> до <b>4</b> — насколько вариант описывает вас.<br/>
          Соответствие: <b>А→P</b>, <b>Б→A</b>, <b>В→E</b>, <b>Г→I</b>.
        </p>
      </header>

      <div className="mb-6">
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div className="h-2 bg-slate-800" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-sm text-slate-600 mt-1 text-center">Прогресс: {progress}%</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {QUESTIONS.map((opts, qi) => (
          <section key={qi} className="rounded-xl border bg-white shadow-sm">
            <div className="px-4 py-3 border-b">
              <h2 className="text-base font-semibold">{qi + 1}</h2>
            </div>
            <div className="p-4 space-y-2">
              {opts.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-medium">{String.fromCharCode(1040 + oi)}</span>
                  <span className="flex-1">{opt}</span>
                  <input
                    inputMode="numeric"
                    type="number"
                    min={1}
                    max={4}
                    value={answers[qi][oi] || ""}
                    onChange={(e) => handleInput(qi, oi, Number(e.target.value))}
                    className="w-16 text-center border rounded-md px-2 py-1"
                    placeholder="1–4"
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <button
          onClick={() => setSubmitted(true)}
          disabled={answers.some((r) => r.some((v) => v === 0))}
          className="px-5 py-3 rounded-xl bg-black text-white disabled:opacity-40"
        >
          Показать результат
        </button>
        <button onClick={reset} className="px-5 py-3 rounded-xl border">
          Сбросить
        </button>
      </div>

      {submitted && (
        <section className="mt-10 rounded-xl border bg-white shadow-sm p-5">
          <h3 className="text-xl font-semibold mb-4">Суммы баллов по ролям PAEI</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {ROLE_MAP.map((r) => (
              <div key={r} className="flex items-center justify-between border p-3 rounded-lg">
                <span className="font-medium text-lg">{r}</span>
                <span className="text-xl font-semibold">{totals[r]}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4 items-end h-64">
            {ROLE_MAP.map((r) => {
              const h = (totals[r] / maxTotal) * 100;
              return (
                <div key={r} className="flex flex-col items-center gap-2">
                  <div className="w-12 md:w-16 bg-slate-800 rounded-t-lg" style={{ height: `${Math.max(4, h)}%` }} title={`${r}: ${totals[r]} / ${maxTotal}`} />
                  <div className="text-sm font-medium">{r}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border">
            <h4 className="font-semibold mb-2">Интерпретация</h4>
            <p className="text-sm text-slate-700">Доминирующая роль: <b>{leadRole}</b>. {ROLE_DESC[leadRole as Role]}</p>
            <p className="text-sm text-slate-600 mt-2">
              Профиль по убыванию: {sortedRoles.map((r)=> `${r} (${totals[r]})`).join(" → ")}
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Это экспресс‑оценка. Для глубокой диагностики используйте расширенный опросник Адизеса или 360‑опрос.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
