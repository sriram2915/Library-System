import React, { useState, useEffect, useCallback } from "react";
import { getBookLike } from "../services/api";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchBookLike() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getBookLike(query);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(delay);
  }, [handleSearch]);

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Search size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("searchBookLike.title")}
        </h2>
      </div>

      {/* Search Box */}
      <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-md mb-8">
        <input
          type="text"
          placeholder={t("searchBookLike.placeholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 w-full rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        {loading && (
          <p className="text-blue-600 text-sm mt-2 animate-pulse">
            {t("searchBookLike.searching")}
          </p>
        )}
      </div>

      {/* Results Table */}
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-blue-100 bg-white rounded-xl shadow-md">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">{t("searchBookLike.table.id")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.name")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.author")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.category")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.year")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.row")}</th>
                <th className="p-3 text-left">{t("searchBookLike.table.copies")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((b, i) => (
                <tr
                  key={i}
                  className="border-t border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium text-gray-800">{b.bookName}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.category}</td>
                  <td className="p-3">{b.publicationYear}</td>
                  <td className="p-3">{b.row}</td>
                  <td className="p-3">{b.noOfCopies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        query &&
        !loading && (
          <p className="text-gray-600 text-center mt-6 italic">
            {t("searchBookLike.noResults", { query })}
          </p>
        )
      )}
    </div>
  );
}
