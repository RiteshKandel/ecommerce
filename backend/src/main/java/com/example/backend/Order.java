package com.example.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String userEmail;
    private String name;
    private String phone;
    private String address;
    private String payment;
    private LocalDateTime date;
    @Lob
    private String productsJson;
    private String paymentStatus; // e.g., PENDING, SUCCESS, FAILED

    public Order() {}

    public Order(Long id, String userEmail, String name, String phone, String address, String payment, LocalDateTime date, String productsJson, String paymentStatus) {
        this.id = id;
        this.userEmail = userEmail;
        this.name = name;
        this.phone = phone;
        this.address = address;
        this.payment = payment;
        this.date = date;
        this.productsJson = productsJson;
        this.paymentStatus = paymentStatus;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getPayment() { return payment; }
    public void setPayment(String payment) { this.payment = payment; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public String getProductsJson() { return productsJson; }
    public void setProductsJson(String productsJson) { this.productsJson = productsJson; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
} 