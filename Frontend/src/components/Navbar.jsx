import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="w-full backdrop-blur-lg bg-blue-600/80 text-white py-4 px-8 flex justify-between items-center shadow-lg border-b border-white/20">
      <Link
        to="/"
        className="text-2xl font-bold tracking-wide hover:text-yellow-200 transition-all"
      >
        {t("📚 Central Library")}
      </Link>

      <div className="flex items-center gap-4">
        <select
          onChange={(e) => handleLanguageChange(e.target.value)}
          value={i18n.language}
          className="bg-blue-700 text-white px-2 py-1 rounded border border-white/20"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>

        {!token ? (
          <>
            <Link
              to="/login"
              className="hover:underline hover:text-yellow-200 transition"
            >
              {t("login")}
            </Link>
            <Link
              to="/signup"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              {t("signup")}
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col text-right leading-tight">
              <span className="font-semibold">{username}</span>
              <span className="text-sm text-gray-200 capitalize">{role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition-all"
            >
              <LogOut size={18} />
              {t("logout")}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
