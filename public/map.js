//Village Layers - Constructing all Layers
var url="http://35.231.13.127:80/"
//VillageBase
var mymap = L.map('mapid').setView([26.8467, 80.9462], 7);

var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["0","0.2","0.4","0.6",'0.8','1'],
        colors=['rgb(255,0,0)','rgb(255,51,0)','rgb(255,102,0)','rgb(255,153,0)','rgb(255,204,0)','rgb(255,255,0)']
        labels = [];
    for (var i = 0; i < grades.length; i++) {

        div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' +
        grades[i] +'<br>';
    }

    return div;
};

legend.addTo(mymap);
var baseLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
});
mymap.addLayer(baseLayer);

// Satellite View Layer
var satellitelayer = L.tileLayer('https://api.mapbox.com/v4/mapbox.satmap1ellite/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1IjoiYWlzaWtwIiwiYSI6ImNqam1xZGU2YjBycTgzdnJzMWRqZTJlbmMifQ.FdSTUlLNlHFm7gy_otMkdg', {
    "attribution": null,
    "detectRetina": false,
    "maxNativeZoom": 18,
    "maxZoom": 18,
    "minZoom": 0,
    "noWrap": false,
    "subdomains": "abc"
});
$('#satellite').on('change', function () {
    if ($('#satellite').is(":checked")) {
        mymap.addLayer(satellitelayer);
        mymap.removeLayer(baseLayer);
    } else {
        mymap.addLayer(baseLayer);
        mymap.removeLayer(satellitelayer);
    }
});

var districtLayer = L.geoJson(null,
  {onEachFeature:onEachFeature,
style: {
    fillColor: 'white',
    weight: 0.5,
    opacity: 3,
    color: 'black',
    dashArray: '2',
    fillOpacity: 0.7
}
});
  mymap.addLayer(districtLayer);
$.ajax({
    type: "GET",
    url: url+"district",
    dataType: 'json',
    success: function (response) {
districtLayer.addData(response);

    }
  });
