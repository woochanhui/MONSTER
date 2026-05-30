package com.example.aaa123.dto;

import com.example.aaa123.model.ThemeDesignConfig;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemeResponse {
    private String id;
    private String title;
    private String description;
    private String descriptionLong;
    private List<String> features;
    private String version;
    private int price;
    private String imageUrl;
    private String author;
    private String category;
    private double averageRating;
    private long reviewCount;
    private ThemeDesignConfig designConfig;
}
