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
}

const Template4: React.FC<TemplateProps> = ({
  arabic,
  urdu,
  english,

  surahName,
  ayahNumber,

  bismillahFontSize,
  arabicFontSize,
  urduFontSize,
  englishFontSize,

  websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://alquran.org",
  brandName = "Al-Quran Website",

  showQr = true,
  showBismillah = true,
  showUrdu = true,
  showEnglish = true,
}) => {
  const today = new Date();

  const gregorian = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hijri = moment()
  .subtract(1, "day")
  .format("iD iMMMM iYYYY");

  const shareUrl = `${websiteUrl}`;

  return (
    <div
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        padding: 45,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Poppins', sans-serif",
        background: "linear-gradient(180deg,#F8F3E8,#F2E8D5,#E7D5B4,#DCC59C)",
        borderRadius: 40,
        color: "#4A3728",
        border: "8px solid #8B6B3F",
        boxSizing: "border-box"
      }}
    >
      {/* Decorative Border */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          border: "2px solid rgba(139,107,63,.35)",
          borderRadius: 28,
          pointerEvents: "none"
        }}
      />

      {/* Top Ornament */}
      <div
        style={{
          position: "absolute",
          top: -120,
          left: "50%",
          transform: "translateX(-50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(139,107,63,.08)",
          pointerEvents: "none"
        }}
      />

      {/* Bottom Ornament */}
      <div
        style={{
          position: "absolute",
          bottom: -180,
          right: -120,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(139,107,63,.05)",
          pointerEvents: "none"
        }}
      />

      {/* Header */}
      <div
        style={{
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            letterSpacing: 4,
            color: "#8B6B3F",
            textTransform: "uppercase"
          }}
        >
          Ayah of the day
        </div>

        <h1
          style={{
            fontSize: 46,
            fontWeight: 700,
            marginTop: 6,
            marginBottom: 8,
            color: "#6B4F2A"
          }}
        >
          {brandName}
        </h1>

        <div
          style={{
            width: "100%",
            height: 2,
            background: "rgba(139,107,63,.20)",
            marginBottom: 20
          }}
        />

        {showBismillah && (
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: bismillahFontSize,
              color: "#8B6B3F",
              marginBottom: 26
            }}
          >
            ﷽
          </div>
        )}

        <div
          style={{
            padding: "12px 25px",
            background: "#8B6B3F",
            color: "#FFF8EE",
            borderRadius: 50,
            fontWeight: 600,
            fontSize: 22
          }}
        >
          Surah {surahName} • Ayah {ayahNumber}
        </div>
      </div>

      {/* Middle Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
          marginTop: 20,
        }}
      >
        {/* Arabic Manuscript Card */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,248,238,.65)",
            border: "2px solid rgba(139,107,63,.18)",
            borderRadius: 30,
            padding: "20px 20px",
            textAlign: "center",
            boxShadow: "0 18px 45px rgba(90,70,40,.10)",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              fontSize: 18,
              letterSpacing: 4,
              color: "#8B6B3F",
              marginBottom: 16,
              fontWeight: 700
            }}
          >
            ﷲ HOLY QURAN ﷲ
          </div>

          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: arabicFontSize,
              lineHeight: 2,
              color: "#4A3728",
              direction: "rtl"
            }}
          >
            {arabic}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            width: "82%",
            height: 2,
            marginTop: 20,
            marginBottom: 20,
            background:
              "linear-gradient(to right,transparent,#8B6B3F,#D4AF37,#8B6B3F,transparent)"
          }}
        />

        {/* Urdu Card */}
        {showUrdu && (
          <div
            style={{
              width: "100%",
              background: "rgba(255,255,255,.45)",
              borderRadius: 24,
              padding: "20px 20px",
              border: "1px solid rgba(139,107,63,.18)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#8B6B3F",
                fontSize: 18,
                letterSpacing: 3,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              URDU TRANSLATION
            </div>

            <div
              style={{
                fontFamily: "'Noto Nastaliq Urdu', serif",
                fontSize: urduFontSize,
                color: "#4A3728",
                lineHeight: 2.2,
                direction: "rtl",
              }}
            >
              {urdu}
            </div>
          </div>
        )}

        {/* English Card */}
        {showEnglish && (
          <div
            style={{
              width: "100%",
              marginTop: 16,
              background: "rgba(255,255,255,.35)",
              borderRadius: 24,
              padding: "20px 20px",
              border: "1px solid rgba(139,107,63,.18)",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                color: "#8B6B3F",
                fontSize: 18,
                letterSpacing: 3,
                fontWeight: 700,
                marginBottom: 10,
              }}
            >
              ENGLISH TRANSLATION
            </div>

            <div
              style={{
                fontSize: englishFontSize,
                color: "#5A4633",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              "{english}"
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: 15,
          zIndex: 5
        }}
      >
        {/* Left Info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 50,
            maxWidth: "68%"
          }}
        >

          <div
            style={{
              fontSize: 32,
              color: "#5A4633",
              fontWeight: 600
            }}
          >
            📅 {gregorian}
          </div>

          <div
            style={{
              fontFamily:"'Noto Nastaliq Urdu', serif",
              fontSize: 35,
              color: "#8B6B3F",
              fontWeight: 600
            }}
          >
            🌙 {hijri} AH
          </div>
        </div>

        {/* QR Card */}
        {showQr && (
          <div
            style={{
              background: "#FFFDF8",
              border: "2px solid rgba(139,107,63,.18)",
              borderRadius: 24,
              padding: 18,
              boxShadow: "0 12px 35px rgba(90,70,40,.12)",
              textAlign: "center"
            }}
          >
            <QRCode
              value={shareUrl}
              size={125}
              bgColor="#FFFFFF"
              fgColor="#6B4F2A"
            />

            <div
              style={{
                marginTop: 10,
                fontSize: 18,
                fontWeight: 700,
                color: "#6B4F2A"
              }}
            >
              Scan to Read
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: 18,
          color: "rgba(74,55,40,.70)",
          textAlign: "center",
          marginTop: 8
        }}
      >
        © {new Date().getFullYear()} {brandName}
      </div>

      {/* Bottom Divider */}
      <div
        style={{
          width: "100%",
          height: 2,
          marginTop: 35,
          background:
            "linear-gradient(to right,transparent,#8B6B3F,#D4AF37,#8B6B3F,transparent)"
        }}
      />    

      {/* Decorative Corners */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 18,
          width: 70,
          height: 70,
          borderTop: "5px solid #8B6B3F",
          borderLeft: "5px solid #8B6B3F",
          borderRadius: 18,
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 18,
          right: 18,
          width: 70,
          height: 70,
          borderTop: "5px solid #8B6B3F",
          borderRight: "5px solid #8B6B3F",
          borderRadius: 18,
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 18,
          left: 18,
          width: 70,
          height: 70,
          borderBottom: "5px solid #8B6B3F",
          borderLeft: "5px solid #8B6B3F",
          borderRadius: 18,
          pointerEvents: "none"
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 18,
          right: 18,
          width: 70,
          height: 70,
          borderBottom: "5px solid #8B6B3F",
          borderRight: "5px solid #8B6B3F",
          borderRadius: 18,
          pointerEvents: "none"
        }}
      />
    </div>
  );
};

export default Template4;