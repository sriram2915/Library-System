package com.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
	
	
    
    public static Connection getConnection() throws SQLException
    { 
    	try {
			Class.forName("com.mysql.cj.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
    	String url = "jdbc:mysql://localhost:3306/Library?useSSL=false&serverTimezone=UTC";
        String user = "root";
        String password = "1234";
        return DriverManager.getConnection(url,user,password);
    }
}