
// Accessing the airport data
let airportDataURL = "http://api.aviationstack.com/v1/airports?access_key=8d32007474ce2f1184533cb9ce09c196";
let flightsDataURL = "http://api.aviationstack.com/v1/flights?access_key=8d32007474ce2f1184533cb9ce09c196"

let map;
let streets;
let destinationSelector;
let departureSelector;
let locations = {};
let popup;
const markers = {
  departure: [],
  destination: []
}

let countryIndex = 0;
//let departureIndex = 0;

// Creating the map where airport locations will go (let all the countries to go through for the map)
function init_map() {
  map = L.map("mapid", {
    center: [0, 0],
    zoom: 2
  });

  streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    accessToken: API_KEY
  });

  streets.addTo(map);
}

function init_dropdowns() {
  // Grab a reference to the dropdown select element 
  destinationSelector = d3.select("#destinations");
  departureSelector = d3.select("#departures");
  let existing_countries = []
  d3.json(airportDataURL).then((data) => { // need to figure out how to get ALL the data
    console.log('daya==>>', data)
    data.data.forEach((location) => {
      if (location.country_name && !existing_countries.includes(location.country_name)) { //getting rid of nulls and duplicates
        existing_countries.push(location.country_name);
        destinationSelector
          .append("option")
          .text(location.country_name)
          .property("value", location.country_iso2);
        departureSelector
          .append("option")
          .text(location.country_name)
          .property("value", location.country_iso2);
      }
      //locations.push(location);
      if (locations[location.country_iso2]) {
        locations[location.country_iso2].push(location)
      } else {
        locations[location.country_iso2] = [location]
      }

    });
  });
}

//locations 
// {
// us: [{},{}],
// canada: [{}]
// }

function set_popup_location(countryCode, type) {  // need to figure out how to get all the airports in that country and not just one
  const airports = locations[countryCode]
  console.log('airports==>>', airports, 'loca==>>', locations)

  markers[type].forEach(marker => {
    map.removeLayer(marker);
  });

  airports.forEach(airport => {
    const lat = airport.latitude;
    const lng = airport.longitude;
    const marker =  L.marker([lat, lng]);
    marker.addTo(map).on('click', () => {
      L.popup()
        .setLatLng([lat, lng])
        .setContent(`<p><b>${airport.country_name}</b><br>Airport name: ${airport.airport_name}</p>`)
        .openOn(map);
    });
    markers[type].push(marker);
  });
}

function departureChanged(value) {
  set_popup_location(value, 'departure');
}

function destinationChanged(value) {
  set_popup_location(value, 'destination');
}