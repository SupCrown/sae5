CREATE TABLE User_(
   UserID SERIAL,
   Login SMALLINT NOT NULL,
   Name VARCHAR(100) NOT NULL,
   Firstname VARCHAR(100) NOT NULL,
   IsAdmin BOOLEAN NOT NULL,
   PRIMARY KEY(UserID)
);

CREATE TABLE Product(
   ProductID SERIAL,
   ProductCode INTEGER NOT NULL,
   Height INTEGER NOT NULL,
   Length INTEGER NOT NULL,
   Width INTEGER NOT NULL,
   PRIMARY KEY(ProductID)
);

CREATE TABLE Driveway(
   DrivewayID SERIAL,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(DrivewayID)
);

CREATE TABLE Zone(
   ZoneID SERIAL,
   Name VARCHAR(50) NOT NULL,
   PRIMARY KEY(ZoneID)
);

CREATE TABLE SupportType(
   TypeID SERIAL,
   Label VARCHAR(50) NOT NULL,
   Capacity INTEGER NOT NULL,
   PRIMARY KEY(TypeID)
);

CREATE TABLE Level(
   LevelID SERIAL,
   Value_ SMALLINT NOT NULL,
   PRIMARY KEY(LevelID)
);

CREATE TABLE Customer(
   CurstomerID VARCHAR(50),
   Code SMALLINT NOT NULL,
   Name VARCHAR(100) NOT NULL,
   PRIMARY KEY(CurstomerID)
);

CREATE TABLE Order_(
   OrderID SERIAL,
   OrderDate TIMESTAMP,
   Status INTEGER NOT NULL,
   CurstomerID VARCHAR(50) NOT NULL,
   PRIMARY KEY(OrderID),
   FOREIGN KEY(CurstomerID) REFERENCES Customer(CurstomerID)
);

CREATE TABLE Support(
   SupportID SERIAL,
   NestedProductsPlacments TEXT,
   TypeID INTEGER NOT NULL,
   UserID INTEGER NOT NULL,
   OrderID INTEGER NOT NULL,
   PRIMARY KEY(SupportID),
   FOREIGN KEY(TypeID) REFERENCES SupportType(TypeID),
   FOREIGN KEY(UserID) REFERENCES User_(UserID),
   FOREIGN KEY(OrderID) REFERENCES Order_(OrderID)
);

CREATE TABLE Location(
   LocationID SERIAL,
   LocationCode VARCHAR(50) NOT NULL,
   WhiteCode SMALLINT NOT NULL,
   RedCode SMALLINT NOT NULL,
   GreenCode SMALLINT NOT NULL,
   YellowCode SMALLINT NOT NULL,
   BlueCode SMALLINT NOT NULL,
   LevelID INTEGER NOT NULL,
   ProductID INTEGER,
   PRIMARY KEY(LocationID),
   UNIQUE(ProductID),
   FOREIGN KEY(LevelID) REFERENCES Level(LevelID),
   FOREIGN KEY(ProductID) REFERENCES Product(ProductID)
);

CREATE TABLE To_divide(
   DrivewayID INTEGER,
   ZoneID INTEGER,
   PRIMARY KEY(DrivewayID, ZoneID),
   FOREIGN KEY(DrivewayID) REFERENCES Driveway(DrivewayID),
   FOREIGN KEY(ZoneID) REFERENCES Zone(ZoneID)
);

CREATE TABLE To_possess(
   LocationID INTEGER,
   DrivewayID INTEGER,
   PRIMARY KEY(LocationID, DrivewayID),
   FOREIGN KEY(LocationID) REFERENCES Location(LocationID),
   FOREIGN KEY(DrivewayID) REFERENCES Driveway(DrivewayID)
);

CREATE TABLE To_Contain(
   ProductID INTEGER,
   SupportID INTEGER,
   ServedQuantity SMALLINT,
   ApprovedQuantity INTEGER,
   MissingItems BOOLEAN,
   PRIMARY KEY(ProductID, SupportID),
   FOREIGN KEY(ProductID) REFERENCES Product(ProductID),
   FOREIGN KEY(SupportID) REFERENCES Support(SupportID)
);
