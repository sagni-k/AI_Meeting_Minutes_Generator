//AudioConversionService Interface


package com.meetingminutes.api.service;

import com.meetingminutes.api.dto.TranscriptRequest;
import org.springframework.web.multipart.MultipartFile;

public interface AudioConversionService {
    TranscriptRequest convertAudioToTranscript(MultipartFile audioFile);
}
