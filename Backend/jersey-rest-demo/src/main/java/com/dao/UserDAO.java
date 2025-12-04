package com.dao;

import java.sql.*;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;

import com.model.User;
import com.scheduler.EmailSender;
import com.database.DBConnection;

public class UserDAO {
	
	private UserDAO() {  // Utility Class
		
	}
	
    // ---------------- INSERT NEW USER ----------------
    public static void insert(User obj) throws SQLException {
        String query = "INSERT INTO User(name, phoneNumber) VALUES(?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement pre = con.prepareStatement(query)) {
            pre.setString(1, obj.getName());
            pre.setString(2, obj.getPhoneNumber());
            pre.executeUpdate();
        }
    }

    // ---------------- GET ALL USERS ----------------
    public static List<User> getAllUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        String query = "SELECT * FROM User";
        try (Connection con = DBConnection.getConnection();
             Statement st = con.createStatement();
             ResultSet rs = st.executeQuery(query)) {
            while (rs.next()) {
                users.add(new User(
                        rs.getInt("userId"),
                        rs.getString("name"),
                        rs.getString("phoneNumber"),
                        rs.getInt("bookGet"),
                        rs.getInt("bookHave"),
                        rs.getInt("fine")
                ));
            }
        }
        return users;
    }

    // ---------------- GET USER BY ID ----------------
    public static User getUserById(int userId) throws SQLException {
        String query = "SELECT * FROM User WHERE userId = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement pre = con.prepareStatement(query)) {
            pre.setInt(1, userId);
            ResultSet rs = pre.executeQuery();
            if (rs.next()) {
                return new User(
                        rs.getInt("userId"),
                        rs.getString("name"),
                        rs.getString("phoneNumber"),
                        rs.getInt("bookGet"),
                        rs.getInt("bookHave"),
                        rs.getInt("fine")
                );
            }
        }
        return null;
    }
    // ---------------- SEARCH USING LIKE ----------------
    public static List<User> searchUsers(String queryValue) {
        List<User> users = new ArrayList<>();

        String sql = "SELECT * FROM user " +
                     "WHERE CAST(userId AS CHAR) LIKE ? " +
                     "OR name LIKE ? " +
                     "OR phoneNumber LIKE ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
        	
            String likePattern = "%" + queryValue + "%";
            ps.setString(1, likePattern);
            ps.setString(2, likePattern);
            ps.setString(3, likePattern);

            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                User u = new User();
                u.setUserId(rs.getInt("userId"));
                u.setName(rs.getString("name"));
                u.setPhoneNumber(rs.getString("phoneNumber"));
                u.setFine(rs.getInt("fine"));
                u.setBookGet(rs.getInt("bookGet"));
                u.setBookHave(rs.getInt("bookHave"));
                users.add(u);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return users;
    }
    

    // ---------------- CALCULATE FINE ----------------
    public static int calculateFine(int userId) throws SQLException {
        String query = "SELECT checkIn FROM owenedUser WHERE userId = ?";
        int totalFine = 0;
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
            ps.setInt(1, userId);
            ResultSet rs = ps.executeQuery();
            LocalDate currentDate = LocalDate.now();
            while (rs.next()) {
                Timestamp checkInTimestamp = rs.getTimestamp("checkIn");
                if (checkInTimestamp != null) {
                    LocalDate checkInDate = checkInTimestamp.toLocalDateTime().toLocalDate();
                    long daysBetween = ChronoUnit.DAYS.between(checkInDate, currentDate);
                    if (daysBetween > 5) {
                        totalFine += (daysBetween - 5) * 10;
                    }
                }
            }
        }
        
        String getQuery = "Select * from User where userId = ?";
        int oldFine = 0;
        try (Connection con = DBConnection.getConnection();
                PreparedStatement ps = con.prepareStatement(getQuery)) {
               ps.setInt(1, userId);
               ResultSet rs1 = ps.executeQuery();
               if (rs1.next()) {
                   oldFine = rs1.getInt("fine"); 
               }else {
            	   return -1;
               }
             }
        catch(Exception e) {
        	e.printStackTrace();
        }
        totalFine = totalFine + oldFine;

        String updateFineQuery = "UPDATE User SET fine = ? WHERE userId = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement updatePs = con.prepareStatement(updateFineQuery)) {
            updatePs.setInt(1, totalFine);
            updatePs.setInt(2, userId);
            updatePs.executeUpdate();
        }
        return totalFine;
    }

    // ---------------- PROCESS BOOK CHECKOUT ----------------
    public static String processBookCheckout(int userId, int bookId) throws SQLException {
        String selectBookSql = "SELECT noOfCopies FROM Books WHERE id = ? FOR UPDATE";
        String selectUserSql = "SELECT bookGet, bookHave, fine FROM User WHERE userId = ?";
        String selectReservationSql =
                "SELECT userId FROM reserveduser WHERE id = ? ORDER BY created_at LIMIT 1";
        String deleteReservationSql =
                "DELETE FROM reserveduser WHERE id = ? AND userId = ?";
        String updateBookSql = "UPDATE Books SET noOfCopies = noOfCopies - 1 WHERE id = ?";
        String insertOwnedSql = "INSERT INTO owenedUser(id, userId) VALUES (?, ?)";
        String updateUserSql = "UPDATE User SET bookGet = bookGet - 1, bookHave = bookHave + 1 WHERE userId = ?";
        String queryCheckReserved = "SELECT COUNT(*) FROM reserveduser WHERE userId = ? AND id = ?";

        try (Connection conn = DBConnection.getConnection()) {

            // Start transaction
            conn.setAutoCommit(false);
            int noOfCopies = 0;

            try {
                // Check book availability (locked row)
//                int noOfCopies;
                try (PreparedStatement psBook = conn.prepareStatement(selectBookSql)) {
                    psBook.setInt(1, bookId);
                    try (ResultSet rsBook = psBook.executeQuery()) {
                        if (!rsBook.next()) {
                            conn.rollback();
                            return "Invalid Book Id";
                        }
                        noOfCopies = rsBook.getInt("noOfCopies");
                        if (noOfCopies <= 0) {
                            int already = 0;
                            try (PreparedStatement psAlReserve = conn.prepareStatement(queryCheckReserved)) {
                                psAlReserve.setInt(1, userId);
                                psAlReserve.setInt(2, bookId);
                                ResultSet rsCheck = psAlReserve.executeQuery();
                                rsCheck.next();
                                already = rsCheck.getInt(1);
                            }
                            if (already > 0) {
                                conn.rollback();
                                return "You have already reserved this book!";
                            } else {
                                try (PreparedStatement psReserve =
                                             conn.prepareStatement("INSERT INTO reserveduser(id, userId) VALUES(?, ?)")) {
                                    psReserve.setInt(1, bookId);
                                    psReserve.setInt(2, userId);
                                    psReserve.executeUpdate();
                                }
                                conn.commit();
                                return "Book unavailable. You’ve been added to reservation queue.";
                            }
                        }
                    }
                }

                // Check user eligibility
                try (PreparedStatement psUser = conn.prepareStatement(selectUserSql)) {
                    psUser.setInt(1, userId);
                    try (ResultSet rsUser = psUser.executeQuery()) {
                        if (!rsUser.next()) {
                            conn.rollback();
                            return "Invalid User Id";
                        }
                        int bookGet = rsUser.getInt("bookGet");
                        int fine = rsUser.getInt("fine");
                        if (bookGet <= 0) {
                            conn.rollback();
                            return "Book limit reached.";
                        }
                        if (fine > 50) {
                            conn.rollback();
                            return "Please clear fine before checkout.";
                        }
                    }
                }

                // Check reservation queue
                try (PreparedStatement psRes = conn.prepareStatement(selectReservationSql)) {
                    psRes.setInt(1, bookId);
                    try (ResultSet rsRes = psRes.executeQuery()) {
                        if (rsRes.next()) {
                            int firstUserInQueue = rsRes.getInt("userId");
                            if (firstUserInQueue != userId && noOfCopies<=1) {
                                conn.rollback();
                                return "Book is reserved by another user.";
                            } else {
                                try (PreparedStatement psDel = conn.prepareStatement(deleteReservationSql)) {
                                    psDel.setInt(1, bookId);
                                    psDel.setInt(2, userId);
                                    psDel.executeUpdate();
                                }
                            }
                        }
                    }
                }

                // Proceed checkout
                try (PreparedStatement psUpdateBook = conn.prepareStatement(updateBookSql);
                     PreparedStatement psInsertOwned = conn.prepareStatement(insertOwnedSql);
                     PreparedStatement psUpdateUser = conn.prepareStatement(updateUserSql)) {

                    psUpdateBook.setInt(1, bookId);
                    psUpdateBook.executeUpdate();

                    psInsertOwned.setInt(1, bookId);
                    psInsertOwned.setInt(2, userId);
                    psInsertOwned.executeUpdate();

                    psUpdateUser.setInt(1, userId);
                    psUpdateUser.executeUpdate();
                }

                // Commit all updates as one atomic unit
                conn.commit();
                return "Book checkout successful!";

            } catch (Exception ex) {
                conn.rollback(); // rollback on error
                throw ex;
            } finally {
                conn.setAutoCommit(true);
            }
        }
    }


    // ---------------- RETURN BOOK ----------------
    public static String returnBook(int bookId, int userId) throws SQLException {
        try (Connection con = DBConnection.getConnection()) {
            String q2 = "SELECT * FROM owenedUser WHERE id = ?";
            String q4 = "SELECT * FROM User WHERE userId = ?";
            String q3 = "DELETE FROM owenedUser WHERE id = ? AND userId = ? LIMIT 1";
            String q5 = "UPDATE Books SET noOfCopies = noOfCopies + 1 WHERE id = ?";
            String q6 = "UPDATE User SET bookGet = bookGet + 1, bookHave = bookHave - 1 WHERE userId = ?";
            String selectReservationSql =
                    "SELECT * FROM reserveduser WHERE id = ? ORDER BY created_at LIMIT 1";
            String q7 = "SELECT bookName from Books where id = ?";
            String q8 = "SELECT * FROM User where userId = ?";
            String q9 = "INSERT INTO Logs(id,userId,borrow_date) VALUES (?,?,?)";
            		 
            Timestamp borrow = null;

            try (PreparedStatement psOwned = con.prepareStatement(q2)) {
                psOwned.setInt(1, bookId);
                ResultSet rsOwned = psOwned.executeQuery();

                boolean ownsBook = false;
                while (rsOwned.next()) {
                    if (rsOwned.getInt("userId") == userId) {
                    	borrow = rsOwned.getTimestamp("checkIn");
                        ownsBook = true;
                        
                        break;
                    }
                }

                if (!ownsBook) return "You don’t currently own this book.";

                try (PreparedStatement psUser = con.prepareStatement(q4)) {
                    psUser.setInt(1, userId);
                    ResultSet rsUser = psUser.executeQuery();
                    if (rsUser.next() && rsUser.getInt("fine") >= 50) {
                        return "Please clear fine before returning book.";
                    }
                }

                try (PreparedStatement pre1 = con.prepareStatement(q3);
                     PreparedStatement pre2 = con.prepareStatement(q5);
                     PreparedStatement pre3 = con.prepareStatement(q6)) {

                    pre1.setInt(1, bookId);
                    pre1.setInt(2, userId);
                    pre1.executeUpdate();

                    pre2.setInt(1, bookId);
                    pre2.executeUpdate();

                    pre3.setInt(1, userId);
                    pre3.executeUpdate();
                }
                
                try(PreparedStatement pre4 = con.prepareStatement(selectReservationSql)){
                	pre4.setInt(1, bookId);
                	ResultSet rs = pre4.executeQuery();
                	if(rs.next()) {
	                	int user = rs.getInt("userId");
	                	try(PreparedStatement pre5 = con.prepareStatement(q7);
	                		PreparedStatement pre6 = con.prepareStatement(q8)){
	                		pre6.setInt(1,user);
	                		pre5.setInt(1, bookId);
	                		ResultSet rs1 = pre5.executeQuery();
	                		ResultSet rs2 = pre6.executeQuery();
	                		if(rs1.next() && rs2.next()) {
	                			String bookName = rs1.getString("bookName");
	                			String email = rs2.getString("email");
//	                			String message = "Hello user "+user+",/n Hope this mail fin"
	                			
	                			try {
									EmailSender.sendEmail(email, "Book is Available !!!", " Hello"+ user+"Reserved book "+bookName+" by you is now available Please checkout the book as soon as possible");
								} catch (Exception e) {
									e.printStackTrace();
								}
	                		}
	                	}
	                	
                	}
                	
                }
                
                try(PreparedStatement pre5 = con.prepareStatement(q9)){
                	pre5.setInt(1,bookId);
                	pre5.setInt(2, userId);
                	pre5.setTimestamp(3, borrow);
//                	int rowChanged = 
                			pre5.executeUpdate();
                	                	
                }

                return "Book returned successfully!";
                
                
            }
        }
    }
}
