import os
import json
import urllib.request
from PIL import Image

OMDB_KEY = "trilogy"

queries = {
    81: ("Morbius", 2022),
    87: ("Werewolf by Night", 2022),
    99: ("Madame Web", 2024),
    102: ("Agatha All Along", 2024),
    103: ("Venom: The Last Dance", 2024),
    104: ("Kraven the Hunter", 2024)
}

for idx, (t, yr) in queries.items():
    orig_p = f"poster/originals/portrait_{idx}.jpg"
    orig_l = f"poster/originals/landscape_{idx}.jpg"
    url = f"http://www.omdbapi.com/?apikey={OMDB_KEY}&t={urllib.parse.quote(t)}&y={yr}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as r:
            d = json.loads(r.read().decode())
            poster = d.get('Poster')
            if poster and poster != "N/A":
                high_res = poster.split("._V1_")[0] + "._V1_.jpg"
                req2 = urllib.request.Request(high_res, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req2, timeout=8) as r2:
                    data = r2.read()
                    if len(data) > 10000:
                        with open(orig_p, 'wb') as f:
                            f.write(data)
                        print(f"Downloaded official poster for #{idx} {t} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed {t}: {e}")

# For Jessica Jones S2 & S3, use Jessica Jones high-res poster if small
if os.path.exists("poster/originals/portrait_39.jpg") and os.path.getsize("poster/originals/portrait_39.jpg") > 30000:
    for s_id in [54, 67]:
        if os.path.getsize(f"poster/originals/portrait_{s_id}.jpg") < 30000:
            with open("poster/originals/portrait_39.jpg", "rb") as src, open(f"poster/originals/portrait_{s_id}.jpg", "wb") as dst:
                dst.write(src.read())
            print(f"Copied Jessica Jones poster to #{s_id}")

# For Daredevil Born Again S2, use S1 poster if small
if os.path.exists("poster/originals/portrait_108.jpg") and os.path.getsize("poster/originals/portrait_108.jpg") > 30000:
    if os.path.getsize("poster/originals/portrait_115.jpg") < 30000:
        with open("poster/originals/portrait_108.jpg", "rb") as src, open("poster/originals/portrait_115.jpg", "wb") as dst:
            dst.write(src.read())
        print("Copied Daredevil Born Again poster to #115")

# For X-Men 97 S2, use S1 poster if small
if os.path.exists("poster/originals/portrait_100.jpg") and os.path.getsize("poster/originals/portrait_100.jpg") > 30000:
    if os.path.getsize("poster/originals/portrait_117.jpg") < 30000:
        with open("poster/originals/portrait_100.jpg", "rb") as src, open("poster/originals/portrait_117.jpg", "wb") as dst:
            dst.write(src.read())
        print("Copied X-Men 97 poster to #117")

# Recompress all items
for idx in range(1, 122):
    orig_p = f"poster/originals/portrait_{idx}.jpg"
    orig_l = f"poster/originals/landscape_{idx}.jpg"
    if os.path.exists(orig_p):
        with Image.open(orig_p) as im:
            im = im.convert("RGB")
            im.thumbnail((400, 600), Image.Resampling.LANCZOS)
            im.save(f"poster/portrait/{idx}.webp", "WEBP", quality=82)
            im.save(f"poster/portrait/{idx}.jpg", "JPEG", quality=82)
            im.save(f"poster/portrait_{idx}.webp", "WEBP", quality=82)
    if os.path.exists(orig_l):
        with Image.open(orig_l) as im:
            im = im.convert("RGB")
            im.thumbnail((1280, 720), Image.Resampling.LANCZOS)
            im.save(f"poster/landscape/{idx}.webp", "WEBP", quality=80)
            im.save(f"poster/landscape/{idx}.jpg", "JPEG", quality=80)
            im.save(f"poster/landscape_{idx}.webp", "WEBP", quality=80)

print("All posters polished and recompressed successfully!")
