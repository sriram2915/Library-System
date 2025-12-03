import React, { useState } from "react";
import {
  getBookByCategory,
  getBookById,
  getBookByName,
  getBookByYear,
} from "../services/api";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SearchBook() {
  const { t } = useTranslation();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [year, setYear] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (type) => {
    try {
      let res;
      if (type === "id" && id) res = await getBookById(id);
      else if (type === "name" && name) res = await getBookByName(name);
      else if (type === "category" && category)
        res = await getBookByCategory(category);
      else if (type === "year" && year) res = await getBookByYear(year);
      else {
        alert(t("searchBook.alertEnterValue"));
        return;
      }

      const data = Array.isArray(res.data) ? res.data : [res.data];
      setResults(data);
      setId("");
      setName("");
      setCategory("");
      setYear("");
    } catch (err) {
      console.error("Search failed", err);
      alert(t("searchBook.alertFailed"));
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Search size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("searchBook.title")}
        </h2>
      </div>

      {/* Search Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("searchBook.fields.id"), value: id, setter: setId, type: "number", key: "id" },
          { label: t("searchBook.fields.name"), value: name, setter: setName, type: "text", key: "name" },
          { label: t("searchBook.fields.category"), value: category, setter: setCategory, type: "text", key: "category" },
          { label: t("searchBook.fields.year"), value: year, setter: setYear, type: "number", key: "year" },
        ].map((field) => (
          <div
            key={field.key}
            className="flex items-center gap-2 bg-white border border-blue-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <input
              type={field.type}
              placeholder={field.label}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              className="p-2 rounded-md border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none flex-1"
            />
            <button
              onClick={() => handleSearch(field.key)}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {t("searchBook.button")}
            </button>
          </div>
        ))}
      </div>

      {/* Results Table */}
      {results.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white border border-blue-100 rounded-xl shadow-md text-gray-800">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-3 text-left">{t("searchBook.table.id")}</th>
                <th className="p-3 text-left">{t("searchBook.table.name")}</th>
                <th className="p-3 text-left">{t("searchBook.table.author")}</th>
                <th className="p-3 text-left">{t("searchBook.table.category")}</th>
                <th className="p-3 text-left">{t("searchBook.table.year")}</th>
              </tr>
            </thead>
            <tbody>
              {results.map((b, i) => (
                <tr
                  key={i}
                  className="border-t border-blue-100 hover:bg-blue-50 transition"
                >
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium">{b.bookName}</td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.category}</td>
                  <td className="p-3">{b.publicationYear}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 italic">
          {t("searchBook.noResults")}
        </p>
      )}
    </div>
  );
}
