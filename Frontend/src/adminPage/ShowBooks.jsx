import React, { useEffect, useState } from "react";
import { getAllBooks, updateBook } from "../services/api";
import { BookOpen, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ShowBooks() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getAllBooks();
        setBooks(res.data);
      } catch (err) {
        console.error("Failed to load books:", err);
        alert(t("showBooks.fetchError"));
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [t]);

  const handleEditClick = (book) => {
    setSelectedBook({ ...book });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedBook((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateBook(selectedBook);
      setBooks((prev) =>
        prev.map((b) => (b.id === selectedBook.id ? selectedBook : b))
      );
      setIsEditing(false);
      alert(t("showBooks.updateSuccess"));
    } catch (error) {
      console.error("Error updating book:", error);
      alert(t("showBooks.updateFail"));
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("showBooks.title")}
        </h2>
      </div>

      {loading ? (
        <p className="text-gray-300 animate-pulse">{t("showBooks.loading")}</p>
      ) : books.length === 0 ? (
        <p className="text-gray-400 text-center italic">
          {t("showBooks.noBooks")}
        </p>
      ) : (
        <div className="overflow-x-auto bg-white border border-blue-100 rounded-xl shadow-md">
          <table className="min-w-full text-left text-gray-800">
            <thead className="bg-blue-50 border-b border-blue-200">
              <tr>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.id")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.name")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.author")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.category")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.year")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.row")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.copies")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showBooks.fields.edit")}
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, index) => (
                <tr
                  key={b.id}
                  className={`border-b border-blue-100 hover:bg-blue-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                  }`}
                >
                  <td className="p-3">{b.id}</td>
                  <td className="p-3 font-medium text-blue-900">
                    {b.bookName}
                  </td>
                  <td className="p-3">{b.author}</td>
                  <td className="p-3">{b.category}</td>
                  <td className="p-3">{b.publicationYear}</td>
                  <td className="p-3">{b.row}</td>
                  <td className="p-3">{b.noOfCopies}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEditClick(b)}
                      className="text-blue-600 hover:text-blue-800"
                      title={t("showBooks.editTooltip")}
                    >
                      <Pencil size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedBook && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-xl font-semibold text-blue-700 mb-4">
              {t("showBooks.editTitle")}
            </h3>

            <div className="space-y-3">
              <input
                name="bookName"
                value={selectedBook.bookName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.name")}
              />
              <input
                name="author"
                value={selectedBook.author}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.author")}
              />
              <input
                name="category"
                value={selectedBook.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.category")}
              />
              <input
                name="publicationYear"
                value={selectedBook.publicationYear}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.year")}
              />
              <input
                name="row"
                value={selectedBook.row}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.row")}
              />
              <input
                name="noOfCopies"
                value={selectedBook.noOfCopies}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={t("showBooks.placeholders.copies")}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                {t("showBooks.cancel")}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {t("showBooks.save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
