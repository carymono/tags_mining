//google map api -> real text

var fs = require('fs');
var googleMapsClient = require('@google/maps').createClient({
  key: ''//insert your key
});

var cleaner = require('./data_cleaning.js')

//Reach Data from txt and remove dupplicate
//rename the 'tags_user.txt' to new file that you want to read from
var array = fs.readFileSync('user_with_tag.txt').toString().split("\n");
var unique = array.filter(function(elem, index, self) {
    return index == self.indexOf(elem);
})
unique.pop();
var currentUserID = [] ;
var arrayLat = [];
var arrayLon = [];
var locations = [];
var counter = 0;
var noID = 0;

for(let i = 0 ; i < unique.length ; i++){
  if(!(unique[i].includes("User ID") ) ){
    continue;
  }
  //clean read data process
  let originalText = unique[i].replace(/ /g, '').replace("UserID:","").replace("Lattitute:","").replace("Longitute:","").replace("InputParameter:","");
  let arrayData = originalText.split(",");
  // [0] = ID , [1] = Lat , [2] = Lon
  // console.log(arrayData)
  currentUserID.push(arrayData[0]);
  arrayLat.push(arrayData[1]);
  arrayLon.push(arrayData[2]);
  locations.push(arrayData[3]);

}

var writtingID = "";
var myAddress = [];
var writtingLocation = "";

var mapBotApp = setInterval(function(){

  writtingID = currentUserID[counter];
  writtingLocation = locations[counter];
  mapAPIApp(arrayLat[counter],arrayLon[counter]);
  console.log("HERE in loop");
  // coordinates_to_address(30,140);
  counter++;

} , 2*1000 )


var actualLocation = [];
var api_result = "";
var last_result = "";

function mapAPIApp(lat,lon){
  googleMapsClient.reverseGeocode({
    latlng: [lat, lon]
  }, function(err, response) {
    // console.log(err);
    if (!err) {
      api_result = response.json.results[0].formatted_address;
      // console.log("HERE")
      // cleaner do something here
      let clean_result = cleaner(api_result);
      console.log(api_result)
      console.log(clean_result)
      if(clean_result=="No Location Match"){
        //do nothing
      }
      else if(last_result==clean_result){
        //do nothing
      }
      else{
        last_result = clean_result;
        console.log("Ready To Write")
        writeFileToTxt(clean_result);
      }
    }
    else{
      throw err;
    }
  });

}


function writeFileToTxt(rec_data){
  var toTxt = "";
  toTxt += "User ID : " + writtingID + ", Location : " + rec_data+ ", Input Keyword : " + writtingLocation   +"\n" ;
  var textName = "tags_and_location.txt";
  fs.appendFile(textName, toTxt , function (err) {
    if (err) throw err;
    console.log('Saved!');
    toTxt = "";
    userGeo = [];
  });
}

//coordinates_to_address(35.6573965 , 139.74830925);
function coordinates_to_address(lat, lng) {
    var latlng = new googleMapsClient.maps.LatLng(lat, lng);

    geocoder.geocode({'latLng': latlng}, function(results, status) {
        if(status == google.maps.GeocoderStatus.OK) {
            if(results[0]) {
                console.log((results[0].formatted_address));
            } else {
                alert('No results found');
            }
        } else {
            var error = {
                'ZERO_RESULTS': 'Error No Result'
            }
            console.log(error[status]);
        }
    });
}
