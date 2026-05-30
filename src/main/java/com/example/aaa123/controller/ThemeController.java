package com.example.aaa123.controller;

import com.example.aaa123.dto.ThemeRequest;
import com.example.aaa123.dto.ThemeResponse;
import com.example.aaa123.service.ThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/themes")
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeService themeService;

    @GetMapping
    public List<ThemeResponse> getThemes() {
        return themeService.getAllThemes();
    }

    @PostMapping
    public ThemeResponse createTheme(@RequestBody ThemeRequest request) {
        return themeService.createTheme(request);
    }

    @PutMapping("/{id}")
    public ThemeResponse updateTheme(@PathVariable String id, @RequestBody ThemeRequest request) {
        return themeService.updateTheme(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteTheme(@PathVariable String id) {
        themeService.deleteTheme(id);
    }
}
