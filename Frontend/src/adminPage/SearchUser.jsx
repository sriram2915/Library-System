import React, { useState } from "react";
import { searchUserById } from "../services/api";
import { Search, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchUser() {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!id.trim()) {
      alert(t("searchUser.alertEnterId"));
      return;
    }

    setLoading(true);
    setUser(null);
    try {
      const res = await searchUserById(id);
      setUser(res.data);
    } catch (err) {
      alert(t("searchUser.userNotFound"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <User size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("searchUser.title")}
        </h2>
      </div>

      {/* Search Box */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white border border-blue-100 p-5 rounded-xl shadow-md">
        <input
          type="number"
          placeholder={t("searchUser.placeholder")}
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="p-3 rounded-lg border border-blue-200 flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          <Search size={18} />
          {loading ? t("searchUser.searching") : t("searchUser.search")}
        </button>
      </div>

      {/* Result Card */}
      {user && (
        <div className="bg-white border border-blue-100 rounded-xl shadow-md p-6 text-gray-800 max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
            <User size={22} className="text-blue-600" />
            {t("searchUser.detailsTitle")}
          </h3>
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-blue-700">{t("searchUser.fields.id")}:</span>{" "}
              {user.userId}
            </p>
            <p>
              <span className="font-semibold text-blue-700">{t("searchUser.fields.name")}:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className="font-semibold text-blue-700">{t("searchUser.fields.phone")}:</span>{" "}
              {user.phoneNumber}
            </p>
            <p>
              <span className="font-semibold text-blue-700">{t("searchUser.fields.fine")}:</span>{" "}
              ₹{user.fine || 0}
            </p>
          </div>
        </div>
      )}

      {!user && !loading && (
        <p className="text-gray-500 text-center italic mt-4">
          {t("searchUser.hint")}
        </p>
      )}
    </div>
  );
}
