package com.meetingminutes.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TranscriptRequest {
    @NotBlank
    private String transcript;
}
