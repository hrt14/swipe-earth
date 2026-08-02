#!/usr/bin/env python3
"""Validate SWIPE EARTH: OCEAN assets and creature metadata.

Run locally:
    python -m pip install Pillow
    python scripts/validate_ocean_assets.py
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

try:
    from PIL import Image, UnidentifiedImageError
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "Pillow is required. Run: python -m pip install Pillow"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OCEAN_ROOT = PUBLIC / "ocean"
DATA_FILE = ROOT / "data" / "ocean" / "creatures.json"

ALLOWED_EXTENSIONS = {".png", ".webp", ".jpg", ".jpeg", ".avif", ".svg"}
ALLOWED_CLASSIFICATIONS = {"real", "legend", "fiction"}
ALLOWED_RESEARCH_STATUS = {"pending", "verified", "fiction"}
ALLOWED_ASSET_STATUS = {"planned", "ready"}
ALLOWED_ROLES = {"small", "medium", "large", "hero", "school", "bottom", "distant"}
ALLOWED_ZONES = {"sunlit", "twilight", "midnight", "abyssal", "hadal"}
ID_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

errors: list[str] = []
warnings: list[str] = []


def error(message: str) -> None:
    errors.append(message)


def warn(message: str) -> None:
    warnings.append(message)


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        error(f"Missing data file: {path.relative_to(ROOT)}")
    except json.JSONDecodeError as exc:
        error(f"Invalid JSON in {path.relative_to(ROOT)}: {exc}")
    return {}


def validate_creature_data() -> None:
    payload = load_json(DATA_FILE)
    creatures = payload.get("creatures")
    if not isinstance(creatures, list):
        error("data/ocean/creatures.json must contain a creatures array")
        return

    seen_ids: set[str] = set()
    seen_assets: set[str] = set()

    required = {
        "id",
        "nameEn",
        "nameJa",
        "classification",
        "zone",
        "experienceDepthM",
        "sourceUrls",
        "researchStatus",
        "assetStatus",
        "asset",
        "role",
        "groupMin",
        "groupMax",
        "tapEnabled",
    }

    for index, creature in enumerate(creatures):
        label = f"creatures[{index}]"
        if not isinstance(creature, dict):
            error(f"{label} must be an object")
            continue

        missing = sorted(required - creature.keys())
        if missing:
            error(f"{label} missing fields: {', '.join(missing)}")
            continue

        creature_id = creature["id"]
        label = str(creature_id)
        if not isinstance(creature_id, str) or not ID_PATTERN.fullmatch(creature_id):
            error(f"Invalid creature id: {creature_id!r}")
        elif creature_id in seen_ids:
            error(f"Duplicate creature id: {creature_id}")
        else:
            seen_ids.add(creature_id)

        classification = creature["classification"]
        research_status = creature["researchStatus"]
        asset_status = creature["assetStatus"]
        zone = creature["zone"]
        role = creature["role"]

        if classification not in ALLOWED_CLASSIFICATIONS:
            error(f"{label}: invalid classification {classification!r}")
        if research_status not in ALLOWED_RESEARCH_STATUS:
            error(f"{label}: invalid researchStatus {research_status!r}")
        if asset_status not in ALLOWED_ASSET_STATUS:
            error(f"{label}: invalid assetStatus {asset_status!r}")
        if zone not in ALLOWED_ZONES:
            error(f"{label}: invalid zone {zone!r}")
        if role not in ALLOWED_ROLES:
            error(f"{label}: invalid role {role!r}")

        if classification == "real":
            if research_status == "fiction":
                error(f"{label}: real creature cannot have researchStatus=fiction")
            if research_status != "verified":
                warn(f"{label}: scientific metadata is not verified yet")
            if research_status == "verified" and not creature["sourceUrls"]:
                error(f"{label}: verified real creature requires sourceUrls")
        elif research_status != "fiction":
            error(f"{label}: legend/fiction entries must have researchStatus=fiction")

        source_urls = creature["sourceUrls"]
        if not isinstance(source_urls, list):
            error(f"{label}: sourceUrls must be an array")
        else:
            for source in source_urls:
                parsed = urlparse(str(source))
                if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                    error(f"{label}: invalid source URL {source!r}")

        depth = creature["experienceDepthM"]
        if not isinstance(depth, (int, float)) or depth < 0 or depth > 12000:
            error(f"{label}: experienceDepthM must be between 0 and 12000")

        group_min = creature["groupMin"]
        group_max = creature["groupMax"]
        if not isinstance(group_min, int) or not isinstance(group_max, int):
            error(f"{label}: groupMin/groupMax must be integers")
        elif group_min < 1 or group_max < group_min or group_max > 20:
            error(f"{label}: invalid group range {group_min}..{group_max}")

        asset = creature["asset"]
        if not isinstance(asset, str) or not asset.startswith("/ocean/"):
            error(f"{label}: asset must start with /ocean/")
            continue
        if asset in seen_assets:
            warn(f"{label}: asset path is shared: {asset}")
        seen_assets.add(asset)

        relative_asset = asset.lstrip("/")
        asset_path = PUBLIC / relative_asset
        if asset_path.suffix.lower() not in ALLOWED_EXTENSIONS:
            error(f"{label}: unsupported asset extension: {asset_path.suffix}")
        if asset_status == "ready" and not asset_path.is_file():
            error(f"{label}: ready asset is missing: {relative_asset}")
        if asset_status == "planned" and asset_path.exists():
            warn(f"{label}: asset exists but assetStatus is still planned")


def validate_svg(path: Path) -> None:
    try:
        root = ET.parse(path).getroot()
    except ET.ParseError as exc:
        error(f"Invalid SVG {path.relative_to(ROOT)}: {exc}")
        return

    width = root.attrib.get("width")
    height = root.attrib.get("height")
    view_box = root.attrib.get("viewBox")
    if not view_box and not (width and height):
        error(f"SVG lacks dimensions/viewBox: {path.relative_to(ROOT)}")

    for node in root.iter():
        tag = node.tag.rsplit("}", 1)[-1]
        if tag != "image":
            continue
        href = node.attrib.get("href") or node.attrib.get("{http://www.w3.org/1999/xlink}href")
        if not href:
            error(f"SVG image without href: {path.relative_to(ROOT)}")
            continue
        if href.startswith("data:"):
            continue
        parsed = urlparse(href)
        if parsed.scheme or href.startswith("//"):
            error(f"External image reference in {path.relative_to(ROOT)}: {href}")
            continue
        referenced = (path.parent / href).resolve()
        try:
            referenced.relative_to(ROOT)
        except ValueError:
            error(f"SVG image reference escapes repository: {path.relative_to(ROOT)} -> {href}")
            continue
        if not referenced.is_file():
            error(f"Broken SVG image reference: {path.relative_to(ROOT)} -> {href}")


def validate_raster(path: Path) -> None:
    try:
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            width, height = image.size
            if width < 16 or height < 16:
                error(f"Raster image too small: {path.relative_to(ROOT)} ({width}x{height})")
            if width > 4096 or height > 4096:
                warn(f"Very large raster image: {path.relative_to(ROOT)} ({width}x{height})")

            image.load()
            if "A" in image.getbands():
                alpha = image.getchannel("A")
                extrema = alpha.getextrema()
                if extrema == (0, 0):
                    error(f"Fully transparent image: {path.relative_to(ROOT)}")
                bbox = alpha.getbbox()
                if bbox:
                    drawn_width = bbox[2] - bbox[0]
                    drawn_height = bbox[3] - bbox[1]
                    coverage = (drawn_width * drawn_height) / (width * height)
                    if coverage < 0.04:
                        error(
                            f"Visible content occupies less than 4% of canvas: "
                            f"{path.relative_to(ROOT)}"
                        )
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        error(f"Cannot decode image {path.relative_to(ROOT)}: {exc}")


def validate_asset_tree() -> None:
    if not OCEAN_ROOT.is_dir():
        error("Missing public/ocean directory")
        return

    for path in sorted(OCEAN_ROOT.rglob("*")):
        if not path.is_file():
            continue
        suffix = path.suffix.lower()
        if suffix not in ALLOWED_EXTENSIONS:
            continue
        if path.stat().st_size == 0:
            error(f"Empty asset file: {path.relative_to(ROOT)}")
            continue
        if suffix == ".svg":
            validate_svg(path)
        else:
            validate_raster(path)


def main() -> int:
    validate_creature_data()
    validate_asset_tree()

    print(f"Ocean asset validation: {len(errors)} error(s), {len(warnings)} warning(s)")
    for message in warnings:
        print(f"WARNING: {message}")
    for message in errors:
        print(f"ERROR: {message}", file=sys.stderr)

    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
