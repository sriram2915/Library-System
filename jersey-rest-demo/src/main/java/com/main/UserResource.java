package com.main;

import com.dao.UserDAO;
import com.model.User;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.*;
import java.sql.SQLException;
import java.util.List;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

	
	//-------------- *******USER OPERATIONS******* ----------------

    @PUT
    @Path("/fine")
    public Response calculateFine(@Context ContainerRequestContext context) {
    
        String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        
        try {
            int fine = UserDAO.calculateFine(id);
            return Response.ok("{\"fine\":" + fine + "}").build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
    // Checkout a Book
    @POST
    @Path("/checkout/{bookId}")
    public Response checkoutBook(@Context ContainerRequestContext context,@PathParam("bookId") int bookId) {
    	
        String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        try {
            String result = UserDAO.processBookCheckout(id, bookId);
            return Response.ok("{\"message\":\"" + result + "\"}").build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }

    // Return a Book
    @POST
    @Path("/return/{bookId}")
    public Response returnBook(@Context ContainerRequestContext context, @PathParam("bookId") int bookId) {
    	
        String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        try {
            String result = UserDAO.returnBook(bookId, id);
            return Response.ok("{\"message\":\"" + result + "\"}").build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
  //-------------- *******ADMIN OPERATIONS******* ----------------
    // get all Users info
    @GET
    public Response getAllUsers(@Context ContainerRequestContext context) {
    	
    	String role = (String) context.getProperty("role");

        if (!"admin".equalsIgnoreCase(role)) {
            return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
        }
        
        try {
            List<User> users = UserDAO.getAllUsers();
            return Response.ok(users).build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
	// get by user id
    @GET
    @RolesAllowed("admin")
    @Path("/{id}")
    public Response getUserById(@Context ContainerRequestContext context,@PathParam("id") int id) {
    	
//    	String role = (String) context.getProperty("role");
//		if (!"admin".equalsIgnoreCase(role)) {
//	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
//	    }
        try {
            User user = UserDAO.getUserById(id);
            if (user == null)
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\":\"User not found\"}")
                        .build();
            return Response.ok(user).build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
    @PUT
    @Path("/fine/{userId}")
    public Response calculateFineAdmin(@PathParam("userId") int userId,@Context ContainerRequestContext context) {
    	
    	String role = (String) context.getProperty("role");
		if (!"admin".equalsIgnoreCase(role)) {
	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
	    }
        try {
            int fine = UserDAO.calculateFine(userId);
            return Response.ok("{\"fine\":" + fine + "}").build();
        } catch (SQLException e) {
            return Response.serverError().entity("{\"error\":\"" + e.getMessage() + "\"}").build();
        }
    }
    
    @GET
    @Path("/search")
    public Response searchUsers(@QueryParam("query") String query, @Context ContainerRequestContext context ) {
    	String role = (String) context.getProperty("role");
		if (!"admin".equalsIgnoreCase(role)) {
	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
	    }
		
        if (query == null || query.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Query parameter cannot be empty.")
                    .build();
        }

        List<User> users = UserDAO.searchUsers(query);
        return Response.ok(users).build();
    }
    
    
}
