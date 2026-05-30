package com.example.aaa123.service;

import com.example.aaa123.dto.ThemeRequest;
import com.example.aaa123.dto.ThemeResponse;
import com.example.aaa123.exception.BusinessException;
import com.example.aaa123.exception.ErrorCode;
import com.example.aaa123.model.Theme;
import com.example.aaa123.repository.ReviewRepository;
import com.example.aaa123.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThemeService {

    private final ThemeRepository themeRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public List<ThemeResponse> getAllThemes() {
        return themeRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ThemeResponse createTheme(ThemeRequest request) {
        Theme theme = new Theme();
        mapToEntity(request, theme);
        return toResponse(themeRepository.save(theme));
    }

    @Transactional
    public ThemeResponse updateTheme(String id, ThemeRequest request) {
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.THEME_NOT_FOUND));
        mapToEntity(request, theme);
        return toResponse(themeRepository.save(theme));
    }

    @Transactional
    public void deleteTheme(String id) {
        if (!themeRepository.existsById(id)) {
            throw new BusinessException(ErrorCode.THEME_NOT_FOUND);
        }
        themeRepository.deleteById(id);
    }

    private void mapToEntity(ThemeRequest request, Theme theme) {
        theme.setId(request.getId());
        theme.setTitle(request.getTitle());
        theme.setDescription(request.getDescription());
        theme.setDescriptionLong(request.getDescriptionLong());
        theme.setFeatures(request.getFeatures());
        theme.setVersion(request.getVersion());
        theme.setPrice(request.getPrice());
        theme.setImageUrl(request.getImageUrl());
        theme.setAuthor(request.getAuthor());
        theme.setCategory(request.getCategory());
        theme.setDesignConfig(request.getDesignConfig());
    }

    private ThemeResponse toResponse(Theme theme) {
        return ThemeResponse.builder()
                .id(theme.getId())
                .title(theme.getTitle())
                .description(theme.getDescription())
                .descriptionLong(theme.getDescriptionLong())
                .features(theme.getFeatures())
                .version(theme.getVersion())
                .price(theme.getPrice())
                .imageUrl(theme.getImageUrl())
                .author(theme.getAuthor())
                .category(theme.getCategory())
                .averageRating(reviewRepository.findAverageRatingByThemeId(theme.getId()))
                .reviewCount(reviewRepository.countByThemeId(theme.getId()))
                .designConfig(theme.getDesignConfig())
                .build();
    }
}
