import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ShowBooks from "../adminPage/ShowBooks";
import ShowUsers from "../adminPage/ShowUsers";
import AddBook from "../adminPage/AddBook";
import SearchLike from "../adminPage/SearchLike";
import SearchBook from "../adminPage/SearchBook";
import SearchUser from "../adminPage/SearchUser";
import UserFine from "../adminPage/UserFine";
import SearchBookLike from "../adminPage/SearchBookLike";
import { Library, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import UpdateFine from "../adminPage/UpdateFine";

export default function AdminDashboard() {
  const [selectedOperation, setSelectedOperation] = useState("");
  const [adminName, setAdminName] = useState("Admin");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedName = localStorage.getItem("username") || "Admin";
    setAdminName(storedName);
  }, []);

  const renderOperation = () => {
    switch (selectedOperation) {
      case t("operations.showBooks"):
        return <ShowBooks />;
      case t("operations.showUsers"):
        return <ShowUsers />;
      case t("operations.addBooks"):
        return <AddBook />;
      case t("operations.searchUser"):
        return <SearchLike />;
      case t("operations.searchBook"):
        return <SearchBook />;
      case t("operations.searchBookLike"):
        return <SearchBookLike />;
      case t("operations.searchUserId"):
        return <SearchUser />;
      case t("operations.findUserFine"):
        return <UserFine />;
      case t("operations.updateUserFine"):
        return <UpdateFine/>
      default:
        return (
          <p className="text-gray-600 text-center mt-6 text-lg">
            {t("selectOperation")}
          </p>
        );
    }
  };

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? t("goodMorning")
      : currentHour < 18
      ? t("goodAfternoon")
      : t("goodEvening");

  const operations = [
    t("operations.showBooks"),
    t("operations.showUsers"),
    t("operations.addBooks"),
    t("operations.searchUser"),
    // t("operations.searchBook"),
    t("operations.searchBookLike"),
    // t("operations.searchUserId"),
    // t("operations.findUserFine"),
    t("operations.updateUserFine")
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white text-gray-800 animate-fadeIn">
      <Navbar />
      <main className="flex-1 p-8 sm:p-10">
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-3">
            <Library className="text-blue-700" size={32} />
            <h1 className="text-3xl sm:text-4xl font-bold text-blue-800">
              {t("welcome_user", { name: adminName })}
            </h1>
            <button
              onClick={() => navigate("/")}
              className="absolute top-13 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition duration-300"
            >
              <Home size={18} />
              {t("home_")}
            </button>
          </div>
          <p className="text-lg text-blue-600 font-medium">{greeting}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {operations.map((op) => (
            <button
              key={op}
              onClick={() => setSelectedOperation(op)}
              className={`${
                selectedOperation === op
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white border border-blue-200 text-blue-700 hover:bg-blue-50"
              } p-4 rounded-xl font-semibold transition-all duration-200 shadow-sm`}
            >
              {op}
            </button>
          ))}
        </div>

        <div className="bg-white border border-blue-100 rounded-2xl shadow-md p-6 sm:p-8">
          {renderOperation()}
        </div>
      </main>
    </div>
  );
}
