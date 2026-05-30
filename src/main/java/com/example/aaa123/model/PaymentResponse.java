package com.example.aaa123.model;

public record PaymentResponse(
    boolean success,
    String message,
    String downloadUrl,
    String licenseKey
) {}
