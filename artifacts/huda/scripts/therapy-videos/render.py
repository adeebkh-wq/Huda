"""Render Huda AAC's original, captioned education assets; no third-party footage.

Requires the workspace's ffmpeg and ffprobe. Run from any working directory.
The screenplay is data/therapy-lessons.json; captions are part of the MP4.
"""
import json
from pathlib import Path
import subprocess
import tempfile
import textwrap

ROOT = Path(__file__).resolve().parents[2]
CONTENT = json.loads((ROOT / "data/therapy-lessons.json").read_text())
OUTPUT = ROOT / "assets/videos/therapy"
FONT = next(
    (ROOT / "node_modules/@expo-google-fonts/inter/400Regular").glob("*.ttf")
)
BOLD = next(
    (ROOT / "node_modules/@expo-google-fonts/inter/700Bold").glob("*.ttf")
)
W, H, FPS, SHOT_SECONDS = 540, 960, 12, 8
COLORS = ["0x2A9D8F", "0x7C4DBC", "0x2B78BE", "0xE07B39", "0x2B4D7E"]


def run(*args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)


def box(x, y, w, h, color, enable=None, thickness="fill"):
    result = f"drawbox=x={x}:y={y}:w={w}:h={h}:color={color}:t={thickness}"
    return result + (f":enable='{enable}'" if enable else "")


def text(tmp, name, value, x, y, size=24, color="0x1A1A2E",
         enable=None, bold=False, width=None):
    path = tmp / f"{name}.txt"
    path.write_text(textwrap.fill(value, width) if width else value)
    filt = (
        f"drawtext=fontfile='{BOLD if bold else FONT}':textfile='{path}'"
        f":fontsize={size}:fontcolor={color}:x='{x}':y={y}:line_spacing=9"
    )
    return filt + (f":enable='{enable}'" if enable else "")


def diagram(tmp, prefix, visual, start, end, accent):
    active = f"gte(t,{start})*lt(t,{end})"
    reveal = lambda delay: f"gte(t,{start + delay})*lt(t,{end})"
    filters = [box(30, 375, 480, 232, "0xFFFFFF", active)]
    if visual in ("communication", "choice", "access"):
        labels = ["WANT", "HELP", "STOP"]
        for i, label in enumerate(labels):
            x = 54 + i * 154
            filters += [
                box(x, 405, 132, 74, accent if i == 1 else "0xE8F1EF", active),
                text(tmp, prefix + f"tile{i}", label, x + 17, 430, 20,
                     "white" if i == 1 else "0x1A1A2E", active, True),
            ]
        filters += [
            text(tmp, prefix + "path", "A MESSAGE", 180, 545, 22, accent, reveal(2), True),
            text(tmp, prefix + "moving", ">", f"60+min((t-{start})*43,375)",
                 504, 32, accent, active, True),
        ]
    elif visual in ("conversation", "play", "together"):
        left = "CAREGIVER" if visual == "together" else "CHILD"
        right = "SUPPORT" if visual == "together" else "PARTNER"
        filters += [
            text(tmp, prefix + "left", "●", 77, 405, 75, accent, active),
            text(tmp, prefix + "right", "●", 369, 405, 75, accent, active),
            text(tmp, prefix + "name1", left, 47, 527, 17, "0x1A1A2E", active, True),
            text(tmp, prefix + "name2", right, 352, 527, 17, "0x1A1A2E", active, True),
            text(tmp, prefix + "shared", "SHARED\nFOCUS", 214, 470, 19, accent, reveal(1), True),
            text(tmp, prefix + "moving", "•",
                 f"270+100*sin((t-{start})*0.8)", 398, 37, accent, active),
        ]
    elif visual == "environment":
        filters += [
            text(tmp, prefix + "busy", "TOO MUCH", 69, 407, 18, accent, active, True),
            text(tmp, prefix + "calm", "MORE ACCESS", 321, 407, 18, accent, active, True),
            text(tmp, prefix + "crowd", "|||  |||  |||", 58, 465, 28, "0x9CA3AF", active),
            text(tmp, prefix + "arrow", ">", 259, 456, 45, accent, reveal(2), True),
            text(tmp, prefix + "simple", "—  —", 345, 477, 30, accent, reveal(2)),
            text(tmp, prefix + "adapt", "ADAPT THE SETTING", 152, 560, 18, accent, reveal(3), True),
        ]
    elif visual == "balance":
        filters += [
            text(tmp, prefix + "first", "ONE CHILD", 68, 408, 18, accent, active, True),
            text(tmp, prefix + "second", "ANOTHER CHILD", 310, 408, 18, accent, active, True),
            text(tmp, prefix + "circle", "○", 111, 440, 72, accent, active),
            text(tmp, prefix + "square", "□", 363, 440, 72, accent, reveal(1)),
            text(tmp, prefix + "caption", "DIFFERENT NEEDS", 175, 561, 19, accent, reveal(2), True),
        ]
    elif visual == "reference":
        filters += [
            text(tmp, prefix + "purpose", "LEARN • ASK • REVIEW", 67, 415, 25, accent, active, True),
            text(tmp, prefix + "notcure", "No cure claims.\nNo guaranteed outcomes.", 69, 468, 23,
                 "0x1A1A2E", active),
            text(tmp, prefix + "sources", "SOURCES & TRANSCRIPT IN HUDA AAC", 66, 565, 18,
                 accent, reveal(1), True),
        ]
    else:
        labels = (["DRESS", "PLAY", "EAT"] if visual == "routine"
                  else ["GOAL", "ADAPT", "REVIEW"])
        for i, label in enumerate(labels):
            x = 53 + i * 155
            filters += [
                box(x, 454, 126, 72, accent, reveal(i)),
                text(tmp, prefix + f"step{i}", label, x + 15, 478, 19,
                     "white", reveal(i), True),
            ]
            if i < 2:
                filters.append(text(tmp, prefix + f"arrow{i}", ">", x + 134, 476,
                                    23, accent, reveal(i + 1), True))
        filters.append(text(tmp, prefix + "context", "INDIVIDUAL SUPPORT", 148, 563,
                            19, accent, reveal(3), True))
    return filters


