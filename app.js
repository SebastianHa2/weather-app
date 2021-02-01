
// INSTANTIATING LIBRARY CLASS FOR FETCHING
const http = new httpLibrary()

const cityInput = document.getElementById("find-location")
const countrySelect = document.getElementById("country")
const search = document.getElementById("search")
const warning = document.getElementById("warning")


// FETCH AND DISPLAY WEATHER FUNCTION
search.addEventListener("click", searchWeather)

function searchWeather(){
  let cityId
  // GET SELECTED COUNTRY ID
  let country = getSelectedOption(countrySelect)
  let countryName = country.textContent
  let countryId = country.getAttribute("value")
  
  // GET THE CITY INPUT IN LOWERCASE
  let city = cityInput.value.toLowerCase()

  // MAKING SURE THE CITY IS ON THE LIST AND THE CITY AND THE COUNTRY AND ID MATCH
  // DATE IS AN ARRAY OF CITIES IN THE FILE CITIES.JS
  data.forEach(place => {
    if(place.name.toLowerCase() == city && place.country == countryId){
      cityId = place.id
    }
  });


  // INSTANTIATE CLASS FOR UI MODIFICATION
  const ui = new UImodification()


  // FETCHING THE WEATHER FOR THE NEXT THREE DAYS 
  http.sendHttpRequest(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=9f49053296577327d4f6976bd0e2f5ee`).then(rd=> {
    console.log(rd)
    console.log(new Date(rd.list[1].dt * 1000).toISOString())

    // UPDATING THE WEATHER INFORMATION FOR THE NEXT THREE DAYS
    ui.setTheNextThreeDays(".weather-information-1", rd.list[1].weather[0].description, rd.list[1].clouds.all, rd.list[1].main.temp, rd.list[1].main.humidity, rd.list[1].wind.speed)

    ui.setTheNextThreeDays(".weather-information-2", rd.list[2].weather[0].description, rd.list[2].clouds.all, rd.list[2].main.temp, rd.list[2].main.humidity, rd.list[2].wind.speed)

    ui.setTheNextThreeDays(".weather-information-3", rd.list[3].weather[0].description, rd.list[3].clouds.all, rd.list[3].main.temp, rd.list[3].main.humidity, rd.list[3].wind.speed)

    // UPDATING THE WEATHER ICONS FOR THE NEXT THREE DAYS 
    // CHECK IF PROPERTY MAIN IS "Clouds" IF SO THERE IS MORE THAN ONE ICON
    // AVAILABLE FOR CLOUDS DEPENDING ON THE INTENSITY
    if(rd.list[1].weather[0].main == "Clouds"){
      ui.updateIcons(rd.list[1].weather[0].description, "2")

    }
    else{
      ui.updateIcons(rd.list[1].weather[0].main, "2")
    }

    if(rd.list[2].weather[0].main == "Clouds"){
      ui.updateIcons(rd.list[2].weather[0].description, "3")

    }
    else{
      ui.updateIcons(rd.list[2].weather[0].main, "3")
    }

    if(rd.list[3].weather[0].main == "Clouds"){
      ui.updateIcons(rd.list[3].weather[0].description, "4")

    }
    else{
      ui.updateIcons(rd.list[3].weather[0].main, "4")
    }
  
  })


  // GETTING THE WEATHER FOR TODAY
  http.sendHttpRequest(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=9f49053296577327d4f6976bd0e2f5ee`, "GET").then(rd => {
    let dateObj = new Date(rd.dt * 1000)
    ui.setTodayWeatherInformation(rd.weather[0].description, rd.clouds.all, rd.main.temp, rd.main.humidity, rd.wind.speed,
      rd.name, countryName, dateObj, rd.main.pressure, rd.sys.sunset, rd.sys.sunrise)

    // UPDATING THE WEATHER ICONS
    if(rd.weather[0].main == "Clouds"){
      ui.updateIcons(rd.weather[0].description, "1")
    }
    else{
      ui.updateIcons(rd.weather[0].main, "1")
    }
    // SHOWING A MESSAGE IF CITY IS NOT FOUND, CITY IS EMPTY, CITY AND COUNTRY DO NOT MATCH ETC.
  }).catch(error => {
    console.log(error)
    if(!warning.classList.contains("display")){
      warning.classList.add("display")
      setTimeout(() => {
        warning.classList.remove("display")
      }, 3000)
  }})

}






