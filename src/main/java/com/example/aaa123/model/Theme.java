package com.example.aaa123.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Theme {
    @Id
    private String id;
    private String title;
    private String description;
    private int price;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private String author;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String descriptionLong;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "theme_features", joinColumns = @JoinColumn(name = "theme_id"))
    @Column(name = "feature")
    private List<String> features = new ArrayList<>();

    private String version;

    @Embedded
    private ThemeDesignConfig designConfig;
}
