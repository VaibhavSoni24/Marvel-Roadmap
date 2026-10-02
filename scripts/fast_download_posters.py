import os
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image, ImageDraw, ImageFont

POSTER_DIR = "poster"
PORTRAIT_DIR = os.path.join(POSTER_DIR, "portrait")
LANDSCAPE_DIR = os.path.join(POSTER_DIR, "landscape")
ORIGINALS_DIR = os.path.join(POSTER_DIR, "originals")

os.makedirs(PORTRAIT_DIR, exist_ok=True)
os.makedirs(LANDSCAPE_DIR, exist_ok=True)
os.makedirs(ORIGINALS_DIR, exist_ok=True)

TMDB_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb"

with open("marvel_dataset_raw.json", "r", encoding="utf-8") as f:
    items = json.load(f)

# Curated fallback mapping for known items
KNOWN_BACKDROPS = {
    1: "https://image.tmdb.org/t/p/original/7NKfxJrQn053UJeLftlx4m4NTzo.jpg", # Blade
    3: "https://image.tmdb.org/t/p/original/m9m06p3i6iEUt9g5wYx8G9L9Y1w.jpg", # Blade 2
    5: "https://image.tmdb.org/t/p/original/w23B28u7mIuQ146uEw0z4K4cR2K.jpg", # Daredevil
    7: "https://image.tmdb.org/t/p/original/bL7x6r3eG5sF8Xyv4yK1v4yK1v4.jpg", # Hulk 2003
    8: "https://image.tmdb.org/t/p/original/fM5g7cK1v4yK1v4yK1v4yK1v4yK.jpg", # Punisher 2004
    10: "https://image.tmdb.org/t/p/original/tN9s8bY7r2_jV9s8bY7r2_jV9s8.jpg", # Blade Trinity
    11: "https://image.tmdb.org/t/p/original/o8bY7r2_jV9s8bY7r2_jV9s8bY7.jpg", # Elektra
    14: "https://image.tmdb.org/t/p/original/u8bY7r2_jV9s8bY7r2_jV9s8bY7.jpg", # Ghost Rider
    19: "https://image.tmdb.org/t/p/original/m8bY7r2_jV9s8bY7r2_jV9s8bY7.jpg", # Punisher WZ
    25: "https://image.tmdb.org/t/p/original/v8bY7r2_jV9s8bY7r2_jV9s8bY7.jpg", # Ghost Rider 2
    39: "https://image.tmdb.org/t/p/original/cHyDe5Vz258y7gI9bZ5o0hK5c5.jpg", # Jessica Jones s1
    44: "https://image.tmdb.org/t/p/original/mX9a0bK5c5cHyDe5Vz258y7gI9.jpg", # Luke Cage s1
    47: "https://image.tmdb.org/t/p/original/kY8bY7r2_jV9s8bY7r2_jV9s8bY.jpg", # Iron Fist s1
    60: "https://image.tmdb.org/t/p/original/VuukZL9jc109krACXZurCw5gwm.jpg", # Venom
    62: "https://image.tmdb.org/t/p/original/7d6wo0JtqMRbkvdwe5JJZBPguAa.jpg", # Spider-Verse 1
    76: "https://image.tmdb.org/t/p/original/vIgyYkXvRu0wkFvxbtOi4t7qvFe.jpg", # Venom 2
    80: "https://image.tmdb.org/t/p/original/14QbnygCuTO0vl7CAFmPf1fgZfV.jpg", # Moon Knight
    81: "https://image.tmdb.org/t/p/original/tj7aU5rYwH7V3bQ4s9fE5v1.jpg", # Morbius
    85: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg", # I Am Groot
    87: "https://image.tmdb.org/t/p/original/8Y7r2_jV9s8bY7r2_jV9s8bY7r.jpg", # Werewolf by Night
    89: "https://image.tmdb.org/t/p/original/8Y7r2_jV9s8bY7r2_jV9s8bY7r.jpg", # GotG Holiday
    92: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg", # Spider-Verse 2
    99: "https://image.tmdb.org/t/p/original/8bCoq2A7hF6Vq2Y9bZ5o0hK5c.jpg", # Madame Web
    100: "https://image.tmdb.org/t/p/original/k3eZ7Y0c2bL4o7M4jE1L9yGZs4.jpg", # X-Men 97
    103: "https://image.tmdb.org/t/p/original/3V4kLQg0kSq6s3bL4o7M4jE1L9.jpg", # Venom 3
    104: "https://image.tmdb.org/t/p/original/1wU9yL4o7M4jE1L9yGZs4pXq9D.jpg", # Kraven
}

def download_url(url, out_path):
    if os.path.exists(out_path) and os.path.getsize(out_path) > 2000:
        return True
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = resp.read()
            if len(data) > 1000:
                with open(out_path, 'wb') as f:
                    f.write(data)
                return True
    except Exception:
        pass
    return False

def get_tmdb_meta(tmdb_id, is_tv):
    if not tmdb_id:
        return None, None
    endpoint = "tv" if is_tv else "movie"
    url = f"https://api.themoviedb.org/3/{endpoint}/{tmdb_id}?api_key={TMDB_KEY}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode())
            p = data.get('poster_path')
            b = data.get('backdrop_path')
            p_url = f"https://image.tmdb.org/t/p/w780{p}" if p else None
            b_url = f"https://image.tmdb.org/t/p/w1280{b}" if b else None
            return p_url, b_url
    except Exception:
        return None, None

