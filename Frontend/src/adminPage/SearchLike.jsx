import React, { useState, useEffect } from "react";
import { getUserLike } from "../services/api";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchLike() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await getUserLike(query);
        setResults(res.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("searchUserLike.title")}
        </h2>
      </div>

      {/* Search Box */}
      <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-md mb-8">
        <input
          type="text"
          placeholder={t("searchUserLike.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {loading && (
          <p className="text-blue-600 text-sm mt-2 animate-pulse">
            {t("searchUserLike.searching")}
          </p>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-100 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.userId")}
                </th>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.name")}
                </th>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.phone")}
                </th>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.fine")}
                </th>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.available")}
                </th>
                <th className="p-3 text-left">
                  {t("searchUserLike.table.borowed")}
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map((u, i) => (
                <tr
                  key={i}
                  className="border-t border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-3">{u.userId}</td>
                  <td className="p-3 font-medium text-gray-800">{u.name}</td>
                  <td className="p-3">{u.phoneNumber}</td>
                  <td className="p-3">{u.fine}</td>
                  <td className="p-3">{u.bookGet}</td>
                  <td className="p-3">{u.bookHave}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        query &&
        !loading && (
          <p className="text-gray-600 text-center mt-6 italic">
            {t("searchUserLike.noResults", { query })}
          </p>
        )
      )}
    </div>
  );
}
