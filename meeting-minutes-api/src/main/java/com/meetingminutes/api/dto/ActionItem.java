package com.meetingminutes.api.dto;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ActionItem {
    private String description;
    private String owner;
}
