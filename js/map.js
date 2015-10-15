var map;
// Function to draw your map
var drawMap = function() {
  map = L.map('container').setView([38.617, -92.284], 4)
  var layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
  layer.addTo(map)
  getData();
}

// Function for getting data
var getData = function() {
  $.ajax({
	  url: "/sirra/info343/police-shooting/data/response.json",
	  success: function(data) {
	  	customBuild(data);
	  },
	  dataType: "json"
	});
}

// Loop through your data and add the appropriate layers and points
var customBuild = function(data) {
  var unknown = new L.LayerGroup([]);
  var white = new L.LayerGroup([]);
  var black = new L.LayerGroup([]);
  var asian = new L.LayerGroup([]);
  var amIndian = new L.LayerGroup([]);
  var pacificIslander = new L.LayerGroup([]);
  var shootingData = {whiteKilled: 0, whiteHit: 0, otherKilled: 0, otherHit: 0};

  data.map(function(item) { 
  	var race = item.Race;
    var killed = item['Hit or Killed?'];
    var options;

    if (killed == "Killed") {
      options = {fillColor: "#c62104", color: "#c62104", fillOpacity: ".5"};

      if (race == "White") {
      	shootingData.whiteKilled += 1;
      } else {
      	shootingData.otherKilled += 1;
      }
    } else if (killed == "Hit") {
      options = {fillColor: "#2d2a2a", color: "#2d2a2a", fillOpacity: ".5"};

      if (race == "White") {
      	shootingData.whiteHit += 1;
      } else {
      	shootingData.otherHit += 1;
      }
    } else if (killed == "Unknown" || typeof killed == "undefined") {
      options = {fillColor: "#d5d618", color: "#d5d618", fillOpacity: ".5"};
    }

    var circle = new L.circleMarker([item.lat, item.lng], options);
    circle.setRadius(5);

    if (race != "Unknown" && typeof race != "undefined") {
      if (race == "White") {
        circle.addTo(white);
        shootingData.whiteHit += 1;
      } else if (race == "Black or African American") {
        circle.addTo(black);
      } else if (race == "Asian") {
        circle.addTo(asian);
      } else if (race == "American Indian or Alaska Native") {
        circle.addTo(amIndian);
      } else {
        // Native Hawaiian or Other Pacific Islander
        circle.addTo(pacificIslander);
      }
    } else {
      // Unknown or undefined
      circle.addTo(unknown);
    }

    var popupContext = "";

    if (typeof item.Summary != "undefined") {
      popupContext += item.Summary;
    } else {
      popupContext += "No Summary Available";
    }
    if (typeof item["Source Link"] != "undefined") {
      popupContext += " (" + "link".link(item["Source Link"]) +")";
    }
    circle.bindPopup(popupContext);
  });

  unknown.addTo(map);
  white.addTo(map);
  black.addTo(map);
  asian.addTo(map);
  amIndian.addTo(map);
  pacificIslander.addTo(map);

  L.control.layers(null,{"Unknown": unknown, "White": white, "Black or African American": black, "Asian": asian, "American Indian or Alaska Native": amIndian, "Native Hawaiian or Other Pacific Islander": pacificIslander}).addTo(map); 
  fillTable(shootingData);
}

function fillTable(data) {
	$(".tdata:eq(0)").text(data.whiteKilled);
 	$(".tdata:eq(1)").text(data.otherKilled)
 	$(".tdata:eq(2)").text(data.whiteHit);
	$(".tdata:eq(3)").text(data.otherHit)
}