function onEachFeature(feature,layer){
  layer.name=feature.properties.DIST_NAME;
  layer.code=feature.properties.ST_CODE;
  layer.score=feature.properties.scores;
  layer.bindPopup(feature.properties.DIST_NAME);
  layer.on({
    mouseover:function highlightFeature(e){
      this.openPopup();
      e.target.setStyle({
        fillOpacity: 0.3
      });
    },
      mouseout:function resetHighlight(e){
        this.closePopup();
        e.target.setStyle({
          fillOpacity: 0.7
        });
      },
      click: function zoomToFeature(e){
        mymap.fitBounds(e.target.getBounds());
        if(e.target.name=="MEERUT")
        {var x=meerut();
      }
      }
  });
}
$('#dist_infant').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.infant_mortality_rate;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_polio').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.child_polio_vaccination;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_birth').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.hospital_birth;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_toilet').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.Toilet_facility;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_death').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.annual_deaths;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_literate').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.literate_population;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
$('#dist_malaria').on('change', function () {
  districtLayer.eachLayer(function(layer){
try{dic=layer.score.malaria_index;}
  catch(err){dic=0;}
    layer.setStyle({fillColor: "rgb(255,"+255*dic+",0)",
    fillOpacity:0.7
  });
  });
});
function meerut()
{
$('#districtLayer').hide();
$('#poilayer').show();
mymap.removeLayer(districtLayer);
var villageSelect=[];
//mymap.addLayer(villageSelect);
var villageLayer = L.layerGroup();
$.ajax({
    type: "GET",
    url: url+"entity?type=village",
    dataType: 'json',
    success: function (response) {
        for (var village in response) {
            var square = L.circle([response[village]['geometry']['coordinates'][1], response[village]['geometry']['coordinates'][0]], {
                color: 'green',
                weight:3,
                fillColor: 'green',
                fillOpacity: 0.5,
                radius: 50
            });
            square.lat=response[village]['geometry']['coordinates'][1];
            square.lon=response[village]['geometry']['coordinates'][0];
            square.affluence=response[village]['properties']['index']["need"];
            square.development=response[village]['properties']['index']["dev"];
            square.connectivity=response[village]['properties']['index']["connectivity"];
            square.household=response[village]['properties']['raw']["household"];
            square.old=response[village]['properties']['raw']["old"];
            square.doctor=response[village]['properties']['raw']["doctor"];
            square.population=response[village]['properties']['raw']["population_density"];
            square.infant=response[village]['properties']['raw']["infant"];
            square.hospital=response[village]['properties']['raw']["poi_hospital"];
            square.pharmacy=response[village]['properties']['raw']["pharmacy"];
            square.sex=response[village]['properties']['raw']["sex_ratio"];
            square.name=response[village]['properties']["name"];
            square.bindPopup(response[village]['properties']["name"]);
            square.on('mouseover', function (e) {
                this.openPopup();
            });
            square.on('mouseout', function (e) {
                this.closePopup();
            });
            square.on('click',function(e){
              var checked=[$('input[type="radio"]:checked', '#myForm').val()];
            //  console.log(e.target[checked]);

              if(villageSelect.includes(e.target.name)){
                var index = villageSelect.indexOf(e.target.name);
                if (index > -1) {
                  villageSelect.splice(index, 1);
                }
                e.target.setStyle({color:'green'});
                          }
              else
              {e.target.setStyle({color:'blue'});
              villageSelect.push(e.target.name);}
              var x= drawChart();
            });
            villageLayer.addLayer(square);
        }
    }
});

$('#affluence').on('change', function () {
    if ($('#village').is(":checked")) {
      //var x= drawChart();
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.affluence/0.10012060948442918*100);


      });
    }
});
$('#development').on('change', function () {
    if ($('#village').is(":checked")) {
    //  var x= drawChart();
      villageLayer.eachLayer(function(layer){

        layer.setRadius(layer.development*1000);
      });
    }
});
$('#population').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.population/11650.4*6000);
      //  var x= drawChart();
      });
    }
});
$('#hospital').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.hospital/ 232.0*4000);
        //var x= drawChart();
      });
    }
});
$('#household').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.household/17631.0*7000);
      //  var x= drawChart();
      });
    }
});
$('#infant').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.infant/2230.1568*7000);
      //  var x= drawChart();
      });
    }
});
$('#elder').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.old/587.8656*5000);
      //  var x= drawChart();
      });
    }
});
$('#sex_ratio').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.sex/931.0*1000);
        //var x= drawChart();
      });
    }
});
$('#pharmacy').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.pharmacy*100);
      //  var x= drawChart();
      });
    }
});
$('#connectivity').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.connectivity*1000);
      //  var x= drawChart();

      });
    }
});
$('#doctor').on('change', function () {
    if ($('#village').is(":checked")) {
      villageLayer.eachLayer(function(layer){
        layer.setRadius(layer.doctor*100);


      });
    }
});
$('#village').on('change', function () {villageList =[];
    if ($('#village').is(":checked")) {
      drawChart();

        mymap.addLayer(villageLayer);
    } else {
        mymap.removeLayer(villageLayer);
        chart.destroy();
    }
});
var ctx = document.getElementById("myChart");
var chart = new Chart(ctx,{});



function drawChart(){

            var villageList = [];
            var datasetis = [];
            var backgroundColor = [];
            var checked;
            var dict = new Array(); // create an empty array
            dict['affluence']="Need";
            dict['development']="Development";
            dict['connectivity']="Connectivity";
            dict['household']="Household";
            dict['infant']="Birth Rate";
            dict['sex']="Sex Ratio";
            dict['old']="Mortality Rate";
            dict['pharmacy']="Pharmacy";
            dict['hospital']="Hospital";
            dict['population']="Population Density";
            dict['doctor']="Doctor";

            if ($('#village').is(":checked"))
            { var t="Village";
              villageLayer.eachLayer( function(layer) {
               checked=$('input[type="radio"]:checked', '#myForm').val();

                if(villageSelect.includes(layer.name)){
                  //console.log(layer[checked]);
                datasetis.push(layer[checked]);
                backgroundColor.push('rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random())*255+')');
                villageList.push(layer.name);
                t="Village "+dict[checked];
              }
            });}
              else {
                var t ="Town"
                townMlayer.eachLayer( function(layer) {
                checked=$('input[type="radio"]:checked', '#myForm').val();

                  if(townSelect.includes(layer.name)){
                    //console.log(layer[checked]);
                    t="Town "+dict[checked];
                  datasetis.push(layer[checked]);
                  backgroundColor.push('rgb('+Math.floor(Math.random()*255)+','+Math.floor(Math.random()*255)+','+Math.floor(Math.random())*255+')');
                  villageList.push(layer.name);
              }

            });}
            //console.log(datasetis);

                chart.destroy();
                chart = new Chart(ctx, {
                        // The type of chart we want to create
                        type: 'pie',

                        // The data for our dataset
                        data: {
                            labels: villageList,
                            datasets: [{
                                label: "My First dataset",
                                backgroundColor: backgroundColor,
                                borderColor: 'rgb(255, 99, 132)',
                                data: datasetis,
                            }]
                        },

                        // Configuration options go here
                        options: {legend:{labels: {fontColor: 'white'}},
                                          title: {
                              display: true,
                              fontColor: 'white',
                              text:t,
                              fontSize:15,
                          }
                      }
                    });
}

