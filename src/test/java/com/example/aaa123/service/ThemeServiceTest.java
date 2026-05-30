package com.example.aaa123.service;

import com.example.aaa123.dto.ThemeResponse;
import com.example.aaa123.model.Theme;
import com.example.aaa123.repository.ReviewRepository;
import com.example.aaa123.repository.ThemeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ThemeServiceTest {

    @Mock
    private ThemeRepository themeRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ThemeService themeService;

    @Test
    @DisplayName("전체 테마 목록을 조회할 수 있다")
    void getAllThemes() {
        // given
        Theme theme = new Theme();
        theme.setId("1");
        theme.setTitle("Test Theme");
        theme.setDescription("Desc");
        theme.setPrice(1000);
        theme.setImageUrl("url");
        theme.setAuthor("author");
        theme.setCategory("modern");

        given(themeRepository.findAll()).willReturn(List.of(theme));
        given(reviewRepository.findAverageRatingByThemeId("1")).willReturn(0.0);
        given(reviewRepository.countByThemeId("1")).willReturn(0L);

        // when
        List<ThemeResponse> result = themeService.getAllThemes();

        // then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test Theme");
    }
}
