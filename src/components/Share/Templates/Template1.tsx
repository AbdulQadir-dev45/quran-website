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

const Template1: React.FC<TemplateProps> = ({
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
      style={{
        width: 1080,
        height: 1350,
        position: "relative",
        overflow: "hidden",
        borderRadius: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 60,
        color: "#fff",
        fontFamily: "'Poppins', sans-serif",
        background:
          "linear-gradient(180deg,#0B3D2E 0%,#14532D 35%,#166534 70%,#0B3D2E 100%)",
        boxSizing: "border-box",
      }}
    >
      {/* Decorative Circle */}
      <div
        style={{
          position: "absolute",
          top: -180,
          right: -180,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(255,255,255,.05)",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -220,
          left: -220,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background: "rgba(255,255,255,.04)",
        }}
      />

      {/* Islamic Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "radial-gradient(circle,#ffffff 1px,transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* ================= HEADER ================= */}
      <div
        style={{
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 5,
            opacity: 0.8,
            textTransform: "uppercase",
          }}
        >
          Ayah Of The Day
        </div>

        <h1
          style={{
            marginTop: 18,
            marginBottom: 8,
            color: "#FFD54A",
            fontSize: 50,
            fontWeight: 700,
          }}
        >
          {brandName}
        </h1>

        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,.80)",
            lineHeight: 1,
            wordBreak: "break-word",
          }}
        >
          {websiteUrl}
        </div>

        <div
          style={{
            width: "100%",
            height: 2,
            marginTop: 30,
            marginBottom: 35,
            background: "rgba(255,255,255,.15)",
          }}
        />

        {showBismillah && (
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: 65,
              color: "#FFD54A",
              textShadow: "0 5px 15px rgba(0,0,0,.35)",
              marginBottom: 25,
            }}
          >
            ﷽
          </div>
        )}

        <div
          style={{
            width: "85%",
            height: 2,
            marginTop: 40,
            marginBottom: 40,
            background:
              "linear-gradient(to right,transparent,#FFD54A,transparent)",
          }}
        />

      </div>

      {/* ================= MIDDLE CONTENT ================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          zIndex: 10,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {/* Arabic Ayah */}
        <div
          style={{
            width: "100%",
            padding: "0 10px",
          }}
        >
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: arabicFontSize,
              lineHeight: 2,
              color: "#FFFFFF",
              textAlign: "center",
              textShadow: "0 4px 12px rgba(0,0,0,.35)",
            }}
          >
            {arabic}
          </div>
        </div>

        {/* Decorative Divider */}
        <div
          style={{
            width: "85%",
            height: 2,
            marginTop: 40,
            marginBottom: 40,
            background:
              "linear-gradient(to right,transparent,#FFD54A,transparent)",
          }}
        />

        {/* Urdu Translation */}
        <div
          style={{
            width: "100%",
            padding: "0 30px",
          }}
        >
          <div
            style={{
              fontFamily: "'Noto Nastaliq Urdu', serif",
              fontSize: urduFontSize,
              letterSpacing: 2,
              lineHeight: 1.6,
              color: "#F8F8F8",
            }}
          >
            {urdu}
          </div>
        </div>

        {/* English Translation */}
        <div
          style={{
            marginTop: 35,
            width: "100%",
            padding: "0 40px",
          }}
        >
          <div
            style={{
              fontSize: englishFontSize,
              fontStyle: "italic",
              color: "#E5E7EB",
              lineHeight: 1.9,
              fontWeight: 400,
            }}
          >
            "{english}"
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          zIndex: 10,
          marginTop: 30,
        }}
      >
        {/* Left Side */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: "68%",
          }}
        >
          <div
            style={{
            padding: "12px 28px",
            borderRadius: 999,
            background: "#FFD54A",
            color: "#14532D",
            fontWeight: 700,
            fontSize: 22,
          }}
          >
            Surah {surahName} • Ayah {ayahNumber}
          </div>

          <div
            style={{
              fontSize: 30,
              color: "#F5F5F5",
              margin: 10,
            }}
          >
            📅 {gregorian}
          </div>

          <div
            style={{
              fontSize: 34,
              color: "#FFD54A",
              margin: 5,
            }}
          >
            🌙 {hijri} AH
          </div>
        </div>

        {/* QR */}
        {showQr && (
          <div
            style={{
              background: "#FFFFFF",
              padding: 16,
              borderRadius: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 12px 35px rgba(0,0,0,.25)",
            }}
          >
            <QRCode
              value={shareUrl}
              size={125}
              bgColor="#FFFFFF"
              fgColor="#14532D"
            />

            <div
              style={{
                marginTop: 12,
                color: "#14532D",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Scan to Read
            </div>
          </div>
        )}
      </div>

      {/* Bottom Divider */}
      <div
        style={{
          width: "100%",
          height: 2,
          marginTop: 35,
          background: "rgba(255,255,255,.12)",
          zIndex: 10,
        }}
      />

      {/* Bottom Branding */}
      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          zIndex: 10,
        }}
      >

        <div
            style={{
              fontSize: 20,
              opacity: 0.75,
            }}
          >
            © {new Date().getFullYear()} {brandName}
          </div>
      </div>
    </div>
  );
};

export default Template1;