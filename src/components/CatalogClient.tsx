"use client";

import { useMemo, useState } from "react";
import type { Story, StoryType } from "@/data/stories";
import { StoryCard } from "@/components/StoryCard";
import type { Locale } from "@/i18n/config";

type Options = {
  types: StoryType[];
  districts: string[];
  eras: string[];
  people: string[];
};

export function CatalogClient({
  stories,
  options,
  initialType = "все",
  initialQuery = "",
  locale = "kh",
  labels,
}: {
  stories: Story[];
  options: Options;
  initialType?: string;
  initialQuery?: string;
  locale?: Locale;
  labels: {
    search: string;
    all: string;
    type: string;
    district: string;
    era: string;
    person: string;
    empty: string;
    read: string;
    storyTypes: Record<StoryType, string>;
  };
}) {
  const all = labels.all;
  const [q, setQ] = useState(initialQuery);
  const [type, setType] = useState<string>(
    initialType === "все" ? all : initialType,
  );
  const [district, setDistrict] = useState(all);
  const [era, setEra] = useState(all);
  const [person, setPerson] = useState(all);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return stories.filter((s) => {
      if (type !== all && s.type !== type) return false;
      if (district !== all && s.district !== district) return false;
      if (era !== all && s.era !== era) return false;
      if (person !== all && !s.people.includes(person)) return false;
      if (!query) return true;
      const hay = [
        s.title,
        s.summary,
        s.body,
        s.placeName,
        s.district,
        ...s.tags,
        ...s.people,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [stories, q, type, district, era, person, all]);

  const chips = [
    {
      key: "type",
      label: labels.type,
      value: type,
      set: setType,
      opts: [all, ...options.types],
      format: (opt: string) =>
        opt === all ? all : (labels.storyTypes[opt as StoryType] ?? opt),
    },
    {
      key: "district",
      label: labels.district,
      value: district,
      set: setDistrict,
      opts: [all, ...options.districts],
      format: (opt: string) => opt,
    },
    {
      key: "era",
      label: labels.era,
      value: era,
      set: setEra,
      opts: [all, ...options.eras],
      format: (opt: string) => opt,
    },
    {
      key: "person",
      label: labels.person,
      value: person,
      set: setPerson,
      opts: [all, ...options.people],
      format: (opt: string) => opt,
    },
  ];

  return (
    <div className="space-y-10">
      <div className="border border-[var(--line)] bg-[var(--paper-elevated)] p-5 shadow-[var(--shadow)] sm:p-6">
        <label className="block">
          <span className="eyebrow mb-2 block">{labels.search}</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={labels.search}
            className="field text-[1.05rem]"
          />
        </label>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {chips.map((chip) => (
            <label key={chip.key} className="block">
              <span className="eyebrow mb-2 block">{chip.label}</span>
              <div className="flex flex-wrap gap-2">
                {chip.opts.map((opt) => {
                  const active = chip.value === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => chip.set(opt)}
                      className={`min-h-10 px-3 py-2 text-[0.88rem] transition ${
                        active
                          ? "bg-[var(--brick)] text-[var(--paper-elevated)]"
                          : "border border-[var(--line)] bg-[var(--paper)] text-[var(--ink-soft)] hover:border-[var(--brick)] hover:text-[var(--brick)]"
                      }`}
                    >
                      {chip.format(opt)}
                    </button>
                  );
                })}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.95rem] text-[var(--muted)]">
          <span className="font-semibold text-[var(--ink)]">{filtered.length}</span>
        </p>
        {(q ||
          type !== all ||
          district !== all ||
          era !== all ||
          person !== all) && (
          <button
            type="button"
            className="text-[0.9rem] font-semibold text-[var(--brick)] hover:underline"
            onClick={() => {
              setQ("");
              setType(all);
              setDistrict(all);
              setEra(all);
              setPerson(all);
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            locale={locale}
            readLabel={labels.read}
            typeLabel={labels.storyTypes[story.type]}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="border border-dashed border-[var(--line-strong)] p-10 text-center text-[var(--muted)]">
          {labels.empty}
        </p>
      )}
    </div>
  );
}
