from PIL import Image
import os

base = os.path.join(os.path.dirname(__file__), "..", "public", "maps", "ocr")
base = os.path.normpath(base)

for prefix in ("hi-L", "hi-R"):
    rows = []
    for r in range(3):
        im1 = Image.open(os.path.join(base, f"{prefix}{r}r0.png"))
        im2 = Image.open(os.path.join(base, f"{prefix}{r}r1.png"))
        row = Image.new("RGB", (im1.width + im2.width, max(im1.height, im2.height)))
        row.paste(im1, (0, 0))
        row.paste(im2, (im1.width, 0))
        rows.append(row)
    total_h = sum(r.height for r in rows)
    w = max(r.width for r in rows)
    out = Image.new("RGB", (w, total_h))
    y = 0
    for r in rows:
        out.paste(r, (0, y))
        y += r.height
    path = os.path.join(base, f"{prefix}-stitched.png")
    out.save(path)
    print(path, out.size)
