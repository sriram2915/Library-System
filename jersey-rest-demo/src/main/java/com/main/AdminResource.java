package com.main;

import java.sql.SQLException;
import java.util.List;

import com.dao.LibrarySystemDAO;
import com.google.gson.JsonArray;
import com.model.LibrarySystem;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/library")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)

public class AdminResource {

	//-------------- *******BOTH OPERATIONS******* ----------------

	// Get all books
	@GET
	@Path("/books")
	public List<LibrarySystem> getAllBooks() {
		try {
			return LibrarySystemDAO.getAllBooks();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Search by book ID
	@GET
	@Path("/book/id/{id}")
	public LibrarySystem getBookById(@PathParam("id") int id) {
		try {
			return LibrarySystemDAO.getBookById(id);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Search by book name
	@GET
	@Path("/book/name/{name}")
	public LibrarySystem getBookByName(@PathParam("name") String name) {
		try {
			return LibrarySystemDAO.getBookByName(name);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Search by category
	@GET
	@Path("/book/category/{category}")
	public List<LibrarySystem> getBooksByCategory(@PathParam("category") String category) {
		try {
			return LibrarySystemDAO.getBooksByCategory(category);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	// Search by publication year
	@GET
	@Path("/book/year/{year}")
	public List<LibrarySystem> getBooksByYear(@PathParam("year") int year) {
		try {
			return LibrarySystemDAO.getBooksByYear(year);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return null;
	}

	@GET
	@Path("/searchBook/{query}")
	public Response searchBooks(@PathParam("query") String query) {
		try {
			List<LibrarySystem> books = LibrarySystemDAO.searchBooksLike(query);
			return Response.ok(books).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error fetching book data").build();
		}
	}
	
	// Remove expired reservations
	@DELETE
	@Path("/removeReserved")
	public Response removeExpiredReservations() {
		try {
			LibrarySystemDAO.removeReserve();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Response.ok("Expired reservations removed").build();
	}
	
	//-------------- *******USER OPERATIONS******* ----------------	

	@DELETE
	@Path("/removeReservation/{id}")
	public Response removeReservation(@Context ContainerRequestContext context, @PathParam("id") int bookId) {
		String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        if(id<100) return Response.ok("you are admin. !!").build();
		try {
			LibrarySystemDAO.removeReservation(id, bookId);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return Response.ok("You are not reserved this book !!").build();
	}
	
	@GET
	@Path("/borrowed")
	public Response getBorrowedBooks(@Context ContainerRequestContext context) {
		String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        if(id<100) return Response.ok("you are admin. !!").build();
		JsonArray borrowedBooks = LibrarySystemDAO.getBorrowedBooksByUserId(id);
		return Response.ok(borrowedBooks.toString()).build();
	}

	@GET
	@Path("/reserved")
	public Response getReservedBooks(@Context ContainerRequestContext context) {
		String userId = (String) context.getProperty("userId");
        int id = Integer.parseInt(userId);
        if(id<100) return Response.ok("you are admin. !!").build();
		JsonArray reservedBooks = LibrarySystemDAO.getReservedBooksByUserId(id);
		return Response.ok(reservedBooks.toString()).build();
	}
		
	 //-------------- *******ADMIN OPERATIONS******* ----------------

	// Add a new book
	@POST
	@Path("/addBook")
	
	public Response addBook(LibrarySystem book, @Context ContainerRequestContext context) {
		String role = (String) context.getProperty("role");
		if (!"admin".equalsIgnoreCase(role)) {
	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
	    }
		try {
			LibrarySystemDAO.insert(book);
			return Response.ok("Book added successfully").build();
		} catch (Exception e) {
			return Response.status(Response.Status.BAD_REQUEST).entity("Failed to add book: " + e.getMessage()).build();
		}
	}
	
	@PUT
    @Path("/update")
    public Response updateBook(LibrarySystem book, @Context ContainerRequestContext context) {
		String role = (String) context.getProperty("role");
		if (!"admin".equalsIgnoreCase(role)) {
	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
	    }
        try {
            boolean updated = LibrarySystemDAO.updateBook(book);
            if (updated) {
                return Response.ok()
                        .entity("{\"message\": \"Book updated successfully\"}")
                        .build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"message\": \"Book not found\"}")
                        .build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error updating book: " + e.getMessage() + "\"}")
                    .build();
        }
    }
		
	@GET
	@Path("/{userId}/borrowed")
	@RolesAllowed("admin")
	public Response getBorrowedBooksAdmin(@PathParam("userId") int userId, @Context ContainerRequestContext context) {
//		String role = (String) context.getProperty("role");
//		if (!"admin".equalsIgnoreCase(role)) {
//	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
//	    }
		JsonArray borrowedBooks = LibrarySystemDAO.getBorrowedBooksByUserId(userId);
		return Response.ok(borrowedBooks.toString()).build();
	}

	@GET
	@Path("/{userId}/reserved")
	public Response getReservedBooksAdmin(@PathParam("userId") int userId,@Context ContainerRequestContext context) {
		String role = (String) context.getProperty("role");
		if (!"admin".equalsIgnoreCase(role)) {
	         return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
	    }
		JsonArray reservedBooks = LibrarySystemDAO.getReservedBooksByUserId(userId);
		return Response.ok(reservedBooks.toString()).build();
	}
	
	@PUT
	@Path("/{userId}/updatefine/{amount}")
	public Response updateFine(@PathParam("userId") int userId, @PathParam("amount") int amount, @Context ContainerRequestContext context) {
		
		String role = (String) context.getProperty("role");
		if(!"admin".equalsIgnoreCase(role)) {
			return Response.status(Response.Status.FORBIDDEN).entity("Only admins can access this resource").build();
		}
		
		try {
            boolean updated = LibrarySystemDAO.updateFine(userId, amount);
            if (updated) {
                return Response.ok()
                        .entity("{\"message\": \"Fine Updates Successfully \"}")
                        .build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"message\": \"User Id not found or User Don't have fine \"}")
                        .build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\": \"Error updating Fine : " + e.getMessage() + "\"}")
                    .build();
        }
		
		
	}

}
