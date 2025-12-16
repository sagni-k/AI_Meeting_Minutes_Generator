package com.meetingminutes.api.dto;
import lombok.Data;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Builder
@Data
public class MeetingMinutesResponse {
    private UUID meetingId;
    private String summary;
    private List<String> keyDecisions;
    private List<ActionItem> actionItems;

}
