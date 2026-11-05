"""Instalează doar media autorizată pentru poezia Prietenii curățeniei.

Înainte de publicare verifică numele, dimensiunile și antetele fișierelor.
Nu extrage alte intrări din arhivă și nu permite suprascrierea codului.
"""
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "Maricica_Prietenii_Curateniei_Media_HD.zip"
IMAGES = {
    "assets/poem/01-apa-mana-sapun.webp",
    "assets/poem/02-ochii-urechile.webp",
    "assets/poem/03-corpul.webp",
    "assets/poem/04-periuta.webp",
}
AUDIO = {f"audio/poem/{n}_Chapter_1.mp3" for n in range(1, 10)}
EXPECTED = IMAGES | AUDIO

def main() -> int:
    if not ARCHIVE.is_file():
        print(f"Lipsește arhiva {ARCHIVE.name}", file=sys.stderr)
        return 1
    with zipfile.ZipFile(ARCHIVE) as package:
        entries = {item.filename: item for item in package.infolist() if not item.is_dir()}
        missing = EXPECTED - set(entries)
        extra = set(entries) - EXPECTED - {"README.txt"}
        if missing or extra:
            raise ValueError(f"Pachet incomplet sau cu fișiere neașteptate: lipsesc {sorted(missing)}, în plus {sorted(extra)}")
        for rel in sorted(EXPECTED):
            item = entries[rel]
            if not 100 <= item.file_size <= 10_000_000:
                raise ValueError(f"Dimensiune invalidă: {rel}")
            raw = package.read(item)
            if rel in IMAGES and not (raw.startswith(b"RIFF") and raw[8:12] == b"WEBP"):
                raise ValueError(f"Nu este WebP valid: {rel}")
            if rel in AUDIO and not (raw.startswith(b"ID3") or (raw[0] == 0xFF and raw[1] & 0xE0 == 0xE0)):
                raise ValueError(f"Nu este MP3 valid: {rel}")
            dst = ROOT / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            dst.write_bytes(raw)
            print(f"Instalat: {rel}, {len(raw)} B")
    ARCHIVE.unlink()
    print("Instalare completă. ZIP-ul a fost eliminat; fișierele media sunt gata de commit.")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
