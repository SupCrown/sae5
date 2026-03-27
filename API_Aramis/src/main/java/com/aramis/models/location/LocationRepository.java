package com.aramis.models.location;

import com.aramis.models.driveway.Driveway;
import com.aramis.models.level.Level;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface LocationRepository extends CrudRepository<Location, Integer> {
    @Query("select l from Location l " +
            "join Level ll on l.level.levelID = ll.levelID " +
            "join Driveway d on l.driveway.drivewayID = d.drivewayID " +
            "join Zone z on d.zone.zoneID = z.zoneID " +
            "where l.locationCode = ?1 and ll.levelValue = ?2 and d.name = ?3 and z.zoneName = ?4")
    Optional<Location> findByCodeLevelDrivewayAndZone(String locationCode, String levelValue, String drivewayName, String zoneName);

    Iterable<Location> findAll(Pageable pageable);

    Optional<Location> findByDrivewayAndLevel(Driveway driveway, Level level);
}
