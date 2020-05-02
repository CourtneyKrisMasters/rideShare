INSERT INTO Driver (first_name, last_name, phone, licenseNumber)
VALUES ('Fred', 'Ziffle', '217-245-4667', '88888888888');

INSERT INTO "State"(abbreviation, name)
VALUES ('IL', 'Illinois');

INSERT INTO "Location" (id, name, address, city, state, zipcode)
VALUES (20, 'name?', '2020', 'Warsaw', 'IL', '62379' );

INSERT INTO 'Location' (id, name, address, city, state, zipcode)
VALUES (21, 'name?', '2021', 'Hamilton', 'IL', '62339' );

INSERT INTO 'VehicleType' (id, type)
VALUES (100, 'type');

INSERT INTO 'Vehicle' (id, make, model, color, vehicleTypeId, capacity, mpg, licenseState, licenseNumber)
VALUES (4, 'Volkswagon', 'Bug', 'yellow', 100, 4, 30.0, 'IL', 'W3SCHOOLS');

INSERT INTO "Ride" (id, date, time, distance, fuelPrice, fee, vehicleId, fromLocationId, toLocationId)
VALUES (0, '1/8/1999', '04:05 PM' , 20.0, 20.0, 5.00, 4, 20, 21);

