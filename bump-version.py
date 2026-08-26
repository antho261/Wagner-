"""
Anti-cache : ajoute / incrémente un ?v=N sur tous les CSS et JS locaux.

À lancer AVANT chaque mise en ligne. Les navigateurs (surtout Safari iOS)
gardent le CSS en cache très longtemps ; changer l'URL est le seul moyen
fiable de forcer le rechargement.

    python bump-version.py        -> incrémente (v3 -> v4)
    python bump-version.py 12     -> force une version précise
    python bump-version.py --dry  -> montre sans rien écrire

Ne touche jamais aux URL externes (Google Fonts, CDN Firebase) ni au
favicon en data:URI : seuls les chemins contenant « assets/ » sont visés,
plus le @import de variables.css à l'intérieur des feuilles.
"""

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).parent

# href="assets/css/x.css"  |  src="../assets/js/x.js"   (+ ?v=N éventuel)
HTML_REF = re.compile(r'((?:href|src)=")((?:\.\./)*assets/[^"?]+)(?:\?v=\d+)?(")')
# @import url('variables.css')  -> les feuilles s'importent entre elles
CSS_IMPORT = re.compile(r"(@import\s+url\(')([^'?]+)(?:\?v=\d+)?('\))")
FIND_VERSION = re.compile(r'assets/[^"?]+\?v=(\d+)')


def targets():
    return sorted(
        [ROOT / "index.html"]
        + list((ROOT / "pages").glob("*.html"))
        + list((ROOT / "assets" / "css").glob("*.css"))
    )


def current_version(files):
    """Version la plus haute déjà présente ; 0 si aucune."""
    found = [0]
    for f in files:
        found += [int(m) for m in FIND_VERSION.findall(f.read_text(encoding="utf-8"))]
    return max(found)


def main():
    args = [a for a in sys.argv[1:] if a != "--dry"]
    dry = "--dry" in sys.argv

    files = targets()
    if not files:
        print("Aucun fichier trouvé — lancez le script depuis la racine du site.")
        return 1

    version = int(args[0]) if args else current_version(files) + 1

    changed = 0
    for f in files:
        original = f.read_text(encoding="utf-8", newline="")
        if f.suffix == ".html":
            updated = HTML_REF.sub(rf"\1\2?v={version}\3", original)
        else:
            updated = CSS_IMPORT.sub(rf"\1\2?v={version}\3", original)

        if updated != original:
            changed += 1
            print(f"  {f.relative_to(ROOT)}")
            if not dry:
                f.write_text(updated, encoding="utf-8", newline="")

    verb = "seraient mis à jour" if dry else "mis à jour"
    print(f"\nVersion v={version} — {changed} fichier(s) {verb}.")
    if not dry:
        print("Pensez à redéployer : les anciennes URL restent en cache.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
