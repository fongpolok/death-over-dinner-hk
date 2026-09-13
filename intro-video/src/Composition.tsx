import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  continueRender,
  delayRender,
  Composition,
} from "remotion";
import { useEffect, useState } from "react";
import { loadFont } from "@remotion/google-fonts/SpecialElite";

const { fontFamily: specialElite } = loadFont("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// Palette matches frontend/css/styles.css ("Airborne Letters" direction) exactly.
const PAPER = "#f4efe1";
const PAPER_WHITE = "#fbf8f0";
const INK = "#2b2620";
const RED = "#b1272d";
const BLUE = "#1a3e72";
const LINE = "#d9c8a3";
// System font (ships with macOS) — used for the stamp's small CJK label,
// where a brush face would be illegible at that size.
const CJK_SERIF = `"Noto Serif HK", "PingFang HK", "PingFang TC", serif`;
// Brush-styled headline face. Loaded manually (not via @remotion/google-fonts)
// with Google's `text=` glyph-subsetting so it fetches ~15 characters in one
// small request instead of the ~107 chunk files the font's full
// "chinese-traditional" coverage would otherwise require. Chosen over the
// flashier cursive faces (Ma Shan Zheng, Long Cang, Zhi Mang Xing) because
// those only ship a "chinese-simplified" subset and are liable to render
// this headline's Cantonese-specific characters (啲/冇/嘅) as tofu boxes;
// LXGW WenKai TC is a brush-based Kai-script face built for full Traditional
// Chinese/HK coverage.
const CALLIGRAPHY_FONT = `"LXGW WenKai TC", ${CJK_SERIF}`;

// Standard Written Chinese, matching frontend/js/i18n.js's hero.title --
// the whole site converted away from spoken Cantonese (item 11), and the
// intro video's headline needs to read as the same sentence.
const HEADLINE = "這一頓飯，說出一直未曾說出的話";

const useCalligraphyFont = () => {
  const [handle] = useState(() => delayRender("Loading calligraphy headline font"));
  useEffect(() => {
    const uniqueChars = Array.from(new Set(HEADLINE)).join("");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=LXGW+WenKai+TC:wght@700&text=${encodeURIComponent(uniqueChars)}&display=block`;
    const finish = () => continueRender(handle);
    link.onload = () => {
      if ("fonts" in document) {
        document.fonts.load(`700 46px "LXGW WenKai TC"`).then(finish, finish);
      } else {
        finish();
      }
    };
    link.onerror = finish; // fall back to CJK_SERIF rather than hang the render
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
};

// Letter geometry — one large, centred sheet (no desk/figure scene; the
// letter itself is the whole composition, same as the real hero envelope).
const PAPER_X = 110;
const PAPER_Y = 120;
const PAPER_W = 1060;
const PAPER_H = 480;
const FOLD_Y = PAPER_Y + 262;
const PAPER_PERIMETER = 2 * (PAPER_W + PAPER_H);

export const IntroComposition = () => {
  return (
    <Composition
      id="IntroLetter"
      component={IntroLetter}
      durationInFrames={225}
      fps={30}
      width={1280}
      height={720}
    />
  );
};

export const IntroLetter: React.FC = () => {
  const frame = useCurrentFrame();
  useCalligraphyFont();

  const revealCount = Math.round(
    interpolate(frame, [114, 184], [0, HEADLINE.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.linear,
    }),
  );

  return (
    <Interactive.Div
      name="Intro Root"
      style={{
        width: 1280,
        height: 720,
        opacity: interpolate(frame, [200, 225], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.4, 0, 1, 1),
        }),
      }}
    >
      {/* Outer chevron border — same repeating-linear-gradient stops as .envelope in styles.css */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(45deg, #b1272d 0, #b1272d 14px, #f4efe1 14px, #f4efe1 22px, #1a3e72 22px, #1a3e72 36px, #f4efe1 36px, #f4efe1 44px)",
        }}
      />

      <Interactive.Div
        name="Sheet"
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          right: 16,
          bottom: 16,
          backgroundColor: PAPER_WHITE,
          borderRadius: 4,
          opacity: interpolate(frame, [0, 14], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 14], [0.97, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      >
        {/* Ambient warm glow behind the letter's top-left corner */}
        <Interactive.Div
          name="Lamp Glow"
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            width: 480,
            height: 480,
            borderRadius: 480,
            background:
              "radial-gradient(circle, rgba(169,129,47,0.20) 0%, rgba(169,129,47,0.07) 45%, rgba(169,129,47,0) 72%)",
            opacity: interpolate(frame, [10, 30], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        />

        <Interactive.Svg
          name="Illustration"
          viewBox="0 0 1280 720"
          style={{ position: "absolute", top: 0, left: 0, width: 1280, height: 720 }}
        >
          {/* The letter itself, drawn in by its own outline before filling in */}
          <rect
            x={PAPER_X}
            y={PAPER_Y}
            width={PAPER_W}
            height={PAPER_H}
            fill={PAPER}
            stroke={INK}
            strokeWidth={2}
            strokeDasharray={PAPER_PERIMETER}
            strokeDashoffset={interpolate(frame, [4, 30], [PAPER_PERIMETER, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}
            opacity={interpolate(frame, [4, 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            })}
          />
          <line
            x1={PAPER_X + 40}
            y1={FOLD_Y}
            x2={PAPER_X + PAPER_W - 40}
            y2={FOLD_Y}
            stroke={LINE}
            strokeWidth={2}
            strokeDasharray="6 6"
            opacity={interpolate(frame, [22, 34], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          />

          {/* Scribble, upper block: draws in first, then gives way to the
              actual wording revealed in the exact same lines below. */}
          {[
            "M 168 210 Q 210 190 254 210 Q 298 230 342 210 Q 386 190 430 210 Q 466 226 500 214",
            "M 168 246 Q 216 224 264 246 Q 312 268 360 246 Q 402 226 444 246 Q 470 258 494 250",
            "M 168 282 Q 208 264 250 282 Q 292 300 334 282 Q 372 266 410 282",
          ].map((d, i) => {
            const start = 36 + i * 9;
            const drawEnd = start + 28;
            return (
              <path
                key={d}
                d={d}
                stroke={BLUE}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={340}
                strokeDashoffset={interpolate(frame, [start, drawEnd], [340, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
                opacity={interpolate(frame, [100, 114], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.linear,
                })}
              />
            );
          })}

          {/* Scribble, lower block: kept as quieter ambient "rest of the
              letter" texture — doesn't resolve into text, just fills the
              larger sheet so it doesn't read as empty. */}
          {[
            "M 168 452 Q 206 436 246 452 Q 286 468 326 452 Q 360 438 396 452",
            "M 168 486 Q 212 470 256 486 Q 300 502 344 486 Q 380 472 412 484",
            "M 168 520 Q 202 508 238 520 Q 274 532 310 520",
          ].map((d, i) => {
            const start = 150 + i * 9;
            const drawEnd = start + 26;
            return (
              <path
                key={`lower-${d}`}
                d={d}
                stroke={BLUE}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={340}
                strokeDashoffset={interpolate(frame, [start, drawEnd], [340, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.bezier(0.16, 1, 0.3, 1),
                })}
                opacity={0.55}
              />
            );
          })}
        </Interactive.Svg>

        {/* HK postage stamp — matches .postal-stamp exactly, with a rubber-stamp thud entrance */}
        <Interactive.Div
          name="HK Stamp"
          style={{
            position: "absolute",
            top: PAPER_Y + 30,
            left: PAPER_X + PAPER_W - 116,
            width: 84,
            height: 106,
            border: `2px dotted ${RED}`,
            borderRadius: 2,
            backgroundColor: "rgba(177,39,45,0.04)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: CJK_SERIF,
            fontSize: 17,
            lineHeight: 1.3,
            textAlign: "center",
            color: RED,
            rotate: "4deg",
            scale: interpolate(frame, [46, 56, 64], [0.5, 1.18, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.back(2)),
              output: "perceptual-scale",
            }),
            opacity: interpolate(frame, [46, 54], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.linear,
            }),
          }}
        >
          <div>香港</div>
          <div style={{ fontFamily: specialElite, fontSize: 12, marginTop: 2 }}>
            HONG KONG
          </div>
        </Interactive.Div>

        {/* Headline — the scribble above resolves into this, in the same spot */}
        <Interactive.Div
          name="Headline"
          style={{
            position: "absolute",
            top: PAPER_Y + 78,
            left: PAPER_X + 58,
            width: PAPER_W - 160,
            fontFamily: CALLIGRAPHY_FONT,
            fontWeight: 700,
            fontSize: 54,
            letterSpacing: "0.04em",
            lineHeight: 1.5,
            color: INK,
            opacity: interpolate(frame, [108, 122], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.linear,
            }),
          }}
        >
          {HEADLINE.slice(0, revealCount)}
        </Interactive.Div>
      </Interactive.Div>
    </Interactive.Div>
  );
};
