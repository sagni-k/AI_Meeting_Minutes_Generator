package com.meetingminutes.api.service;

import com.meetingminutes.api.dto.TranscriptRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class AudioConversionServiceImpl implements AudioConversionService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${assemblyai.api.key}")
    private String assemblyApiKey;

    private static final String UPLOAD_URL = "https://api.assemblyai.com/v2/upload";
    private static final String TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript";

    private static final long POLL_INTERVAL_MS = 3000;
    private static final long MAX_POLL_DURATION_MS = 60_000;

    @Override
    public TranscriptRequest convertAudioToTranscript(MultipartFile audioFile) {

        try {
            // 1. Upload audio
            HttpHeaders uploadHeaders = new HttpHeaders();
            uploadHeaders.set("Authorization", assemblyApiKey);
            uploadHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            HttpEntity<byte[]> uploadEntity =
                    new HttpEntity<>(audioFile.getBytes(), uploadHeaders);

            ResponseEntity<Map> uploadResponse =
                    restTemplate.postForEntity(UPLOAD_URL, uploadEntity, Map.class);

            String audioUrl = (String) uploadResponse.getBody().get("upload_url");

            // 2. Start transcription
            HttpHeaders transcriptHeaders = new HttpHeaders();
            transcriptHeaders.set("Authorization", assemblyApiKey);
            transcriptHeaders.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, String>> transcriptEntity =
                    new HttpEntity<>(Map.of("audio_url", audioUrl), transcriptHeaders);

            ResponseEntity<Map> transcriptResponse =
                    restTemplate.postForEntity(TRANSCRIPT_URL, transcriptEntity, Map.class);

            String transcriptId = (String) transcriptResponse.getBody().get("id");

            // 3. Poll with timeout
            String pollingUrl = TRANSCRIPT_URL + "/" + transcriptId;
            long startTime = System.currentTimeMillis();

            while (true) {

                if (System.currentTimeMillis() - startTime > MAX_POLL_DURATION_MS) {
                    throw new RuntimeException("Transcription timed out");
                }

                ResponseEntity<Map> pollingResponse =
                        restTemplate.exchange(
                                pollingUrl,
                                HttpMethod.GET,
                                new HttpEntity<>(transcriptHeaders),
                                Map.class
                        );

                String status = (String) pollingResponse.getBody().get("status");

                if ("completed".equals(status)) {
                    TranscriptRequest request = new TranscriptRequest();
                    request.setTranscript((String) pollingResponse.getBody().get("text"));
                    return request;
                }

                if ("error".equals(status)) {
                    throw new RuntimeException("AssemblyAI transcription failed");
                }

                Thread.sleep(POLL_INTERVAL_MS);
            }

        } catch (Exception e) {
            throw new RuntimeException("Audio transcription failed", e);
        }
    }
}
