package com.example.aaa123.model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ThemeDesignConfig {
    private String primaryColor;
    private String fontFamily; // sans, serif, mono
    private String layoutType; // sidebar-left, sidebar-right, centered
    private boolean darkModeDefault;
    private String backgroundStyle; // dots, grid, none
}
