#!/usr/bin/env python3
"""Generate a 1200x630 OG share-card for a wedding invitation.
Per-slug capable: all text/photo come from the CONFIG dict (in the real
SaaS this is one invitation's data). Output is a landscape 1.91:1 card so
WhatsApp/Twitter render the large-image preview, not a tiny thumbnail.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import sys

CONFIG = {
    "photo": "/home/clown/Documents/Bintang/MY GITHUB/LAVELLE/public/img/mentahan/pasangan-utama.jpeg",
    "kicker": "THE WEDDING OF",
    "names": "Anindya & Rizky",
    "date": "SABTU, 20 FEBRUARI 2027",
    "brand": "lavelle.my.id",
    "out": "/home/clown/Documents/Bintang/MY GITHUB/LAVELLE/public/demo/royale/og.jpg",
}

W, H = 1200, 630
SERIF = "/usr/share/fonts/TTF/ttf-google-fonts-typewolf/PlayfairDisplay[wght].ttf"
SANS = "/usr/share/fonts/liberation/LiberationSans-Regular.ttf"

def load(path, size, wght=None):
    f = ImageFont.truetype(path, size)
    if wght is not None:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f

def text_w(draw, s, font, tracking=0):
    if tracking == 0:
        return draw.textbbox((0, 0), s, font=font)[2]
    return sum(draw.textbbox((0, 0), c, font=font)[2] + tracking for c in s) - tracking

def draw_tracked(draw, xy, s, font, fill, tracking):
    x, y = xy
    for c in s:
        draw.text((x, y), c, font=font, fill=fill)
        x += draw.textbbox((0, 0), c, font=font)[2] + tracking

def centered_tracked(draw, cy, s, font, fill, tracking):
    w = text_w(draw, s, font, tracking)
    draw_tracked(draw, ((W - w) / 2, cy), s, font, fill, tracking)

def main():
    # 1) photo → cover-crop to 1200x630
    src = Image.open(CONFIG["photo"]).convert("RGB")
    scale = max(W / src.width, H / src.height)
    nw, nh = int(src.width * scale + 1), int(src.height * scale + 1)
    src = src.resize((nw, nh), Image.LANCZOS)
    # focus a touch above center (faces usually upper half of portrait)
    left = (nw - W) // 2
    top = int((nh - H) * 0.34)
    img = src.crop((left, top, left + W, top + H))

    # 2) cinematic scrim: darken overall + stronger vignette bottom for text
    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for y in range(H):
        # top ~28%, rising toward bottom to ~72%
        a = 0.30 + 0.46 * (y / H) ** 1.5
        sd.line([(0, y), (W, y)], fill=int(a * 255))
    black = Image.new("RGB", (W, H), (14, 12, 16))
    img = Image.composite(black, img, scrim)
    # subtle centered radial lift so names pop
    glow = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W*0.16, H*0.28, W*0.84, H*0.92], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, glow)

    d = ImageDraw.Draw(img)

    # 3) elegant inset frame
    m = 34
    gold = (201, 169, 110)
    d.rectangle([m, m, W - m, H - m], outline=(238, 232, 224), width=2)
    d.rectangle([m + 7, m + 7, W - m - 7, H - m - 7], outline=gold, width=1)

    # 4) text stack (centered)
    f_kick = load(SANS, 26)
    f_names = load(SERIF, 108, 600)
    f_date = load(SANS, 27)
    f_brand = load(SANS, 24)
    white = (247, 244, 240)

    centered_tracked(d, 178, CONFIG["kicker"], f_kick, (223, 205, 178), 8)

    nb = d.textbbox((0, 0), CONFIG["names"], font=f_names)
    d.text(((W - (nb[2] - nb[0])) / 2 - nb[0], 232), CONFIG["names"], font=f_names, fill=white)

    # divider with center diamond
    cy = 388
    half = 150
    d.line([(W/2 - half, cy), (W/2 - 22, cy)], fill=gold, width=2)
    d.line([(W/2 + 22, cy), (W/2 + half, cy)], fill=gold, width=2)
    d.polygon([(W/2, cy - 7), (W/2 + 8, cy), (W/2, cy + 7), (W/2 - 8, cy)], fill=gold)

    centered_tracked(d, 420, CONFIG["date"], f_date, white, 6)

    # brand pill bottom-center
    brand = CONFIG["brand"].upper()
    bw = text_w(d, brand, f_brand, 4)
    centered_tracked(d, H - 92, brand, f_brand, (214, 198, 176), 4)

    img.save(CONFIG["out"], "JPEG", quality=88)
    print("saved", CONFIG["out"], img.size)

if __name__ == "__main__":
    main()
