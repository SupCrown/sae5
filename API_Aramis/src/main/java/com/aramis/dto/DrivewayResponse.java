package com.aramis.dto;

import com.aramis.models.driveway.Driveway;
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
public class DrivewayResponse {
    public Integer drivewayID;
    public String name;
    private ZoneResponse zone;

    public DrivewayResponse(Driveway driveway) {
        drivewayID = driveway.getDrivewayID();
        name = driveway.getName();
        zone = new ZoneResponse(driveway.getZone());
    }
}

