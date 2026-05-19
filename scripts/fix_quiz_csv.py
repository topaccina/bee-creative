"""Fix BeeWise Quiz CSV: outer line quotes + inner unquoted commas broke columns."""
from __future__ import annotations

import csv
import io
from itertools import combinations
from pathlib import Path

EXPECTED = 11


def unwrap_line(line: str) -> str:
    line = line.rstrip("\n\r")
    if len(line) >= 2 and line[0] == '"' and line[-1] == '"':
        return line[1:-1].replace('""', '"')
    return line


def parse_inner(inner: str) -> list[str]:
    return list(csv.reader(io.StringIO(inner)))[0]


def score_row(text: str, o1: str, o2: str, o3: str, o4: str) -> float:
    """Higher is better — prefer question ending with ? or :; avoid merged answer choices."""
    s = 0.0
    t = text.strip()
    if t.endswith("?"):
        s += 100
    elif t.endswith(":"):
        s += 80
    elif t.endswith(".") or t.endswith("…"):
        s += 40

    for o in (o1, o2, o3, o4):
        o = o.strip()
        if o.startswith(("Sì", "No", "Solo ", "Il ", "La ", "Un ", "Una ", "Per ", "In ", "Miele", '"')):
            s += 12
        if ",Solo " in o:
            s -= 120
        # Two short alternatives glued: ",Sì" mid-string usually starts another option
        if ",Sì" in o and not o.startswith("Sì"):
            s -= 120
        if ",No," in o or o.endswith(",No"):
            s -= 80
        # "...,Trattamenti" often starts option B after "Solo il numero..."
        if ",Trattamenti" in o and not o.startswith("Trattamenti"):
            s -= 100
        if ",Colore" in o and "odore" not in o.lower():
            s -= 60
        # Prefer keeping common comma-phrases inside one option (bad CSV splits)
        if "asciutto e al buio" in o.lower():
            s += 90
        if "antivirali" in o.lower():
            s += 90
        if ",coloranti" in o.lower() and o.strip().lower() != "coloranti":
            s -= 100
        # Standalone fragments from bad splits usually start with lowercase
        st = o.strip()
        if st and st[0].islower():
            s -= 85

    s += min(len(o1), len(o2), len(o3), len(o4)) * 0.02
    s += max(len(o1), len(o2), len(o3), len(o4)) * 0.001
    return s


def partitions_mid(mid: list[str]) -> list[tuple[str, str, str, str, str]]:
    """
    Split mid (fragments between topic_label and correct_index) into
    text + 4 options by placing 4 cuts between consecutive runs.
    mid length L >= 5.
    """
    L = len(mid)
    if L < 5:
        return []
    # choose 4 cut positions in gaps 1..L-1: after cum lengths
    # indices: split after i means first group is mid[0:i] for i>=1
    # We need indices 0<a<b<c<d<L so groups are [0:a],[a:b],[b:c],[c:d],[d:L]
    out: list[tuple[str, str, str, str, str]] = []
    for a, b, c, d in combinations(range(1, L), 4):
        if not (a < b < c < d < L):
            continue
        g0 = ",".join(mid[0:a])
        g1 = ",".join(mid[a:b])
        g2 = ",".join(mid[b:c])
        g3 = ",".join(mid[c:d])
        g4 = ",".join(mid[d:L])
        out.append((g0, g1, g2, g3, g4))
    return out


def reconstruct_row(parts: list[str]) -> list[str] | None:
    """If parts represent one quiz row with extra comma splits, return 11 fields."""
    if len(parts) == EXPECTED:
        return parts
    if len(parts) < EXPECTED or not parts[-1].strip().isdigit():
        return None

    time_limit = parts[-1].strip()
    best: tuple[float, list[str]] | None = None

    for k in range(len(parts) - 2, 7, -1):
        if parts[k] not in ("0", "1", "2", "3") or len(parts[k]) != 1:
            continue
        left = parts[:k]
        if len(left) < 8:
            continue
        explanation = ",".join(parts[k + 1 : -1])
        mid = left[3:]
        if len(mid) < 5:
            continue
        id_, tk, tl = left[0], left[1], left[2]
        for text, o1, o2, o3, o4 in partitions_mid(mid):
            sc = score_row(text, o1, o2, o3, o4)
            row = [
                id_,
                tk,
                tl,
                text.strip(),
                o1.strip(),
                o2.strip(),
                o3.strip(),
                o4.strip(),
                parts[k],
                explanation.strip(),
                time_limit,
            ]
            if best is None or sc > best[0]:
                best = (sc, row)

    return best[1] if best else None


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    src = root / "input_data" / "BeeWise Quiz - 13_05.csv"
    dst = root / "input_data" / "BeeWise Quiz - 13_05_fixed.csv"

    fixed_log: list[tuple[int, list[str], list[str]]] = []
    out_rows: list[list[str]] = []

    with src.open(newline="", encoding="utf-8") as f:
        for lineno, raw in enumerate(f, 1):
            inner = unwrap_line(raw)
            parts = parse_inner(inner)
            if len(parts) == EXPECTED:
                out_rows.append(parts)
                continue
            fixed = reconstruct_row(parts)
            if fixed and len(fixed) == EXPECTED:
                fixed_log.append((lineno, parts, fixed))
                out_rows.append(fixed)
            else:
                out_rows.append(parts)

    with dst.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
        w.writerows(out_rows)

    print("Written:", dst)
    print("Fixed rows:", len(fixed_log))
    bad = [(i + 1, len(r)) for i, r in enumerate(out_rows) if len(r) != EXPECTED]
    if bad:
        print("Still bad:", bad[:25])


def debug_lines(src: Path, line_numbers: list[int]) -> None:
    lines = src.read_text(encoding="utf-8").splitlines()
    for lineno in line_numbers:
        raw = lines[lineno - 1]
        parts = parse_inner(unwrap_line(raw))
        fixed = reconstruct_row(parts)
        print("LINE", lineno, "n=", len(parts), "->", len(fixed) if fixed else None)
        if fixed:
            print("  text:", fixed[3][:100])
            print("  o1:", fixed[4][:80])


if __name__ == "__main__":
    import sys

    root = Path(__file__).resolve().parents[1]
    src = root / "input_data" / "BeeWise Quiz - 13_05.csv"
    if len(sys.argv) > 1 and sys.argv[1] == "--debug":
        nums = [int(x) for x in sys.argv[2:]] if len(sys.argv) > 2 else [107, 160]
        debug_lines(src, nums)
    else:
        main()
