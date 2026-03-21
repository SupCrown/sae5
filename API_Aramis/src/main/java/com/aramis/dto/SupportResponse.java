package com.aramis.dto;

import com.aramis.models.support.Support;
import com.aramis.models.supportType.SupportType;
import com.aramis.models.user.User;
import com.aramis.utils.EPrepareStatus;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.sql.Date;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportResponse {
    public Integer supportID;
    public String nestedProductsPlacements;
    private EPrepareStatus status;
    private UserResponse preparer;
    private SupportType type;
    public Date datePreparation;
    public List<ProductSupportResponse> products;

    public SupportResponse(Support support, List<ProductSupportResponse> products) {
        supportID = support.getSupportID();
        nestedProductsPlacements = support.getNestedProductsPlacements();
        status = support.getStatus();
        if (support.getUser() != null) {
            preparer = new UserResponse(support.getUser());
        }
        datePreparation = support.getDatePreparation();
        this.products = products;
    }
}
