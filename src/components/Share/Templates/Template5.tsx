import React from "react";
import QRCode from "react-qr-code";
import moment from "moment-hijri";

export interface TemplateProps {
  arabic: string;
  urdu: string;
  english: string;

  surahName: string;
  surahNumber: number;
  ayahNumber: number;

  bismillahFontSize: number;
  arabicFontSize: number;
  urduFontSize: number;
  englishFontSize: number;

  showUrdu?: boolean;
  showEnglish?: boolean;

  websiteUrl?: string;
  brandName?: string;

  showQr?: boolean;
  showBismillah?: boolean;

  themeVariant?: "obsidian-gold" | "royal-emerald" | "midnight-sapphire" | "pearl-champagne";
}

export const Template5: React.FC<TemplateProps> = ({
  arabic,
  urdu,
  english,

  surahName,
  ayahNumber,

  bismillahFontSize = 52,
  arabicFontSize = 40,
  urduFontSize = 26,
  englishFontSize = 22,

  websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://alquran.org",
  brandName = "Al-Quran Website",

  showQr = true,
  showBismillah = true,
  showUrdu = true,
  showEnglish = true,

  themeVariant = "obsidian-gold",
}) => {
  const today = new Date();

  const gregorian = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  let hijri = "";
  try {
    hijri = (moment as unknown as { (): { subtract(n: number, unit: string): { format(f: string): string } } })()
      .subtract(1, "day")
      .format("iD iMMMM iYYYY");
  } catch {
    hijri = "14 Safar 1448";
  }

  const shareUrl = `${websiteUrl}`;

  const themes = {
    "obsidian-gold": {
      canvasBg: "radial-gradient(circle at 50% 22%, #141B2B 0%, #0B101A 50%, #05080E 100%)",
      patternOpacity: 0.15,
      goldPrimary: "#D4AF37",
      goldBright: "#F9E7A2",
      goldMuted: "#AA8C30",
      goldBorder: "rgba(212, 175, 55, 0.35)",
      goldBorderSubtle: "rgba(212, 175, 55, 0.16)",
      cardBg: "rgba(18, 24, 38, 0.65)",
      cardSubBg: "rgba(18, 24, 38, 0.45)",
      cardBorder: "rgba(212, 175, 55, 0.22)",
      textMain: "#FDFBF7",
      textMuted: "#CBD5E1",
      accentGlow: "rgba(212, 175, 55, 0.12)",
      badgeBg: "linear-gradient(135deg, rgba(212, 175, 55, 0.18), rgba(212, 175, 55, 0.06))",
      isDark: true,
    },
    "royal-emerald": {
      canvasBg: "radial-gradient(circle at 50% 22%, #083328 0%, #04211A 50%, #02120E 100%)",
      patternOpacity: 0.05,
      goldPrimary: "#DFC27A",
      goldBright: "#FFF2C4",
      goldMuted: "#9E8442",
      goldBorder: "rgba(223, 194, 122, 0.38)",
      goldBorderSubtle: "rgba(223, 194, 122, 0.16)",
      cardBg: "rgba(6, 38, 30, 0.68)",
      cardSubBg: "rgba(6, 38, 30, 0.46)",
      cardBorder: "rgba(223, 194, 122, 0.24)",
      textMain: "#FDFBF7",
      textMuted: "#D1E2DD",
      accentGlow: "rgba(223, 194, 122, 0.15)",
      badgeBg: "linear-gradient(135deg, rgba(223, 194, 122, 0.22), rgba(223, 194, 122, 0.06))",
      isDark: true,
    },
    "midnight-sapphire": {
      canvasBg: "radial-gradient(circle at 50% 22%, #12244E 0%, #0A1432 50%, #040817 100%)",
      patternOpacity: 0.05,
      goldPrimary: "#E5C875",
      goldBright: "#FFF6D6",
      goldMuted: "#9C833D",
      goldBorder: "rgba(229, 200, 117, 0.36)",
      goldBorderSubtle: "rgba(229, 200, 117, 0.16)",
      cardBg: "rgba(13, 27, 59, 0.65)",
      cardSubBg: "rgba(13, 27, 59, 0.45)",
      cardBorder: "rgba(229, 200, 117, 0.22)",
      textMain: "#FDFBF7",
      textMuted: "#CDD8EC",
      accentGlow: "rgba(229, 200, 117, 0.14)",
      badgeBg: "linear-gradient(135deg, rgba(229, 200, 117, 0.20), rgba(229, 200, 117, 0.06))",
      isDark: true,
    },
    "pearl-champagne": {
      canvasBg: "radial-gradient(circle at 50% 22%, #FFFFFF 0%, #F9F6F0 50%, #EFE9DC 100%)",
      patternOpacity: 0.035,
      goldPrimary: "#9E7B36",
      goldBright: "#7A5E25",
      goldMuted: "#B8964E",
      goldBorder: "rgba(158, 123, 54, 0.32)",
      goldBorderSubtle: "rgba(158, 123, 54, 0.16)",
      cardBg: "rgba(255, 255, 255, 0.85)",
      cardSubBg: "rgba(255, 255, 255, 0.65)",
      cardBorder: "rgba(158, 123, 54, 0.22)",
      textMain: "#221C15",
      textMuted: "#574C3D",
      accentGlow: "rgba(158, 123, 54, 0.08)",
      badgeBg: "linear-gradient(135deg, rgba(158, 123, 54, 0.12), rgba(158, 123, 54, 0.04))",
      isDark: false,
    },
  };

  const t = themes[themeVariant] || themes["obsidian-gold"];

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        padding: "44px 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
        background: t.canvasBg,
        borderRadius: 36,
        color: t.textMain,
        boxSizing: "border-box",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      }}
    >
      {/* Sacred Geometry Arabesque Islamic Pattern SVG Watermark */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: t.patternOpacity,
          pointerEvents: "none",
        }}
        viewBox="0 0 800 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="islamic-grid-5" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M60 10 L72 38 L100 26 L88 54 L116 66 L88 78 L100 106 L72 94 L60 122 L48 94 L20 106 L32 78 L4 66 L32 54 L20 26 L48 38 Z"
              stroke={t.goldPrimary}
              strokeWidth="1.2"
              fill="none"
            />
            <circle cx="60" cy="60" r="18" stroke={t.goldPrimary} strokeWidth="1" fill="none" />
            <circle cx="60" cy="60" r="32" stroke={t.goldPrimary} strokeWidth="0.75" strokeDasharray="3 3" fill="none" />
            <rect x="15" y="15" width="90" height="90" stroke={t.goldPrimary} strokeWidth="0.5" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid-5)" />
      </svg>

      {/* Atmospheric Radial Aura Glow behind the Ayah */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 780,
          height: 520,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${t.accentGlow} 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      {/* Modern High-End Double Hairline Frame */}
      <div
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          right: 24,
          bottom: 24,
          border: `1.5px solid ${t.goldBorder}`,
          borderRadius: 26,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 32,
          right: 32,
          bottom: 32,
          border: `1px solid ${t.goldBorderSubtle}`,
          borderRadius: 20,
          pointerEvents: "none",
        }}
      />

      {/* Modern 8-Point Star Corner Medallions (۞) */}
      {[
        { top: 16, left: 16 },
        { top: 16, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            ...pos,
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="5"
              width="14"
              height="14"
              stroke={t.goldPrimary}
              strokeWidth="1.5"
              fill={t.isDark ? "#0A101C" : "#FFFFFF"}
            />
            <rect
              x="5"
              y="5"
              width="14"
              height="14"
              stroke={t.goldPrimary}
              strokeWidth="1.5"
              transform="rotate(45 12 12)"
              fill={t.isDark ? "#0A101C" : "#FFFFFF"}
            />
            <circle cx="12" cy="12" r="2.5" fill={t.goldPrimary} />
          </svg>
        </div>
      ))}

      {/* HEADER SECTION */}
      <div
        style={{
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 14,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "6px 20px",
            borderRadius: 50,
            background: t.badgeBg,
            border: `1px solid ${t.goldBorderSubtle}`,
            marginBottom: 10,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.goldPrimary }} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 5,
              color: t.goldBright,
              textTransform: "uppercase",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Ayah of the Day
          </span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.goldPrimary }} />
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel', 'Outfit', serif",
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: "1.5px",
            margin: "4px 0 10px 0",
            color: t.goldBright,
            textShadow: t.isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "none",
            textAlign: "center",
          }}
        >
          {brandName}
        </h1>

        {showBismillah && (
          <div
            style={{
              fontFamily: "'Amiri', 'Amiri Quran', serif",
              fontSize: bismillahFontSize,
              color: "#ffffff",
              textShadow: "0 0 35px rgba(255,255,255,.35)",
              marginTop: 10,
              marginBottom: 28,
            }}
          >
            ﷽
          </div>
        )}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "10px 28px",
            background: t.badgeBg,
            backdropFilter: "blur(12px)",
            border: `1px solid ${t.goldBorder}`,
            borderRadius: 50,
            boxShadow: t.isDark ? "0 8px 24px rgba(0,0,0,0.3)" : "0 4px 16px rgba(0,0,0,0.06)",
          }}
        >
          <span style={{ color: t.goldPrimary, fontSize: 24 }}>۞</span>
          <span
            style={{
              paddingTop: 3,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: t.textMain,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            SURAH {surahName.toUpperCase()}
          </span>

          <span style={{ width: 4, height: 4, borderRadius: "50%", background: t.goldPrimary }} />

          <span
            style={{
              paddingTop: 3,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 1.5,
              color: t.goldBright,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            AYAH {ayahNumber}
          </span>
        </div>
      </div>

      {/* MIDDLE CONTENT: Sacred Manuscript & Translations */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          zIndex: 5,
          margin: "12px 0",
          gap: 14,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            background: t.cardBg,
            backdropFilter: "blur(16px)",
            border: `1.5px solid ${t.cardBorder}`,
            borderRadius: 28,
            padding: "16px 26px",
            boxShadow: t.isDark
              ? "0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
              : "0 15px 35px rgba(158, 123, 54, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
            boxSizing: "border-box",
            textAlign: "center",
            overflow: "hidden",
          }}
        >

          <div
            style={{
              fontFamily: "'Amiri Quran', 'Amiri', 'Scheherazade New', serif",
              fontSize: arabicFontSize,
              lineHeight: 2.3,
              color: t.textMain,
              direction: "rtl",
              textShadow: t.isDark ? "0 2px 14px rgba(0,0,0,0.6)" : "none",
              padding: "4px 6px",
            }}
          >
            {arabic}
          </div>
        </div>

        {showUrdu && (
          <div
            style={{
              position: "relative",
              width: "100%",
              background: t.cardSubBg,
              backdropFilter: "blur(14px)",
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 22,
              padding: "14px 18px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: 2,
                  fontWeight: 700,
                  color: t.goldPrimary,
                  textTransform: "uppercase",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ◈ URDU TRANSLATION
              </div>
            </div>

            <div
              style={{
                fontFamily: "'Noto Nastaliq Urdu', serif",
                fontSize: urduFontSize,
                color: t.textMain,
                lineHeight: 2.3,
                direction: "rtl",
                textAlign: "right",
              }}
            >
              {urdu}
            </div>
          </div>
        )}

        {showEnglish && (
          <div
            style={{
              position: "relative",
              width: "100%",
              background: t.cardSubBg,
              backdropFilter: "blur(14px)",
              border: `1px solid ${t.cardBorder}`,
              borderRadius: 22,
              padding: "14px 18px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: 18,
                letterSpacing: 2,
                fontWeight: 700,
                color: t.goldPrimary,
                textTransform: "uppercase",
                fontFamily: "'Outfit', sans-serif",
                marginBottom: 10,
              }}
            >
              ◈ ENGLISH TRANSLATION
            </div>

            <div
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
                fontSize: englishFontSize,
                color: t.textMuted,
                lineHeight: 1.6,
                fontWeight: 400,
                letterSpacing: "0.2px",
              }}
            >
              “{english}”
            </div>
          </div>
        )}
      </div>

      {/* FOOTER SECTION */}
      <div
        style={{
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingBottom: 6,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: t.cardSubBg,
                border: `1px solid ${t.goldBorderSubtle}`,
                borderRadius: 16,
                padding: "10px 18px",
              }}
            >
              <span style={{ fontSize: 30 }}>📅</span>
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: t.textMain,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {gregorian}
              </span>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: t.cardSubBg,
                border: `1px solid ${t.goldBorderSubtle}`,
                borderRadius: 16,
                padding: "10px 18px",
                paddingBottom: 24,
              }}
            >
              <span style={{ paddingTop: 10, fontSize: 30 }}>🌙</span>
              <span
                style={{
                  fontFamily: "'Noto Nastaliq Urdu', serif",
                  fontSize: 34,
                  fontWeight: 600,
                  color: t.goldBright,
                  direction: "rtl",
                }}
              >
                {hijri} ھ
              </span>
            </div>
          </div>

          {showQr && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: t.cardBg,
                backdropFilter: "blur(16px)",
                border: `1.5px solid ${t.goldBorder}`,
                borderRadius: 22,
                padding: "14px 20px",
                boxShadow: t.isDark
                  ? "0 10px 30px rgba(0,0,0,0.35)"
                  : "0 8px 24px rgba(158,123,54,0.12)",
              }}
            >
              <div
                style={{
                  background: "#FFFFFF",
                  padding: 8,
                  borderRadius: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QRCode
                  value={shareUrl}
                  size={120}
                  bgColor="#FFFFFF"
                  fgColor={t.isDark ? "#0A101C" : "#453215"}
                  level="M"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: t.goldBright,
                    letterSpacing: 1,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Scan to Read
                </span>
                <span
                  style={{
                    fontSize: 16,
                    color: t.textMuted,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Read & Listen Online
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            width: "100%",
            height: 1,
            background: `linear-gradient(to right, transparent, ${t.goldPrimary}, transparent)`,
            opacity: 0.4,
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
            color: t.textMuted,
            opacity: 0.85,
            fontFamily: "'Outfit', sans-serif",
            padding: "0 8px",
          }}
        >
          <span>© {new Date().getFullYear()} {brandName}. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
};

export default Template5;