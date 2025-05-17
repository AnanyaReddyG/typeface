package com.example.demo;

import com.example.demo.Restaurant;

import java.util.List;

public class RestaurantPage {
    private List<Restaurant> content;
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;

    // Getters and setters
    public List<Restaurant> getContent() {
        return content;
    }
    public void setContent(List<Restaurant> content) {
        this.content = content;
    }
    public int getPage() {
        return page;
    }
    public void setPage(int page) {
        this.page = page;
    }
    public int getSize() {
        return size;
    }
    public void setSize(int size) {
        this.size = size;
    }
    public int getTotalPages() {
        return totalPages;
    }
    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }
    public long getTotalElements() {
        return totalElements;
    }
    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
}


