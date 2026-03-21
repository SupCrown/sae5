package com.aramis.dto;

import com.aramis.models.user.User;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatsResponse {
    UserResponse user;
    int ordersNumberOfAllTime;
    int supportsNumberOfAllTime;
    int productsNumberOfAllTime;
    int ordersNumberOfTheDay;
    int supportsNumberOfTheDay;
    int productsNumberOfTheDay;
}
