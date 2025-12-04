package com.model;

public class User {
    private int userId;
    private String name;
    private String phoneNumber;
    private int bookGet;
    private int bookHave;
    private int fine;
    private String email;

    public User() {}

    public User(int userId, String name, String phoneNumber, int bookGet, int bookHave, int fine) {
        this.userId = userId;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.bookGet = bookGet;
        this.bookHave = bookHave;
        this.fine = fine;
    }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public int getBookGet() { return bookGet; }
    public void setBookGet(int bookGet) { this.bookGet = bookGet; }

    public int getBookHave() { return bookHave; }
    public void setBookHave(int bookHave) { this.bookHave = bookHave; }

    public int getFine() { return fine; }
    public void setFine(int fine) { this.fine = fine; }
    
    public String getEmail() {
    	return email;
    }
    public void setEmail(String email) {
    	this.email = email;
    }

}
