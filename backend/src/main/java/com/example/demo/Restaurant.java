package com.example.demo;

import java.util.List;

public class Restaurant {
    private int id;
    private String name;
    private String location;
    private String cuisines;
    private String rating;
    private double latitude;
    private double longitude;
    private String country;
    private List<String> cuisinels;
    private String avgSpend;


    public Restaurant() {
        
    }

    public Restaurant(int id, String name, String location, String cuisines, String rating, String country, String avgSpend, List<String> cuisinels) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.cuisines = cuisines;
        this.rating = rating;
        this.country = country;
        this.cuisinels = cuisinels;
        this.avgSpend = avgSpend;
    }
    // Add more fields as needed based on your CSV columns

    // Getters and Setters

    public String getCountry() {
        return country;
    }

    public List<String> getCuisinels() {
        return cuisinels;
    }

    public String getAverageSpend() {
        return avgSpend;
    }

    public double getLatitude() { 
        return latitude; 
    }

    public void setCountry(String country) {
        this.country = country;
    }
    public void setCuisinels(List<String> cuisinels) {
        this.cuisinels = cuisinels;
    }
    public void setAverageSpend(String averageSpend) {
        this.avgSpend = averageSpend;
    }

    public void setLatitude(double latitude) { 
        this.latitude = latitude; 
    
    }
    public double getLongitude() { 
        return longitude; 
    }

    public void setLongitude(double longitude) { 
        this.longitude = longitude; 
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCuisines() {
        return cuisines;
    }

    public void setCuisines(String cuisines) {
        this.cuisines = cuisines;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }
}
