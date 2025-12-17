package com.meetingminutes.api.controller;

import com.meetingminutes.api.dto.MeetingMinutesResponse;
import com.meetingminutes.api.dto.TranscriptRequest;
import com.meetingminutes.api.service.AudioConversionService;
import com.meetingminutes.api.service.MeetingMinutesService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class MeetingMinutesController {

    private final AudioConversionService audioConversionService;
    private final MeetingMinutesService meetingMinutesService;

    public MeetingMinutesController(
            AudioConversionService audioConversionService,
            MeetingMinutesService meetingMinutesService
    ) {
        this.audioConversionService = audioConversionService;
        this.meetingMinutesService = meetingMinutesService;
    }

    /**
     * Upload audio -> Speech-to-Text ONLY
     */
    @PostMapping("/upload-audio")
    public ResponseEntity<TranscriptRequest> uploadAudio(
            @RequestParam("file") MultipartFile audioFile
    ) {
        TranscriptRequest transcript =
                audioConversionService.convertAudioToTranscript(audioFile);

        return ResponseEntity.ok(transcript);
    }

    /**
     * Transcript -> LLM -> Meeting Minutes
     */
    @PostMapping("/process-transcript")
    public ResponseEntity<MeetingMinutesResponse> processTranscript(
            @Valid @RequestBody TranscriptRequest request
    ) {
        MeetingMinutesResponse response =
                meetingMinutesService.generateMeetingMinutes(request);

        return ResponseEntity.ok(response);
    }
}
