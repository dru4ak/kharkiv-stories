# -*- coding: utf-8 -*-
"""Build plan1887-streets.json from plan1887-streets.tsv."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TSV = Path(__file__).resolve().parent / "plan1887-streets.tsv"
OUT = ROOT / "src" / "data" / "plan1887-streets.json"

_LOWER = "abcdefghijklmnopqrstuvwxyz"
_CYR_LO = "\u0430\u0431\u0441\u0434\u0435\u0444\u0433\u0445\u0438\u0439\u043a\u043b\u043c\u043d\u043e\u043f\u043a\u0440\u0441\u0442\u0443\u0432\u0432\u0445\u044b\u0437"
_CYR_HI = "\u0410\u0411\u0421\u0414\u0415\u0424\u0413\u0425\u0418\u0419\u041a\u041b\u041c\u041d\u041e\u041f\u041a\u0420\u0421\u0422\u0423\u0412\u0412\u0425\u042b\u0417"
assert len(_LOWER) == len(_CYR_LO) == len(_CYR_HI)
_LAT_MAP = {**dict(zip(_LOWER, _CYR_LO)), **dict(zip(_LOWER.upper(), _CYR_HI))}
LAT = str.maketrans(_LAT_MAP)


def normalize_name(name: str) -> str:
    name = name.translate(LAT)
    # mixed-script OCR (latin y -> ы before final а)
    for a, b in (
        ("skaыa", "ская"),
        ("skiы", "ский"),
        ("наыa", "ная"),
        ("аыa ул.", "ая ул."),
        ("аыa пл.", "ая пл."),
        ("Гonsхар", "Гонchar"),
        ("Гonсхar", "Гonchar"),
        ("Схерноглаз", "Черноглаз"),
        ("Алехандр", "Александр"),
        ("Розхдест", "Рождест"),
        ("Сирокхин", "Сирохин"),
        ("Славыан", "Славян"),
        ("Мыаснит", "Мясниц"),
        ("Мыасни", "Мясни"),
        ("Скрипит", "Скрыпиц"),
        ("Тeатрал", "Театрал"),
        ("Тыурин", "Тюрин"),
        ("Основын", "Основян"),
        ("Mironosits", "Mironosits"),
        ("Miroсх", "Miro"),
        ("Подгорna", "Подгор"),
        ("Съезdin", "Съезд"),
        ("схаров", "чаров"),
        ("схар", "чар"),
        ("осхна", "очна"),
        ("олсхан", "олчан"),
        ("есхен", "ечен"),
        ("ессхан", "есчан"),
        ("осхтов", "очтов"),
        ("схескиы", "ческий"),
        ("схески", "ческий"),
        ("ологисх", "ологическ"),
        ("исхев", "ишев"),
        ("нысхев", "нышев"),
        ("екхнолог", "ехнолог"),
        ("Посхтовыы", "Почтовый"),
        ("Пессханый", "Песчаный"),
        ("Купесхескиы", "Купеческий"),
    ):
        name = name.replace(a, b)
    name = re.sub(r"ыa(\s|$)", r"ая\1", name)
    name = re.sub(r"иы(\s|$)", r"ий\1", name)
    name = name.replace("skiy пер.", "ский пер.")
    name = name.replace("skaya ул.", "ская ул.")
    name = name.replace("skaya пл.", "ская пл.")
    name = name.replace("ovskiy пер.", "овский пер.")
    name = name.replace("ovskaya ул.", "овская ул.")
    name = name.replace("skiy пер.", "ский пер.")
    name = name.replace("ckiy пер.", "цкий пер.")
    name = name.replace("ckiy ул.", "цкая ул.")
    name = name.replace("chnaya ул.", "чная ул.")
    name = name.replace("chnyy пер.", "чный пер.")
    name = name.replace("yy пер.", "ый пер.")
    name = name.replace("nyy пер.", "ный пер.")
    name = name.replace("iy пер.", "ий пер.")
    name = name.replace("aya ул.", "ая ул.")
    name = name.replace("aya пл.", "ая пл.")
    name = name.replace("skiy 2-\u0439 пер.", "ский 2-й пер.")
    name = name.replace("charov", "charov")  # Goncharov
    name = name.replace("Gonchar", "Gonchar")
    name = name.replace("\u0413onchar", "\u0413\u043e\u043d\u0447\u0430\u0440")
    name = name.replace("Episkopskaya", "\u0415\u043f\u0438\u0441\u043a\u043e\u043f\u0441\u043a\u0430\u044f")
    name = name.replace("Mihailov", "\u041c\u0438\u0445\u0430\u0439\u043b\u043e\u0432")
    name = name.replace("Mironositskaya", "\u041c\u0438\u0440\u043e\u043d\u043e\u0441\u0438\u0446\u043a\u0430\u044f")
    name = name.replace("Molokhnaya", "\u041c\u043e\u043b\u043e\u0447\u043d\u0430\u044f")
    name = name.replace("Kupecheskiy", "\u041a\u0443\u043f\u0435\u0447\u0435\u0441\u043a\u0438\u0439")
    name = name.replace("Pochtovyy", "\u041f\u043e\u0447\u0442\u043e\u0432\u044b\u0439")
    name = name.replace("Teatralnyy", "\u0422\u0435\u0430\u0442\u0440\u0430\u043b\u044c\u043d\u044b\u0439")
    name = name.replace("Stolyarnyy", "\u0421\u0442\u043e\u043b\u044f\u0440\u043d\u044b\u0439")
    name = name.replace("Slesarnyy", "\u0421\u043b\u0435\u0441\u0430\u0440\u043d\u044b\u0439")
    name = name.replace("Seminarskiy", "\u0421\u0435\u043c\u0438\u043d\u0430\u0440\u0441\u043a\u0438\u0439")
    name = name.replace("Pavlovskiy", "\u041f\u0430\u0432\u043b\u043e\u0432\u0441\u043a\u0438\u0439")
    name = name.replace("Frolovskiy", "\u0424\u0440\u043e\u043b\u043e\u0432\u0441\u043a\u0438\u0439")
    name = name.replace("Usovskiy", "\u0423\u0441\u043e\u0432\u0441\u043a\u0438\u0439")
    name = name.replace("Podolskiy", "\u041f\u043e\u0434\u043e\u043b\u044c\u0441\u043a\u0438\u0439")
    name = name.replace("Novyy", "\u041d\u043e\u0432\u044b\u0439")
    name = name.replace("Peschan\u044b\u0439", "\u041f\u0435\u0441\u0447\u0430\u043d\u044b\u0439")
    name = name.replace("Krinichny", "\u041a\u0440\u0438\u043d\u0438\u0447\u043d\u044b\u0439")
    name = name.replace("Naberezhny", "\u041d\u0430\u0431\u0435\u0440\u0435\u0436\u043d\u044b\u0439")
    return name.strip()


def norm_grids(raw: str) -> list[str]:
    if not raw.strip():
        return []
    out: list[str] = []
    for part in re.split(r"[\s,]+", raw.strip()):
        part = part.replace("—", "-").replace("–", "-").replace(".", "")
        if not part:
            continue
        m = re.match(r"^(\d{1,2})-([IVX]+)$", part, re.I)
        if m:
            out.append(f"{int(m.group(1))}-{m.group(2).upper()}")
    return out


def main() -> None:
    entries: list[tuple[str, list[str]]] = []
    for line in TSV.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        name, _, grids = line.partition("|")
        entries.append((normalize_name(name), norm_grids(grids)))

    merged: dict[str, list[str]] = {}
    for name, grids in entries:
        if not name:
            continue
        merged.setdefault(name, [])
        for g in grids:
            if g not in merged[name]:
                merged[name].append(g)

    data = [{"name": k, "grids": v} for k, v in sorted(merged.items(), key=lambda x: x[0].casefold())]
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(data)} streets")


if __name__ == "__main__":
    main()