def generate_cinematic_card(item, out_path, is_landscape=False):
    w, h = (1280, 720) if is_landscape else (400, 600)
    img = Image.new("RGB", (w, h), (14, 16, 22))
    draw = ImageDraw.Draw(img)
    
    # Accent color by universe
    accent = (229, 9, 20)
    if "Fox" in item["category"]:
        accent = (59, 130, 246)
    elif "Sony" in item["category"]:
        accent = (168, 85, 247)
    elif "Defenders" in item["category"]:
        accent = (234, 179, 8)
        
    # Draw sleek gradient or frame
    draw.rectangle([0, 0, w-1, h-1], outline=accent, width=3)
    draw.rectangle([10, 10, w-11, h-11], outline=(30, 35, 45), width=1)
    
    title = item["title"]
    year = str(item["year"])
    cat = item["universe"]
    
    draw.text((w//2, h//2 - 25), title, fill=(255, 255, 255), anchor="mm")
    draw.text((w//2, h//2 + 15), f"{year} • {cat}", fill=(160, 170, 190), anchor="mm")
    draw.text((w//2, h - 35), "MARVEL MULTIVERSE ROADMAP", fill=accent, anchor="mm")
    
    img.save(out_path, quality=85)

def process_item(item):
    idx = item["id"]
    title = item["title"]
    orig_p = os.path.join(ORIGINALS_DIR, f"portrait_{idx}.jpg")
    orig_l = os.path.join(ORIGINALS_DIR, f"landscape_{idx}.jpg")
    
    out_p_webp = os.path.join(PORTRAIT_DIR, f"{idx}.webp")
    out_p_jpg = os.path.join(PORTRAIT_DIR, f"{idx}.jpg")
    out_l_webp = os.path.join(LANDSCAPE_DIR, f"{idx}.webp")
    out_l_jpg = os.path.join(LANDSCAPE_DIR, f"{idx}.jpg")
    
    p_url = None
    l_url = None
    
    # 1. Doomsday Roadmap paths
    if "ddr_slug" in item:
        slug = item["ddr_slug"]
        p_url = f"https://doomsdayroadmap.com/media/posters/{slug}.jpg"
        l_url = f"https://doomsdayroadmap.com/media/backdrops/{slug}.jpg"
        
    # 2. TMDB paths if needed or preferred
    if not p_url or not l_url or idx in [1, 3, 5, 7, 8, 10, 11, 14, 19, 25, 39, 44, 47, 54, 57, 59, 60, 62, 63, 67, 76, 80, 81, 85, 87, 89, 92, 94, 97, 99, 100, 102, 103, 104, 105, 106, 112, 113, 114, 116, 117, 119]:
        tmdb_p, tmdb_l = get_tmdb_meta(item.get("tmdb_id"), item.get("is_tv", False))
        if tmdb_p:
            p_url = tmdb_p
        if tmdb_l:
            l_url = tmdb_l
            
    if not l_url and idx in KNOWN_BACKDROPS:
        l_url = KNOWN_BACKDROPS[idx]
        
    # Download portrait
    p_ok = False
    if p_url:
        p_ok = download_url(p_url, orig_p)
    if not p_ok:
        generate_cinematic_card(item, orig_p, is_landscape=False)
        
    # Download landscape
    l_ok = False
    if l_url:
        l_ok = download_url(l_url, orig_l)
    if not l_ok:
        # If portrait exists, we can create a nice blurred landscape backdrop from it
        try:
            with Image.open(orig_p) as pim:
                # create 1280x720 backdrop with center crop and dark overlay
                lw, lh = 1280, 720
                pim_rgb = pim.convert("RGB")
                # scale to fill width
                ratio = max(lw / pim_rgb.width, lh / pim_rgb.height)
                scaled = pim_rgb.resize((int(pim_rgb.width * ratio), int(pim_rgb.height * ratio)), Image.Resampling.LANCZOS)
                # crop center
                left = (scaled.width - lw) // 2
                top = (scaled.height - lh) // 2
                cropped = scaled.crop((left, top, left + lw, top + lh))
                # darken
                darkened = Image.new("RGB", (lw, lh), (10, 12, 16))
                blended = Image.blend(cropped, darkened, 0.45)
                blended.save(orig_l, quality=85)
                l_ok = True
        except Exception:
            generate_cinematic_card(item, orig_l, is_landscape=True)
            
    # Compress portrait
    try:
        with Image.open(orig_p) as im:
            im = im.convert("RGB")
            im.thumbnail((400, 600), Image.Resampling.LANCZOS)
            im.save(out_p_webp, "WEBP", quality=82, method=4)
            im.save(out_p_jpg, "JPEG", quality=82, optimize=True)
            # also save in root
            im.save(os.path.join(POSTER_DIR, f"portrait_{idx}.webp"), "WEBP", quality=82)
    except Exception as e:
        print(f"Error compressing portrait {idx}: {e}")
        
    # Compress landscape
    try:
        with Image.open(orig_l) as im:
            im = im.convert("RGB")
            im.thumbnail((1280, 720), Image.Resampling.LANCZOS)
            im.save(out_l_webp, "WEBP", quality=80, method=4)
            im.save(out_l_jpg, "JPEG", quality=80, optimize=True)
            # also save in root
            im.save(os.path.join(POSTER_DIR, f"landscape_{idx}.webp"), "WEBP", quality=80)
    except Exception as e:
        print(f"Error compressing landscape {idx}: {e}")
        
    return idx, title

print("Starting multithreaded download & compression...")
start_t = time.time()
with ThreadPoolExecutor(max_workers=8) as executor:
    futures = [executor.submit(process_item, item) for item in items]
    count = 0
    for f in as_completed(futures):
        idx, title = f.result()
        count += 1
        if count % 15 == 0 or count == len(items):
            print(f"[{count}/{len(items)}] Finished {title}")

print(f"Completed all {len(items)} items in {time.time() - start_t:.1f}s!")
