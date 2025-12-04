// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// export default function Home() {
//   const navigate = useNavigate();
//   const [userRole, setUserRole] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const role = localStorage.getItem("role");
//     const token = localStorage.getItem("token");
//     if (token) {
//       setIsLoggedIn(true);
//       setUserRole(role);
//     }
//   }, []);

//   const handleDashboard = () => {
//     setUserRole(localStorage.getItem("role"));
//     if (userRole === "admin") navigate("/admin");
//     else navigate("/user");
//   };

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
//       <Navbar />

//       {/* Hero Section */}
//       <main className="flex-1">
//         <section className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-br from-blue-100 via-white to-blue-50 overflow-hidden">
  
//           <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center z-0" />

//           <div className="relative z-10">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//               Welcome to <span className="text-blue-600">Central Library</span>
//             </h1>
//             <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               Discover thousands of books, journals, and digital resources.
//               Experience a modern, peaceful environment designed to inspire
//               knowledge and creativity.
//             </p>

//             <div className="mt-8 flex flex-wrap gap-4 justify-center">

//               {isLoggedIn && (
//                 <button
//                   onClick={handleDashboard}
//                   className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 cursor-pointer"
//                 >
//                   Go to Dashboard
//                 </button>
//               )}
//             </div>
//           </div>
//         </section>


//         {/* Features / Gallery Section */}
//         <section className="py-16 px-6 md:px-12 bg-white">
//           <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
//             Explore Our Library
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
//               <img
//                 src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
//                 alt="Library Interior"
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-5">
//                 <h3 className="text-xl font-semibold mb-2">Modern Facilities</h3>
//                 <p className="text-gray-600">
//                   Spacious reading halls, comfortable seating, and a calm study environment.
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
//               <img
//                 src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
//                 alt="Books"
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-5">
//                 <h3 className="text-xl font-semibold mb-2">Extensive Collection</h3>
//                 <p className="text-gray-600">
//                   Access thousands of books, research papers, and digital resources.
//                 </p>
//               </div>
//             </div>

//             <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
//               <img
//                 src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=800&q=80"
//                 alt="Study Area"
//                 className="w-full h-56 object-cover"
//               />
//               <div className="p-5">
//                 <h3 className="text-xl font-semibold mb-2">Peaceful Study Areas</h3>
//                 <p className="text-gray-600">
//                   Dedicated spaces for students and professionals to read, learn, and collaborate.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Contact Section */}
//         <section className="py-16 px-6 bg-blue-600 text-white text-center">
//           <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
//           <div className="space-y-2 text-lg">
//             <p>
//               Email:{" "}
//               <a href="mailto:info@citylibrary.com" className="underline">
//                 info@citylibrary.com
//               </a>
//             </p>
//             <p>
//               Phone:{" "}
//               <a href="tel:+919876543210" className="underline">
//                 +91 98765 43210
//               </a>
//             </p>
//             <p>Address: 123 Library Street, Chennai</p>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userRole, setUserRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
  }, []);

  const handleDashboard = () => {
    setUserRole(localStorage.getItem("role"));
    if (userRole === "admin") navigate("/admin");
    else navigate("/user");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center py-20 px-6 bg-gradient-to-br from-blue-100 via-white to-blue-50 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center z-0" />

          <div className="relative z-10">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t("home.welcome")}{" "}
              <span className="text-blue-600">{t("home.libraryName")}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t("home.description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              {isLoggedIn && (
                <button
                  onClick={handleDashboard}
                  className="bg-gray-800 hover:bg-gray-900 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition duration-300 cursor-pointer"
                >
                  {t("home.dashboardButton")}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Features / Gallery Section */}
        <section className="py-16 px-6 md:px-12 bg-white">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
            {t("home.exploreTitle")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
              <img
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80"
                alt={t("home.features.modernFacilities.title")}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {t("home.features.modernFacilities.title")}
                </h3>
                <p className="text-gray-600">
                  {t("home.features.modernFacilities.description")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80"
                alt={t("home.features.extensiveCollection.title")}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {t("home.features.extensiveCollection.title")}
                </h3>
                <p className="text-gray-600">
                  {t("home.features.extensiveCollection.description")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 bg-white">
              <img
                src="https://images.unsplash.com/photo-1515168833906-d2a3b82b302a?auto=format&fit=crop&w=800&q=80"
                alt={t("home.features.peacefulAreas.title")}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">
                  {t("home.features.peacefulAreas.title")}
                </h3>
                <p className="text-gray-600">
                  {t("home.features.peacefulAreas.description")}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-6 bg-blue-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-6">{t("home.contactTitle")}</h2>
          <div className="space-y-2 text-lg">
            <p>
              {t("home.contact.email")}:{" "}
              <a href="mailto:info@citylibrary.com" className="underline">
                info@citylibrary.com
              </a>
            </p>
            <p>
              {t("home.contact.phone")}:{" "}
              <a href="tel:+919876543210" className="underline">
                +91 98765 43210
              </a>
            </p>
            <p>{t("home.contact.address")}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
