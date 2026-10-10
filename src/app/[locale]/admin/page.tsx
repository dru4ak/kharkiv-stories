import type { Metadata } from "next";
import { buildPageMetadata } from "@/i18n/seo";

export const metadata: Metadata = {
  ...buildPageMetadata({
    locale: "kh",
    path: "/admin",
    page: "admin",
    noIndex: true,
  }),
};

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-4xl text-[var(--ink)]">
        Модерация
      </h1>
      <p className="mt-4 text-[var(--ink-soft)]">
        Здесь появится очередь заявок (pending) с approve / reject. Сейчас форма
        на сайте уже есть — сохранение в базу подключим на следующем шаге
        наполнения.
      </p>
    </div>
  );
}
