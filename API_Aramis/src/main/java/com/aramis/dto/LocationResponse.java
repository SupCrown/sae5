package com.aramis.dto;

import com.aramis.models.driveway.Driveway;
import com.aramis.models.level.Level;
import com.aramis.models.location.Location;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LocationResponse {
    public Integer locationID;
    public String locationCode;
    private DrivewayResponse driveway;
    private LevelResponse level;

    public LocationResponse(Location location) {
        locationID = location.getLocationID();
        locationCode = location.getLocationCode();
        driveway = new DrivewayResponse(location.getDriveway());
        level = new LevelResponse(location.getLevel());
    }
}