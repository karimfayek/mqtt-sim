// subscriber.js
const mqtt = require("mqtt");
const { Client } = require("pg");

//  PostgreSQL settings
const pgClient = new Client({
  host: "127.0.0.1",
  port: 5432,
  user: "mqtt_user",
  password: "secret123",
  database: "mqtt_db",
});

// اتصال بالـ DB
pgClient
  .connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ PG connect error:", err.message));
const mqttClient = mqtt.connect("mqtt://127.0.0.1:1883");

mqttClient.on("connect", () => {
  console.log("✅ Subscriber connected");

  // اسمع لكل حاجة في المبنى 1
  mqttClient.subscribe("building1/#", (err) => {
    if (!err) {
      console.log("👂 Subscribed to building1/#");
    }
  });
});

mqttClient.on("message", async (topic, message) => {
  let payload;
  try {
    payload = JSON.parse(message.toString());
  } catch (e) {
    console.log("📥 [", topic, "] => (non-JSON)", message.toString());
    return;
  }

  console.log("📥 [", topic, "] =>", payload);

  const parts = topic.split("/");
  const sensorType = parts[2] || null; // occupancy / temperature / ...
  const toiletId = payload.toiletId || null;

  try {
    await pgClient.query(
      `INSERT INTO readings (topic, toilet_id, sensor_type, payload) 
       VALUES ($1, $2, $3, $4)`,
      [topic, toiletId, sensorType, payload]
    );
    // console.log("💾 Saved to DB");
  } catch (err) {
    console.error("❌ DB insert error:", err.message);
  }
});


mqttClient.on("error", (err) => {
  console.error("❌ MQTT error:", err.message);
});
