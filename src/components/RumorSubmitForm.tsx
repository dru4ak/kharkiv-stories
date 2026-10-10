"use client";

import { useState, type FormEvent, type ReactNode } from "react";

export function RumorSubmitForm({
  labels,
  themes,
}: {
  labels: {
    title: string;
    lead: string;
    fieldTitle: string;
    fieldTitlePh: string;
    fieldPlace: string;
    fieldPlacePh: string;
    fieldYear: string;
    fieldYearPh: string;
    fieldTheme: string;
    fieldThemeOther: string;
    fieldBody: string;
    fieldBodyPh: string;
    fieldName: string;
    fieldNamePh: string;
    send: string;
    thanksTitle: string;
    thanksText: string;
  };
  themes: string[];
}) {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-[var(--line)] bg-[var(--paper-elevated)] p-7 shadow-[var(--shadow)]">
        <p className="display text-3xl text-[var(--ink)]">{labels.thanksTitle}</p>
        <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--ink-soft)]">
          {labels.thanksText}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="display text-[clamp(1.6rem,3.5vw,2.2rem)] text-[var(--ink)]">
        {labels.title}
      </h2>
      <p className="mt-2 text-[0.98rem] text-[var(--ink-soft)]">{labels.lead}</p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-5 border border-[var(--line)] bg-[var(--paper-elevated)] p-6 shadow-[var(--shadow)] sm:p-7"
      >
        <Field label={labels.fieldTitle}>
          <input
            required
            name="title"
            className="field"
            placeholder={labels.fieldTitlePh}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={labels.fieldPlace}>
            <input
              name="place"
              className="field"
              placeholder={labels.fieldPlacePh}
            />
          </Field>
          <Field label={labels.fieldYear}>
            <input
              name="year"
              className="field"
              placeholder={labels.fieldYearPh}
            />
          </Field>
        </div>

        <Field label={labels.fieldTheme}>
          <select name="theme" className="field" defaultValue="">
            <option value="">{labels.fieldThemeOther}</option>
            {themes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field label={labels.fieldBody}>
          <textarea
            required
            name="body"
            rows={8}
            className="field min-h-[12rem]"
            placeholder={labels.fieldBodyPh}
          />
        </Field>

        <Field label={labels.fieldName}>
          <input
            name="author"
            className="field"
            placeholder={labels.fieldNamePh}
          />
        </Field>

        <button type="submit" className="btn btn-primary">
          {labels.send}
        </button>
      </form>
    </div>
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
