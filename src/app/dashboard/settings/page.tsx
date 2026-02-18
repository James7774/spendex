"use client";
import React, {
  useState,
  useRef,
  ChangeEvent,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useFinance, Language } from "@/context/FinanceContext";
import {
  Sun,
  Moon,
  Trash2,
  LogOut,
  ChevronRight,
  Globe,
  Check,
  Camera,
  Pencil,
  User,
  Wallet,
  SlidersHorizontal,
  FileText,
  ChevronLeft,
  ShieldCheck,
  Lock,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BottomSheet from "@/components/BottomSheet";
import CenterModal from "@/components/CenterModal";

type SettingsView = "main" | "account" | "payment" | "preferences" | "export";

export default function SettingsPage() {
  const {
    language,
    setLanguage,
    clearAllData,
    darkMode,
    user,
    updateUserProfile,
    logout,
    setTheme,
    t,
    isRTL,
    pinCode,
    setPinCode,
    setOverlayOpen
  } = useFinance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tAny = t as any;

  const getFlagUrl = (countryCode: string) =>
    `https://flagcdn.com/w160/${countryCode}.png`;

  const languages = [
    { code: "uz", name: "O'zbek", country: "uz" },
    { code: "ru", name: "Русский", country: "ru" },
    { code: "en", name: "English", country: "gb" },
    { code: "es", name: "Español", country: "es" },
    { code: "ar", name: "العربية", country: "sa" },
    { code: "hi", name: "हिन्दी", country: "in" },
    { code: "zh-Hans", name: "简体中文", country: "cn" },
    { code: "fr", name: "Français", country: "fr" },
    { code: "pt-BR", name: "Português", country: "br" },
    { code: "de", name: "Deutsch", country: "de" },
    { code: "ja", name: "日本語", country: "jp" },
  ];

  const currentLang =
    languages.find((l) => l.code === language) || languages[0];

  const [confirmationType, setConfirmationType] = useState<
    "clear" | "logout" | null
  >(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tempPin, setTempPin] = useState("");
  const [pinStep, setPinStep] = useState<"enter" | "confirm" | "verify">("enter");
  const [firstPin, setFirstPin] = useState("");
  const [setupError, setSetupError] = useState(false);

  useEffect(() => {
    setOverlayOpen(isPinModalOpen);
    if (isPinModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    };
  }, [isPinModalOpen, setOverlayOpen]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 512;
        const MAX_HEIGHT = 512;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
    });
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        try {
          const compressed = await compressImage(result);
          updateUserProfile({ avatar: compressed });
        } catch (err) {
          console.error("Compression failed:", err);
          updateUserProfile({ avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    if (newName.trim() && user) {
      updateUserProfile({ name: newName.trim() });
      setIsEditingName(false);
    }
  };

  const handleDeletePhoto = () => {
    updateUserProfile({ avatar: undefined });
  };

  const handleLogout = () => {
    localStorage.removeItem("hasSeenOnboarding");
    sessionStorage.setItem("finova_skip_splash", "true");
    logout();
  };

  /* --- VIEW STATE --- */
  const [currentView, setCurrentView] = useState<SettingsView>("main");

  /* --- PROFILE EDIT STATE --- */
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize edit fields when entering account view
  const userName = user?.name;

  // Initialize edit fields when entering account view
  useEffect(() => {
    if (currentView === "account" && userName) {
      const names = userName.split(" ");
      const newFirst = names[0] || "";
      const newLast = names.slice(1).join(" ") || "";
      
      // eslint-disable-next-line
      setEditFirstName(prev => prev !== newFirst ? newFirst : prev);
      // eslint-disable-next-line
      setEditLastName(prev => prev !== newLast ? newLast : prev);
      // eslint-disable-next-line
      setSaveSuccess(prev => prev ? false : prev);
    }
  }, [currentView, userName]);

  const handleProfileSave = () => {
    if (!editFirstName.trim()) return;
    setIsSaving(true);

    // Simulate API call for premium feel
    setTimeout(() => {
      updateUserProfile({
        name: `${editFirstName.trim()} ${editLastName.trim()}`.trim(),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  /* --- RENDERERS --- */
  const renderMainView = () => (
    <div
      className="animate-slide-up"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        padding: "0 2px",
      }}
    >
      {/* Account Settings */}
      <button
        className="settings-item touch-active"
        onClick={() => setCurrentView("account")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User
              size={22}
              color={darkMode ? "#fff" : "#1e293b"}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {tAny.accountSettings}
          </span>
        </div>
        <ChevronRight size={18} color="#cbd5e1" strokeWidth={3} />
      </button>

      {/* Payment Methods */}
      <button
        className="settings-item touch-active"
        onClick={() => setCurrentView("payment")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Wallet
              size={22}
              color={darkMode ? "#fff" : "#1e293b"}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {tAny.paymentMethods}
          </span>
        </div>
        <ChevronRight size={18} color="#cbd5e1" strokeWidth={3} />
      </button>

      {/* Preferences */}
      <button
        className="settings-item touch-active"
        onClick={() => setCurrentView("preferences")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SlidersHorizontal
              size={22}
              color={darkMode ? "#fff" : "#1e293b"}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {tAny.preferences}
          </span>
        </div>
        <ChevronRight size={18} color="#cbd5e1" strokeWidth={3} />
      </button>

      {/* Export Data */}
      <button
        className="settings-item touch-active"
        onClick={() => setCurrentView("export")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "12px 16px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "20px",
          boxShadow: "var(--shadow-sm)",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              borderRadius: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText
              size={22}
              color={darkMode ? "#fff" : "#1e293b"}
              strokeWidth={2.5}
            />
          </div>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 800,
              color: "var(--text-main)",
            }}
          >
            {tAny.exportData}
          </span>
        </div>
        <ChevronRight size={18} color="#cbd5e1" strokeWidth={3} />
      </button>
    </div>
  );

  const renderAccountSettings = () => {
    const cardStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      padding: "14px 18px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "24px",
      boxShadow: "var(--shadow-sm)",
      width: "100%",
      marginBottom: "12px",
    };

    const inputResetStyle: React.CSSProperties = {
      width: "100%",
      border: "none",
      background: "transparent",
      color: "var(--text-main)",
      fontSize: "1rem",
      fontWeight: 700,
      padding: "2px 0",
      outline: "none",
      margin: 0,
      appearance: "none" as const,
      WebkitAppearance: "none" as const,
    };

    const labelStyle: React.CSSProperties = {
      fontSize: "0.7rem",
      fontWeight: 850,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      display: "block",
      marginBottom: "2px",
    };

    return (
      <div
        className="animate-slide-in-right"
        style={{ width: "100%", padding: "0 4px" }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={() => setCurrentView("main")}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-main)",
              cursor: "pointer",
              padding: 0,
            }}
            className="touch-active"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 900,
              color: "var(--text-main)",
              margin: 0,
              letterSpacing: "-0.3px",
            }}
          >
            {tAny.accountSettings}
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Form Fields */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* First Name */}
            <div style={cardStyle}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Ism</span>
                <input
                  type="text"
                  style={inputResetStyle}
                  value={editFirstName}
                  onChange={(e) => setEditFirstName(e.target.value)}
                  placeholder="Ismingizni kiriting"
                />
              </div>
            </div>

            {/* Last Name */}
            <div style={cardStyle}>
              <div style={{ flex: 1 }}>
                <span style={labelStyle}>Familiya</span>
                <input
                  type="text"
                  style={inputResetStyle}
                  value={editLastName}
                  onChange={(e) => setEditLastName(e.target.value)}
                  placeholder="Familiyangizni kiriting"
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ marginTop: "12px" }}>
            <button
              onClick={handleProfileSave}
              disabled={isSaving || !editFirstName.trim()}
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "24px",
                border: "none",
                background: saveSuccess
                  ? "#10b981"
                  : "linear-gradient(to right, #3b82f6, #2563eb)",
                color: "#fff",
                fontSize: "1.05rem",
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                boxShadow: saveSuccess
                  ? "0 10px 25px rgba(16, 185, 129, 0.3)"
                  : "0 10px 25px rgba(59, 130, 246, 0.3)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              className="touch-active"
            >
              {isSaving ? (
                <div className="loader-white" />
              ) : saveSuccess ? (
                <>
                  <Check size={22} strokeWidth={3} /> Saqlandi
                </>
              ) : (
                <>Ma&apos;lumotlarni saqlash</>
              )}
            </button>
            <p
              style={{
                fontSize: "0.75rem",
                textAlign: "center",
                color: "var(--text-secondary)",
                padding: "16px 20px 0",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              O&apos;zgarishlar faqat sizning qurilmangizda saqlanadi.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderPreferences = () => (
    <div className="animate-slide-in-right">
      <button
        className="back-btn touch-active"
        onClick={() => setCurrentView("main")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          fontSize: "1rem",
          fontWeight: 800,
          color: "var(--text-secondary)",
          marginBottom: "20px",
          cursor: "pointer",
          padding: "0",
        }}
      >
        <ChevronLeft size={20} strokeWidth={3} />
        <span>{tAny.back}</span>
      </button>

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          color: "var(--text-main)",
          marginBottom: "24px",
        }}
      >
        {tAny.preferences}
      </h2>

      {/* Appearance Section */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 900,
            color: "#94a3b8",
            textTransform: "uppercase",
            marginBottom: "12px",
            marginLeft: "4px",
            letterSpacing: "0.5px",
          }}
        >
          {tAny.appearance || "Appearance"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Language Dropdown Card */}
          <button
            className="settings-item touch-active"
            onClick={() => setIsLangModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Globe size={20} strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                  }}
                >
                  {tAny.selectLang || "Language"}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {currentLang.name}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "28px",
                  height: "18px",
                  borderRadius: "4px",
                  overflow: "hidden",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Image
                  src={getFlagUrl(currentLang.country)}
                  alt={currentLang.name}
                  width={28}
                  height={18}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <ChevronRight
                size={18}
                color="#cbd5e1"
                strokeWidth={3}
                className={isRTL ? "rotate-180" : ""}
              />
            </div>
          </button>

          {/* Theme Toggle Card */}
          <button
            className="settings-item touch-active"
            onClick={() => setTheme(darkMode ? "light" : "dark")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                {darkMode ? (
                  <Moon size={20} strokeWidth={2.5} />
                ) : (
                  <Sun size={20} strokeWidth={2.5} />
                )}
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                  }}
                >
                  {t.themeTitle}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {darkMode ? t.darkModeLabel : t.lightModeLabel}
                </div>
              </div>
            </div>
            {darkMode ? (
              <div
                style={{
                  padding: "6px",
                  background: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "10px",
                }}
              >
                <Moon size={16} color="#3b82f6" strokeWidth={3} />
              </div>
            ) : (
              <div
                style={{
                  padding: "6px",
                  background: "rgba(245, 158, 11, 0.1)",
                  borderRadius: "10px",
                }}
              >
                <Sun size={16} color="#f59e0b" strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 900,
            color: "#94a3b8",
            textTransform: "uppercase",
            marginBottom: "12px",
            marginLeft: "4px",
            letterSpacing: "0.5px",
          }}
        >
          {tAny.security || "Security"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* PIN Code Card */}
          <button
            className="settings-item touch-active"
            onClick={() => {
              setIsSuccess(false);
              setSetupError(false);
              const savedPin = localStorage.getItem("finflow_pin");
              if (savedPin) {
                setPinStep("verify");
                setTempPin("");
                setIsPinModalOpen(true);
              } else {
                setPinStep("enter");
                setTempPin("");
                setIsPinModalOpen(true);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #10b981, #34d399)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 800,
                    color: "var(--text-main)",
                  }}
                >
                  {tAny.pinCodeTitle || "PIN Code"}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {tAny.pinCodeDesc || "Protect app with code"}
                </div>
              </div>
            </div>
            <div
              style={{
                width: "42px",
                height: "24px",
                background: pinCode ? "#10b981" : "var(--border)",
                borderRadius: "12px",
                position: "relative",
                transition: "all 0.3s",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  background: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "3px",
                  left: pinCode ? "21px" : "3px",
                  transition: "all 0.3s",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Account Section - Moved to Preferences for convenience */}
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            fontSize: "0.75rem",
            fontWeight: 900,
            color: "#94a3b8",
            textTransform: "uppercase",
            marginBottom: "12px",
            marginLeft: "4px",
            letterSpacing: "0.5px",
          }}
        >
          {tAny.account || "Account"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Clear Data Card */}
          <button
            className="settings-item touch-active"
            onClick={() => setConfirmationType("clear")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #64748b, #94a3b8)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <Trash2 size={20} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                }}
              >
                {tAny.clearData}
              </span>
            </div>
            <ChevronRight
              size={18}
              color="#cbd5e1"
              strokeWidth={3}
              className={isRTL ? "rotate-180" : ""}
            />
          </button>

          {/* Logout Card */}
          <button
            className="settings-item touch-active"
            onClick={() => setConfirmationType("logout")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              padding: "12px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "20px",
              boxShadow: "var(--shadow-sm)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  background: "linear-gradient(135deg, #ef4444, #f87171)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <LogOut size={20} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  color: "#ef4444",
                }}
              >
                {tAny.logout}
              </span>
            </div>
            <ChevronRight
              size={18}
              color="#cbd5e1"
              strokeWidth={3}
              className={isRTL ? "rotate-180" : ""}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="animate-slide-in-right">
      <button
        className="back-btn touch-active"
        onClick={() => setCurrentView("main")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          border: "none",
          background: "transparent",
          fontSize: "1rem",
          fontWeight: 800,
          color: "var(--text-secondary)",
          marginBottom: "20px",
          cursor: "pointer",
          padding: "0",
        }}
      >
        <ChevronLeft size={20} strokeWidth={3} />
        <span>{tAny.back}</span>
      </button>
      <h2 className="sub-page-title">{title}</h2>
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#94a3b8",
          background: "var(--surface)",
          borderRadius: "24px",
          border: "1px solid var(--border)",
        }}
      >
        Coming Soon...
      </div>
    </div>
  );

  return (
    <div className="profile-page animate-fade-in" dir={isRTL ? "rtl" : "ltr"}>
      {/* Banner Cover - Static & Reliable */}
      <div className="profile-banner">
        <h1 className="banner-title">{tAny.settings}</h1>

        {/* Decorative Circles */}
        <div className="banner-circle c1" />
        <div className="banner-circle c2" />

        <div className="banner-avatar-wrapper">
          <div className="banner-avatar-container">
            <div
              className="banner-avatar"
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: "50%",
                padding: "0",
                background: "var(--surface)",
                overflow: "hidden",
              }}
            >
              <div
                className="avatar-outer-circle"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  className="avatar-inner-circle"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user?.avatar ? (
                    <div className="avatar-img-container">
                      <Image
                        src={user.avatar}
                        alt="Avatar"
                        width={110}
                        height={110}
                        className="banner-avatar-img"
                        unoptimized
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          width: "110px",
                          height: "110px",
                          display: "block",
                        }}
                      />
                      <div className="avatar-hover-overlay">
                        <Camera size={26} color="#fff" />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="banner-avatar-placeholder"
                      style={{
                        width: "110px",
                        height: "110px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "var(--background)",
                        borderRadius: "50%",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {user?.avatar ? (
              <button
                className="delete-avatar-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto();
                }}
              >
                <Trash2 size={16} color="#fff" />
              </button>
            ) : (
              <div
                className="edit-badge"
                style={{ zIndex: 100 }}
                onClick={() => fileInputRef.current?.click()}
              >
                <Pencil size={14} color="#fff" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <main className="main-content-uz">
        {/* User Info - ALWAYS VISIBLE in MAIN VIEW */}
        {currentView === "main" && (
          <div className="user-info-section">
            <div className="name-wrapper">
              <h2 className="user-name">{user?.name}</h2>
            </div>
            <p className="user-email">{user?.phone || "finova@info.com"}</p>
          </div>
        )}

        {/* Dynamic Content */}
        {currentView === "main" && renderMainView()}
        {currentView === "account" && renderAccountSettings()}
        {currentView === "payment" && renderPlaceholder(tAny.paymentMethods)}
        {currentView === "preferences" && renderPreferences()}
        {currentView === "export" && renderPlaceholder(tAny.exportData)}

        <div className="footer-uz">Finova v3.5 • 2026</div>
      </main>

      {/* Language Selection Modal */}
      <BottomSheet
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title={tAny.selectLang || "Select Language"}
        showCloseIcon={true}
      >
        <div className="lang-grid-uz">
          {languages.map((l) => (
            <button
              key={l.code}
              className={`lang-card-uz touch-active ${language === l.code ? "selected" : ""}`}
              onClick={() => {
                setLanguage(l.code as Language);
                setIsLangModalOpen(false);
              }}
            >
              <div className="lang-card-content">
                <div className="lang-flag-wrapper">
                  <Image
                    src={getFlagUrl(l.country)}
                    alt={l.name}
                    width={44}
                    height={30}
                    style={{
                      width: "44px",
                      height: "30px",
                      objectFit: "cover",
                      borderRadius: "6px",
                    }}
                  />
                </div>
                <div className="lang-info">
                  <span className="lang-label">{l.name}</span>
                  <span className="lang-sub-label">{l.code.toUpperCase()}</span>
                </div>
              </div>
              {language === l.code && (
                <div className="lang-check">
                  <Check size={18} color="#fff" strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Confirmation Modal - NEW centered style */}
      <CenterModal
        isOpen={!!confirmationType}
        onClose={() => setConfirmationType(null)}
        title={confirmationType === "logout" ? tAny.logout : tAny.clearData}
      >
        <div className="confirm-content-minimal">
          <div
            className={`confirm-icon-bg ${confirmationType === "logout" ? "red" : "slate"}`}
            style={{ marginBottom: "16px" }}
          >
            {confirmationType === "logout" ? (
              <LogOut size={32} />
            ) : (
              <Trash2 size={32} />
            )}
          </div>

          <p className="confirm-desc-minimal">
            {confirmationType === "logout"
              ? tAny.confirmLogout || "Rostdan ham chiqmoqchimisiz?"
              : tAny.confirmClear ||
                "Rostdan ham barcha ma'lumotlarni o'chirib yubormoqchimisiz?"}
          </p>

          <div className="confirm-actions-vertical">
            <button
              className={`modal-action-btn ${confirmationType === "logout" ? "danger" : "primary"}`}
              onClick={() => {
                if (confirmationType === "logout") handleLogout();
                else {
                  clearAllData();
                  setConfirmationType(null);
                }
              }}
            >
              {confirmationType === "logout"
                ? tAny.confirmAction || "Ha, chiqish"
                : tAny.confirmClearBtn || "Tozalash"}
            </button>
            <button
              className="modal-cancel-btn"
              onClick={() => setConfirmationType(null)}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      </CenterModal>

      <AnimatePresence>
        {isPinModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "var(--background)",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              padding: "24px",
              paddingTop: "var(--safe-top, 40px)",
              touchAction: "none",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <button
                onClick={() => {
                  setIsPinModalOpen(false);
                  setTempPin("");
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--text-main)",
                  padding: "8px",
                }}
              >
                <X size={28} />
              </button>
              <h3
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 900,
                  color: "var(--text-main)",
                  margin: 0,
                }}
              >
                {pinStep === "verify" 
                  ? tAny.verifyPin || "PIN-kodni kiriting"
                  : pinStep === "enter"
                    ? tAny.setPinCode || "PIN-kod o'rnatish"
                    : tAny.confirmPin || "Kodni tasdiqlang"}
              </h3>
              <div style={{ width: "40px" }} /> {/* Spacer */}
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: "100%",
                maxHeight: "800px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <motion.div
                  animate={setupError ? { x: [-10, 10, -10, 10, 0] } : isSuccess ? { scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{
                    width: "75px",
                    height: "75px",
                    background: isSuccess
                      ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                      : setupError
                        ? "linear-gradient(135deg, #ef4444 0%, #f87171 100%)"
                        : "linear-gradient(135deg, #3b82f6 0%, #9061f9 100%)",
                    borderRadius: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    marginBottom: "20px",
                    boxShadow: isSuccess
                      ? "0 10px 25px rgba(16, 185, 129, 0.3)"
                      : setupError
                        ? "0 10px 25px rgba(239, 68, 68, 0.3)"
                        : "0 10px 25px rgba(59, 130, 246, 0.3)",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {isSuccess ? <ShieldCheck size={36} /> : <Lock size={36} />}
                </motion.div>

                <p
                  style={{
                    fontSize: "0.9rem",
                    color: isSuccess ? "#10b981" : setupError ? "#ef4444" : "var(--text-secondary)",
                    marginBottom: "32px",
                    textAlign: "center",
                    fontWeight: 700,
                    maxWidth: "280px",
                    opacity: 1,
                  }}
                >
                  {isSuccess 
                    ? (pinStep === "verify" ? (tAny.pinRemoved || "PIN-kod o'chirildi!") : (tAny.saveSuccess || "Muvaffaqiyatli saqlandi!"))
                    : setupError
                      ? (tAny.pinMismatch || "PIN-kodlar mos kelmadi. Qayta urinib ko'ring.")
                      : pinStep === "verify"
                        ? (tAny.enterCurrentPin || "PIN-kodni o'chirish uchun amaldagi kodni kiriting")
                        : pinStep === "enter"
                          ? (tAny.enterNewPin || "Ilovani himoya qilish uchun 4 xonali kod o'ylang")
                          : (tAny.confirmNewPin || "Tasdiqlash uchun kodni qayta kiriting")}
                </p>

                <div
                  style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                    key={i}
                    animate={tempPin.length >= i ? {
                      scale: [1, 1.3, 1],
                      backgroundColor: isSuccess ? "#10b981" : setupError ? "#ef4444" : "#3b82f6",
                      borderColor: isSuccess ? "#10b981" : setupError ? "#ef4444" : "#3b82f6",
                      boxShadow: isSuccess
                        ? "0 0 15px rgba(16, 185, 129, 0.4)"
                        : setupError
                          ? "0 0 15px rgba(239, 68, 68, 0.4)"
                          : "0 0 15px rgba(59, 130, 246, 0.4)"
                    } : {
                      scale: 1,
                      backgroundColor: "transparent",
                      borderColor: "var(--border)"
                    }}
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "2.5px solid var(--border)",
                      transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    }}
                  />
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  width: "100%",
                  maxWidth: "300px",
                  paddingBottom: "20px",
                }}
              >
                {[
                  { num: "1", letters: "" },
                  { num: "2", letters: "ABC" },
                  { num: "3", letters: "DEF" },
                  { num: "4", letters: "GHI" },
                  { num: "5", letters: "JKL" },
                  { num: "6", letters: "MNO" },
                  { num: "7", letters: "PQRS" },
                  { num: "8", letters: "TUV" },
                  { num: "9", letters: "WXYZ" },
                ].map((item) => (
                  <button
                    key={item.num}
                    onClick={() => {
                      if (setupError) setSetupError(false);
                      const newPin = tempPin + item.num;
                      if (newPin.length <= 4) setTempPin(newPin);
                      if (newPin.length === 4) {
                        if (pinStep === "enter") {
                          setTimeout(() => {
                            setFirstPin(newPin);
                            setTempPin("");
                            setPinStep("confirm");
                          }, 300);
                        } else if (pinStep === "verify") {
                          if (newPin === (pinCode || localStorage.getItem("finflow_pin"))) {
                            setIsSuccess(true);
                            setTimeout(() => {
                              setPinCode(null);
                              setIsPinModalOpen(false);
                              setTempPin("");
                              setIsSuccess(false);
                              setPinStep("enter");
                            }, 800);
                          } else {
                            setSetupError(true);
                            setTimeout(() => {
                              setTempPin("");
                              setSetupError(false);
                            }, 1000);
                          }
                        } else if (newPin === firstPin) {
                          setIsSuccess(true);
                          setTimeout(() => {
                            setPinCode(newPin);
                            setIsPinModalOpen(false);
                            setTempPin("");
                            setIsSuccess(false);
                          }, 800);
                        } else {
                          setSetupError(true);
                          setTimeout(() => {
                            setTempPin("");
                            setSetupError(false);
                          }, 1000);
                        }
                      }
                    }}
                    style={{
                      width: "76px",
                      height: "76px",
                      borderRadius: "50%",
                      border: "none",
                      background: "var(--bg-secondary)",
                      color: "var(--text-main)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      margin: "0 auto",
                      transition: "all 0.15s ease",
                    }}
                    className="pin-btn-simple"
                  >
                    {item.num}
                  </button>
                ))}
                <div />
                <button
                  onClick={() => {
                    if (setupError) setSetupError(false);
                    const newPin = tempPin + "0";
                    if (newPin.length <= 4) setTempPin(newPin);
                    if (newPin.length === 4) {
                      if (pinStep === "enter") {
                        setTimeout(() => {
                          setFirstPin(newPin);
                          setTempPin("");
                          setPinStep("confirm");
                        }, 300);
                      } else if (pinStep === "verify") {
                        if (newPin === (pinCode || localStorage.getItem("finflow_pin"))) {
                          setIsSuccess(true);
                          setTimeout(() => {
                            setPinCode(null);
                            setIsPinModalOpen(false);
                            setTempPin("");
                            setIsSuccess(false);
                            setPinStep("enter");
                          }, 800);
                        } else {
                          setSetupError(true);
                          setTimeout(() => {
                            setTempPin("");
                            setSetupError(false);
                          }, 1000);
                        }
                      } else if (newPin === firstPin) {
                        setIsSuccess(true);
                        setTimeout(() => {
                          setPinCode(newPin);
                          setIsPinModalOpen(false);
                          setTempPin("");
                          setIsSuccess(false);
                        }, 800);
                      } else {
                        setSetupError(true);
                        setTimeout(() => {
                          setTempPin("");
                          setSetupError(false);
                        }, 1000);
                      }
                    }
                  }}
                  style={{
                    width: "76px",
                    height: "76px",
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--bg-secondary)",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    margin: "0 auto",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="pin-btn-simple"
                >
                  0
                </button>
                <button
                  onClick={() => {
                    if (setupError) setSetupError(false);
                    setTempPin((prev) => prev.slice(0, -1));
                  }}
                  style={{
                    width: "76px",
                    height: "76px",
                    borderRadius: "50%",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-main)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    cursor: "pointer",
                  }}
                  className="touch-active"
                >
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                    <line x1="18" y1="9" x2="12" y2="15"></line>
                    <line x1="12" y1="9" x2="18" y2="15"></line>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .pin-btn-simple:active {
          transform: scale(0.92);
          background: var(--border) !important;
        }
        .touch-active:active {
          transform: scale(0.9);
          opacity: 0.5;
        }
        .profile-page {
          background: var(--background);
          min-height: 100vh;
          overflow-x: hidden;
          width: 100%;
        }

        .profile-banner {
          width: 100%;
          height: 170px;
          background: linear-gradient(
            135deg,
            #7c3aed 0%,
            #9061f9 100%,
            #6d28d9 100%
          );
          position: relative;
          padding-top: calc(var(--safe-top) + 40px);
          display: flex;
          flex-direction: column;
          align-items: center;
          border-bottom-left-radius: 40px;
          border-bottom-right-radius: 40px;
          box-shadow: 0 12px 30px -10px rgba(124, 58, 237, 0.35);
          overflow: visible;
          z-index: 10;
        }

        .banner-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.12);
          pointer-events: none;
        }
        .c1 {
          width: 280px;
          height: 280px;
          top: -100px;
          left: -100px;
        }
        .c2 {
          width: 200px;
          height: 200px;
          bottom: -40px;
          right: -40px;
        }

        .banner-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: white;
          text-align: center;
          z-index: 2;
          width: 100%;
          letter-spacing: -0.5px;
        }

        .banner-avatar-wrapper {
          position: absolute;
          bottom: -50px; /* Half of height to overlap */
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
        }

        .banner-avatar {
          width: 110px;
          height: 110px;
          border-radius: 9999px !important;
          border: 4px solid #9262f1;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(146, 98, 241, 0.4);
          position: relative;
          z-index: 20;
          overflow: hidden !important;
          -webkit-mask-image: -webkit-radial-gradient(
            white,
            black
          ); /* Fix for some webkit versions */
        }

        .avatar-circle {
          width: 100%;
          height: 100%;
          border-radius: 9999px !important;
          overflow: hidden !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .banner-avatar-img {
          width: 100% !important;
          height: 100% !important;
          border-radius: 9999px !important;
          object-fit: cover !important;
        }

        .banner-avatar-placeholder {
          font-size: 3rem;
          font-weight: 900;
          color: #3b82f6;
        }

        .edit-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #3b82f6;
          width: 34px;
          height: 34px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
          z-index: 30;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .banner-avatar-container {
          position: relative;
          display: inline-block;
        }

        .avatar-img-container {
          position: relative;
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
        }

        .avatar-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s ease;
          cursor: pointer;
        }

        .banner-avatar:hover .avatar-hover-overlay {
          opacity: 1;
        }

        .delete-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #ef4444;
          width: 34px;
          height: 34px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
          z-index: 40;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .delete-avatar-btn:active {
          transform: scale(0.9);
        }

        .main-content-uz {
          padding: 60px 20px 80px; /* Top padding acounts for avatar overlap */
        }

        .user-info-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
        }

        .name-wrapper {
          cursor: pointer;
        }

        .user-name {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--text-main);
          margin-bottom: 4px;
        }

        .name-edit-input {
          font-size: 1.6rem;
          font-weight: 850;
          color: var(--text-main);
          margin-bottom: 4px;
          text-align: center;
          border: none;
          border-bottom: 2px solid #3b82f6;
          outline: none;
          background: transparent;
          width: 80%;
        }

        .user-email {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* Menu Sections */
        .menu-sec {
          margin-bottom: 24px;
          width: 100%;
        }
        .sec-label {
          font-size: 0.75rem;
          font-weight: 850;
          color: #94a3b8;
          text-transform: uppercase;
          margin: 0 0 10px 16px;
          letter-spacing: 0.5px;
        }
        .sec-card {
          background: var(--surface);
          border-radius: 24px;
          padding: 6px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border);
        }
        .list-row {
          padding: 16px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          border: none;
          background: transparent;
          color: var(--text-main);
          transition: 0.2s;
        }
        .list-row:active {
          background: var(--background);
          transform: scale(0.99);
        }
        .row-start {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .row-label {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-main);
        }
        .row-end {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .current-lang-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .current-flag-wrapper {
          display: flex;
          border-radius: 6px;
          overflow: hidden;
          height: 20px;
          width: 28px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .val-uz {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-main);
          opacity: 1;
        }

        .icon-wrap-uz {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        .purple {
          background: linear-gradient(135deg, #3b82f6, #a855f7);
        }
        .blue {
          background: linear-gradient(135deg, #3b82f6, #60a5fa);
        }
        .slate {
          background: linear-gradient(135deg, #64748b, #94a3b8);
        }
        .red {
          background: linear-gradient(135deg, #ef4444, #f87171);
        }

        .hr-uz {
          height: 1px;
          background: var(--border);
          margin: 0 16px;
        }

        /* --- NEW SETTINGS UI --- */
        .settings-card-list-vertical {
          background: transparent;
          border-radius: 0;
          box-shadow: none;
          overflow: visible;
          display: flex;
          flex-direction: column !important;
          gap: 16px;
          padding: 0 4px;
          width: 100%;
        }

        .settings-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 20px 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: var(--shadow-sm);
        }

        .settings-item:active {
          transform: scale(0.98);
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        .item-icon-box {
          width: 56px;
          height: 56px;
          background: var(--background);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-label {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-main);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 24px;
          cursor: pointer;
          padding: 0;
        }

        .sub-page-title {
          font-size: 1.8rem;
          font-weight: 900;
          margin-bottom: 24px;
          color: var(--text-main);
        }

        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        /* Dark Mode Support for New UI */
        :global(.dark) .settings-card-list-vertical {
          background: transparent;
          box-shadow: none;
        }
        :global(.dark) .settings-item {
          background: #1e293b;
          border-color: rgba(255, 255, 255, 0.05);
        }
        :global(.dark) .settings-item:active {
          background: #334155;
        }
        :global(.dark) .item-icon-box {
          background: #334155;
        }
        :global(.dark) .item-icon-box svg {
          color: #cbd5e1;
          stroke: #cbd5e1;
        }
        :global(.dark) .item-label {
          color: #fff;
        }
        :global(.dark) .back-btn {
          color: #fff;
        }
        :global(.dark) .back-btn span {
          color: #fff;
        }
        :global(.dark) .back-btn svg {
          color: #fff;
          stroke: #fff;
        }
        :global(.dark) .sub-page-title {
          color: #fff;
        }
        .footer-uz {
          text-align: center;
          padding: 24px 0;
          opacity: 0.35;
          font-size: 0.8rem;
          font-weight: 800;
        }

        /* Modals & Bottom Sheet */
        .modal-ov {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          z-index: 20000;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .bottom-sheet {
          background: var(--surface);
          width: 100%;
          max-width: 480px;
          border-radius: 32px 32px 0 0;
          padding: 24px;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.1);
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          max-height: 85vh;
          display: flex;
          flex-direction: column;
        }
        .sheet-handle {
          width: 40px;
          height: 4px;
          background: var(--border);
          border-radius: 2px;
          margin: 0 auto 20px;
        }
        .sheet-title {
          font-size: 1.25rem;
          font-weight: 800;
          text-align: center;
          margin: 0 0 24px;
          color: var(--text-main);
        }

        .lang-grid-uz {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          padding-bottom: 24px;
        }
        .lang-card-uz {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-radius: 24px;
          background: var(--surface);
          border: 1px solid var(--border);
          width: 100%;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
        }
        .lang-card-uz.selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.03);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
        }
        .lang-card-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .lang-flag-wrapper {
          width: 44px;
          height: 30px;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }
        .lang-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1px;
        }
        .lang-label {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .lang-sub-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-secondary);
          opacity: 0.6;
          letter-spacing: 0.5px;
        }
        .lang-check {
          width: 28px;
          height: 28px;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .confirm-icon-bg {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          color: white;
        }
        .confirm-icon-bg.red {
          background: linear-gradient(135deg, #ef4444, #f87171);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
        }
        .confirm-icon-bg.slate {
          background: linear-gradient(135deg, #64748b, #94a3b8);
          box-shadow: 0 8px 20px rgba(100, 116, 139, 0.2);
        }

        .confirm-content-minimal {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 20px;
          padding-bottom: 8px;
        }
        .confirm-desc-minimal {
          font-size: 1.05rem;
          font-weight: 600;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }
        .confirm-actions-vertical {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .modal-action-btn {
          width: 100%;
          padding: 16px;
          border-radius: 20px;
          font-size: 1.05rem;
          font-weight: 850;
          border: none;
          transition: 0.2s;
          color: white;
          cursor: pointer;
        }
        .modal-action-btn.primary {
          background: #3b82f6;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }
        .modal-action-btn.danger {
          background: var(--danger);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
        }
        .modal-cancel-btn {
          width: 100%;
          padding: 14px;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          background: var(--background);
          color: var(--text-secondary);
          cursor: pointer;
        }
        .modal-action-btn:active,
        .modal-cancel-btn:active {
          transform: scale(0.97);
          opacity: 0.9;
        }

        .touch-active {
          transition: transform 0.1s;
        }
        .touch-active:active {
          transform: scale(0.96);
          opacity: 0.8;
        }
        .num-btn-premium {
          transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          border: 1px solid var(--border);
        }
        .num-btn-premium:active {
          transform: scale(0.9);
          background: #3b82f6 !important;
          border-color: #3b82f6 !important;
          color: #fff !important;
          box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
        }
        .num-btn-premium:active span {
          color: #fff !important;
        }
        @keyframes zoom-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        /* Dark Mode */
        :global(.dark) .profile-page {
          background: #0f172a;
        }
        :global(.dark) .profile-banner {
          background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
        }
        :global(.dark) .banner-avatar {
          background: #1e293b;
          border-color: #1e293b;
        }
        :global(.dark) .user-name {
          color: white;
        }
        :global(.dark) .name-edit-input {
          color: white;
        }
        :global(.dark) .user-email {
          color: #94a3b8;
        }

        :global(.dark) .sec-card {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        :global(.dark) .list-row {
          color: #f8fafc;
        }
        :global(.dark) .row-label {
          color: #f8fafc;
        }
        :global(.dark) .val-uz {
          color: white;
        }
        :global(.dark) .hr-uz {
          background: rgba(255, 255, 255, 0.05);
        }

        :global(.dark) .modal-ov {
          background: rgba(0, 0, 0, 0.7);
        }
        :global(.dark) .bottom-sheet {
          background: #1e293b;
          border-bottom: none;
        }
        :global(.dark) .sheet-title {
          color: white;
        }
        :global(.dark) .sheet-handle {
          background: rgba(255, 255, 255, 0.1);
        }
        :global(.dark) .lang-card-uz {
          background: #334155;
        }
        :global(.dark) .lang-label {
          color: white;
        }
        :global(.dark) .lang-card-uz.selected {
          background: rgba(59, 130, 246, 0.1);
          border-color: #3b82f6;
        }
        :global(.dark) .confirm-desc-minimal {
          color: #94a3b8;
        }
        :global(.dark) .modal-cancel-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
        }
        .loader-white {
          width: 22px;
          height: 22px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
