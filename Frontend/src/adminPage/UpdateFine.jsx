import React, { useState } from "react";
import { updateUserFineAdmin } from "../services/api";
import { Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UpdateFine() {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
  if (!id.trim()) {
    setResult({ status: "invalid", msg: t("userFine.invalidId") });
    return;
  }
  setLoading(true);
  try {
    const res = await updateUserFineAdmin(id, amount);

    setResult({
      status: res.status,   
      data: res.data,    
      msg: t("userFine.success"),
    });

  } catch (err) {
    setResult({
      status: err.response?.status || 500,
      msg: t("userFine.fetchError"),
      data: null,
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Wallet size={28} className="text-blue-700" />
          <h2 className="text-2xl font-semibold text-blue-800">
            💰 {t("userFine.payFine")}
          </h2>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border border-blue-100 rounded-xl p-6 shadow-md text-gray-800">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="number"
            placeholder={t("userFine.placeholder")}
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="p-3 rounded-md border border-blue-200 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="number"
            placeholder={t("userFine.placeholder_amount")}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-3 rounded-md border border-blue-200 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`${
              loading ? "bg-yellow-400" : "bg-yellow-500 hover:bg-yellow-600"
            } text-white px-6 py-2 rounded-md transition shadow-md`}
          >
            {loading ? t("userFine.fetching") : t("userFine.findFinebutton")}
          </button>
        </div>

        {/* Result Section */}
    {result && (
        <div className="mt-6 bg-blue-50 border border-blue-100 p-5 rounded-lg shadow-inner text-gray-800">
        {result.status !== 200 && (
        <p className="text-red-600 text-lg font-semibold">
            {result.msg}
        </p>
        )}
        {result.data === "" && (
        <p className="text-red-600 text-lg font-semibold">
            {t("userFine.userNotFound")}
        </p>
        )}
        {result.status === 200 && result.data && (
        <>
            <p className="mb-2 text-lg">
            <b>{t("userFine.userId")}:</b>{" "}
            <span className="text-blue-800">{id}</span>
            </p>
            <p className="text-green-600 font-semibold mt-2">
            {result.msg}
            </p>
        </>
        )}
        </div>
    )}

      </div>
    </div>
  );
}
