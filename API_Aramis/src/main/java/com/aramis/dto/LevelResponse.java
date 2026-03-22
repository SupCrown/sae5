package com.aramis.dto;

import com.aramis.models.level.Level;
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
public class LevelResponse {
    private Integer levelID;
    private Integer levelValue;

    public LevelResponse(Level level) {
        levelID = level.getLevelID();
        levelValue = level.getLevelValue();
    }
}
