package com.dao;

import java.sql.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import com.database.*;
import com.model.LibrarySystem;


public class LibrarySystemDAO {

    public static void insert(LibrarySystem obj) throws SQLException {
        String query = "INSERT INTO Books(bookName, author, publicationYear, category, bookRow, noOfCopies) VALUES (?, ?, ?, ?, ?, ?)";
        
        try (Connection con = DBConnection.getConnection();
             PreparedStatement pre = con.prepareStatement(query)) {
            
//            pre.setInt(1, obj.getId());
            pre.setString(1, obj.getBookName());
            pre.setString(2, obj.getAuthor());
            pre.setInt(3, obj.getPublicationYear());
            pre.setString(4, obj.getCategory());
            pre.setInt(5, obj.getRow());
            pre.setInt(6, obj.getNoOfCopies());
            
            pre.executeUpdate();
        }
    }


    public static List<LibrarySystem> getAllBooks() throws SQLException {
        List<LibrarySystem> books = new ArrayList<>();
        try(Connection con = DBConnection.getConnection()){
            String query = "Select * from Books";
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery(query);
            while(rs.next()){
                books.add(extractBook(rs));
            }
        }
        return books;
    }

    public static LibrarySystem getBookById(int bookId) throws SQLException {
        try(Connection con = DBConnection.getConnection()){
            String query = "Select * from Books where id = ?";
            PreparedStatement pre = con.prepareStatement(query);
            pre.setInt(1, bookId);
            ResultSet rs = pre.executeQuery();
            if(rs.next()){
                return extractBook(rs);
            }
        }
        return null;
    }

    public static LibrarySystem getBookByName(String bookName) throws SQLException {
        try(Connection con = DBConnection.getConnection()){
            String query = "Select * from Books where bookName = ?";
            PreparedStatement pre = con.prepareStatement(query);
            pre.setString(1, bookName);
            ResultSet rs = pre.executeQuery();
            if(rs.next()){
                return extractBook(rs);
            }
        }
        return null;
    }

    public static List<LibrarySystem> getBooksByCategory(String category) throws SQLException {
        List<LibrarySystem> books = new ArrayList<>();
        try(Connection con = DBConnection.getConnection()){
            String query = "Select * from Books where category = ?";
            PreparedStatement pre = con.prepareStatement(query);
            pre.setString(1, category);
            ResultSet rs = pre.executeQuery();
            while(rs.next()){
                books.add(extractBook(rs));
            }
        }
        return books;
    }

    public static List<LibrarySystem> getBooksByYear(int year) throws SQLException {
        List<LibrarySystem> books = new ArrayList<>();
        try(Connection con = DBConnection.getConnection()){
            String query = "Select * from Books where publicationYear = ?";
            PreparedStatement pre = con.prepareStatement(query);
            pre.setInt(1, year);
            ResultSet rs = pre.executeQuery();
            while(rs.next()){
                books.add(extractBook(rs));
            }
        }
        return books;
    }

    public static void removeReserve() throws SQLException {
        try(Connection con = DBConnection.getConnection()){
            String query = "SELECT created_at FROM reserveduser";
            String delete = "DELETE from reserveduser where created_at = ?";
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery(query);
            LocalDate currentDate = LocalDate.now();
            System.out.println("I am from remove reserve");
            while(rs.next()){
                Timestamp checkInTimestamp = rs.getTimestamp("created_at");
                LocalDate checkInDate = checkInTimestamp.toLocalDateTime().toLocalDate();
                long daysBetween = ChronoUnit.DAYS.between(checkInDate, currentDate);
                if (daysBetween > 5) {
                    PreparedStatement pre = con.prepareStatement(delete);
                    pre.setTimestamp(1, checkInTimestamp);
                    pre.executeUpdate();
                }
            }
        }
    }
    
    public static void removeReservation(int userId, int id) throws SQLException {
        try(Connection con = DBConnection.getConnection()){
        	String delete = "DELETE from reserveduser where userId = ? and id = ?";
                PreparedStatement pre = con.prepareStatement(delete);
                pre.setInt(1, userId);
                pre.setInt(2, id);
                pre.executeUpdate();
        }
        
    }
    
