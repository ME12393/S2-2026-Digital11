// ===================================================
// STUDENT TASK: Build a graphical dashboard for Seneye
// ===================================================

// Replace this with your teacher's Cloudflare Worker URL:
const PROXY_URL = "https://seneye-proxy.ezankov.workers.dev/";

// Toggle to true if you are working offline without network access
const USE_OFFLINE_MOCK = false;

let aquariumData = null;
let lastUpdated = "";

function preload() {
  // Load initial data before setup() runs
  let endpoint = USE_OFFLINE_MOCK ? "sample-data.json" : PROXY_URL;
  aquariumData = loadJSON(endpoint, onDataLoaded, onError);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Refresh live data every 5 minutes (300,000 ms)
  if (!USE_OFFLINE_MOCK) {
    setInterval(() => {
      loadJSON(PROXY_URL, onDataLoaded, onError);
    }, 300000);
  }
}

function onDataLoaded(data) {
  aquariumData = data;
  lastUpdated = new Date().toLocaleTimeString();
  console.log("Data refreshed successfully:", data);
}

function onError(err) {
  console.error("Failed to load aquarium data. Check proxy URL or network.", err);
}

function draw() {
  background(8, 15, 22); 

  fill(10, 30, 45, 80);
  noStroke();
  rect(0, 0, width, height);

// 1. Draw Title Header
  fill(255);
  noStroke();

  textSize(32);
  textAlign(LEFT, TOP);
  text("FISH ENVIRONMENT", width * 0.04, height * 0.04);

  // Live status
  fill(120, 210, 230);
  textSize(13);
  textAlign(RIGHT, TOP);
  text("● LIVE", width * 0.96, height * 0.04);

  fill(150);
  textSize(11);
  text("Updated: " + (lastUpdated || "Loading..."), width * 0.96, height * 0.04 + 20);

  textAlign(LEFT, TOP);

  // 2. Render Dashboard Graphics
  if (aquariumData) {
    // NOTE: Update these keys based on your actual Seneye JSON response structure!
    // Example fields commonly found in sensor data:
    let temp = aquariumData[0].exps.temperature.curr;
    let ph = aquariumData[0].exps.ph.curr;
    let nh3 = aquariumData[0].exps.nh3.curr;
    let nh4 = aquariumData[0].exps.nh4.curr;

    // Call your custom graphic widgets
    drawTempWidget(50, 120, temp);
    drawTempWidget(50, 120, temp);
    drawGaugeWidget(310, 120, "pH Level", ph, 6.0, 8.5);
    drawGaugeWidget(570, 120, "Ammonia (NH3)", nh3, 0.0, 0.05);
    drawGaugeWidget(50, 310, "Ammonium Ion (NH4)", nh4, 0.00, 0.05);
        if (ph >=8.5) {
      if (frameCount % 60 < 30) {
      fill('red')
      rect(0, 0, 800, 500)
      fill('white')
      textSize(50)
      textAlign(CENTER, CENTER)
      text("PH WARNING, PH TOO HIGH", width*0.04 , height * 0.05)
          }
      }
  } else {
    // Loading State
    fill(255, 100, 100);
    textSize(18);
    text("Connecting to sensor stream...", 30, 120);
  }
}

// Example Widget Function: Temperature Card
function drawTempWidget(x, y, tempVal) {


  tempVal = Number(tempVal);

  // Card
  fill(18, 28, 38);
  stroke(45, 75, 90);
  strokeWeight(2);
  rect(x, y, 240, 170, 12);

  // Title
  noStroke();
  fill(180, 200, 210);
  textSize(15);
  textAlign(LEFT, TOP);
  text("WATER TEMPERATURE", x + 18, y + 18);

  // Temperature value
  fill(100, 220, 255);
  textSize(40);
  text(tempVal.toFixed(2) + "°C", x + 18, y + 50);

  // Gauge
  let gaugeX = x + 18;
  let gaugeY = y + 105;
  let gaugeWidth = 204;
  let gaugeHeight = 18;

  // Gauge zones
  let greenStart = map(22, 15, 35, 0, gaugeWidth);
  let orangeStart = map(28, 15, 35, 0, gaugeWidth);
  let redStart = map(30, 15, 35, 0, gaugeWidth);

 // Gauge background
fill(40, 50, 55);
rect(gaugeX, gaugeY, gaugeWidth, gaugeHeight, 9);

  // Green zone
  fill(100, 220, 150);
  rect(
    gaugeX,
    gaugeY,
    greenStart,
    gaugeHeight
  );

  // Orange zone
  fill(255, 170, 60);
  rect(
    gaugeX + greenStart,
    gaugeY,
    orangeStart - greenStart,
    gaugeHeight
  );

  // Red zone
  fill(255, 70, 70);
  rect(
    gaugeX + orangeStart,
    gaugeY,
    gaugeWidth - orangeStart,
    gaugeHeight
  );

  // Restore rounded ends
  fill(100, 220, 150);
  rect(gaugeX, gaugeY, 9, gaugeHeight, 9);

  fill(255, 70, 70);
  rect(
    gaugeX + gaugeWidth - 9,
    gaugeY,
    9,
    gaugeHeight,
    9
  );
  // Current temperature position
  let indicatorX = map(tempVal, 15, 35, gaugeX, gaugeX + gaugeWidth);
  indicatorX = constrain(indicatorX, gaugeX, gaugeX + gaugeWidth);

  // Indicator
  fill(255);
  noStroke();
  circle(indicatorX, gaugeY + gaugeHeight / 2, 12);

  // Status
  fill(100, 220, 150);
  textSize(13);
  text("● NORMAL", x + 18, y + 140);
}
// Example Widget Function: Simple Bar Gauge
function drawGaugeWidget(x, y, label, val, minVal, maxVal) {

  // Card
  fill(18, 28, 38);
  stroke(45, 75, 90);
  strokeWeight(2);
  rect(x, y, 240, 170, 12);

  // Title
  noStroke();
  fill(180, 200, 210);
  textSize(15);
  textAlign(LEFT, TOP);
  text(label.toUpperCase(), x + 18, y + 18);

  // Value
  fill(100, 220, 255);
  textSize(40);
  text(Number(val).toFixed(2), x + 18, y + 50);

  // Gauge
  let gaugeX = x + 18;
  let gaugeY = y + 105;
  let gaugeWidth = 204;
  let gaugeHeight = 18;

  // Position of current value
  let indicatorX = map(val, minVal, maxVal, gaugeX, gaugeX + gaugeWidth);
  indicatorX = constrain(indicatorX, gaugeX, gaugeX + gaugeWidth);

  // Gauge background
  fill(40, 50, 55);
  rect(gaugeX, gaugeY, gaugeWidth, gaugeHeight, 9);

  // Current value fill
  if (val >= minVal && val <= maxVal) {
    fill(100, 220, 150);
  } else {
    fill(255, 70, 70);
  }

  rect(
    gaugeX,
    gaugeY,
    indicatorX - gaugeX,
    gaugeHeight
  );

  // Indicator
  fill(255);
  noStroke();
  circle(indicatorX, gaugeY + gaugeHeight / 2, 12);

  // Status
  if (val >= minVal && val <= maxVal) {

  fill(100, 220, 150);
  textSize(13);
  textAlign(LEFT, TOP);
  text("● NORMAL", x + 18, y + 140);

} else {

  fill(255, 70, 70);
  textSize(13);
  textAlign(LEFT, TOP);
  text("● WARNING", x + 18, y + 140);

}
}