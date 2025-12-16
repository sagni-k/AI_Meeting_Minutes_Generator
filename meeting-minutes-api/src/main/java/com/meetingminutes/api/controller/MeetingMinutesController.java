package com.meetingminutes.api.controller;

import com.meetingminutes.api.dto.TranscriptRequest;
import com.meetingminutes.api.dto.MeetingMinutesResponse;
import com.meetingminutes.api.service.AudioConversionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class MeetingMinutesController {

    private final AudioConversionService audioConversionService;

    public MeetingMinutesController(AudioConversionService audioConversionService) {
        this.audioConversionService = audioConversionService;
    }

    @PostMapping("/process-transcript")
    public ResponseEntity<MeetingMinutesResponse> processTranscript(
            @Valid @RequestBody TranscriptRequest request
    ) {
        return ResponseEntity.ok(null);
    }

    // TEMPORARY: testing STT only
    @PostMapping("/upload-audio")
    public ResponseEntity<TranscriptRequest> uploadAudio(
            @RequestParam("file") MultipartFile audioFile
    ) {
        TranscriptRequest transcript =
                audioConversionService.convertAudioToTranscript(audioFile);

        return ResponseEntity.ok(transcript);
    }
}
