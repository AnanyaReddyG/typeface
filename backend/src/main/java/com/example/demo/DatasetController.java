package com.example.demo;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;


// @CrossOrigin(origins = "http://localhost:3000")
@CrossOrigin(
  origins = "http://localhost:3000", 
  allowedHeaders = "*", 
  methods = {RequestMethod.GET, RequestMethod.POST} // Add other methods if needed
)
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

    @GetMapping("/num/{id}")
    public Restaurant getRestaurantById(@PathVariable int id) {
        Optional<Restaurant> restaurant = restaurantList.stream()
                .filter(r -> r.getId() == id)
                .findFirst();
        return restaurant.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
    }

    @GetMapping("/search")
    public List<Restaurant> searchRestaurantsByName(@RequestParam("name") String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name parameter is required");
        }
        String searchTerm = name.trim().toLowerCase();
        List<String> searchWords = List.of(searchTerm.split("\\s+"));

        return restaurantList.stream()
            .filter(r -> r.getName() != null)
            .filter(r -> {
                String[] restaurantNameWords = r.getName().toLowerCase().split("\\s+");
                // Check if any search word matches any word in restaurant name (partial match)
                return searchWords.stream().anyMatch(
                    searchWord -> 
                        // partial match with any word in restaurant name
                        Arrays.stream(restaurantNameWords)
                            .anyMatch(nameWord -> nameWord.contains(searchWord))
                );
            })
            .collect(Collectors.toList());
    }

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

    @GetMapping("/filters")
    public Map<String, List<String>> getFilterOptions() {
        Map<String, List<String>> filters = new HashMap<>();

        // Extract unique countries
        List<String> countries = restaurantList.stream()
            .map(Restaurant::getCountry)
            .distinct()
            .collect(Collectors.toList());

        // Flatten all cuisines from all restaurants, deduplicate and sort
        List<String> cuisines = restaurantList.stream()
            .flatMap(r -> r.getCuisinels().stream())
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .distinct()
            .sorted()
            .collect(Collectors.toList());

        // Predefined spend ranges
        List<String> spendRanges = Arrays.asList(
            "Under $50",
            "$50 - $100",
            "$100 - $200",
            "Over $200"
        );

        filters.put("countries", countries);
        filters.put("cuisines", cuisines);
        filters.put("spendRanges", spendRanges);

        return filters;
    }

    @GetMapping("/filter")
    public RestaurantPage filterRestaurants(
        @RequestParam(required = false) String country,
        @RequestParam(required = false) String cuisine,
        @RequestParam(required = false) String spendRange,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        List<Restaurant> filtered = restaurantList.stream()
            .filter(r -> country == null || r.getCountry().equalsIgnoreCase(country))
            .filter(r -> cuisine == null || r.getCuisinels().stream()
                .anyMatch(c -> c.equalsIgnoreCase(cuisine)))
            .filter(r -> {
                if (spendRange == null) return true;
                String avgSpendStr = r.getAverageSpend();
                try {
                    String[] parts = avgSpendStr.split("\\s+");
                    double avgSpend = Double.parseDouble(parts[0]);
                    return switch (spendRange) {
                        case "Under $50" -> avgSpend < 50;
                        case "$50 - $100" -> avgSpend >= 50 && avgSpend <= 100;
                        case "$100 - $200" -> avgSpend > 100 && avgSpend <= 200;
                        case "Over $200" -> avgSpend > 200;
                        default -> true;
                    };
                } catch (Exception e) {
                    return false;
                }
            })
            .collect(Collectors.toList());

        int start = page * size;
        int end = Math.min(start + size, filtered.size());
        List<Restaurant> subList = (start > end) ? List.of() : filtered.subList(start, end);

        RestaurantPage result = new RestaurantPage();
        result.setContent(subList);
        result.setPage(page);
        result.setSize(size);
        result.setTotalElements(filtered.size());
        result.setTotalPages((int) Math.ceil((double) filtered.size() / size));
        return result;
    }

}
