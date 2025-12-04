package com.model;

import java.sql.SQLException;

public class LibrarySystem {

    private int id;
    private String bookName;
    private String author;
    private int publicationYear;
    private String category;
    private int row;
    private int noOfCopies;

    public LibrarySystem() {
    	
    }

    public LibrarySystem(int id, String bookName, String author, int publicationYear, String category, int row, int n)
            throws SQLException {
        this.id = id;
        this.bookName = bookName;
        this.author = author;
        this.publicationYear = publicationYear;
        this.category = category;
        this.row = row;
        this.noOfCopies = n;
    }

    // ---------- Getters and Setters ----------

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getPublicationYear() {
        return publicationYear;
    }

    public void setPublicationYear(int publicationYear) {
        this.publicationYear = publicationYear;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getRow() {
        return row;
    }

    public void setRow(int row) {
        this.row = row;
    }

    public int getNoOfCopies() {
        return noOfCopies;
    }

    public void setNoOfCopies(int noOfCopies) {
        this.noOfCopies = noOfCopies;
    }
}
