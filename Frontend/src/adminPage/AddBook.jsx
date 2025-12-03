import React, { useState } from "react";
import { addBook } from "../services/api";
import { BookPlus } from "lucide-react";
import { useTranslation } from "react-i18next"; // added

export default function AddBook() {
  const { t } = useTranslation(); // added

  const [book, setBook] = useState({
    bookName: "",
    author: "",
    category: "",
    publicationYear: "",
    row: "",
    noOfCopies: "",
  });

  const [result, setResult] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(book);
      setResult(t("addBook.success")); // ✅ localized message
      setBook({
        bookName: "",
        author: "",
        category: "",
        publicationYear: "",
        row: "",
        noOfCopies: "",
      });
    } catch (err) {
      if (err.response?.status === 400) {
        setResult(t("addBook.exists"));
      } else {
        setResult(t("addBook.failed")); 
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <BookPlus className="text-blue-700" size={28} />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("addBook.title")}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-md"
      >
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("addBook.placeholders.bookName")}
            value={book.bookName}
            onChange={(e) => setBook({ ...book, bookName: e.target.value })}
            className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder={t("addBook.placeholders.author")}
            value={book.author}
            onChange={(e) => setBook({ ...book, author: e.target.value })}
            className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              placeholder={t("addBook.placeholders.row")}
              value={book.row}
              onChange={(e) => setBook({ ...book, row: e.target.value })}
              className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none flex-1"
              required
            />
            <input
              type="number"
              placeholder={t("addBook.placeholders.copies")}
              value={book.noOfCopies}
              onChange={(e) => setBook({ ...book, noOfCopies: e.target.value })}
              className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none flex-1"
              required
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={t("addBook.placeholders.category")}
            value={book.category}
            onChange={(e) => setBook({ ...book, category: e.target.value })}
            className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="number"
            placeholder={t("addBook.placeholders.publicationYear")}
            value={book.publicationYear}
            onChange={(e) =>
              setBook({ ...book, publicationYear: e.target.value })
            }
            className="p-3 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        {/* Submit button */}
        <div className="md:col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md"
          >
            {t("addBook.submit")}
          </button>
        </div>
      </form>

      {/* Result message */}
      {result && (
        <div
          className={`mt-6 text-center font-medium p-3 rounded-lg shadow-sm ${
            result.includes("✅")
              ? "bg-green-100 text-green-700 border border-green-200"
              : result.includes("⚠️")
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}
