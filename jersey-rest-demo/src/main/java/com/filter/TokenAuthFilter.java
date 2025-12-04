//package com.filter;

//import io.jsonwebtoken.Claims;
//import jakarta.annotation.Priority;
//import jakarta.ws.rs.Priorities;
//import jakarta.ws.rs.container.ContainerRequestContext;
//import jakarta.ws.rs.container.ContainerRequestFilter;
//import jakarta.ws.rs.core.HttpHeaders;
//import jakarta.ws.rs.core.Response;
//import jakarta.ws.rs.ext.Provider;
//
//@Provider
//@Priority(Priorities.AUTHENTICATION)
//public class JwtAuthFilter implements ContainerRequestFilter {
//
//    @Override
//    public void filter(ContainerRequestContext requestContext) {
//
//        String path = requestContext.getUriInfo().getPath();
//        if (path.contains("auth/login") || path.contains("auth/register")) {
//            return;
//        }
//
//        String authHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            abort(requestContext, "Missing or invalid Authorization header");
//            return;
//        }
//
//        String token = authHeader.substring(7).trim();
//
//        try {
//            Claims claims = .validateToken(token);
//            String userId = claims.get("userId", String.class);
//            String role = claims.get("role", String.class);
//
//            requestContext.setProperty("userId", userId);
//            requestContext.setProperty("role", role);
//
//        } catch (Exception e) {
//            abort(requestContext, "Invalid or expired token");
//        }
//    }
//
//    private void abort(ContainerRequestContext requestContext, String message) {
//        requestContext.abortWith(
//                Response.status(Response.Status.UNAUTHORIZED)
//                        .entity(message)
//                        .build()
//        );
//    }
//}

package com.filter;

import jakarta.annotation.Priority;
import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.container.ResourceInfo;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

import java.lang.reflect.Method;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class TokenAuthFilter implements ContainerRequestFilter {
	
	@Context
    private ResourceInfo resourceInfo;
	
	
    // --- DDoS protection configuration ---
    private static final int LIMIT = 20;          
    private static final long WINDOW_MS = 5000;  
    private static final Map<String, RequestCounter> rateLimitMap = new ConcurrentHashMap<>();

    @Override
    public void filter(ContainerRequestContext requestContext) {

        String path = requestContext.getUriInfo().getPath();
        if (path.contains("auth/login") || path.contains("auth/register")) {
            return; 
        }

        String token = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (token == null || !token.startsWith("Bearer ")) {
            abort(requestContext, "Missing or invalid Authorization header");
            return;
        }
        token = token.substring(7).trim();

        try {
            String[] payload = AESTokenUtil.decodeToken(token);
            String userId = payload[0];
            String role = payload[1];
            long timestamp = Long.parseLong(payload[2]);

            if (System.currentTimeMillis() - timestamp > 3600000) {
                abort(requestContext, "Token expired");
                return;
            }

            if (!allowRequest(userId)) {
            	System.out.println("DDOS executed...");
                requestContext.abortWith(
                        Response.status(Response.Status.TOO_MANY_REQUESTS)
                                .entity("Too many requests from this user. Please wait a few seconds.")
                                .build()
                );
                return;
            }

            requestContext.setProperty("userId", userId);
            requestContext.setProperty("role", role);
            
            Method resourceMethod = resourceInfo.getResourceMethod();
            RolesAllowed rolesAllowed = resourceMethod.getAnnotation(RolesAllowed.class);

            if (rolesAllowed != null) {
                boolean allowed = false;
                for (String allowedRole : rolesAllowed.value()) {
                    if (allowedRole.equalsIgnoreCase(role)) {
                        allowed = true;
                        break;
                    }
                }
                if (!allowed) {
                    abortForbidden(requestContext);
                }
            }

        } catch (Exception e) {
            abort(requestContext, "Invalid token");
        }
    }

    private void abort(ContainerRequestContext requestContext, String message) {
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .entity(message)
                        .build()
        );
    }
    
    private void abortForbidden(ContainerRequestContext requestContext) {
        requestContext.abortWith(
                Response.status(Response.Status.FORBIDDEN)
                        .entity("Access denied for your role")
                        .build()
        );
    }

    private boolean allowRequest(String userId) {
        long now = Instant.now().toEpochMilli();
        RequestCounter counter = rateLimitMap.computeIfAbsent(userId, k -> new RequestCounter(now));

        synchronized (counter) {
            if (now - counter.windowStart > WINDOW_MS) {
                counter.count.set(0);
                counter.windowStart = now;
            }
            return counter.count.incrementAndGet() <= LIMIT;
        }
    }

    private static class RequestCounter {
        AtomicInteger count = new AtomicInteger(0);
        long windowStart;

        RequestCounter(long windowStart) {
            this.windowStart = windowStart;
        }
    }
    
}