// Satellite View Layer
var satellitelayer = L.tileLayer('https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1IjoiYWlzaWtwIiwiYSI6ImNqam1xZGU2YjBycTgzdnJzMWRqZTJlbmMifQ.FdSTUlLNlHFm7gy_otMkdg', {
    "attribution": null,
    "detectRetina": false,
    "maxNativeZoom": 18,
    "maxZoom": 18,
    "minZoom": 0,
    "noWrap": false,
    "subdomains": "abc"
});
$('#satellite').on('change', function () {
    if ($('#satellite').is(":checked")) {
        mymap.addLayer(satellitelayer);
        mymap.removeLayer(baseLayer);
    } else {
        mymap.addLayer(baseLayer);
        mymap.removeLayer(satellitelayer);
    }
});

//Grid Layer
var gridLayer = L.geoJson(null, {onEachFeature:Feature,

    style: style
});
var slider = document.getElementById("myRange");
var val =slider.value;
function Feature(feature,layer){
  layer.class=feature.properties.class;
  layer.on({
    mouseover:function highlightFeature(e){
      this.openPopup();
      e.target.setStyle({
        fillOpacity: 2
      });
    },
      mouseout:function resetHighlight(e){
        this.closePopup();
        e.target.setStyle({
          fillOpacity: 0.7
        });
      },
  });
}
$('#grid').on('change', function () {
    if ($('#grid').is(":checked")) {
        mymap.addLayer(gridLayer);
    } else {
        mymap.removeLayer(gridLayer);
    }
});
$.ajax({
    type: "GET",
    url: url+"grid?number="+val.toString(),
    dataType: 'json',
    success: function (response) {
      gridLayer.addData(response);
    }
  });
slider.oninput = function() {
if ($('#grid').is(":checked"))
{var x = this.value;
gridLayer.clearLayers();
$.ajax({
    type: "GET",
    url: url+"grid?number="+x.toString(),
    dataType: 'json',
    success: function (response) {
      gridLayer.addData(response);
    }
  });}
}
$('#roads').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(0,0,0,0,layer.class.Highway,layer.class.Road),
      fillOpacity:0.7
  });
  });
});
$('#composite').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(layer.class.Highway,layer.class.Road,layer.class.Agriculture,layer.class.Greenery,layer.class.Dense,layer.class.Sparse),
      fillOpacity:0.7
  });
  });
});
$('#houses').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(0,0,0,0,layer.class.Dense,layer.class.Sparse),
      fillOpacity:0.7
  });
  });
});
$('#dense').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(0,0,0,0,layer.class.Dense,0),
      fillOpacity:0.7
  });
  });
});
$('#greenery').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(0,0,0,0,layer.class.Agriculture,0),
      fillOpacity:0.7
  });
  });
});
$('#river').on('change', function () {
  gridLayer.eachLayer(function(layer){
    layer.setStyle({
      fillColor: getColor(0,0,0,0,layer.class.River,0),
      fillOpacity:0.7
  });
  });
});
  function style(feature) {
      return {
          weight: 0.2,
          opacity: 1,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.5,
          fillColor: getColor(feature.properties.class.Highway,feature.properties.class.Road, feature.properties.class.Agriculture,feature.properties.class.Greenery,feature.properties.class.Dense,feature.properties.class.Sparse)
      };
  }

  function getColor(r1,r2, g1,g2, d,s) {
    r=0
    g=0;
    b=0;

     if(g1==1||g2==1){
          g=1;
      }
      if(d==1||s==1){
      r=1;
      g=0;
      }
      if(r1==1 || r2==1){
          g=0;
          b=1
      }

      return ('rgb(' + 255 * r + ',' + 255 * g + ',' + 255 * b + ')');
  }

