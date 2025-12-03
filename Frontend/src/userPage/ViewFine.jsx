import React, { useState, useEffect } from "react";
import { getUserFine } from "../services/api";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ViewFine() {
  const { t } = useTranslation();
  const userId = localStorage.getItem("id");
  const [fine, setFine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFine = async () => {
      try {
        const res = await getUserFine();
        setFine(res.data);
      } catch (error) {
        console.error("Failed to fetch fine details:", error);
        alert(t("fine.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchFine();
  }, [userId, t]);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-blue-700">
          {t("fine.title")}
        </h2>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8 text-center">
        {loading ? (
          <p className="text-gray-500">{t("fine.loading")}</p>
        ) : fine ? (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-6 inline-block text-left shadow-inner transition-all duration-300">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              {t("fine.details")}
            </h3>
            <p className="text-gray-700 mb-1">
              <strong>{t("fine.amountLabel")}</strong>{" "}
              <span className="text-blue-600 font-medium">
                ₹{fine.fine || "0"}
              </span>
            </p>
            <p
              className={`text-sm font-semibold ${
                fine.fine > 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              {t(fine.fine > 0 ? "fine.pending" : "fine.noDues")}
            </p>
          </div>
        ) : (
          <p className="text-gray-600">{t("fine.noDetails")}</p>
        )}
      </div>
    </div>
  );
}
