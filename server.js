// npm init    --> install package.json
// npm install express --save   --> setup server
// npm install ejs --save
//Open Weather API key 

const express = require('express');
const app = express();
const port = process.argv[2]; //8080 won't work
const bodyParser = require('body-parser');
const request = require('request');
const apiKey = '7cb6118bd0635109db0faa0f6fa7de03';

app.use(bodyParser.urlencoded({ extended: true })); //set this up before app.post
app.use(express.static('public'));
app.set('view engine', 'ejs'); //set up template engine

//=================================== app.get() =====================================
app.get('/', function(req, res){
  // res.send('你好! Express server working!');
  let url = `http://api.openweathermap.org/data/2.5/weather?q=New%20York,us&appid=${apiKey}`;
  request(url,(err,req,body)=>{
    if(err){
      res.render('index', {weather:null, error:`Oops, there's an error`})
    }
    else{
      let weather = JSON.parse(body) //JSON body
      console.log(weather.name);
      if(weather.main == undefined || weather.weather[0] == undefined || weather.sys.country == undefined){
        res.render('index', {weather:null, error: `Oops, there's an error.`})
      }
      else{
        res.render('index', {
          city: weather.name,
          country: weather.sys.country,
          weather: weather.weather[0].main,
          icon: weather.weather[0].icon,
          fTemp: (weather.main.temp - 273.15) * 1.8 + 32, //JSON data use Kelvin unit
          cTemp: weather.main.temp - 273.15, //JSON data use Kelvin unit
          sunRise:(new Date(weather.sys.sunrise * 1000)).toLocaleTimeString(),
          sunSet: (new Date(weather.sys.sunset * 1000)).toLocaleTimeString(),
          humidity: weather.main.humidity,
          windSpeed: weather.wind.speed,
          pressure: weather.main.pressure
        })
      }
    }
  })
})

//=================================== app.post() =====================================
app.post('/search', (req,res)=>{
  let city = req.body.city.toLowerCase();
  console.log(city);
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  // let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  request(url,(err,req,body)=>{
    let searchWeather = JSON.parse(body);
    if(err){
      res.render('search',{searchWeather:null, error: 'Oops, please try again.'})
    }else{
      if (searchWeather.main == undefined || searchWeather.weather[0] == undefined || searchWeather.sys.country == undefined){
        res.render('search',{weather:null, error:'Oops, please try again.'})
      }
      else{
        res.render('search', {
          city: searchWeather.name,
          country: searchWeather.sys.country,
          weather: searchWeather.weather[0].main,
          icon: searchWeather.weather[0].icon,
          sunRise: (new Date(searchWeather.sys.sunrise * 1000)).toLocaleTimeString(),
          sunSet: (new Date(searchWeather.sys.sunset * 1000)).toLocaleTimeString(),
          fTemp: (searchWeather.main.temp - 273.15) * 1.8 + 32, //JSON data use Kelvin unit
          cTemp: searchWeather.main.temp - 273.15, //JSON data use Kelvin unit
          humidity: searchWeather.main.humidity,
          windSpeed: searchWeather.wind.speed,
          pressure: searchWeather.main.pressure
        });
      }
    }
  }) 
})

app.listen(port,()=>{ //invoke Express
  console.log(`${port} is listening`);
})





