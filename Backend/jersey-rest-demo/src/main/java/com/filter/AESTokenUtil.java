package com.filter;

//import io.jsonwebtoken.*;
//import io.jsonwebtoken.security.Keys;
//
//import java.security.Key;
//import java.util.Date;
//
//public class JwtUtil {
//    private static final String SECRET_KEY = "mYUltraSecureSecretKeyForJWT1234567890123456";
//    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000; 
//
//    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
//
//	public static String generateToken(String userId, String role) {
//        return Jwts.builder()
//                .claim("userId", userId)
//                .claim("role", role)
////                .setIssuedAt(new Date())
//                .setIssuedAt(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
//                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .signWith(key, SignatureAlgorithm.HS256)
//                .compact();
//    }
//
//    public static Claims validateToken(String token) {
//        try {
//            return Jwts.parserBuilder()
//                    .setSigningKey(key)
//                    .build()
//                    .parseClaimsJws(token)
//                    .getBody();
//        } catch (JwtException e) {
//            throw new RuntimeException("Invalid or expired token", e);
//        }
//    }
//
//}

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.util.Base64;

public class AESTokenUtil {

    private static SecretKey secretKey;
    private static IvParameterSpec ivSpec;

    static {
        try {
            // AES key 
            KeyGenerator keyGen = KeyGenerator.getInstance("AES");
            keyGen.init(128);
            secretKey = keyGen.generateKey();

            byte[] iv = new byte[16]; 
            ivSpec = new IvParameterSpec(iv);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Generate token
    public static String generateToken(String userId, String role) throws Exception {
        String payload = userId + ":" + role + ":" + System.currentTimeMillis();
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
        byte[] encrypted = cipher.doFinal(payload.getBytes());
        return Base64.getEncoder().encodeToString(encrypted);
    }

    // Validate and decode token
    public static String[] decodeToken(String token) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
        byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(token));
        String payload = new String(decryptedBytes);
        return payload.split(":"); // [userId, role, timestamp]
    }
}
