package com.example.aaa123.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String themeId;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
