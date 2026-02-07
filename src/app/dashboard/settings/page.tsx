"use client";
import React, { useState, useRef, ChangeEvent } from "react";
import { useFinance, Language } from "@/context/FinanceContext";
import {
  Sun,
  Moon,
  Trash2,
  LogOut,
  ChevronRight,
  Palette,
  Globe,
  Check,
  Camera,
  Pencil,
  User,
  Wallet,
  SlidersHorizontal,
  FileText,
  ChevronLeft
} from "lucide-react";
import Image from "next/image";
import BottomSheet from "@/components/BottomSheet";
import CenterModal from "@/components/CenterModal";

type SettingsView = 'main' | 'account' | 'payment' | 'preferences' | 'export';

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
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  /* --- RENDERERS --- */
  const renderMainView = () => (
    <div className="animate-slide-up">
       {/* List Menu */}
       <div className="settings-list-card">
          {/* Account Settings */}
          <button className="settings-item touch-active" onClick={() => setCurrentView('account')}>
             <div className="item-left">
                <div className="item-icon-box">
                   <User size={22} color="#1e293b" />
                </div>
                <span className="item-label">Account Settings</span>
             </div>
             <ChevronRight size={20} color="#cbd5e1" />
          </button>

          {/* Payment Methods */}
          <button className="settings-item touch-active" onClick={() => setCurrentView('payment')}>
             <div className="item-left">
                <div className="item-icon-box">
                   <Wallet size={22} color="#1e293b" />
                </div>
                <span className="item-label">Payment Methods</span>
             </div>
             <ChevronRight size={20} color="#cbd5e1" />
          </button>

          {/* Preferences */}
          <button className="settings-item touch-active" onClick={() => setCurrentView('preferences')}>
             <div className="item-left">
                <div className="item-icon-box">
                   <SlidersHorizontal size={22} color="#1e293b" />
                </div>
                <span className="item-label">Preferences</span>
             </div>
             <ChevronRight size={20} color="#cbd5e1" />
          </button>

          {/* Export Data */}
          <button className="settings-item touch-active" onClick={() => setCurrentView('export')}>
             <div className="item-left">
                <div className="item-icon-box">
                   <FileText size={22} color="#1e293b" />
                </div>
                <span className="item-label">Export Data</span>
             </div>
             <ChevronRight size={20} color="#cbd5e1" />
          </button>
       </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="animate-slide-in-right">
       <button className="back-btn touch-active" onClick={() => setCurrentView('main')}>
          <ChevronLeft size={24} color="#1e293b" />
          <span>Back</span>
       </button>

       <h2 className="sub-page-title">Account Settings</h2>

       <div className="menu-sec">
          <div className="sec-label">{tAny.appearance || "Appearance"}</div>
          <div className="sec-card">
            {/* Language Selector Row */}
            <button
              className="list-row touch-active"
              onClick={() => setIsLangModalOpen(true)}
            >
              <div className="row-start">
                <div className="icon-wrap-uz blue">
                  <Globe size={18} />
                </div>
                <span className="row-label">
                  {tAny.langTitle || "Language"}
                </span>
              </div>
              <div className="row-end">
                <div className="current-lang-wrap">
                  <span className="current-flag-wrapper">
                    <Image
                      src={getFlagUrl(currentLang.country)}
                      alt={currentLang.name}
                      width={40}
                      height={28}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </span>
                  <span className="val-uz">{currentLang.name}</span>
                </div>
                <ChevronRight
                  size={16}
                  opacity={0.3}
                  className={isRTL ? "rotate-180" : ""}
                />
              </div>
            </button>

            <div className="hr-uz" />

            {/* Theme Toggle */}
            <div
              className="list-row touch-active"
              onClick={() => setTheme(darkMode ? "light" : "dark")}
            >
              <div className="row-start">
                <div className="icon-wrap-uz purple">
                  <Palette size={18} />
                </div>
                <span className="row-label">{t.themeTitle}</span>
              </div>
              <div className="row-end">
                <span className="val-uz">
                  {darkMode ? t.darkModeLabel : t.lightModeLabel}
                </span>
                {darkMode ? (
                  <Moon size={16} color="#8b5cf6" />
                ) : (
                  <Sun size={16} color="#f59e0b" />
                )}
              </div>
            </div>
          </div>
       </div>

       <div className="menu-sec">
          <div className="sec-label">{tAny.account || "Account"}</div>
          <div className="sec-card">
            <button
              className="list-row touch-active"
              onClick={() => setConfirmationType("clear")}
            >
              <div className="row-start">
                <div className="icon-wrap-uz slate">
                  <Trash2 size={18} />
                </div>
                <span className="row-label">{tAny.clearData}</span>
              </div>
              <ChevronRight
                size={16}
                opacity={0.3}
                className={isRTL ? "rotate-180" : ""}
              />
            </button>

            <div className="hr-uz" />

            <button
              className="list-row touch-active danger"
              onClick={() => setConfirmationType("logout")}
            >
              <div className="row-start">
                <div className="icon-wrap-uz red">
                  <LogOut size={18} />
                </div>
                <span className="row-label" style={{ color: "#ef4444" }}>
                  {tAny.logout}
                </span>
              </div>
              <ChevronRight
                size={16}
                opacity={0.3}
                className={isRTL ? "rotate-180" : ""}
              />
            </button>
          </div>
       </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="animate-slide-in-right">
       <button className="back-btn touch-active" onClick={() => setCurrentView('main')}>
          <ChevronLeft size={24} color="#1e293b" />
          <span>Back</span>
       </button>
       <h2 className="sub-page-title">{title}</h2>
       <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
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
              className="banner-avatar touch-active"
              onClick={() => fileInputRef.current?.click()}
              style={{
                borderRadius: "50%",
                padding: "0",
                background: "#fff",
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
                        background: "#f3f4f6",
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
                className="edit-badge touch-active" 
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
        {currentView === 'main' && (
          <div className="user-info-section">
            {isEditingName ? (
              <input
                className="name-edit-input"
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
                onBlur={handleSaveName}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                placeholder={tAny.firstName || "Name"}
              />
            ) : (
              <div
                className="name-wrapper"
                onClick={() => setIsEditingName(true)}
              >
                <h2 className="user-name">{user?.name}</h2>
              </div>
            )}
            <p className="user-email">{user?.phone || "finova@info.com"}</p>
          </div>
        )}

        {/* Dynamic Content */}
        {currentView === 'main' && renderMainView()}
        {currentView === 'account' && renderAccountSettings()}
        {currentView === 'payment' && renderPlaceholder('Payment Methods')}
        {currentView === 'preferences' && renderPlaceholder('Preferences')}
        {currentView === 'export' && renderPlaceholder('Export Data')}

        <div className="footer-uz">Finova v3.5 • 2026</div>
      </main>

      {/* Language Selection Modal */}
      <BottomSheet
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title={tAny.selectLang || "Select Language"}
        showCloseIcon={true}
      >
        <div className="lang-list-scroll">
          {languages.map((l) => (
            <button
              key={l.code}
              className={`lang-item touch-active ${language === l.code ? "selected" : ""}`}
              onClick={() => {
                setLanguage(l.code as Language);
                setIsLangModalOpen(false);
              }}
            >
              <div className="lang-left">
                <span className="lang-flag">
                  <Image
                    src={getFlagUrl(l.country)}
                    alt={l.name}
                    width={48}
                    height={32}
                    style={{
                      width: "48px",
                      height: "32px",
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  />
                </span>
                <span className="lang-name">{l.name}</span>
              </div>
              {language === l.code && <Check size={20} color="#7000ff" />}
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

      <style jsx>{`
        .profile-page {
          background: #f4f6f9;
          min-height: 100vh;
          padding-bottom: 50px;
          overflow-x: hidden;
          width: 100%;
        }

        .profile-page {
          background: #f4f6f9;
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
          border: 4px solid #10b981;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);
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
          color: #7000ff;
        }



        .edit-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: #7000ff;
          width: 34px;
          height: 34px;
          border-radius: 50% !important;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(112, 0, 255, 0.25);
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
          color: #0f172a;
          margin-bottom: 4px;
        }

        .name-edit-input {
          font-size: 1.6rem;
          font-weight: 850;
          color: #0f172a;
          margin-bottom: 4px;
          text-align: center;
          border: none;
          border-bottom: 2px solid #7000ff;
          outline: none;
          background: transparent;
          width: 80%;
        }

        .user-email {
          font-size: 0.9rem;
          color: #64748b;
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
          background: white;
          border-radius: 24px;
          padding: 6px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
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
          color: #1e293b;
          transition: 0.2s;
        }
        .list-row:active {
          background: #f8fafc;
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
          color: #1e293b;
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
          color: #0f172a;
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
          background: linear-gradient(135deg, #7000ff, #a855f7);
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
          background: #f1f5f9;
          margin: 0 16px;
        }

        /* --- NEW SETTINGS UI --- */
        .settings-list-card {
           background: #fff;
           border-radius: 20px;
           box-shadow: 0 4px 20px rgba(0,0,0,0.02);
           overflow: hidden;
           display: flex;
           flex-direction: column !important;
           gap: 12px;
           padding: 12px;
           width: 100%;
        }

        .settings-item {
           display: flex;
           align-items: center;
           justify-content: space-between;
           width: 100%;
           padding: 16px;
           background: #fff;
           border: 1px solid #f1f5f9;
           border-radius: 16px;
           cursor: pointer;
           transition: all 0.2s;
        }
        
        .settings-item:active {
           transform: scale(0.98);
           background: #f8fafc;
        }

        .item-left {
           display: flex;
           align-items: center;
           gap: 16px;
        }

        .item-icon-box {
           width: 48px;
           height: 48px;
           background: #f1f5f9;
           border-radius: 14px;
           display: flex;
           align-items: center;
           justify-content: center;
        }

        .item-label {
           font-size: 1rem;
           font-weight: 700;
           color: #0f172a;
        }

        .back-btn {
           display: flex;
           align-items: center;
           gap: 8px;
           border: none;
           background: transparent;
           font-size: 1.1rem;
           font-weight: 700;
           color: #1e293b;
           margin-bottom: 24px;
           cursor: pointer;
           padding: 0;
        }

        .sub-page-title {
           font-size: 1.8rem;
           font-weight: 900;
           margin-bottom: 24px;
           color: #0f172a;
        }

        .animate-slide-up {
           animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-slide-in-right {
           animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInRight {
           from { opacity: 0; transform: translateX(20px); }
           to { opacity: 1; transform: translateX(0); }
        }
        /* Dark Mode Support for New UI */
        :global(.dark) .settings-list-card {
           background: #1e293b;
           box-shadow: 0 4px 20px rgba(0,0,0,0.2);
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
          background: white;
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
          background: #e2e8f0;
          border-radius: 2px;
          margin: 0 auto 20px;
        }
        .sheet-title {
          font-size: 1.25rem;
          font-weight: 800;
          text-align: center;
          margin: 0 0 24px;
          color: #0f172a;
        }

        .lang-list-scroll {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-bottom: 20px;
        }
        .lang-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: 20px;
          background: #f8fafc;
          border: 1px solid transparent;
          width: 100%;
          transition: 0.2s;
        }
        .lang-item.selected {
          background: #f5f3ff;
          border-color: rgba(112, 0, 255, 0.2);
        }
        .lang-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .lang-flag {
          display: flex;
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-right: 4px;
        }
        .lang-name {
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
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
          background: #7000ff;
          box-shadow: 0 8px 20px rgba(112, 0, 255, 0.2);
        }
        .modal-action-btn.danger {
          background: #ef4444;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
        }
        .modal-cancel-btn {
          width: 100%;
          padding: 14px;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          background: #f1f5f9;
          color: #64748b;
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
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
        :global(.dark) .lang-item {
          background: #334155;
        }
        :global(.dark) .lang-name {
          color: white;
        }
        :global(.dark) .lang-item.selected {
          background: rgba(112, 0, 255, 0.15);
          border-color: rgba(112, 0, 255, 0.3);
        }
        :global(.dark) .confirm-desc-minimal {
          color: #94a3b8;
        }
        :global(.dark) .modal-cancel-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
}
