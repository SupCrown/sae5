package com.aramis.dto;

import com.aramis.models.zone.Zone;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ZoneResponse {
    private Integer zoneID;
    private String zoneName;

    public ZoneResponse(Zone zone) {
        zoneID = zone.getZoneID();
        zoneName = zone.getZoneName();
    }
}
