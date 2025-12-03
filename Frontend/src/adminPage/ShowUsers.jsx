import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  getUserBorrowedBooksAdmin,
  getUserReservedBooksAdmin,
} from "../services/api";
import { Users, BookOpen, Bookmark } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ShowUsers() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
        alert(t("showUsers.fetchError"));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [t]);

  // Handle View Books
  const handleViewBooks = async (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setBorrowedBooks([]);
    setReservedBooks([]);
    try {
      const [borrowedRes, reservedRes] = await Promise.all([
        getUserBorrowedBooksAdmin(user.userId),
        getUserReservedBooksAdmin(user.userId),
      ]);
      setBorrowedBooks(borrowedRes.data || []);
      setReservedBooks(reservedRes.data || []);
    } catch (err) {
      console.error("Error fetching books:", err);
      alert(t("showUsers.fetchBooksError"));
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Users size={28} className="text-blue-700" />
        <h2 className="text-2xl font-semibold text-blue-800">
          {t("showUsers.title")}
        </h2>
      </div>

      {/* Loading / Empty */}
      {loading ? (
        <p className="text-gray-300 animate-pulse">{t("showUsers.loading")}</p>
      ) : users.length === 0 ? (
        <p className="text-gray-400 text-center italic">
          {t("showUsers.noUsers")}
        </p>
      ) : (
        <div className="overflow-x-auto bg-white border border-blue-100 rounded-xl shadow-md">
          <table className="min-w-full text-left text-gray-800">
            <thead className="bg-blue-50 border-b border-blue-200">
              <tr>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showUsers.fields.id")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showUsers.fields.name")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showUsers.fields.phone")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showUsers.fields.fine")}
                </th>
                <th className="p-3 font-semibold text-blue-800">
                  {t("showUsers.fields.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u.userId}
                  className={`border-b border-blue-100 hover:bg-blue-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                  }`}
                >
                  <td className="p-3">{u.userId}</td>
                  <td className="p-3 font-medium text-blue-900">{u.name}</td>
                  <td className="p-3">{u.phoneNumber}</td>
                  <td className="p-3">{u.fine}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleViewBooks(u)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                    >
                      {t("showUsers.viewBooks")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white text-gray-800 w-[90%] md:w-[700px] rounded-2xl shadow-xl relative overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                📚 {t("showUsers.modal.title", { name: selectedUser.name })}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
              >
                ✖
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
              {/* Borrowed Books */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={18} className="text-blue-700" />
                  <h4 className="text-lg font-semibold text-blue-800">
                    {t("showUsers.borrowedBooks")}
                  </h4>
                </div>
                {borrowedBooks.length > 0 ? (
                  <table className="w-full border-collapse bg-blue-50 rounded-lg text-gray-800">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="p-2">{t("showUsers.bookFields.id")}</th>
                        <th className="p-2">{t("showUsers.bookFields.name")}</th>
                        <th className="p-2">{t("showUsers.bookFields.author")}</th>
                        <th className="p-2">{t("showUsers.bookFields.year")}</th>
                        <th className="p-2">{t("showUsers.bookFields.checkedOut")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedBooks.map((b) => (
                        <tr
                          key={b.id}
                          className="text-center border-b border-blue-200"
                        >
                          <td className="p-2">{b.id}</td>
                          <td className="p-2">{b.bookName}</td>
                          <td className="p-2">{b.author}</td>
                          <td className="p-2">{b.publicationYear}</td>
                          <td className="p-2">{b.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 italic">
                    {t("showUsers.noBorrowed")}
                  </p>
                )}
              </div>

              {/* Reserved Books */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Bookmark size={18} className="text-blue-700" />
                  <h4 className="text-lg font-semibold text-blue-800">
                    {t("showUsers.reservedBooks")}
                  </h4>
                </div>
                {reservedBooks.length > 0 ? (
                  <table className="w-full border-collapse bg-blue-50 rounded-lg text-gray-800">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="p-2">{t("showUsers.bookFields.id")}</th>
                        <th className="p-2">{t("showUsers.bookFields.name")}</th>
                        <th className="p-2">{t("showUsers.bookFields.author")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservedBooks.map((b) => (
                        <tr
                          key={b.bookId}
                          className="text-center border-b border-blue-200"
                        >
                          <td className="p-2">{b.id}</td>
                          <td className="p-2">{b.bookName}</td>
                          <td className="p-2">{b.author}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-500 italic">
                    {t("showUsers.noReserved")}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
