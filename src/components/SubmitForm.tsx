"use client";

import { useState, type FormEvent, type ReactNode } from "react";

export function SubmitForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-[var(--line)] bg-[var(--paper-elevated)] p-7 shadow-[var(--shadow)]">
        <p className="display text-3xl text-[var(--ink)]">Спасибо</p>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
          История принята в очередь на модерацию. Сохранение на сервер подключим
          на следующем шаге.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 border border-[var(--line)] bg-[var(--paper-elevated)] p-6 shadow-[var(--shadow)] sm:p-7"
    >
      <Field label="Заголовок">
        <input
          required
          name="title"
          className="field"
          placeholder="Как называлась байка у вашего двора?"
        />
      </Field>
      <Field label="Тип">
        <select name="type" className="field" defaultValue="байка">
          <option>байка</option>
          <option>легенда</option>
          <option>анекдот</option>
          <option>слух</option>
          <option>топоним</option>
          <option>от местных</option>
        </select>
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Район / место">
          <input
            name="place"
            className="field"
            placeholder="Например, Холодная Гора"
          />
        </Field>
        <Field label="Год (если известен)">
          <input name="year" className="field" placeholder="1890" />
        </Field>
      </div>
      <Field label="Имена (через запятую)">
        <input name="people" className="field" placeholder="Харько, …" />
      </Field>
      <Field label="Текст истории">
        <textarea
          required
          name="body"
          rows={8}
          className="field min-h-[12rem]"
          placeholder="Расскажите, как слышали…"
        />
      </Field>
      <Field label="Иллюстрация или файл">
        <input
          name="file"
          type="file"
          accept="image/*,.pdf,.doc,.docx"
          className="field"
        />
      </Field>
      <button type="submit" className="btn btn-primary">
        Отправить на модерацию
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow mb-2 block">{label}</span>
      {children}
    </label>
  );
}
