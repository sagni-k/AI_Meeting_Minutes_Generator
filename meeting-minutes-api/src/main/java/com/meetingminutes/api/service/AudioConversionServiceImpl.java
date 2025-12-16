//AudioConversionService Implementation

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

    @Override
    public TranscriptRequest convertAudioToTranscript(MultipartFile audioFile) {

        try {
            // 1. Upload audio file
            HttpHeaders uploadHeaders = new HttpHeaders();
            uploadHeaders.set("Authorization", assemblyApiKey);
            uploadHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);

            HttpEntity<byte[]> uploadEntity =
                    new HttpEntity<>(audioFile.getBytes(), uploadHeaders);

            ResponseEntity<Map> uploadResponse =
                    restTemplate.postForEntity(UPLOAD_URL, uploadEntity, Map.class);

            String audioUrl = (String) uploadResponse.getBody().get("upload_url");

            // 2. Request transcription
            HttpHeaders transcriptHeaders = new HttpHeaders();
            transcriptHeaders.set("Authorization", assemblyApiKey);
            transcriptHeaders.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> transcriptRequestBody = Map.of(
                    "audio_url", audioUrl
            );

            HttpEntity<Map<String, String>> transcriptEntity =
                    new HttpEntity<>(transcriptRequestBody, transcriptHeaders);

            ResponseEntity<Map> transcriptResponse =
                    restTemplate.postForEntity(
                            TRANSCRIPT_URL,
                            transcriptEntity,
                            Map.class
                    );

            String transcriptId = (String) transcriptResponse.getBody().get("id");

            // 3. Poll until transcription completes (SYNC)
            String pollingUrl = TRANSCRIPT_URL + "/" + transcriptId;

            while (true) {
                HttpEntity<Void> pollingEntity =
                        new HttpEntity<>(transcriptHeaders);

                ResponseEntity<Map> pollingResponse =
                        restTemplate.exchange(
                                pollingUrl,
                                HttpMethod.GET,
                                pollingEntity,
                                Map.class
                        );

                String status = (String) pollingResponse.getBody().get("status");

                if ("completed".equals(status)) {
                    String text = (String) pollingResponse.getBody().get("text");

                    TranscriptRequest request = new TranscriptRequest();
                    request.setTranscript(text);
                    return request;
                }

                if ("error".equals(status)) {
                    throw new RuntimeException("AssemblyAI transcription failed");
                }

                // Wait before next poll (blocking, as requested)
                Thread.sleep(3000);
            }

        } catch (Exception e) {
            throw new RuntimeException("Audio transcription failed", e);
        }
    }
}

