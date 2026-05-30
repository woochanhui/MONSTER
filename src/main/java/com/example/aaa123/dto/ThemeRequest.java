package com.example.aaa123.dto;

import com.example.aaa123.model.ThemeDesignConfig;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThemeRequest {
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
    private ThemeDesignConfig designConfig;
}
