import React, { useState } from "react";
import {
  getBookById,
  getBookByName,
  getBookByCategory,
} from "../services/api";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchBook() {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (type) => {
    try {
      let res;
      if (type === "id" && id) {
        res = await getBookById(id);
      } else if (type === "name" && name) {
        res = await getBookByName(name);
      } else if (type === "category" && category) {
        res = await getBookByCategory(category);
      } else {
        alert(t("search.enterValue"));
        return;
      }

      const data = Array.isArray(res.data) ? res.data : [res.data];
      setResults(data);
    } catch (err) {
      console.error("Search failed", err);
      alert(t("search.fail"));
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-blue-700">
          {t("search.title")}
        </h2>
      </div>

      {/* Search Fields Section */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search by ID */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              {t("search.byId")}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={t("search.placeholder.id")}
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                onClick={() => handleSearch("id")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {t("search.button")}
              </button>
            </div>
          </div>

          {/* Search by Name */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              {t("search.byName")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("search.placeholder.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                onClick={() => handleSearch("name")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {t("search.button")}
              </button>
            </div>
          </div>

          {/* Search by Category */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 font-medium">
              {t("search.byCategory")}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("search.placeholder.category")}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 rounded-lg border border-gray-300 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <button
                onClick={() => handleSearch("category")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                {t("search.button")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 sm:p-8">
        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white text-gray-800 rounded-lg">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="p-3 text-left">{t("search.columns.id")}</th>
                  <th className="p-3 text-left">{t("search.columns.name")}</th>
                  <th className="p-3 text-left">{t("search.columns.author")}</th>
                  <th className="p-3 text-left">{t("search.columns.category")}</th>
                  <th className="p-3 text-left">{t("search.columns.year")}</th>
                </tr>
              </thead>
              <tbody>
                {results.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-blue-50 hover:bg-blue-50 transition-all"
                  >
                    <td className="p-3">{b.id}</td>
                    <td className="p-3 font-medium text-gray-900">
                      {b.bookName}
                    </td>
                    <td className="p-3">{b.author}</td>
                    <td className="p-3">{b.category}</td>
                    <td className="p-3">{b.publicationYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            {t("search.noResults")}
          </p>
        )}
      </div>
    </div>
  );
}