//connection layer
var connections = L.geoJson(null, {
  onEachFeature:onEach,
    style: {

        weight: 1,
        opacity: 3,
        color: 'red',
        dashArray: '1',
        fillOpacity: 0.9
    }
});
function onEach(feature,layer){

  layer.len=feature.properties.len;
  layer.setStyle({
    'color': 'rgb('+255*feature.properties.len/10.43+',0,0)'
  });

}
$('#connections').on('change', function () {
    if ($('#connections').is(":checked")) {
      $.ajax({
          type: "GET",
          url: url+'lines',
          dataType: 'json',
          success: function (response) {
            connections.addData(response);
            mymap.addLayer(connections);
          }
        });

    } else {
        mymap.removeLayer(connections);
    }
});

$('#grid').on('change', function () {
    if ($('#grid').is(":checked")) {
        mymap.addLayer(gridLayer);

    } else {
        mymap.removeLayer(gridLayer);
    }
});

//AC Layer

$.ajax({
    type: "GET",
    url: url+'acshapes',
    dataType: 'json',
    success: function (response) {
var acjson = L.geoJson(response, {
    style: {
        fillColor: 'black',
        weight: 0.5,
        opacity: 3,
        color: 'black',
        dashArray: '2',
        fillOpacity: 0.4
    }
});
acjson.eachLayer(function (layer){
  if(layer.feature.properties.DIST_NAME=="MEERUT"){
    layer.setStyle({fillOpacity:0.1})
  }
})
mymap.addLayer(acjson);
}
});

//Town Layers - Constructing all Layers
var townSelect=[];
//TownBase
var selectLayer= L.layerGroup();
var townMlayer = L.layerGroup();
$.ajax({
    type: "GET",
    url: url+"entity?type=town",
    dataType: 'json',
    success: function (response) {
        for (var village in response) {

            var square = L.marker([response[village]['geometry']['coordinates'][1], response[village]['geometry']['coordinates'][0]], {
                color: 'red',
                fillColor: 'red',
                weight:3,
                fillOpacity: 0.5,
                radius: 100
            });
            square.lat=response[village]['geometry']['coordinates'][1];
            square.lon=response[village]['geometry']['coordinates'][0];
            square.radius=response[village]['properties']["radius"];
            square.affluence=response[village]['properties']['index']["need"];
            square.development=response[village]['properties']['index']["dev"];
            square.connectivity=response[village]['properties']['index']["connectivity"];
            square.household=response[village]['properties']['raw']["household"];
            square.old=response[village]['properties']['raw']["old"];
            square.doctor=response[village]['properties']['raw']["doctor"];
            square.population=response[village]['properties']['raw']["population_density"];
            square.infant=response[village]['properties']['raw']["infant"];
            square.hospital=response[village]['properties']['raw']["poi_hospital"];
            square.pharmacy=response[village]['properties']['raw']["pharmacy"];
            square.sex=response[village]['properties']['raw']["sex_ratio"];
            square.name=response[village]['properties']['name'];
            square.bindPopup(response[village]['properties']['name']);
            square.on('mouseover', function (e) {
                this.openPopup();
            });
            square.on('mouseout', function (e) {
                this.closePopup();
            });
            square.on('click',function(e){
              //console.log(townSelect);
              if(townSelect.includes(e.target.name)){
                selectLayer.eachLayer(function(layer){
                  if(layer.name==e.target.name){
                    selectLayer.removeLayer(layer);
                  }
                });
                var index = townSelect.indexOf(e.target.name);
                if (index > -1) {
                  townSelect.splice(index, 1);
                }

                          }
              else
              {//e.target.setStyle({color:'blue'});

              townSelect.push(e.target.name);
              var square = L.circle([e.target.lat, e.target.lon], {
                  color: 'red',
                  fillColor: 'yellow',
                  weight:1,
                  fillOpacity: 0.3,
                  radius: e.target.radius*1000
              });
              square.name=e.target.name;
              selectLayer.addLayer(square);
            }
              var x= drawChart();
            });



                    /*var ctx = document.getElementById('myChart');
                    */


            townMlayer.addLayer(square);
        }
    }
});
mymap.addLayer(selectLayer);
$('#townM').on('change', function () {villageList =[];
    if ($('#townM').is(":checked")) {
      drawChart();

        mymap.addLayer(townMlayer);
    } else {
        mymap.removeLayer(townMlayer);
        chart.destroy();
    }
});

}