def render(lesson, color, tmp):
    duration = len(lesson["segments"]) * SHOT_SECONDS
    filters = [
        box(0, 0, W, 18, color),
        text(tmp, "masthead", "HUDA AAC  /  CAREGIVER LEARNING", 32, 42, 19, color, bold=True),
        text(tmp, "category", lesson["category"].upper(), 32, 85, 16, color),
        text(tmp, "type", "ORIGINAL • CAPTIONED • EDUCATIONAL", 32, 876, 15, "0x6B7280"),
        text(tmp, "duration", "References and full transcript are in the app.", 32, 912, 16,
             "0x6B7280"),
        box(32, 850, 476, 5, "0xE1E7E4"),
    ]
    for i, segment in enumerate(lesson["segments"]):
        start, end = i * SHOT_SECONDS, (i + 1) * SHOT_SECONDS
        active = f"gte(t,{start})*lt(t,{end})"
        filters += [
            text(tmp, f"heading{i}", segment["heading"], 32, 151, 34,
                 enable=active, bold=True, width=25),
            text(tmp, f"caption{i}", segment["caption"], 32, 645, 24,
                 enable=active, width=34),
            text(tmp, f"count{i}", f"{i+1} / {len(lesson['segments'])}", 441, 84, 17,
                 color, active),
            box(32, 850, round(476 * (i + 1) / len(lesson["segments"])), 5, color, active),
            *diagram(tmp, f"s{i}", segment["visual"], start, end, color),
        ]
    filt = tmp / "filters.txt"
    filt.write_text(",".join(filters))
    dest = OUTPUT / f"{lesson['id']}.mp4"
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "lavfi", "-i", f"color=c=0xF7F3EF:s={W}x{H}:r={FPS}:d={duration}",
        "-filter_script:v", str(filt), "-an", "-c:v", "libx264", "-preset", "fast",
        "-crf", "25", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(dest))
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", "2", "-i",
        str(dest), "-frames:v", "1", str(OUTPUT / f"{lesson['id']}.jpg"))
    # Open-codec counterpart for browsers without proprietary H.264 decoders.
    run("ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(dest),
        "-an", "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "37", "-cpu-used", "5",
        "-row-mt", "1", "-pix_fmt", "yuv420p", str(OUTPUT / f"{lesson['id']}.webm"))
    probe = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries",
                                    "format=duration,size", "-of", "json", str(dest)])
    return {"id": lesson["id"], **json.loads(probe)["format"]}


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    for i, lesson in enumerate(CONTENT["lessons"]):
        with tempfile.TemporaryDirectory(prefix="huda-therapy-") as folder:
            result = render(lesson, COLORS[i], Path(folder))
            results.append(result)
            print(json.dumps(result), flush=True)
    (OUTPUT / "render-manifest.json").write_text(json.dumps(results, indent=2) + "\n")


if __name__ == "__main__":
    main()
