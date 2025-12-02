const mqtt = require("mqtt");

// connect broker
const client = mqtt.connect("mqtt://127.0.0.1:1883");

client.on("connect", () => {
  console.log("✅ Connected to MQTT broker");

  // publish every 5 seconds 
  setInterval(() => {
    // choose random toilet (1-3)
    const toiletId = Math.floor(Math.random() * 3) + 1;

    // defernt topics 
    const occupancyTopic = `building1/toilet${toiletId}/occupancy`;
    const tempTopic       = `building1/toilet${toiletId}/temperature`;
    const humidityTopic   = `building1/toilet${toiletId}/humidity`;
    const motionTopic     = `building1/toilet${toiletId}/motion`;

    // payloads (JSON)
    const occupied = Math.random() > 0.5;

    const occupancyPayload = JSON.stringify({
      toiletId,
      occupied,
      timestamp: new Date().toISOString(),
    });

    const tempPayload = JSON.stringify({
      toiletId,
      value: 20 + Math.random() * 5,  // 20–25
      unit: "C",
      timestamp: new Date().toISOString(),
    });

    const humidityPayload = JSON.stringify({
      toiletId,
      value: 40 + Math.random() * 20, // 40–60
      unit: "%",
      timestamp: new Date().toISOString(),
    });

    const motionPayload = JSON.stringify({
      toiletId,
      motion: Math.random() > 0.7,
      timestamp: new Date().toISOString(),
    });

    // publish 
    client.publish(occupancyTopic, occupancyPayload);
    client.publish(tempTopic, tempPayload);
    client.publish(humidityTopic, humidityPayload);
    client.publish(motionTopic, motionPayload);

    console.log("📨 Published simulated data for toilet", toiletId);
  }, 5000);
});

client.on("error", (err) => {
  console.error("❌ MQTT error:", err.message);
});
