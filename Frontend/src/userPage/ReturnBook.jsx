import React, { useState, useEffect, useCallback } from "react";
import {
  getUserBorrowedBooks,
  getUserReservedBooks,
  returnBook,
  cancelReservation,
} from "../services/api";
import { useTranslation } from "react-i18next";

export default function BorrowBook() {
  const { t } = useTranslation();
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);

  const fetchBooks = useCallback(async () => {
    try {
      const [borrowedRes, reservedRes] = await Promise.all([
        getUserBorrowedBooks(),
        getUserReservedBooks(),
      ]);
      setBorrowedBooks(borrowedRes.data || []);
      setReservedBooks(reservedRes.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleReturn = async (bookId) => {
    if (!window.confirm(t("borrowed.confirmReturn"))) return;
    try {
      await returnBook(bookId);
      alert(t("borrowed.returnSuccess"));
      fetchBooks();
    } catch {
      alert(t("borrowed.returnFail"));
    }
  };

  const handleCancelReservation = async (bookId) => {
    if (!window.confirm(t("borrowed.confirmCancel"))) return;
    try {
      await cancelReservation(bookId);
      alert(t("borrowed.cancelSuccess"));
      fetchBooks();
    } catch {
      alert(t("borrowed.cancelFail"));
    }
  };

  function formatDate(timestamp) {

    const iso = timestamp.replace(" ", "T");
    let date = new Date(iso);
    date.setDate(date.getDate() + 5);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const year = String(date.getFullYear()); 

    return `${day}/${month}/${year}`;
  }



  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        📗 {t("borrowed.title")}
      </h2>

      {/* Borrowed Books */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-3">
          {t("borrowed.borrowedTitle")}
        </h3>
        {borrowedBooks.length > 0 ? (
          <table className="w-full border-collapse bg-white/20 rounded-lg text-gray-600 mb-4 text-sm sm:text-base shadow-lg">
            <thead className="bg-white/30">
              <tr>
                <th className="p-2">{t("borrowed.columns.id")}</th>
                <th className="p-2">{t("borrowed.columns.name")}</th>
                <th className="p-2">{t("borrowed.columns.author")}</th>
                <th className="p-2">{t("borrowed.columns.category")}</th>
                <th className="p-2">{t("borrowed.columns.year")}</th>
                <th className="p-2">{t("borrowed.columns.borrowedOn")}</th>
                <th className="p-2">{t("borrowed.columns.action")}</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((b) => (
                <tr
                  key={b.id}
                  className="text-center border-b border-white/20 hover:bg-white/10 transition"
                >
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.bookName}</td>
                  <td className="p-2">{b.author}</td>
                  <td className="p-2">{b.category}</td>
                  <td className="p-2">{b.publicationYear}</td>
                  <td className="p-2">{formatDate(b.timestamp)}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleReturn(b.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-all"
                    >
                      {t("borrowed.returnBtn")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">{t("borrowed.noBorrowed")}</p>
        )}
      </div>

      {/* Reserved Books */}
      <div>
        <h3 className="text-xl font-semibold mb-3">
          {t("borrowed.reservedTitle")}
        </h3>
        {reservedBooks.length > 0 ? (
          <table className="w-full border-collapse bg-white/20 rounded-lg text-gray-600 mb-4 text-sm sm:text-base shadow-lg">
            <thead className="bg-white/30">
              <tr>
                <th className="p-2">{t("borrowed.columns.id")}</th>
                <th className="p-2">{t("borrowed.columns.name")}</th>
                <th className="p-2">{t("borrowed.columns.author")}</th>
                <th className="p-2">{t("borrowed.columns.category")}</th>
                <th className="p-2">{t("borrowed.columns.year")}</th>
                <th className="p-2">{t("borrowed.columns.reservedOn")}</th>
                <th className="p-2">{t("borrowed.columns.action")}</th>
              </tr>
            </thead>
            <tbody>
              {reservedBooks.map((b) => (
                <tr
                  key={b.id}
                  className="text-center border-b border-white/20 hover:bg-white/10 transition"
                >
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.bookName}</td>
                  <td className="p-2">{b.author}</td>
                  <td className="p-2">{b.category}</td>
                  <td className="p-2">{b.publicationYear}</td>
                  <td className="p-2">{b.timestamp}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleCancelReservation(b.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
                    >
                      {t("borrowed.cancelBtn")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-400">{t("borrowed.noReserved")}</p>
        )}
      </div>
    </div>
  );
}
