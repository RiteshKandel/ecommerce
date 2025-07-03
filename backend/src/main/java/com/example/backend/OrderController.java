package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Map<String, String> placeOrder(@RequestBody Map<String, Object> payload) {
        String userEmail = (String) payload.get("userEmail");
        String name = (String) payload.get("name");
        String phone = (String) payload.get("phone");
        String address = (String) payload.get("address");
        String payment = (String) payload.get("payment");
        String productsJson = (String) payload.get("productsJson");
        Order order = new Order(null, userEmail, name, phone, address, payment, LocalDateTime.now(), productsJson, "PENDING");
        orderRepository.save(order);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return response;
    }

    @GetMapping
    public List<Order> getOrders(@RequestParam String email) {
        return orderRepository.findByUserEmailIgnoreCaseOrderByDateDesc(email);
    }

    @PostMapping("/khalti-verify")
    public Map<String, String> verifyKhalti(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String amount = payload.get("amount");
        String secretKey = "live_secret_key"; // Provided live secret key or use test key for dev
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Key " + secretKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = new HashMap<>();
        body.put("token", token);
        body.put("amount", amount);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map<String, String> response = new HashMap<>();
        try {
            ResponseEntity<String> resp = restTemplate.postForEntity(
                "https://dev.khalti.com/api/v2/epayment/initiate/", request, String.class);
            if (resp.getStatusCode() == HttpStatus.OK && resp.getBody() != null && resp.getBody().contains("idx")) {
                response.put("status", "success");
            } else {
                response.put("status", "error");
            }
        } catch (Exception e) {
            response.put("status", "error");
        }
        return response;
    }

    @PostMapping("/esewa-success")
    public Map<String, String> esewaSuccess(@RequestBody Map<String, Object> payload) {
        String userEmail = (String) payload.get("userEmail");
        String name = (String) payload.get("name");
        String phone = (String) payload.get("phone");
        String address = (String) payload.get("address");
        String payment = (String) payload.get("payment");
        String productsJson = (String) payload.get("productsJson");
        Order order = new Order(null, userEmail, name, phone, address, payment, LocalDateTime.now(), productsJson, "SUCCESS");
        orderRepository.save(order);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        return response;
    }

    @PostMapping("/esewa-verify")
    public Map<String, String> verifyEsewa(@RequestBody Map<String, Object> payload) {
        String amt = String.valueOf(payload.get("amount"));
        String oid = (String) payload.get("oid");
        String refId = (String) payload.get("refId");

        // eSewa test verification endpoint
        String verificationUrl = "https://rc.esewa.com.np/epay/transrec";
        RestTemplate restTemplate = new RestTemplate();
        String params = "?amt=" + amt + "&scd=EPAYTEST&pid=" + oid + "&rid=" + refId;
        String url = verificationUrl + params;

        Map<String, String> response = new HashMap<>();
        try {
            String esewaResponse = restTemplate.getForObject(url, String.class);
            if (esewaResponse != null && esewaResponse.contains("<response_code>Success</response_code>")) {
                // Save order as SUCCESS
                Order order = new Order(
                    null,
                    (String) payload.get("userEmail"),
                    (String) payload.get("name"),
                    (String) payload.get("phone"),
                    (String) payload.get("address"),
                    (String) payload.get("payment"),
                    LocalDateTime.now(),
                    (String) payload.get("productsJson"),
                    "SUCCESS"
                );
                orderRepository.save(order);
                response.put("status", "success");
            } else {
                response.put("status", "fail");
            }
        } catch (Exception e) {
            response.put("status", "error");
        }
        return response;
    }
} 