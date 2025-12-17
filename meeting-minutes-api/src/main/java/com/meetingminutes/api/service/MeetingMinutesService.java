package com.meetingminutes.api.service;

import com.meetingminutes.api.dto.MeetingMinutesResponse;
import com.meetingminutes.api.dto.TranscriptRequest;

public interface MeetingMinutesService {
    MeetingMinutesResponse generateMeetingMinutes(TranscriptRequest request);
}

