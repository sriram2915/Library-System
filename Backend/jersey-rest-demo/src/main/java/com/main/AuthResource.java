package com.main;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import com.dao.CredentialsDAO;
import com.filter.AESTokenUtil;
import com.model.Credentials;
import com.model.User;
import com.model.UserRegistrationRequest;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    // Login
    @POST
    @Path("/login")
    public Response login(Credentials input) {
        try {
            Credentials cred = CredentialsDAO.authenticate(input.getUsername(), input.getPassword());
            if (cred == null) {
            	 return Response.status(Response.Status.UNAUTHORIZED)
                         .entity("{\"message\":\"Invalid username or password\"}")
                         .build();
            }
            
            String token = AESTokenUtil.generateToken(String.valueOf(cred.getId()), cred.getRole());
            System.out.println("hii"+token);
            cred.setToken(token);

            return Response.ok()
                    .entity(cred)
                    .build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\":\"Server error: " + e.getMessage() + "\"}")
                    .build();
        }
    }
    
    @POST
    @Path("/register")
    public Response register(UserRegistrationRequest request) {
        try {
            User user = new User();
            user.setName(request.getName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setEmail(request.getEmail());
            

            Credentials cred = new Credentials();
            cred.setUsername(request.getUsername());
            cred.setPassword(request.getPassword());

            boolean success = CredentialsDAO.registerUser(user, cred);

            if (success) {
                return Response.ok("{\"message\":\"User registered successfully\"}").build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"message\":\"Registration failed\"}")
                        .build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"message\":\"Server error: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}
