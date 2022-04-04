import express from "express";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
const port = process.env.PORT || 3000;
const app = express();
// Konfiguration von express
app.set("views", `./views`);
app.set("view engine", "ejs");
app.use(express.static("./public"));

const navigation = [
  { linkText: "Home", url: "/" },
  { linkText: "Impressum", url: "/impressum" },
  { linkText: "Links", url: "/links" },
];

const apiKey = process.env.WEATHER_KEY;
const getWeather = async (city = "Berlin", units = "metric") => {
  //https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=${lang}`;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}&lang=de`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

app.get("/", async (req, res) => {
  console.log(req.query);
  getWeather(req.query.city, req.query.units)
    .then((data) => {
      return res.render("home", {
        test: "Hallo",
        pageTitle: "Das Wetter von heute",
        weatherData: data,
        linkItems: navigation,
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .render("error", { message: err.message, linkItems: navigation });
    });
});
app.get("/links", (req, res) => {
  const linkNav = [
    ...navigation,
    { linkText: "Google", url: "https://www.google.de" },
  ];
  res.render("links", {
    pageTitle: "Links",
    linkItems: linkNav,
  });
});
app.get("/impressum", (req, res) => {
  res.render("impressum", {
    pageTitle: "Impressum",
    linkItems: navigation,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
