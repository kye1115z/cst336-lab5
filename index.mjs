import express from "express";
const planets = (await import("npm-solarsystem")).default;
const ACCESS_KEY = "LZTg9NbqauEpUq14vj8GhthqOF3aXTcqYqf2_UfB2_s";
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  let homeBg = await randomImage();
  res.render("home", { homeBg });
});

app.get("/planetInfo", async (req, res) => {
  let body = req.query.selectedBody;

  if (body === "Comet" || body === "Asteroid") {
    let celestialBodyInfo;
    if (body === "Comet") {
      celestialBodyInfo = planets.getComets();
    } else if (body === "Asteroid") {
      celestialBodyInfo = planets.getAsteroids();
    }
    res.render("celestialBody", {
      celestialBodyInfo: celestialBodyInfo,
      bodyName: body,
    });
  } else {
    let planetBodyInfo;
    if (body === "Mercury") {
      planetBodyInfo = planets.getMercury();
    } else if (body === "Venus") {
      planetBodyInfo = planets.getVenus();
    } else if (body === "Earth") {
      planetBodyInfo = planets.getEarth();
    } else if (body === "Mars") {
      planetBodyInfo = planets.getMars();
      planetBodyInfo.image =
        "https://t3.ftcdn.net/jpg/02/14/13/14/360_F_214131404_BD1k2AXYMNNfUGemosLGl50jYGAcmCmo.jpg";
    } else if (body === "Jupiter") {
      planetBodyInfo = planets.getJupiter();
      planetBodyInfo.image =
        "https://c4.wallpaperflare.com/wallpaper/505/839/829/space-planet-hd-4k-wallpaper-preview.jpg";
    } else if (body === "Saturn") {
      planetBodyInfo = planets.getSaturn();
    } else if (body === "Uranus") {
      planetBodyInfo = planets.getUranus();
    } else if (body === "Neptune") {
      planetBodyInfo = planets.getNeptune();
    }
    res.render("planetBody", {
      planetBodyInfo: planetBodyInfo,
      bodyName: body,
    });
  }
});

app.get("/nasa", async (req, res) => {
  let date = new Date();
  let nasaData;

  const options = {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  date = date.toLocaleDateString("en-CA", options).replace(/-/g, "-");
  let todayData = await getNasaData(date);

  const { month, day, year } = req.query;
  if (month && day && year) {
    date = `${year}-${month}-${day}`;
    nasaData = await getNasaData(date);
  }

  res.render("nasa", { todayData, nasaData });
});

app.listen(10040, () => {
  console.log("server started");
});

async function randomImage() {
  let url = `https://api.unsplash.com/photos/random/?client_id=${ACCESS_KEY}&featured=true&query=solar%20system&orientation=landscape`;

  const response = await fetch(url);
  const data = await response.json();
  return data.urls.regular;
}

async function getNasaData(date) {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?&api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${date}`
  );
  const data = await response.json();
  return data;
}
