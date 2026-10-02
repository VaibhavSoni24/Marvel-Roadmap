import json

with open("marvel_dataset_raw.json", "r", encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    idx = item["id"]
    item["poster_portrait"] = f"poster/portrait/{idx}.webp"
    item["poster_landscape"] = f"poster/landscape/{idx}.webp"
    item["poster_portrait_fallback"] = f"poster/portrait/{idx}.jpg"
    item["poster_landscape_fallback"] = f"poster/landscape/{idx}.jpg"

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(items, f, indent=2)

with open("data.js", "w", encoding="utf-8") as f:
    f.write("const MARVEL_DATA = " + json.dumps(items, indent=2) + ";\n")

print(f"Exported data.json and data.js with {len(items)} items")
