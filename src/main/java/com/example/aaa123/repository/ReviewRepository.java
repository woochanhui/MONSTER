package com.example.aaa123.repository;

import com.example.aaa123.model.Review;
import com.example.aaa123.model.Theme;
import com.example.aaa123.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByThemeIdOrderByCreatedAtDesc(String themeId);
    boolean existsByUserAndTheme(User user, Theme theme);
    Optional<Review> findByIdAndUser(Long id, User user);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.theme.id = :themeId")
    double findAverageRatingByThemeId(@Param("themeId") String themeId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.theme.id = :themeId")
    long countByThemeId(@Param("themeId") String themeId);
}
