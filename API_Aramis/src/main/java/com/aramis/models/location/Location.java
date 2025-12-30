package com.aramis.models.location;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@IdClass(LocationCompsiteKey.class)
@Getter
@Setter
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public int LocationID;
    @Id
    public int DrivewayID;
    @Column(nullable = false)
    public String LocationCode;
    @Column(nullable = false)
    public int WhiteCode;
    @Column(nullable = false)
    public int RedCode;
    @Column(nullable = false)
    public int GreenCode;
    @Column(nullable = false)
    public int YellowCode;
    @Column(nullable = false)
    public int BlueCode;
    @Column(nullable = false)
    public int LevelID;
    @Column(nullable = false)
    public int ProductID;
}

