package com.example.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.saveAll(Arrays.asList(
                new Product(null, "Laptop", "A high performance laptop", 1200.0, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Smartphone", "Latest model smartphone", 800.0, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Headphones", "Noise cancelling headphones", 200.0, "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Smartwatch", "Stylish smartwatch with health tracking", 250.0, "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Camera", "DSLR camera for photography", 950.0, "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Bluetooth Speaker", "Portable Bluetooth speaker", 120.0, "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Tablet", "10-inch Android tablet", 400.0, "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Gaming Console", "Next-gen gaming console", 500.0, "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Wireless Mouse", "Ergonomic wireless mouse", 35.0, "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80"),
                new Product(null, "Keyboard", "Mechanical keyboard with RGB", 80.0, "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=400&q=80")
            ));
        }
    }
} 