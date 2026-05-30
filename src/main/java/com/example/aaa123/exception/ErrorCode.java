package com.example.aaa123.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "잘못된 입력값입니다."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C002", "허용되지 않은 메소드입니다."),
    ENTITY_NOT_FOUND(HttpStatus.NOT_FOUND, "C003", "엔티티를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C004", "서버 오류가 발생했습니다."),
    INVALID_TYPE_VALUE(HttpStatus.BAD_REQUEST, "C005", "잘못된 타입입니다."),
    HANDLE_ACCESS_DENIED(HttpStatus.FORBIDDEN, "C006", "접근 권한이 없습니다."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "사용자를 찾을 수 없습니다."),
    EMAIL_DUPLICATION(HttpStatus.BAD_REQUEST, "U002", "이미 존재하는 이메일입니다."),
    LOGIN_INPUT_INVALID(HttpStatus.BAD_REQUEST, "U003", "로그인 정보가 일치하지 않습니다."),

    // Theme
    THEME_NOT_FOUND(HttpStatus.NOT_FOUND, "T001", "테마를 찾을 수 없습니다."),

    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "R001", "후기를 찾을 수 없습니다."),
    ALREADY_REVIEWED(HttpStatus.CONFLICT, "R002", "이미 후기를 작성하셨습니다."),
    NOT_PURCHASED_THEME(HttpStatus.FORBIDDEN, "R003", "구매한 테마에만 후기를 작성할 수 있습니다."),
    INVALID_RATING(HttpStatus.BAD_REQUEST, "R004", "별점은 1~5 사이여야 합니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