class UImodification{
  //SETTING TODAY'S WEATHER INFORMATION FUNCTION
  setTodayWeatherInformation(weather,clouds, temperature, humidity, wind, city, country, dt, pressure, sunset, sunrise){
    // GETTING AND INSERTING TODAY'S DATE
    let date = dt.toDateString().substr(0, 10)
    document.getElementById("today-date").textContent = date
    // GETTING AND INSERTING THE DATES FOR THE NEXT THREE DAYS
    let nextDates = getNextThreeDates(dt)
    for(let i=0; i < 3; i++){
      document.getElementById(`date-${i}`).textContent = nextDates[i].toDateString().substr(0, 10)
    }


    // INSERTING THE NAMES OF THE CITY AND COUNTRY
    document.getElementById("location").textContent = `${city}, ${country}`

    // INDSERTING TODAY'S WEATHER INFORMATION
    let output = `
    <p>${weather}</p>
    <p>Cloudiness: ${clouds}%</p>
    <p>Temperature: ${(temperature - 273.15).toFixed(0)}°C</p>
    <p>Wind: ${wind}km/h</p>
    <p>Humidity: ${humidity}%</p>
    `
    let output2 = `
    <p>Pressure: ${pressure}hPA</p>
    <img src="img/sunrise1.png" alt="sunrise">
    <p>Sunrise at: ${new Date(sunrise*1000).toTimeString().substr(0, 8)} </p>
    <img src="img/sunset1.png" alt="sunset">
    <p>Sunset at: ${new Date(sunset*1000).toTimeString().substr(0, 8)} </p>
    `

    document.querySelector(".more-info").innerHTML = output2
    document.querySelector(".weather-information-today").innerHTML = output


  }


  // INSERTING WEATHER INFORMATION FOR THE NEXT THREE DAYS 
  setTheNextThreeDays(selector, weather, clouds, temperature, humidity, wind){
    const day = document.querySelector(selector)
      day.innerHTML = `
      <p>${weather}</p>
      <p>Cloudiness: ${clouds}%</p>
      <p>Temperature: ${(temperature - 273.15).toFixed(0)}°C</p>
      <p>Wind: ${wind}km/h</p>
      <p>Humidity: ${humidity}%</p>
      `
    }

    // CHOOSING THE ICON ACCORDING TO THE WEATHER DESCRIPTION
    updateIcons(description, iconNum){
      switch(description){
        case "Clear":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-clear-day"
          break
        case " few clouds":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-partly-cloudy-day"
          break
        case "scattered clouds":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-partly-cloudy-day"
          break
        case "broken clouds":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-cloudy"
          break
        case "overcast clouds":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-cloudy"
          break
        case "Thunderstorm":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-forecast-io-thunderstorm"
          break
        case "Drizzle":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-day-showers"
          break
        case "Rain":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-day-rain"
          break
        case "Snow":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-night-snow"
          break
        case "Fog":
        case "Mist":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-fog"
          break
        case "Smoke":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-smog"
          break
        case "Haze":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-day-haze"
          break
        case "Sand":
        case "Dust":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-sandstorm"
          break
        case "Ash":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-volcano"
          break
        case "Tornado":
          document.getElementById(`icon-${iconNum}`).className = "wi wi-tornado"
    }

}}



// GETTING THE SELECTED COUNTRY FROM THE DROP DOWN MENU FUNCTION 
function getSelectedOption(sel){
  let opt
  for(let i = 0; i < sel.options.length; i++){
    opt = sel.options[i]
    if(opt.selected === true){
      break
    }
  }
  return opt
}

// LOAD COUNTRIES FOR SELECTION IN DROP DOWN MENU
let output = ''
countrynames.forEach(country => {
  output += `<option value="${country.code}">${country.value}</option>`
  return output
})

// INSERT THE COUNTRIES INTO THE DROP DOWN MENU
document.getElementById("country").innerHTML = output


// FUNCTION TO FLIP THE TODAY'S WEATHER CARD FOR MORE INFORMATION

const change = document.getElementById("change-information")

const showMore = () => {
  if(!document.querySelector(".more").classList.contains("show")){
    change.textContent = "Go back"
  }
  else{
    change.textContent = "See more"
  }
  document.querySelector(".more").classList.toggle("show")
  document.querySelector(".more").classList.toggle("hide")
  document.querySelector(".today").classList.toggle("show")
  document.querySelector(".today").classList.toggle("hide")
}

change.addEventListener("click", showMore)


// FUNCTION GETTING THE NEXT THREE DATES USING TODAY'S DATE

function getNextThreeDates(date){
  let dates = []
  let tomorrow = new Date()
  tomorrow.setDate(date.getDate()+1)
  dates.push(tomorrow)

  let dayAfter = new Date()
  dayAfter.setDate(tomorrow.getDate()+1)
  dates.push(dayAfter)

  let dayAfter2 = new Date()
  dayAfter2.setDate(dayAfter.getDate()+1)
  dates.push(dayAfter2)
  return dates
}


