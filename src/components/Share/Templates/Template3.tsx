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

  arabicFontSize: number;
  urduFontSize: number;
  englishFontSize: number;

  websiteUrl?: string;
  brandName?: string;

  showQr?: boolean;
  showBismillah?: boolean;
}

const Template3: React.FC<TemplateProps> = ({
  arabic,
  urdu,
  english,

  surahName,
  surahNumber,
  ayahNumber,

  arabicFontSize,
  urduFontSize,
  englishFontSize,

  websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://alquran.example.com",
  brandName = "Al-Quran Website",

  showQr = true,
  showBismillah = true,
}) => {
  const today = new Date();

  const gregorian = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hijri = moment().format("iD iMMMM iYYYY");

  const shareUrl = `${websiteUrl}/english?surah=${surahNumber}&ayah=${ayahNumber}`;

  return (
    <div
      id="quran-card-export"
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",

        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        padding: 60,

        borderRadius: 42,

        boxSizing: "border-box",

        color: "#fff",

        fontFamily: "'Poppins', sans-serif",

        background: `
        radial-gradient(circle at top right,
        rgba(96,165,250,.22),
        transparent 32%),

        radial-gradient(circle at bottom left,
        rgba(56,189,248,.18),
        transparent 35%),

        linear-gradient(
        160deg,
        #020617 0%,
        #0F172A 35%,
        #172554 70%,
        #0F172A 100%)
        `,
      }}
    >
      {/* Top Glow */}
      <div
        style={{
          position: "absolute",
          top: -220,
          right: -220,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(59,130,246,.25)",
          filter: "blur(120px)",
        }}
      />

      {/* Bottom Glow */}
      <div
        style={{
          position: "absolute",
          bottom: -220,
          left: -220,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "rgba(14,165,233,.18)",
          filter: "blur(140px)",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Glass border frame */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,.10)",
          background: "rgba(255,255,255,.04)",
          backdropFilter: "blur(18px)",
        }}
      />

      {/* Header section */}
      <div
        style={{
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: 8,
            color: "#FACC15",
            fontWeight: 700,
          }}
        >
          ☪ AYAH OF THE DAY
        </div>

        <h1
          style={{
            marginTop: 18,
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: 2,
            margin: 0,
          }}
        >
          {brandName}
        </h1>

        <div
          style={{
            marginTop: 20,
            width: "70%",
            height: 1,
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,.3), transparent)",
          }}
        />

        {showBismillah && (
          <div
            style={{
              fontFamily: "'Amiri', 'Amiri Quran', serif",
              fontSize: 60,
              color: "#ffffff",
              textShadow: "0 0 35px rgba(255,255,255,.35)",
              marginTop: 15,
            }}
          >
            ﷽
          </div>
        )}

        <div
          style={{
            marginTop: 25,
            padding: "16px 36px",
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.15)",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          Surah {surahName} • Ayah {ayahNumber}
        </div>
      </div>

      {/* =======================
            MIDDLE CONTENT
      ======================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 40,
          zIndex: 5,
        }}
      >
        {/* Arabic Card */}
        <div
          style={{
            width: "100%",
            padding: "25px",
            borderRadius: 38,
            background:
              "linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04))",
            border: "1px solid rgba(255,255,255,.15)",
            backdropFilter: "blur(25px)",
            boxShadow: "0 30px 70px rgba(0,0,0,.30)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              textAlign: "center",
              direction: "rtl",
              fontFamily: "'Amiri', 'Amiri Quran', serif",
              fontSize: arabicFontSize,
              lineHeight: 2.2,
              color: "#FFFFFF",
              textShadow: "0 0 30px rgba(255,255,255,.25)",
            }}
          >
            {arabic}
          </div>
        </div>

        {/* Decorative Divider */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "25px 0",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "70%",
              height: 2,
              background:
                "linear-gradient(to right, transparent, #FACC15, #ffffff, #FACC15, transparent)",
            }}
          />

          <div
            style={{
              position: "absolute",
              background: "#0F172A",
              padding: "0 25px",
              color: "#FACC15",
              fontSize: 28,
            }}
          >
            ❈
          </div>
        </div>

        {/* Urdu Card */}
        <div
          style={{
            width: "100%",
            borderRadius: 30,
            padding: "20px 25px",
            background: "rgba(255,255,255,.07)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,.12)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              color: "#FACC15",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 10,
              letterSpacing: 2,
            }}
          >
            URDU TRANSLATION
          </div>

          <div
            style={{
              direction: "rtl",
              textAlign: "right",
              fontFamily: "'Noto Nastaliq Urdu', serif",
              fontSize: urduFontSize,
              lineHeight: 1.6,
              color: "#F8FAFC",
            }}
          >
            {urdu}
          </div>
        </div>

        {/* English Card */}
        <div
          style={{
            width: "100%",
            marginTop: 14,
            borderRadius: 30,
            padding: "20px 25px",
            background: "rgba(255,255,255,.06)",
            backdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,.12)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              color: "#FACC15",
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 18,
              letterSpacing: 2,
            }}
          >
            ENGLISH TRANSLATION
          </div>

          <div
            style={{
              fontSize: englishFontSize,
              color: "#F8FAFC",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            "{english}"
          </div>
        </div>
      </div>

      {/* =======================
            PREMIUM FOOTER
      ======================= */}
      <div
        style={{
          zIndex: 5,
          // marginTop: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          {/* Left */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginBottom: 80,
              maxWidth: "68%",
            }}
          >

            <div
              style={{
                color: "#E2E8F0",
                fontSize: 32,
              }}
            >
              📅 {gregorian}
            </div>

            <div
              style={{
                color: "#7DD3FC",
                fontSize: 34,
              }}
            >
              🌙 {hijri} AH
            </div>

          </div>

          {/* QR */}
          {showQr && (
            <div
              style={{
                padding: 18,
                borderRadius: 28,
                backgroundColor: "#fff",
                border: "1px solid rgba(255,255,255,.18)",
                backdropFilter: "blur(18px)",
                boxShadow: "0 20px 45px rgba(0,0,0,.30)",
                textAlign: "center",
              }}
            >
              <QRCode
                value={shareUrl}
                size={125}
                fgColor="rgba(59,130,250,.99)"
              />

              <div
                style={{
                  marginTop: 12,
                  color: "rgba(59,130,246,.99)",
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                Scan to Read
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          style={{
            width: "100%",
            height: 2,
            marginTop: 14,
            background:
              "linear-gradient(to right, transparent, #FACC15, #ffffff, #FACC15, transparent)",
          }}
        />

        {/* Bottom */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              color: "#FACC15",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            ☪ {brandName}
          </div>

          <div
            style={{
              color: "#CBD5E1",
              fontSize: 20,
            }}
          >
            Read • Reflect • Share
          </div>
        </div>
      </div>

      {/* Floating Lights */}
      <div
        style={{
          position: "absolute",
          top: 140,
          right: 100,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "rgba(255,255,255,.25)",
          filter: "blur(2px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 260,
          left: 80,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "rgba(125,211,252,.25)",
          filter: "blur(3px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 340,
          left: 120,
          width: 14,
          height: 14,
          borderRadius: "50%",
          background: "#FACC15",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 220,
          left: 950,
          fontSize: 28,
          color: "rgba(255,255,255,.20)",
        }}
      >
        ✦
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 180,
          right: 120,
          fontSize: 24,
          color: "rgba(250,204,21,.25)",
        }}
      >
        ✧
      </div>
    </div>
  );
};

export default Template3;