// js code to plot Earthquakes, tectonic plates and basic earth views
//
// GeoJSON data for past one week for all earthquakes
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// GeoJSON data for past one day for all earthquakes
//var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Tectonic plates link
var TectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json"

// Perform a GET request to the query URL to access the geoJSON
d3.json(queryURL, function (data) {
    createFeatures(data.features);
});

// Define createFeatures
function createFeatures(earthquakeData) {
    // function to access the features and various layers
    // and bind the popup function
    var earthquakes = L.geoJson(earthquakeData, {
        // Define function onEachFeature
        // add circles for each earthquake - on each feature
        onEachFeature: function (feature, layer) {
            // Define function onEachFeature
            // add circles for each earthquake - on each feature
            layer.bindPopup(
                "<h3>Magnitude: " + feature.properties.mag +
                "<br>Location: " + feature.properties.place +
                "<hr>" + new Date(feature.properties.time) + "</h3>"
            );
        }, pointToLayer: function (feature, latlng) {
            return new L.circle(latlng, {
                radius: markerRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                weight: 0.5,
                fillOpacity: 0.5,
                color: "green",
                stroke: true
            });
        }
    });

    // add earthquake layer to map
    createMap(earthquakes);
}

function createMap(earthquakes) {
    // Add tilelayer and define street map layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>" +
            " | © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap </a>" +
            "<strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Define satellite Street map layer
    var satellitestmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>" +
            " | © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap </a>" +
            "<strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
    });

    // Define Satellite map layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>" +
            " contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href =\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "satellite-v9",
        accessToken: API_KEY
    });

    // Define outdoors map layer
    var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a>" +
            " | © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap </a>" +
            "<strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/outdoors-v11",
        accessToken: API_KEY
    });

    // Define dark map layer
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>" +
            " contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href =\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Define dark map layer
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a>" +
            " contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
            " Imagery © <a href =\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Satellite St Map": satellitestmap,
        "Satellite Map": satellitemap,
        "Outdoors Map": outdoorsmap,
        "Dark Map": darkmap,
        "Light Map": lightmap
    };

    // Add a tectonic plate layer
    var tectonicPlates = new L.LayerGroup();

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes,
        "Tectonic Plates": tectonicPlates
    };

    // Create map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Add Fault lines data
    d3.json(TectonicPlatesUrl, function (plateData) {
        // Adding our geoJSON data, along with style information, to the tectonicplates layer.
        L.geoJson(plateData, {
            color: "purple",
            weight: 2
        }).addTo(tectonicPlates);
    });


    // Add the layer control to the map
    // Pass in our baseMaps and overlayMaps
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // Create Legend
    // Change all the code below to work with magnitude
    // https://leafletjs.com/examples/choropleth/
    // Uses style defined in the css
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {
        var div = L.DomUtil.create('div', 'info legend'),
            // insert the magnitudes below
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = "<strong>Magnitude</strong><br>";
        // div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>";
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '&nbsp;&nbsp;<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}

function getColor(mag) {
    // switch function here matches magnitude with color
    // For color choice use https://www.materialpalette.com/colors
    // var colors = ["#304FFE", "#00C853", "#AEEA00", "#FFFF00", "#FFD700", "#FFA500"];
    var colors = ['lightgreen','yellowgreen','gold','orange','lightsalmon','tomato'];
    return mag > 5 ? colors[5] :
        mag > 4 ? colors[4] :
            mag > 3 ? colors[3] :
                mag > 2 ? colors[2] :
                    mag > 1 ? colors[1] :
                        colors[0];
}

function markerRadius(mag) {
    // Use a mulitplier to get a reasonable size circles
    return mag * 30000;
}
