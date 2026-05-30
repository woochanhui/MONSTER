package com.example.aaa123.service;

import com.example.aaa123.dto.ReviewRequest;
import com.example.aaa123.dto.ReviewResponse;
import com.example.aaa123.dto.ReviewUpdateRequest;
import com.example.aaa123.exception.BusinessException;
import com.example.aaa123.exception.ErrorCode;
import com.example.aaa123.model.Review;
import com.example.aaa123.model.Theme;
import com.example.aaa123.model.User;
import com.example.aaa123.repository.PurchaseRepository;
import com.example.aaa123.repository.ReviewRepository;
import com.example.aaa123.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ThemeRepository themeRepository;
    private final PurchaseRepository purchaseRepository;

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByThemeId(String themeId) {
        return reviewRepository.findByThemeIdOrderByCreatedAtDesc(themeId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, User user) {
        Theme theme = themeRepository.findById(request.getThemeId())
                .orElseThrow(() -> new BusinessException(ErrorCode.THEME_NOT_FOUND));

        if (!purchaseRepository.existsByUserAndTheme(user, theme)) {
            throw new BusinessException(ErrorCode.NOT_PURCHASED_THEME);
        }

        if (reviewRepository.existsByUserAndTheme(user, theme)) {
            throw new BusinessException(ErrorCode.ALREADY_REVIEWED);
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BusinessException(ErrorCode.INVALID_RATING);
        }

        Review review = new Review();
        review.setUser(user);
        review.setTheme(theme);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateReview(Long reviewId, ReviewUpdateRequest request, User user) {
        Review review = reviewRepository.findByIdAndUser(reviewId, user)
                .orElseThrow(() -> new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED));

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BusinessException(ErrorCode.INVALID_RATING);
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public void deleteReview(Long reviewId, User user) {
        Review review = reviewRepository.findByIdAndUser(reviewId, user)
                .orElseThrow(() -> new BusinessException(ErrorCode.HANDLE_ACCESS_DENIED));

        reviewRepository.delete(review);
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .themeId(review.getTheme().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
