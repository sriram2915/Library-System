import React, { useState } from "react";
import {
  BookOpen,
  // Search,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  BookMarked,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/Navbar";
// import SearchBook from "../userPage/SearchBook";
import AllBooks from "../userPage/AllBooks";
import BorrowBook from "../userPage/BorrowBook";
import ReturnBook from "../userPage/ReturnBook";
import ViewFine from "../userPage/ViewFine";
import SearchBookLike from "../adminPage/SearchBookLike";
import { useTranslation } from "react-i18next"; // added

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation(); // added

  const username = localStorage.getItem("username") || "User";
  const userId = localStorage.getItem("id") || "N/A";

  const operations = [
    {
      key: "books",
      title: t("operations_user.books"),
      icon: <BookOpen size={36} />,
      desc: t("descriptions.books"),
    },
    // {
    //   key: "search",
    //   title: t("operations_user.search"),
    //   icon: <Search size={36} />,
    //   desc: t("descriptions.search"),
    // },
    {
      key: "fine",
      title: t("operations_user.fine"),
      icon: <CreditCard size={36} />,
      desc: t("descriptions.fine"),
    },
    {
      key: "borrow",
      title: t("operations_user.borrow"),
      icon: <ArrowDownCircle size={36} />,
      desc: t("descriptions.borrow"),
    },
    {
      key: "return",
      title: t("operations_user.return"),
      icon: <ArrowUpCircle size={36} />,
      desc: t("descriptions.return"),
    },
    {
      key: "searchBookLike",
      title: t("operations_user.liveSearch"),
      icon: <BookMarked size={36} />,
      desc: t("descriptions.liveSearch"),
    },
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "books":
        return <AllBooks />;
      // case "search":
      //   return <SearchBook />;
      case "fine":
        return <ViewFine />;
      case "borrow":
        return <BorrowBook />;
      case "return":
        return <ReturnBook />;
      case "searchBookLike":
        return <SearchBookLike />;
      default:
        return (
          <div className="text-center text-gray-500 py-12">
            <p>{t("selectOperation_user")}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white text-gray-800">
      <UserNavbar />

      {/* Header Section */}
      <header className="relative bg-white shadow-md py-8 px-6 flex flex-col items-center text-center border-b border-blue-100">
        <button
          onClick={() => navigate("/")}
          className="absolute top-5 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
        >
          <Home size={18} />
          {t("home_")}
        </button>

        <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2">
          {t("welcome_users", { name: username })}
        </h1>
        <p className="text-gray-500 text-sm">
          {t("userId")}:{" "}
          <span className="text-blue-600 font-medium">{userId}</span>
        </p>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 flex flex-col items-center p-6 sm:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center text-blue-700">
          {t("yourDashboard")}
        </h2>

        {/* Operation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-10">
          {operations.map((op) => (
            <div
              key={op.key}
              onClick={() => setActiveTab(op.key)}
              className={`cursor-pointer rounded-2xl p-6 text-center border transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 ${
                activeTab === op.key
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white border-gray-200 hover:border-blue-400"
              }`}
            >
              <div
                className={`flex justify-center mb-4 ${
                  activeTab === op.key ? "text-white" : "text-blue-600"
                }`}
              >
                {op.icon}
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  activeTab === op.key ? "text-white" : "text-gray-800"
                }`}
              >
                {op.title}
              </h3>
              <p
                className={`text-sm ${
                  activeTab === op.key ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {op.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Active Section */}
        <div className="w-full max-w-6xl bg-white border border-blue-100 rounded-2xl shadow-lg p-8 transition-all duration-300">
          {renderComponent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm text-gray-500 border-t border-blue-100 bg-blue-50">
        {t("footer", { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
}
