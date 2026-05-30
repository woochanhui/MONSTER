package com.example.aaa123.config;

import com.example.aaa123.model.Theme;
import com.example.aaa123.model.ThemeDesignConfig;
import com.example.aaa123.model.User;
import com.example.aaa123.repository.ThemeRepository;
import com.example.aaa123.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(ThemeRepository themeRepository, UserRepository userRepository) {
        return args -> {
            // Theme Data
            Theme t1 = new Theme();
            t1.setId("1");
            t1.setTitle("NexGen SaaS");
            t1.setDescription("스타트업과 소프트웨어 제품을 위한 혁신적인 랜딩 페이지 테마");
            t1.setDescriptionLong("NexGen SaaS는 현대적인 기술 기업의 성장을 위해 설계되었습니다. 깔끔한 히어로 섹션, 동적인 가격표, 그리고 사용자의 신뢰를 높여주는 서비스 소개 레이아웃을 통해 전환율을 극대화하세요. 다크 모드와 고해상도 그래픽 지원으로 당신의 기술력을 돋보이게 합니다.");
            t1.setFeatures(List.of("A/B 테스트 최적화 레이아웃", "동적 가격 체계표", "실시간 채팅 위젯 통합", "다크/라이트 테마 스위처", "고성능 퍼포먼스 (99+ Lighthouse)"));
            t1.setVersion("1.0.0");
            t1.setPrice(59000);
            t1.setImageUrl("/themes/saas.svg");
            t1.setAuthor("SaaSFlow");
            t1.setCategory("saas");
            t1.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#0070f3")
                    .fontFamily("sans")
                    .layoutType("sidebar-right")
                    .darkModeDefault(false)
                    .backgroundStyle("dots")
                    .build());

            Theme t2 = new Theme();
            t2.setId("2");
            t2.setTitle("CulinaryArt");
            t2.setDescription("미쉐린 가이드 스타일의 고품격 레스토랑 및 셰프 블로그 테마");
            t2.setDescriptionLong("음식의 풍미를 시각적으로 전달하는 CulinaryArt는 고급 레스토랑과 파인 다이닝을 위해 제작되었습니다. 고해상도 메뉴판, 실시간 예약 시스템 연동, 그리고 감각적인 갤러리 레이아웃을 통해 고객에게 잊지 못할 첫인상을 선사하세요.");
            t2.setFeatures(List.of("인터랙티브 디지털 메뉴판", "실시간 테이블 예약 모듈", "셰프 스페셜 스토리텔링 섹션", "고해상도 푸드 갤러리", "Google Maps 위치 연동"));
            t2.setVersion("2.1.0");
            t2.setPrice(45000);
            t2.setImageUrl("/themes/culinary.svg");
            t2.setAuthor("ChefDesign");
            t2.setCategory("food");
            t2.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#eab308")
                    .fontFamily("serif")
                    .layoutType("centered")
                    .darkModeDefault(false)
                    .backgroundStyle("none")
                    .build());

            Theme t3 = new Theme();
            t3.setId("3");
            t3.setTitle("EstateVision");
            t3.setDescription("신뢰와 전문성을 강조하는 부동산 매물 관리 및 중개 플랫폼 테마");
            t3.setDescriptionLong("EstateVision은 부동산 전문가를 위한 강력한 도구입니다. 매물 검색 필터, VR 투어 지원 섹션, 그리고 상세 지도 보기를 통해 고객이 원하는 집을 쉽고 빠르게 찾을 수 있도록 돕습니다. 신뢰감을 주는 블루/화이트 톤의 디자인이 특징입니다.");
            t3.setFeatures(List.of("고급 매물 검색 필터", "360도 VR 투어 임베드", "중개인 1:1 상담 폼", "매물 비교 바구니", "지역별 시세 대시보드"));
            t3.setVersion("3.2.0");
            t3.setPrice(69000);
            t3.setImageUrl("/themes/estate.svg");
            t3.setAuthor("UrbanBuild");
            t3.setCategory("business");
            t3.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#1e40af")
                    .fontFamily("serif")
                    .layoutType("centered")
                    .darkModeDefault(false)
                    .backgroundStyle("grid")
                    .build());

            Theme t4 = new Theme();
            t4.setId("4");
            t4.setTitle("EduPulse");
            t4.setDescription("학습 효율을 높여주는 온라인 강의 및 교육 플랫폼 전용 테마");
            t4.setDescriptionLong("EduPulse는 지식 공유의 가치를 극대화합니다. 깔끔한 강의 커리큘럼 표시, 학습 진도 관리 UI, 그리고 퀴즈 및 과제 제출 시스템을 위한 레이아웃을 제공합니다. 학생과 강사 모두에게 최상의 학습 경험을 제공하도록 설계되었습니다.");
            t4.setFeatures(List.of("강의 커리큘럼 타임라인", "학습 진도 대시보드", "비디오 플레이어 커스텀 UI", "수료증 자동 생성 레이아웃", "Q&A 커뮤니티 섹션"));
            t4.setVersion("1.1.5");
            t4.setPrice(55000);
            t4.setImageUrl("/themes/education.svg");
            t4.setAuthor("EduTech");
            t4.setCategory("edu");
            t4.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#10b981")
                    .fontFamily("sans")
                    .layoutType("sidebar-left")
                    .darkModeDefault(false)
                    .backgroundStyle("none")
                    .build());

            Theme t5 = new Theme();
            t5.setId("5");
            t5.setTitle("FitTrack Pro");
            t5.setDescription("퍼스널 트레이너와 헬스장을 위한 역동적인 피트니스 센터 테마");
            t5.setDescriptionLong("에너지가 넘치는 디자인의 FitTrack Pro는 운동 동기를 부여합니다. PT 예약 스케줄러, 운동 프로그램 가이드, 그리고 회원들의 생생한 비포/애프터 갤러리를 통해 당신의 피트니스 비즈니스를 한 단계 업그레이드하세요.");
            t5.setFeatures(List.of("PT 실시간 예약 캘린더", "운동 프로그램 관리 도구", "비포/애프터 비교 슬라이더", "헬스장 시설 VR 투어", "회원권 결제 연동 UI"));
            t5.setVersion("2.0.1");
            t5.setPrice(39000);
            t5.setImageUrl("/themes/user_theme_5.png");
            t5.setAuthor("ActiveLife");
            t5.setCategory("fitness");
            t5.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#f43f5e")
                    .fontFamily("sans")
                    .layoutType("sidebar-right")
                    .darkModeDefault(true)
                    .backgroundStyle("none")
                    .build());

            Theme t6 = new Theme();
            t6.setId("6");
            t6.setTitle("TravelBound");
            t6.setDescription("전 세계의 숨은 보석을 소개하는 여행사 및 여행 작가 전용 테마");
            t6.setDescriptionLong("TravelBound는 당신의 여행을 한 편의 영화처럼 만들어줍니다. 고화질 풍경 사진에 최적화된 풀스크린 레이아웃과 지도 기반의 여행 코스 추천 기능을 통해 독자들에게 생생한 여행 경험을 전달하세요. 감성적인 브이로그 연동도 지원합니다.");
            t6.setFeatures(List.of("인터랙티브 여행 지도", "코스별 일정 플래너", "고해상도 파노라마 갤러리", "유튜브/틱톡 브이로그 연동", "현지 통화 환율 계산기"));
            t6.setVersion("1.3.0");
            t6.setPrice(42000);
            t6.setImageUrl("/themes/travel.svg");
            t6.setAuthor("NomadSoul");
            t6.setCategory("travel");
            t6.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#8b5cf6")
                    .fontFamily("serif")
                    .layoutType("sidebar-left")
                    .darkModeDefault(false)
                    .backgroundStyle("none")
                    .build());

            Theme t7 = new Theme();
            t7.setId("7");
            t7.setTitle("User Custom Theme");
            t7.setDescription("사용자가 직접 업로드한 커스텀 디자인 테마");
            t7.setDescriptionLong("이 테마는 사용자가 직접 업로드한 이미지를 기반으로 생성되었습니다. 플랫폼의 유연한 디자인 엔진을 통해 즉시 마켓플레이스에 등록되었습니다.");
            t7.setFeatures(List.of("사용자 정의 업로드", "커스텀 썸네일 적용", "동적 레이아웃 지원"));
            t7.setVersion("1.0.0");
            t7.setPrice(15000);
            t7.setImageUrl("/themes/user_theme_7.png");
            t7.setAuthor("UserContributor");
            t7.setCategory("modern");
            t7.setDesignConfig(ThemeDesignConfig.builder()
                    .primaryColor("#6366f1")
                    .fontFamily("sans")
                    .layoutType("sidebar-left")
                    .darkModeDefault(false)
                    .backgroundStyle("none")
                    .build());

            themeRepository.deleteAll();
            themeRepository.saveAll(List.of(t1, t2, t3, t4, t5, t6, t7));

            // User Data
            if (userRepository.findByEmail("test@example.com").isEmpty()) {
                User testUser = new User();
                testUser.setEmail("test@example.com");
                testUser.setPassword(passwordEncoder.encode("password123"));
                testUser.setName("테스트 유저");
                testUser.setRole("ROLE_USER");
                userRepository.save(testUser);
            }

            if (userRepository.findByEmail("admin@example.com").isEmpty()) {
                User adminUser = new User();
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setName("관리자");
                adminUser.setRole("ROLE_ADMIN");
                userRepository.save(adminUser);
            }
        };
    }
}
