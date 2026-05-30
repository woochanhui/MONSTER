package com.example.aaa123.controller;

import com.example.aaa123.model.PaymentRequest;
import com.example.aaa123.model.PaymentResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @PostMapping("/verify")
    public PaymentResponse verifyPayment(@RequestBody PaymentRequest request) {
        // Simulate PG verification
        if (request.paymentKey() != null && !request.paymentKey().isEmpty()) {
            String licenseKey = "LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            String downloadUrl = "https://example.com/download/themes/" + request.themeId() + "?token=" + UUID.randomUUID();
            
            return new PaymentResponse(
                true,
                "Payment verified successfully.",
                downloadUrl,
                licenseKey
            );
        } else {
            return new PaymentResponse(
                false,
                "Payment verification failed.",
                null,
                null
            );
        }
    }
}
