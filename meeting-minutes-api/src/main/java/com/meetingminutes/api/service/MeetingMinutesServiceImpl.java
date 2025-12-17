package com.meetingminutes.api.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meetingminutes.api.dto.ActionItem;
import com.meetingminutes.api.dto.MeetingMinutesResponse;
import com.meetingminutes.api.dto.TranscriptRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MeetingMinutesServiceImpl implements MeetingMinutesService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${groq.api.key}")
    private String groqApiKey;

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=%s";

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    private static final String GROQ_MODEL = "llama-3.1-8b-instant";
    private static final int CHUNK_SIZE = 3000;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public MeetingMinutesResponse generateMeetingMinutes(TranscriptRequest request) {

        List<String> chunks = chunkTranscript(request.getTranscript());

        List<String> summaries = new ArrayList<>();
        Set<String> decisions = new LinkedHashSet<>();
        List<ActionItem> actionItems = new ArrayList<>();

        for (String chunk : chunks) {
            String prompt = buildChunkPrompt(chunk);

            String llmResponse = request.isCallGemini()
                    ? callGemini(prompt)
                    : callGroq(prompt);

            try {
                JsonNode json = objectMapper.readTree(extractJson(llmResponse));

                summaries.add(json.get("summary").asText());

                json.get("keyDecisions").forEach(d ->
                        decisions.add(d.asText()));

                json.get("actionItems").forEach(ai ->
                        actionItems.add(new ActionItem(
                                ai.get("description").asText(),
                                ai.get("owner").asText()
                        )));

            } catch (Exception e) {
                throw new RuntimeException("Failed to parse LLM response", e);
            }
        }

        String finalSummaryPrompt = buildFinalSummaryPrompt(summaries);
        String finalSummary = request.isCallGemini()
                ? callGemini(finalSummaryPrompt)
                : callGroq(finalSummaryPrompt);

        return MeetingMinutesResponse.builder()
                .meetingId(UUID.randomUUID())
                .summary(finalSummary)
                .keyDecisions(new ArrayList<>(decisions))
                .actionItems(actionItems)
                .build();
    }

    /* ================= Helpers ================= */

    private List<String> chunkTranscript(String transcript) {
        List<String> chunks = new ArrayList<>();
        for (int i = 0; i < transcript.length(); i += CHUNK_SIZE) {
            chunks.add(transcript.substring(i, Math.min(i + CHUNK_SIZE, transcript.length())));
        }
        return chunks;
    }

    private String buildChunkPrompt(String chunk) {
        return """
You are generating structured meeting minutes.

Return STRICT JSON only:

{
  "summary": "...",
  "keyDecisions": ["..."],
  "actionItems": [
    { "description": "...", "owner": "..." }
  ]
}

Transcript:
\"\"\"
%s
\"\"\"
""".formatted(chunk);
    }

    private String buildFinalSummaryPrompt(List<String> summaries) {
        return """
Merge the following summaries into one coherent summary (max 5 sentences).

%s
""".formatted(String.join("\n", summaries));
    }

    private String callGemini(String prompt) {

        String url = String.format(GEMINI_URL, geminiApiKey);

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, jsonHeaders());

        for (int i = 0; i < 3; i++) {
            try {
                ResponseEntity<Map> response =
                        restTemplate.postForEntity(url, entity, Map.class);

                Map content = (Map) ((Map)
                        ((List) response.getBody().get("candidates"))
                                .get(0)).get("content");

                return (String) ((Map)
                        ((List) content.get("parts")).get(0)).get("text");

            } catch (HttpServerErrorException.ServiceUnavailable e) {
                sleep(1000L * (i + 1));
            }
        }

        throw new RuntimeException("Gemini overloaded");
    }

    private String callGroq(String prompt) {

        Map<String, Object> body = Map.of(
                "model", GROQ_MODEL,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.2
        );

        HttpHeaders headers = jsonHeaders();
        headers.setBearerAuth(groqApiKey);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(
                        GROQ_URL,
                        new HttpEntity<>(body, headers),
                        Map.class
                );

        try {
            Map responseBody = response.getBody();
            List choices = (List) responseBody.get("choices");
            Map firstChoice = (Map) choices.get(0);
            Map message = (Map) firstChoice.get("message");
            return (String) message.get("content");

        } catch (Exception e) {
            throw new RuntimeException("Invalid Groq response format", e);
        }
    }


    private HttpHeaders jsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    private String extractJson(String raw) {
        raw = raw.trim();
        if (raw.startsWith("```")) {
            raw = raw.replaceFirst("^```[a-zA-Z]*", "").replaceFirst("```$", "").trim();
        }
        return raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1);
    }

    private void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }
}

