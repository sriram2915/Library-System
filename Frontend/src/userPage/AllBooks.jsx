import React, { useEffect, useState, useCallback } from "react";
import { getAllBooks } from "../services/api";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AllBooks() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);

  // const fetchBooks = async () => {
  //   try {
  //     const res = await getAllBooks();
  //     setBooks(res.data);
  //   } catch (error) {
  //     alert(t("allBooks.loadError"));
  //     console.error(error);
  //   }
  // };

  const fetchBooks = useCallback(async () => {
    try {
      const res = await getAllBooks();
      setBooks(res.data);
    } catch (error) {
      alert(t("allBooks.loadError"));
      console.error(error);
    }
  }, [t])

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-blue-600" size={28} />
        <h2 className="text-2xl font-semibold text-blue-700">
          {t("allBooks.title")}
        </h2>
      </div>

      {/* Table Container */}
      {books.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-blue-100 shadow-md bg-white">
          <table className="w-full text-sm sm:text-base text-left text-gray-700">
            <thead className="bg-blue-600 text-white uppercase text-sm">
              <tr>
                <th className="py-3 px-4">{t("allBooks.columns.id")}</th>
                <th className="py-3 px-4">{t("allBooks.columns.bookName")}</th>
                <th className="py-3 px-4">{t("allBooks.columns.author")}</th>
                <th className="py-3 px-4">{t("allBooks.columns.category")}</th>
                <th className="py-3 px-4">{t("allBooks.columns.year")}</th>
                <th className="py-3 px-4">{t("allBooks.columns.copy")}</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, index) => (
                <tr
                  key={b.id}
                  className={`hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{b.id}</td>
                  <td className="py-3 px-4">{b.bookName}</td>
                  <td className="py-3 px-4">{b.author}</td>
                  <td className="py-3 px-4">{b.category}</td>
                  <td className="py-3 px-4">{b.publicationYear}</td>
                  <td className="py-3 px-4">{b.noOfCopies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center bg-blue-50 border border-blue-100 p-6 rounded-xl text-blue-700 font-medium shadow-inner">
          📚 {t("allBooks.noBooks")}
        </div>
      )}
    </div>
  );
}
