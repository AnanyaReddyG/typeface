package com.example.demo;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/restaurants")
public class DatasetController {

    private final List<Restaurant> restaurantList;

    // Constructor Injection
    public DatasetController(DatasetReader datasetReader) {
        this.restaurantList = datasetReader.readRestaurants();
    }

    // 1. Get all restaurants
    @GetMapping
    // public List<Restaurant> getAllRestaurants() {
    //     return restaurantList;
    // }
    public RestaurantPage getRestaurants(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        int start = page * size;
        int end = Math.min(start + size, restaurantList.size());
        List<Restaurant> subList = (start > end) ? List.of() : restaurantList.subList(start, end);

        RestaurantPage result = new RestaurantPage();
        result.setContent(subList);
        result.setPage(page);
        result.setSize(size);
        result.setTotalElements(restaurantList.size());
        result.setTotalPages((int) Math.ceil((double) restaurantList.size() / size));
        return result;
    }

    // 2. Get restaurant by ID
    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable int id) {
        Optional<Restaurant> restaurant = restaurantList.stream()
                .filter(r -> r.getId() == id)
                .findFirst();
        return restaurant.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
    }

    // @GetMapping("/nearby")
    // @ResponseBody
    // public List<Restaurant> getNearbyRestaurants(
    //     @RequestParam double userLat,
    //     @RequestParam double userLon,
    //     @RequestParam(defaultValue = "3") double radiusKm
    // ) {
    //     System.out.println("Total restaurants: " + restaurantList.size());
        
    //     List<Restaurant> nearbyList = restaurantList.stream()
    //         .filter(restaurant -> {
    //             double distance = GeoUtils.haversine(
    //                 userLat, userLon,
    //                 restaurant.getLatitude(), restaurant.getLongitude()
    //             );
    //             // Debug - log distances for all restaurants
    //             // System.out.println("Restaurant: " + restaurant.getName() + 
    //             //                   ", Distance: " + distance);
    //             return distance <= radiusKm;
    //         })
    //         .collect(Collectors.toList());

    //     System.out.println("Nearby restaurants: " + nearbyList.size());
        
    //     return nearbyList;
    // }
    @GetMapping("/nearby")
    public List<Restaurant> getNearbyRestaurants(
        @RequestParam double userLat, 
        @RequestParam double userLon,
        @RequestParam(defaultValue = "9000.0") double radiusKm
    ) {
        System.out.println("Total restaurants: " + restaurantList.size());
        
        // Add this to check values - print first 5 restaurants' coordinates
        for (int i = 0; i < Math.min(5, restaurantList.size()); i++) {
            Restaurant r = restaurantList.get(i);
            System.out.println("Restaurant " + i + ": " + r.getName() + 
                " | Lat: " + r.getLatitude() + 
                " | Lon: " + r.getLongitude());
        }
        
        List<Restaurant> nearby = restaurantList.stream()
            .filter(r -> {
                double dist = GeoUtils.haversine(userLat, userLon, 
                    r.getLatitude(), r.getLongitude());
                
                if (dist <= radiusKm) {
                    System.out.println("MATCH: " + r.getName() + " | Distance: " + dist);
                    return true;
                }
                return false;
            })
            .collect(Collectors.toList());
        
        System.out.println("Nearby restaurants: " + nearby.size());
        return nearby;
    }


}
