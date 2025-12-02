docker run -it --name mosquitto-local -p 1883:1883 -p 9001:9001  -v "C:\Users\kimo\mosquitto-conf":/mosquitto/config eclipse-mosquitto
3) اعمل ملف إعدادات
nano mosquitto-conf/mosquitto.conf


وحط فيه السطور دي فقط:

listener 1883 0.0.0.0
allow_anonymous true

docker run --name pg-mqtt -e POSTGRES_USER=mqtt_user -e POSTGRES_PASSWORD=secret123  -e POSTGRES_DB=mqtt_db -p 5432:5432 -d postgres
docker exec -it pg-mqtt psql -U mqtt_user -d mqtt_db
CREATE TABLE readings (
    id SERIAL PRIMARY KEY,
    topic TEXT NOT NULL,
    toilet_id INT,
    sensor_type TEXT,
    payload JSONB NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
\q
