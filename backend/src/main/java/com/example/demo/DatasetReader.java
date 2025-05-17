package com.example.demo;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

@Component
public class DatasetReader {

    public List<Restaurant> readRestaurants() {
        List<Restaurant> restaurants = new ArrayList<>();

        try (InputStream is = getClass().getResourceAsStream("/zomato.csv")) {
            if (is == null) {
                throw new RuntimeException("CSV file not found in resources!");
            }

            CSVReader reader = new CSVReader(
                new InputStreamReader(is, StandardCharsets.UTF_8)
            );

            // Skip header row
            reader.readNext();

            String[] line;
            int idCounter = 1;

            while ((line = reader.readNext()) != null) {
                if (line.length < 20) {
                    System.err.println("Skipping invalid row: " + String.join(",", line));
                    continue;
                }

                Restaurant restaurant = new Restaurant();
                restaurant.setId(Integer.parseInt(line[0].trim()));
                restaurant.setName(line[1].trim());       // Restaurant Name (index 1)
                restaurant.setLocation(line[3].trim());   // City (index 3)
                restaurant.setCuisines(line[9].trim());   // Cuisines (index 9)
                restaurant.setRating(line[19].trim());    // Rating text (index 19)
                restaurant.setLatitude(Double.parseDouble(line[8].trim()));
                restaurant.setLongitude(Double.parseDouble(line[7].trim()));
                // double distance = GeoUtils.haversine(14.565443, 121.027535, 14.565443, 121.027535);
                // System.out.println(distance); // Should print 0.0 km (same location)
                // double distance2 = GeoUtils.haversine(14.565443, 121.027535, 14.553708, 121.0141013);
                // System.out.println(distance2);

                restaurants.add(restaurant);
            }
        } catch (CsvValidationException e) {
            throw new RuntimeException("Invalid CSV format", e);
        } catch (Exception e) {
            throw new RuntimeException("Error reading CSV file", e);
        }

        return restaurants;
    }
}
