import React, { useState } from "react";
import { borrowBook } from "../services/api";
import { ArrowDownCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BorrowBook() {
  const { t } = useTranslation();
  const [bookId, setBookId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    if (!bookId) {
      alert(t("borrowBook_.enterValidId"));
      return;
    }

    try {
      setLoading(true);
      const res = await borrowBook(bookId);
      alert(res.data.message);
      setBookId("");
    } catch {
      alert(t("borrowBook_.borrowFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowDownCircle className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-blue-700">
          {t("borrowBook_.title")}
        </h2>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8 max-w-xl mx-auto">
        <p className="text-gray-600 mb-4 text-sm sm:text-base">
          {t("borrowBook_.instruction1")}{" "}
          <span className="font-medium text-blue-700">{t("borrowBook_.bookId")}</span>{" "}
          {t("borrowBook_.instruction2")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <input
            type="number"
            placeholder={t("borrowBook_.placeholder")}
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleBorrow}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition-all duration-300 ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? t("borrowBook_.processing") : t("borrowBook_.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
