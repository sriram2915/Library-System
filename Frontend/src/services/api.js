import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/jersey-rest-demo/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically before every API call
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Token expired or invalid. Redirecting to login...");
      localStorage.removeItem("token");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

// Login user & Signup
export const loginUser = (data) => API.post("/auth/login", data);
export const signupUser = (data) => API.post("/auth/register", data);

// Book APIs
export const getAllBooks = () => API.get("/library/books");
export const addBook = (bookData) => API.post("/library/addBook", bookData);
export const deleteBook = (id) => API.delete(`/books/${id}`);
export const searchBook = (query) => API.get(`/books/search?query=${query}`);
export const updateBook = (book) => API.put("/library/update", book);

// User APIs
export const getAllUsers = () => API.get("/users");
export const searchUserById = (id) => API.get(`/users/${id}`);
export const getUserFine = () => API.put(`/users/fine`);
export const getUserFineAdmin = (userId) => API.put(`/users/fine/${userId}`);
export const updateUserFineAdmin = (userId,amount) => API.put(`library/${userId}/updatefine/${amount}`);

//  Search APIs
export const getBookById = (id) => API.get(`/library/book/id/${id}`);
export const getBookByName = (name) => API.get(`/library/book/name/${name}`);
export const getBookByCategory = (category) => API.get(`/library/book/category/${category}`);
export const getBookByYear = (year) => API.get(`/library/book/year/${year}`);
export const getBookLike = (query) => API.get(`/library/searchBook/${query}`);

export const getUserById = (id) => API.get(`/users/${id}`);
export const getUserLike = (query) => API.get(`/users/search?query=${query}`);

// Borrow & Return APIs
export const borrowBook = (bookId) => API.post(`/users/checkout/${bookId}`);
export const returnBook = (bookId) => API.post(`/users/return/${bookId}`);
export const getUserBorrowedBooksAdmin = (userId) => API.get(`/library/${userId}/borrowed`);
export const getUserReservedBooksAdmin = (userId) => API.get(`/library/${userId}/reserved`);
export const getUserBorrowedBooks = () => API.get(`/library/borrowed`);
export const getUserReservedBooks = () => API.get(`/library/reserved`);
export const cancelReservation = (id) => API.delete(`/library/removeReservation/${id}`);
export const cancelReserveAuto = () => API.delete(`/library/removeReserved`);

export default API;
