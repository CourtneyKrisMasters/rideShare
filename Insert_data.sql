--insert drivers manually to the Driver table--

INSERT INTO Driver (id, first_name, last_name, phone, licenseNumber)
VALUES (1, 'Fred', 'Ziffle', '217-245-4667', '88888888888');

INSERT INTO Driver (id, first_name, last_name, phone, licenseNumber)
VALUES (2, 'Velma', 'Ziffle', '218-245-5555', '2222222222');

--insert passengers manually to the Passenger table--

INSERT INTO "Passenger" (id, firstname, lastname, phone)
VALUES (1, 'Scooby', 'Doo', '123-456-7890');

INSERT INTO "Passenger" (id, firstname, lastname, phone)
VALUES (2, 'Scrappy', 'Doo', '111-222-3333');


--insert state information to State table--
-- Nurk suggests using these to put in a drop down for people to choose from
-- that means we should never have to add to the State table after this initial insert
INSERT INTO "State"(abbreviation, name)
VALUES('AL','Alabama');

INSERT INTO "State"(abbreviation, name)
VALUES('AK','Alaska');

INSERT INTO "State"(abbreviation, name)
VALUES('AZ','Arizona');

INSERT INTO "State"(abbreviation, name)
VALUES('AR','Arkansas');

INSERT INTO "State"(abbreviation, name)
VALUES('CA','California');

INSERT INTO "State"(abbreviation, name)
VALUES('CO','Colorado');

INSERT INTO "State"(abbreviation, name)
VALUES('CT','Connecticut');

INSERT INTO "State"(abbreviation, name)
VALUES('DE','Delaware');

INSERT INTO "State"(abbreviation, name)
VALUES('FL','Florida');

INSERT INTO "State"(abbreviation, name)
VALUES('GA','Georgia');

INSERT INTO "State"(abbreviation, name)
VALUES('HI','Hawaii');

INSERT INTO "State"(abbreviation, name)
VALUES('ID','Idaho');

INSERT INTO "State"(abbreviation, name)
VALUES ('IL', 'Illinois');

INSERT INTO "State"(abbreviation, name)
VALUES('IN','Indiana');

INSERT INTO "State"(abbreviation, name)
VALUES('IA','Iowa');

INSERT INTO "State"(abbreviation, name)
VALUES('KS','Kansas');

INSERT INTO "State"(abbreviation, name)
VALUES('KY','Kentucky');

INSERT INTO "State"(abbreviation, name)
VALUES('LA','Louisiana');

INSERT INTO "State"(abbreviation, name)
VALUES('ME','Maine');

INSERT INTO "State"(abbreviation, name)
VALUES('MD','Maryland');

INSERT INTO "State"(abbreviation, name)
VALUES('MA','Massachusetts');

INSERT INTO "State"(abbreviation, name)
VALUES('MI','Michigan');

INSERT INTO "State"(abbreviation, name)
VALUES('MN','Minnesota');

INSERT INTO "State"(abbreviation, name)
VALUES('MS','Mississippi');

INSERT INTO "State"(abbreviation, name)
VALUES('MO','Missouri');

INSERT INTO "State"(abbreviation, name)
VALUES('MT','Montana');

INSERT INTO "State"(abbreviation, name)
VALUES('NE','Nebraska');

INSERT INTO "State"(abbreviation, name)
VALUES('NV','Nevada');

INSERT INTO "State"(abbreviation, name)
VALUES('NH','New Hampshire');

INSERT INTO "State"(abbreviation, name)
VALUES('NJ','New Jersey');

INSERT INTO "State"(abbreviation, name)
VALUES('NM','New Mexico');

INSERT INTO "State"(abbreviation, name)
VALUES('NY','New York');

INSERT INTO "State"(abbreviation, name)
VALUES('NC','North Carolina');

INSERT INTO "State"(abbreviation, name)
VALUES('ND','North Dakota');

INSERT INTO "State"(abbreviation, name)
VALUES('OH','Ohio');

INSERT INTO "State"(abbreviation, name)
VALUES('OK','Oklahoma');

INSERT INTO "State"(abbreviation, name)
VALUES('OR','Oregon');

INSERT INTO "State"(abbreviation, name)
VALUES('PA','Pennsylvania');

INSERT INTO "State"(abbreviation, name)
VALUES('RI','Rhode Island');

INSERT INTO "State"(abbreviation, name)
VALUES('SC','South Carolina');

INSERT INTO "State"(abbreviation, name)
VALUES('SD','South Dakota');

INSERT INTO "State"(abbreviation, name)
VALUES('TN','Tennessee');

INSERT INTO "State"(abbreviation, name)
VALUES('TX','Texas');

INSERT INTO "State"(abbreviation, name)
VALUES('UT','Utah');

INSERT INTO "State"(abbreviation, name)
VALUES('VT','Vermont');

