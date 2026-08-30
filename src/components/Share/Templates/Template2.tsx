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

const Template2: React.FC<TemplateProps> = ({
  arabic,
  urdu,
  english,

  surahName,
  ayahNumber,

  bismillahFontSize,
  arabicFontSize,
  urduFontSize,
  englishFontSize,

  websiteUrl = typeof window !== "undefined" ? window.location.origin : "https://alquran.example.com",
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
        background: "linear-gradient(180deg,#050505,#111111,#1A1A1A,#050505)",
        borderRadius: 40,
        fontFamily: "'Poppins', sans-serif",
        color: "#ffffff",
        border: "8px solid #C9A227",
        boxSizing: "border-box",
      }}
    >
      {/* Gold Corner */}
      <div
        style={{
          position: "absolute",
          top: 30,
          left: 30,
          right: 30,
          bottom: 30,
          border: "2px solid rgba(201,162,39,.35)",
          borderRadius: 28,
          pointerEvents: "none",
        }}
      />

      {/* Decorative Circle */}
      <div
        style={{
          position: "absolute",
          top: -160,
          right: -160,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(201,162,39,.08)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: -200,
          left: -200,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(201,162,39,.06)",
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <div
          style={{
            letterSpacing: 6,
            fontSize: 24,
            color: "#C9A227",
          }}
        >
          Ayah Of The Day
        </div>

        <h1
          style={{
            fontSize: 48,
            marginTop: 10,
            marginBottom: 12,
            color: "#F6D76B",
            fontWeight: 700,
          }}
        >
          {brandName}
        </h1>

        <div
          style={{
            width: "100%",
            height: 2,
            background: "rgba(201,162,39,.25)",
            marginBottom: 20,
          }}
        />

        {showBismillah && (
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: bismillahFontSize,
              color: "#F6D76B",
              marginBottom: 20,
            }}
          >
            ﷽
          </div>
        )}

        {/* Gold Divider */}
        <div
          style={{
            height: 2,
            marginTop: 40,
            marginBottom: 20,
            background:
              "linear-gradient(to right,transparent,#C9A227,#F8E28A,#C9A227,transparent)",
          }}
        />
        
      </div>

      {/* Middle Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        {/* Arabic */}
        <div
          style={{
            width: "100%",
            textAlign: "center",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: "'Amiri', serif",
              fontSize: arabicFontSize,
              lineHeight: 2,
              color: "#F8E28A",
              textShadow: "0 4px 20px rgba(201,162,39,.35)",
            }}
          >
            {arabic}
          </div>
        </div>

        {/* Gold Divider */}
        <div
          style={{
            width: "82%",
            height: 2,
            marginTop: 40,
            marginBottom: 30,
            background:
              "linear-gradient(to right,transparent,#C9A227,#F8E28A,#C9A227,transparent)",
          }}
        />

        {/* Urdu */}

        {showUrdu && (
          <div
            style={{
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                background: "rgba(201,162,39,.08)",
                border: "1px solid rgba(201,162,39,.20)",
                borderRadius: 24,
                padding: "20px 20px",
              }}
            >
              <div
                style={{
                  color: "#C9A227",
                  fontSize: 20,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  marginBottom: 18,
                  fontWeight: 700,
                }}
              >
                Urdu Translation
              </div>

              <div
                style={{
                  fontFamily: "'Noto Nastaliq Urdu', serif",
                  fontSize: urduFontSize,
                  lineHeight: 2.2,
                  letterSpacing: 3,
                  color: "#F8F8F8",
                  direction: "rtl",
                }}
              >
                {urdu}
              </div>
            </div>
          </div>
        )}

        {/* English */}

        {showEnglish && (
        <div
          style={{
            width: "100%",
            marginTop: 24,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(201,162,39,.18)",
              borderRadius: 24,
              padding: "20px 20px",
            }}
          >
            <div
              style={{
                color: "#C9A227",
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 10,
                fontWeight: 700,
              }}
            >
              English Translation
            </div>

            <div
              style={{
                fontSize: englishFontSize,
                color: "#E8E8E8",
                lineHeight: 1.5,
                fontStyle: "italic",
              }}
            >
              "{english}"
            </div>
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
          zIndex: 2,
        }}
      >
        {/* Left */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
            marginBottom: 25,
            maxWidth: "68%",
          }}
        >
          <div
            style={{
            display: "inline-block",
            padding: "12px 30px",
            border: "2px solid #C9A227",
            borderRadius: 50,
            fontSize: 22,
            fontWeight: 700,
            color: "#F6D76B",
          }}
          >
            Surah {surahName} • Ayah {ayahNumber}
          </div>

          <div
            style={{
              fontSize: 28,
              color: "#EAEAEA",
            }}
          >
            📅 {gregorian}
          </div>

          <div
            style={{
              fontFamily:"'Noto Nastaliq Urdu', serif",
              fontSize: 35,
              color: "#F6D76B",
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
              padding: 18,
              borderRadius: 22,
              boxShadow: "0 12px 35px rgba(0,0,0,.40)",
              textAlign: "center",
            }}
          >
            <QRCode
              value={shareUrl}
              size={125}
              bgColor="#ffffff"
              fgColor="#000000"
            />

            <div
              style={{
                marginTop: 10,
                color: "#000",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Scan to Read
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "rgba(255,255,255,.70)",
          fontSize: 20,
          textAlign: "center",
        }}
      >
        © {new Date().getFullYear()} {brandName}
      </div>

      {/* Gold Divider */}
      <div
        style={{
          width: "100%",
          height: 2,
          marginTop: 35,
          background:
            "linear-gradient(to right,transparent,#C9A227,#F6D76B,#C9A227,transparent)",
          zIndex: 2,
        }}
      />

      {/* Bottom Footer */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 2,
        }}
      >
      </div>

      {/* Small Gold Corners */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          width: 60,
          height: 60,
          borderTop: "4px solid #C9A227",
          borderLeft: "4px solid #C9A227",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 60,
          height: 60,
          borderTop: "4px solid #C9A227",
          borderRight: "4px solid #C9A227",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          width: 60,
          height: 60,
          borderBottom: "4px solid #C9A227",
          borderLeft: "4px solid #C9A227",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          width: 60,
          height: 60,
          borderBottom: "4px solid #C9A227",
          borderRight: "4px solid #C9A227",
          borderRadius: 12,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default Template2;