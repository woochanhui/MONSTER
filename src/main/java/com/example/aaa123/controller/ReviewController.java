package com.example.aaa123.controller;

import com.example.aaa123.dto.ReviewRequest;
import com.example.aaa123.dto.ReviewResponse;
import com.example.aaa123.dto.ReviewUpdateRequest;
import com.example.aaa123.model.User;
import com.example.aaa123.repository.UserRepository;
import com.example.aaa123.security.JwtTokenProvider;
import com.example.aaa123.service.ReviewService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @GetMapping("/api/themes/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getReviews(@PathVariable String id) {
        return ResponseEntity.ok(reviewService.getReviewsByThemeId(id));
    }

    @PostMapping("/api/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @RequestBody ReviewRequest request,
            HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(httpRequest);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(reviewService.createReview(request, user));
    }

    @PutMapping("/api/reviews/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long id,
            @RequestBody ReviewUpdateRequest request,
            HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(httpRequest);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(reviewService.updateReview(id, request, user));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long id,
            HttpServletRequest httpRequest) {
        User user = getAuthenticatedUser(httpRequest);
        if (user == null) return ResponseEntity.status(401).build();
        reviewService.deleteReview(id, user);
        return ResponseEntity.noContent().build();
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            if (tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getUsernameFromJWT(jwt);
                return userRepository.findByEmail(email).orElse(null);
            }
        }
        return null;
    }
}
