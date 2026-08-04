import React from "react";
import QRCode from "react-qr-code";
import moment from "moment-hijri";
import logo from "../assets/logo.png";

interface AyahShareCardProps {
  arabic: string;
  urdu: string;
  english: string;
  surahName: string;
  surahNumber: number;
  ayahNumber: number;
}

const AyahShareCard: React.FC<AyahShareCardProps> = ({
  arabic,
  urdu,
  english,
  surahName,
  surahNumber,
  ayahNumber,
}) => {
  const today = new Date();

  const gregorian = today.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hijri = moment().format("iD iMMMM iYYYY");

  const shareUrl = `${window.location.origin}/surah/${surahNumber}?ayah=${ayahNumber}`;

  return (
    <div
      id="ayah-share-card"
      style={{
        width: "1080px",
        height: "1350px",
        background: "linear-gradient(180deg,#0f5132,#166534,#14532d,#0b3d2e)",
        color: "#fff",
        padding: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "40px",
        fontFamily: "Poppins",
        position: "relative",
        overflow: "hidden",
      }}
    >

        {/* ===== Decorative Background ===== */}
        <div
        style={{
            position: "absolute",
            top: -180,
            right: -180,
            width: 450,
            height: 450,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
        }}
        />

        <div
        style={{
            position: "absolute",
            bottom: -220,
            left: -220,
            width: 550,
            height: 550,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
        }}
        />

        {/* ===== Header ===== */}
        <div
        style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
        }}
        >
        <img
            src={logo}
            alt="Logo"
            style={{
            width: 90,
            height: 90,
            marginBottom: 20,
            }}
        />

        <h2
            style={{
            margin: 0,
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 1,
            }}
        >
            Al-Quran Website
        </h2>

        <p
            style={{
            marginTop: 10,
            opacity: 0.85,
            fontSize: 22,
            }}
        >
            Urdu & English Hub
        </p>

        <div
            style={{
            width: "100%",
            height: 2,
            background: "rgba(255,255,255,.2)",
            margin: "35px 0",
            }}
        />

        <div
            style={{
            color: "#FFD700",
            fontSize: 55,
            marginBottom: 15,
            }}
        >
            ﷽
        </div>
        </div>

        {/* ===== Title ===== */}

        <div
        style={{
            textAlign: "center",
            marginTop: 40,
            marginBottom: 20,
            zIndex: 2,
        }}
        >
        <h1
            style={{
            fontSize: 44,
            letterSpacing: 4,
            color: "#FFD700",
            marginBottom: 20,
            }}
        >
            AYAH OF THE DAY
        </h1>
        </div>

        {/* ===== Arabic Ayah ===== */}

        <div
        style={{
            textAlign: "center",
            zIndex: 2,
        }}
        >
        <div
            style={{
            fontFamily: "Amiri",
            fontSize: 72,
            lineHeight: 2,
            color: "#FFFFFF",
            }}
        >
            {arabic}
        </div>

        <div
            style={{
            width: "100%",
            height: 2,
            background: "rgba(255,255,255,.15)",
            margin: "40px 0",
            }}
        />

        <div
            style={{
            fontSize: 32,
            lineHeight: 2,
            fontFamily: "'Noto Nastaliq Urdu', serif",
            }}
        >
            {urdu}
        </div>

        <div
            style={{
            marginTop: 30,
            fontSize: 28,
            color: "#EAEAEA",
            fontStyle: "italic",
            lineHeight: 1.8,
            }}
        >
            {english}
        </div>
        </div>

        {/* ===== Bottom Section ===== */}
        <div
        style={{
            marginTop: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 2,
        }}
        >
        {/* Left Side */}
        <div style={{ maxWidth: "70%" }}>
            {/* Surah Badge */}
            <div
            style={{
                display: "inline-block",
                background: "#FFD700",
                color: "#14532d",
                padding: "12px 24px",
                borderRadius: "30px",
                fontWeight: 700,
                fontSize: 24,
                marginBottom: 25,
            }}
            >
            📖 {surahName} • Ayah {ayahNumber}
            </div>

            {/* Gregorian Date */}
            <div
            style={{
                fontSize: 24,
                marginBottom: 10,
            }}
            >
            📅 {gregorian}
            </div>

            {/* Hijri Date */}
            <div
            style={{
                fontSize: 24,
                color: "#FFD700",
            }}
            >
            🌙 {hijri} AH
            </div>
        </div>

        {/* QR Code */}
        <div
            style={{
            background: "#fff",
            padding: 15,
            borderRadius: 20,
            textAlign: "center",
            }}
        >
            <QRCode
            value={shareUrl}
            size={140}
            bgColor="#ffffff"
            fgColor="#14532d"
            />

            <div
            style={{
                color: "#14532d",
                marginTop: 10,
                fontWeight: 600,
                fontSize: 16,
            }}
            >
            Scan to Read
            </div>
        </div>
        </div>

        {/* ===== Footer ===== */}
        <div
        style={{
            marginTop: 50,
            textAlign: "center",
            zIndex: 2,
        }}
        >
        <div
            style={{
            height: 2,
            background: "rgba(255,255,255,.15)",
            marginBottom: 25,
            }}
        />

        <div
            style={{
            fontSize: 18,
            opacity: 0.8,
            letterSpacing: 1,
            }}
        >
            © {new Date().getFullYear()} Al-Quran Website
        </div>

        <div
            style={{
            marginTop: 8,
            fontSize: 16,
            opacity: 0.65,
            }}
        >
            Urdu & English Hub
        </div>
        </div>

        {/* ===== Watermark ===== */}
        <div
        style={{
            position: "absolute",
            bottom: 180,
            right: -40,
            transform: "rotate(-35deg)",
            fontSize: 90,
            fontWeight: 700,
            color: "rgba(255,255,255,.04)",
            pointerEvents: "none",
        }}
        >
        AL-QURAN
        </div>
    </div>
  );
}

export default AyahShareCard;