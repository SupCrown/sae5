package com.aramis.dto;

import com.aramis.models.order.Order;
import com.aramis.models.support.Support;
import com.aramis.models.supportType.SupportType;
import com.aramis.utils.EPrepareStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportRequest {
    @NotNull
    private Integer typeID;
    @NotNull
    public List<ProductSupportRequest> products;

    public Support toSupport(Order order, SupportType type) {
        Timestamp now = new Timestamp(System.currentTimeMillis());

        Support support = new Support();
        support.setStatus(EPrepareStatus.Pending);
        support.setOrder(order);
        support.setType(type);
        support.setDateCreation(now);
        support.setDateModification(now);

        return support;
    }
}
