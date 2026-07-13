#!/usr/bin/env python3
"""Branded 1200x630 OG card for the Lavelle marketing homepage.
Landscape 1.91:1 so WhatsApp/Twitter render the large-image preview."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter

CFG = {
    "photo": "/home/clown/Documents/Bintang/MY GITHUB/LAVELLE/public/img/mentahan/pasangan-bukit-sunset.jpeg",
    "brand": "Lavelle",
    "tagline": "UNDANGAN PERNIKAHAN DIGITAL PREMIUM",
    "sub": "RSVP · Buku Ucapan · Galeri · Amplop Digital — dalam satu link",
    "url": "lavelle.my.id",
    "out": "/home/clown/Documents/Bintang/MY GITHUB/LAVELLE/public/img/og-home.jpg",
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


def tw(d, s, f, tr=0):
    if tr == 0: return d.textbbox((0, 0), s, font=f)[2]
    return sum(d.textbbox((0, 0), c, font=f)[2] + tr for c in s) - tr


def centered(d, cy, s, f, fill, tr):
    x = (W - tw(d, s, f, tr)) / 2
    for c in s:
        d.text((x, cy), c, font=f, fill=fill)
        x += d.textbbox((0, 0), c, font=f)[2] + tr


def main():
    src = Image.open(CFG["photo"]).convert("RGB")
    scale = max(W / src.width, H / src.height)
    src = src.resize((int(src.width * scale + 1), int(src.height * scale + 1)), Image.LANCZOS)
    left = (src.width - W) // 2
    top = int((src.height - H) * 0.32)
    img = src.crop((left, top, left + W, top + H))

    # scrim for legibility
    scrim = Image.new("L", (W, H), 0)
    sd = ImageDraw.Draw(scrim)
    for y in range(H):
        sd.line([(0, y), (W, y)], fill=int((0.42 + 0.32 * (y / H)) * 255))
    img = Image.composite(Image.new("RGB", (W, H), (18, 20, 12)), img, scrim)
    glow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(glow).ellipse([W*0.18, H*0.26, W*0.82, H*0.94], fill=66)
    img = Image.composite(Image.new("RGB", (W, H), (0, 0, 0)), img, glow.filter(ImageFilter.GaussianBlur(120)))

    d = ImageDraw.Draw(img)
    m = 34
    gold = (216, 173, 104)
    d.rectangle([m, m, W - m, H - m], outline=(238, 232, 224), width=2)
    d.rectangle([m + 7, m + 7, W - m - 7, H - m - 7], outline=gold, width=1)

    centered(d, 150, CFG["tagline"], load(SANS, 24), (223, 205, 178), 7)
    brand = CFG["brand"]
    bf = load(SERIF, 132, 600)
    bb = d.textbbox((0, 0), brand, font=bf)
    d.text(((W - (bb[2] - bb[0])) / 2 - bb[0], 210), brand, font=bf, fill=(247, 244, 240))
    cy = 392
    d.line([(W/2 - 150, cy), (W/2 - 22, cy)], fill=gold, width=2)
    d.line([(W/2 + 22, cy), (W/2 + 150, cy)], fill=gold, width=2)
    d.polygon([(W/2, cy - 7), (W/2 + 8, cy), (W/2, cy + 7), (W/2 - 8, cy)], fill=gold)
    centered(d, 420, CFG["sub"], load(SANS, 25), (238, 232, 222), 1)
    centered(d, H - 92, CFG["url"].upper(), load(SANS, 24), (214, 198, 176), 5)

    img.save(CFG["out"], "JPEG", quality=88)
    print("saved", CFG["out"], img.size)


if __name__ == "__main__":
    main()
