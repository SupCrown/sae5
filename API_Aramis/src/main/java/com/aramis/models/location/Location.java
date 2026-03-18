package com.aramis.models.location;

import com.aramis.models.driveway.Driveway;
import com.aramis.models.level.Level;
import com.aramis.models.zone.Zone;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.*;
import org.eclipse.collections.impl.map.primitive.LongKeysMap;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Integer locationID;

    @Column(nullable = false)
    public String locationCode;

    @ManyToOne
    @JoinColumn(nullable = false, name = "drivewayid")
    private Driveway driveway;

    @ManyToOne
    @JoinColumn(nullable = false, name = "levelid")
    private Level level;

    @Column(nullable = false)
    public Timestamp dateCreation;

    @Column(nullable = false)
    public Timestamp dateModification;

    @Override
    public String toString() {
        return driveway.toString() + " - "  + String.format("%04d", Integer.parseInt(locationCode))  + " - " + level.toString();
    }
}

