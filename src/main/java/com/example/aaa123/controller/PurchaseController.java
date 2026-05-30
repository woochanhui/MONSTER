package com.example.aaa123.controller;

import com.example.aaa123.model.Purchase;
import com.example.aaa123.model.Theme;
import com.example.aaa123.model.User;
import com.example.aaa123.repository.PurchaseRepository;
import com.example.aaa123.repository.ThemeRepository;
import com.example.aaa123.repository.UserRepository;
import com.example.aaa123.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final ThemeRepository themeRepository;
    private final JwtTokenProvider tokenProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/my")
    public ResponseEntity<?> getMyPurchases(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        List<Purchase> purchases = purchaseRepository.findByUser(user);
        
        List<Map<String, Object>> response = purchases.stream().map(p -> Map.<String, Object>of(
            "id", p.getTheme().getId(),
            "title", p.getTheme().getTitle(),
            "description", p.getTheme().getDescription(),
            "price", p.getTheme().getPrice(),
            "imageUrl", p.getTheme().getImageUrl(),
            "author", p.getTheme().getAuthor(),
            "licenseKey", p.getLicenseKey(),
            "downloadUrl", p.getDownloadUrl(),
            "purchasedAt", p.getPurchasedAt().toString()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> recordPurchase(@RequestBody Map<String, String> payload, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        String themeId = payload.get("themeId");
        Theme theme = themeRepository.findById(themeId).orElse(null);
        if (theme == null) return ResponseEntity.badRequest().body("Theme not found");

        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setTheme(theme);
        purchase.setLicenseKey("LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        purchase.setDownloadUrl("/api/purchases/download/" + themeId);
        purchase.setPurchasedAt(LocalDateTime.now());

        purchaseRepository.save(purchase);

        return ResponseEntity.ok(Map.of(
            "licenseKey", purchase.getLicenseKey(),
            "downloadUrl", purchase.getDownloadUrl()
        ));
    }

    @GetMapping("/download/{themeId}")
    public ResponseEntity<?> downloadTheme(@PathVariable String themeId, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);
        if (user == null) return ResponseEntity.status(401).body("Unauthorized");

        Theme theme = themeRepository.findById(themeId).orElse(null);
        if (theme == null) return ResponseEntity.badRequest().body("Theme not found");

        boolean hasPurchased = purchaseRepository.findByUser(user).stream()
                .anyMatch(p -> p.getTheme().getId().equals(themeId));

        if (!hasPurchased) return ResponseEntity.status(403).body("You have not purchased this theme");

        Path skinPath = Paths.get("tistory_skin");
        if (!Files.exists(skinPath)) {
            return ResponseEntity.internalServerError().body("Template skin not found on server");
        }

        try (ByteArrayOutputStream baos = new ByteArrayOutputStream();
             ZipOutputStream zos = new ZipOutputStream(baos)) {

            String primaryColor = theme.getDesignConfig() != null ? theme.getDesignConfig().getPrimaryColor() : "#0070f3";
            String font = theme.getDesignConfig() != null ? theme.getDesignConfig().getFontFamily() : "sans";

            // Prepare preview image data
            byte[] previewImageData = null;
            if (theme.getImageUrl().startsWith("data:image")) {
                String base64Data = theme.getImageUrl().substring(theme.getImageUrl().indexOf(",") + 1);
                previewImageData = Base64.getDecoder().decode(base64Data);
            } else if (theme.getImageUrl().startsWith("/")) {
                Path imagePath = Paths.get("frontend/public" + theme.getImageUrl());
                if (Files.exists(imagePath)) {
                    previewImageData = Files.readAllBytes(imagePath);
                }
            }

            // Add all files from template except the ones we modify
            try (Stream<Path> paths = Files.walk(skinPath)) {
                List<Path> fileList = paths.filter(Files::isRegularFile).collect(Collectors.toList());
                for (Path file : fileList) {
                    String fileName = skinPath.relativize(file).toString().replace("\\", "/");
                    
                    if (fileName.equals("index.xml")) {
                        String content = Files.readString(file);
                        content = content.replace("<name>Odyssey</name>", "<name>" + theme.getTitle() + "</name>");
                        content = content.replace("<name>TISTORY</name>", "<name>" + theme.getAuthor() + "</name>");
                        addToZip(zos, fileName, content.getBytes());
                    } else if (fileName.equals("style.css")) {
                        String originalCss = Files.readString(file);
                        String customVars = String.format(":root {\n  --main-color: %s !important;\n  --font-family: %s !important;\n}\n\n", primaryColor, font);
                        // Aggressively replace the default Odyssey color (#0066cc in our modified style.css, or standard Odyssey colors if they exist)
                        String modifiedCss = originalCss.replace("#0066cc", primaryColor);
                        addToZip(zos, fileName, (customVars + modifiedCss).getBytes());
                    } else if (fileName.startsWith("preview") && fileName.endsWith(".jpg") && previewImageData != null) {
                        // Replace Tistory preview images with theme's actual image
                        addToZip(zos, fileName, previewImageData);
                    } else {
                        // Binary files (images, js, etc.)
                        addToZip(zos, fileName, Files.readAllBytes(file));
                    }
                }
            }

            zos.finish();
            byte[] zipBytes = baos.toByteArray();
            String filename = "theme-" + themeId + "-tistory-package.zip";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(zipBytes.length)
                    .body(zipBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error generating skin package: " + e.getMessage());
        }
    }

    private void addToZip(ZipOutputStream zos, String fileName, byte[] content) throws IOException {
        ZipEntry entry = new ZipEntry(fileName);
        zos.putNextEntry(entry);
        zos.write(content);
        zos.closeEntry();
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            if (tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getUsernameFromJWT(jwt);
                return userRepository.findByEmail(email).orElse(null);
            }
        }
        return null;
    }
}