INSERT INTO "State"(abbreviation, name)
VALUES('VA','Virginia');

INSERT INTO "State"(abbreviation, name)
VALUES('WA','Washington');

INSERT INTO "State"(abbreviation, name)
VALUES('WV','West Virginia');

INSERT INTO "State"(abbreviation, name)
VALUES('WI','Wisconsin');

INSERT INTO "State"(abbreviation, name)
VALUES('WY','Wyoming');


--insert locations manually to the Location Table--
--must match 'state' value to an abbreviation from the State table--
INSERT INTO "Location" (id, name, address, city, state, zipcode)
VALUES (1, 'Hofmeister Farms', 'NCR 460', 'Warsaw', 'IL', '62379' );

INSERT INTO "Location" (id, name, address, city, state, zipcode)
VALUES (2, 'Hamilton High School', '276 South Street', 'Hamilton', 'IL', '62339' );

INSERT INTO "Location" (id, name, address, city, state, zipcode)
VALUES (3, 'Samuel Morris Hall', '500 West Reade Aveneue', 'Upland', 'IN', '46989' );

INSERT INTO 'Location' (id, name, address, city, state, zipcode)
VALUES (4, 'The Bridge Cafe', '138 N Main St', 'Upland', 'IN', '46989' );

--insert vehicle types to the VehicleType table--
--types will include the body style of the vehicles (e.g. van, compact, etc.)
INSERT INTO "VehicleType{"} (id, type)
VALUES (100, 'Van');

INSERT INTO "VehicleType" (id, type)
VALUES (101, 'Suburban');

INSERT INTO "VehicleType" (id, type)
VALUES (102, 'Truck');

INSERT INTO "VehicleType" (id, type)
VALUES (103, 'Compact/Economy');

INSERT INTO "VehicleType" (id, type)
VALUES (104, 'Convertible');

--insert a few vehicles manually into the Vehicle table--
--must match 'vehicleTypeId' to 'id' in VehicleType table--

--?? should licenseState be connected to the State table???--

INSERT INTO "Vehicle" (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES (1, 'Ford', 'Ranger', 'black', 102, 5, 18.0, 'IA', 'WORKHARD');

INSERT INTO "Vehicle" (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES (2, 'Chevorlet', 'LT 4WD', 'white', 101, 8, 15.0, 'IN', 'JCHILLING');

INSERT INTO "Vehicle" (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES (3, 'GMC', 'Savana', 'blue', 100, 7, 15.0, 'MI', 'FAMBAM');

INSERT INTO "Vehicle" (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES (4, 'Volkswagon', 'Bug', 'yellow', 104, 4, 30.0, 'IL', 'W3SCHOOLS');


--insert a few rides manually into the Ride table--
--must match 'vehicleId' to "id" in Vehicle table--
--must match from and to locationIds to the id in the Location table--

INSERT INTO "Ride" (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES (0, '1/8/1999', '04:05 PM' , 20.0, 20.0, 5.00, 4, 1, 2);

INSERT INTO "Ride" (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES (1, '7/7/2020', '06:15 PM' , 52.5, 30.0, 5.00, 2, 2, 1);

INSERT INTO "Ride" (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES (2, '9/10/2020', '11:30 AM' , 1.2, 3.00, 1.00, 3, 3, 4);

INSERT INTO "Ride" (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES (3, '9/10/2020', '12:30 PM' , 1.2, 3.00, 1.00, 3, 4, 3);

--manually authorize drivers for vehicles in the authorization--
INSERT INTO "Authorization" (driverId, vehicleId)
VALUES (1, 1);

INSERT INTO "Authorization" (driverId, vehicleId)
VALUES (1, 2);

INSERT INTO "Authorization" (driverId, vehicleId)
VALUES (1, 4);

INSERT INTO "Authorization" (driverId, vehicleId)
VALUES (2, 3);

INSERT INTO "Authorization" (driverId, vehicleId)
VALUES (2, 4);

--manually sign up drivers for rides in Drivers table--
INSERT INTO "Drivers" (driverId, rideId)
VALUES (1, 0);

INSERT INTO "Drivers" (driverId, rideId)
VALUES (1, 1);

INSERT INTO "Drivers" (driverId, rideId)
VALUES (2, 2);

INSERT INTO "Drivers" (driverId, rideId)
VALUES (2, 3);


--manually sign up passengers to rides in the passengers table--

INSERT INTO "Passengers" (passengerId, rideId)
VALUES (1, 0);

INSERT INTO "Passengers" (passengerId, rideId)
VALUES (1, 1);

INSERT INTO "Passengers" (passengerId, rideId)
VALUES (2, 1);

INSERT INTO "Passengers" (passengerId, rideId)
VALUES (2, 2);

INSERT INTO "Passengers" (passengerId, rideId)
VALUES (2, 3);




