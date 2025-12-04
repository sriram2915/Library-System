package com.main;

import org.glassfish.jersey.server.ResourceConfig;

import com.filter.CORSFilter;
import com.filter.TokenAuthFilter;

import jakarta.ws.rs.ApplicationPath;

@ApplicationPath("/api")
public class RestApplication extends ResourceConfig {
    public RestApplication() {
        //resource and filter packages
        packages("com.main");
        packages("com.filter");
        register(TokenAuthFilter.class);
        register(CORSFilter.class);
    }
}