    public static JsonArray getBorrowedBooksByUserId(int userId) {
    	
        JsonArray borrowedBooks = new JsonArray();
        String query = """
            SELECT b.id, b.bookName, b.author, b.category, b.publicationYear, o.checkIn
            FROM owenedUser as o
            JOIN Books as b ON o.id = b.id
            WHERE o.userId = ?
        """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                JsonObject book = new JsonObject();
                book.addProperty("id", rs.getInt("id"));
                book.addProperty("bookName", rs.getString("bookName"));
                book.addProperty("author", rs.getString("author"));
                book.addProperty("category", rs.getString("category"));
                book.addProperty("publicationYear", rs.getInt("publicationYear"));
                book.addProperty("timestamp", rs.getTimestamp("checkIn").toString());
                borrowedBooks.add(book);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return borrowedBooks;
    }
    
    public static JsonArray getReservedBooksByUserId(int userId) {
        JsonArray reservedBooks = new JsonArray();
        String query = """
            SELECT b.id, b.bookName, b.author, b.category, b.publicationYear, r.created_at
            FROM reserveduser as r
            JOIN Books as b ON r.id = b.id
            WHERE r.userId = ?
        """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(query)) {

            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
                JsonObject book = new JsonObject();
                book.addProperty("id", rs.getInt("id"));
                book.addProperty("bookName", rs.getString("bookName"));
                book.addProperty("author", rs.getString("author"));
                book.addProperty("category", rs.getString("category"));
                book.addProperty("publicationYear", rs.getInt("publicationYear"));
                book.addProperty("timestamp", rs.getTimestamp("created_at").toString());
                reservedBooks.add(book);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return reservedBooks;
    }
    
    
    public static boolean updateBook(LibrarySystem book) throws SQLException {
        String query = "UPDATE Books SET bookName = ?, author = ?, publicationYear = ?, category = ?, bookRow = ?, noOfCopies = ? WHERE id = ?";
        
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            
            ps.setString(1, book.getBookName());
            ps.setString(2, book.getAuthor());
            ps.setInt(3, book.getPublicationYear());
            ps.setString(4, book.getCategory());
            ps.setInt(5, book.getRow());
            ps.setInt(6, book.getNoOfCopies());
            ps.setInt(7, book.getId());
            
            int rowsUpdated = ps.executeUpdate();
            return rowsUpdated > 0;
        }
    }
	    
    public static boolean updateFine(int userId, int amount) throws SQLException {

        String get = "SELECT fine FROM User WHERE userId = ?";
        String update = "UPDATE User SET fine = fine - ? WHERE userId = ?";

        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(get)) {

            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            if (!rs.next()) return false;

            int currentFine = rs.getInt("fine");

            if (currentFine <= 0 || currentFine - amount < 0) {
                return false;
            }

            try (PreparedStatement pre = con.prepareStatement(update)) {
                pre.setInt(1, amount);
                pre.setInt(2, userId);

                int rows = pre.executeUpdate();
                return rows > 0;
            }
        }
    }

    
    public static List<LibrarySystem> searchBooksLike(String query) {
        List<LibrarySystem> books = new ArrayList<>();
        String sql = """
            SELECT * FROM Books 
            WHERE CAST(id AS CHAR) LIKE ? 
               OR bookName LIKE ? 
               OR author LIKE ? 
               OR category LIKE ? 
               OR CAST(publicationYear AS CHAR) LIKE ?
            """;

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            String likePattern = "%" + query + "%";
            for (int i = 1; i <= 5; i++) {
                stmt.setString(i, likePattern);
            }

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                LibrarySystem book = new LibrarySystem();
                book.setId(rs.getInt("id"));
                book.setBookName(rs.getString("bookName"));
                book.setAuthor(rs.getString("author"));
                book.setCategory(rs.getString("category"));
                book.setPublicationYear(rs.getInt("publicationYear"));
                book.setRow(rs.getInt("bookRow"));
                book.setNoOfCopies(rs.getInt("noOfCopies"));
                books.add(book);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return books;
    }
    


    private static LibrarySystem extractBook(ResultSet rs) throws SQLException {
        return new LibrarySystem(
            rs.getInt("id"),
            rs.getString("bookName"),
            rs.getString("author"),
            rs.getInt("publicationYear"),
            rs.getString("category"),
            rs.getInt("bookRow"),
            rs.getInt("noOfCopies")
        );
    }


	
}
