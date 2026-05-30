package com.example.aaa123.model;

public record PaymentRequest(
    String orderId,
    String paymentKey,
    double amount,
    String themeId
) {}
