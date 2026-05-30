package com.example.aaa123.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private String themeId;
    private int rating;
    private String comment;
}
