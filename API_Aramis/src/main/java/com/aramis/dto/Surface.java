package com.aramis.dto;

import java.util.Map;
import com.github.skjolber.packing.api.Surface.Label;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Surface {
    public Label label;
    public Map<String, ?> attributes;

    public Surface(com.github.skjolber.packing.api.Surface surface) {
        this.label = surface.getLabel();
        this.attributes = surface.getAttributes();
    }
}
