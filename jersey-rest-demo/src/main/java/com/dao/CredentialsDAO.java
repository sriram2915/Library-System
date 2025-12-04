package com.dao;

import com.database.DBConnection;
import java.sql.*;
import com.model.Credentials;
import com.model.User;

public class CredentialsDAO {

    // Check login credentials
    public static Credentials authenticate(String username, String password) throws SQLException {
        String query = "SELECT * FROM Credentials WHERE username = ? AND password = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(query)) {
        	
            ps.setString(1, username);
            ps.setString(2, password);
            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                Credentials cred = new Credentials();
                cred.setId(rs.getInt("userId"));
                cred.setUsername(rs.getString("username"));
                cred.setRole(rs.getString("role"));
                return cred;
            }
        }
        return null; 
    }
    
    public static boolean registerUser(User user, Credentials cred) throws SQLException {
        Connection con = null;
        PreparedStatement ps = null;

        try {
            con = DBConnection.getConnection();
            con.setAutoCommit(false); 

            String userQuery = "INSERT INTO User(name, phoneNumber,email) VALUES(?, ?, ?)";
            ps = con.prepareStatement(userQuery, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, user.getName());
            ps.setString(2, user.getPhoneNumber());
            ps.setString(3, user.getEmail());
            ps.executeUpdate();
            
            ResultSet rs = ps.getGeneratedKeys();
            int userId = -1;
            if (rs.next()) {
                userId = rs.getInt(1);
            }

            // 2️ Insert into Credentials using that userId
            String credQuery = "INSERT INTO Credentials(userId, username, password, role) VALUES(?, ?, ?, ?)";
            ps = con.prepareStatement(credQuery);
            ps.setInt(1, userId);
            ps.setString(2, cred.getUsername());
            ps.setString(3, cred.getPassword());
            ps.setString(4, "user");
            ps.executeUpdate();

            con.commit(); 
            return true;
        } catch (Exception e) {
            if (con != null) con.rollback(); 
            e.printStackTrace();
            return false;
        } finally {
            if (ps != null) ps.close();
            if (con != null) con.close();
        }
    }

}
