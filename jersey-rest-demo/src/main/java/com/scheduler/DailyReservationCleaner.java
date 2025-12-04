package com.scheduler;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;
import java.time.LocalDateTime;
import java.util.concurrent.*;

import com.dao.LibrarySystemDAO;
import com.dao.UserDAO;
import com.database.DBConnection;

import java.sql.*;

@WebListener
public class DailyReservationCleaner implements ServletContextListener {

    private ScheduledExecutorService scheduler;

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        scheduler = Executors.newSingleThreadScheduledExecutor();

//        long initialDelay = computeInitialDelay(); 
//        long period = 24 * 60 * 60; 

        scheduler.scheduleAtFixedRate(() -> {
            System.out.println("Running daily expired reservation cleanup at " + LocalDateTime.now());
            try {
				LibrarySystemDAO.removeReserve();
				
				String userBorrow = "SELECT userId FROM owenedUser";
				try(Connection con = DBConnection.getConnection()){
					PreparedStatement pre = con.prepareStatement(userBorrow);
					ResultSet rs = pre.executeQuery();
					while(rs.next()) {
						UserDAO.calculateFine(rs.getInt("userId"));
					}
				}
				
			} catch (SQLException e) {
				e.printStackTrace();
			}
        }, 0, 5, TimeUnit.MINUTES);

        System.out.println("DailyReservationCleaner scheduled successfully.");
    }

//    private long computeInitialDelay() {
//        LocalDateTime now = LocalDateTime.now();
//        LocalDateTime nextRun = now.truncatedTo(ChronoUnit.DAYS).plusDays(1);
//        return ChronoUnit.SECONDS.between(now, nextRun);
//    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        if (scheduler != null && !scheduler.isShutdown()) {
            scheduler.shutdownNow();
            System.out.println("DailyReservationCleaner stopped.");
        }
    }
}
