package com.example.aaa123.repository;

import com.example.aaa123.model.Purchase;
import com.example.aaa123.model.Theme;
import com.example.aaa123.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUser(User user);
    boolean existsByUserAndTheme(User user, Theme theme);
}
