var flString = "PUBLIC/JS/VALIDATION.JS: ";

var checkValidity = function(id){
	var fString = flString + "CHECK_VALIDITY: ";

	var  x;
	var field = document.getElementById(id);
	if(field){
		field.onblur = function(){

			x = this.value;
			try{
				if(x == "") throw "This field is required!";

			}
			catch(err) {
				document.getElementById(id).className = "input-invalid form-control";
				document.getElementById(id).style.background = '#ffa6a6';
			}
		};

		field.oninput = function(){
			document.getElementById(id).style.background = "transparent";
		};
	} else {
		console.log(fString + "No input fields - bypassing Validity Check.");
	}
};

checkValidity("eventTitle");
checkValidity("eventDate");
checkValidity("eventStart");
checkValidity("eventEnd");
checkValidity("exhibit");
checkValidity("sponsor");
checkValidity("instrument");

/*
var buildingsAndRooms = {};
buildingsAndRooms["Hyatt"] = ["Cedar Ballroom AB", "Regency Ballroom ABC", "Regency Ballroom EFG", "Grand Ballroom ABC", "Grand Ballroom EFG", "Grand Ballroom I", "Grand Ballroom J", "Cottonwood", "Juniper", "Laurel", "Larch", "Madrona", "Auditorium", "Maple"];
buildingsAndRooms["Westin"] = ["Fort Peck", "Grand ABC", "Lake Sammamish", "Lake Coeur d'Alene", "Lake WA] ;

var changeRoomList = function(){
	var fString = flString + "CHANGE_ROOM_LIST(): ";
	console.log(fString);

	var buildingList = document.getElementById("building");
	console.log(fString + buildingList.value);

	var roomList = document.getElementById("room");
	var building = buildingList.options[buildingList.selectedIndex].value;
	console.log(fString + "building: " + building);

	while(roomList.options.length){
		roomList.remove(0);
	}

	var rooms = buildingsAndRooms[building];
	console.log(fString + "rooms: " + rooms);
	if(rooms){
		var i;
		for (i = 0; i < rooms.length; i++){
			var room = new Option(rooms[i], rooms[i]);
			roomList.options.add(room);
		}
	}
};

var addBuildings = function(){
	fString = flString + "BUILDING_LIST(): ";
	console.log(fString);

	var element = document.getElementById("building");
	console.log(fString + "element.value: " + element.value);
	var buildings = ["Hyatt", "Westin"];

 	while(element.options.length){
 		element.remove(0);
 	}

 	console.log(fString + "buildings.length: T" + buildings.length);
 	for(var i = 0; i < buildings.length; i++){
 		console.log(fString + buildings[i]);
 		var building = new Option(buildings[i], buildings[i]);
 		console.log(fString + building);
 		element.options.add(building);
 	}
};

var selectBuilding = function(){
	fString = flString + "SELECT_BUILDING(): ";
	console.log(fString);

	var buildings = ["Hyatt", "Westin"];

	var supposedBuilding = "";
	console.log(fString + "supposedBuilding: " + supposedBuilding);
	var building = document.getElementById("building");
	console.log(fString + building.value);

};

var states = function(id){
	fString = flString + "STATES: ";
	console.log(fString);

	var st = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

	var element = document.getElementById(id);
	console.log(fString + "element: " + element);
	console.log(fString + "id: " + id);
	var i = 0;
	for(i = 0; i < st.length; i++){
		var state = new Option(st[i]);
		element.options.add(state);
	}
};

var fillOptions = function(){
	fString = flString + "FILL_OPTIONS: ";
	console.log(fString);

	addBuildings();
	changeRoomList();
	states("hostState");
	states("presenterState");
	states("performerState");

};
*/

var exitOK = false;
var newForm = document.querySelector('#newForm');

newForm.addEventListener('submit', function() {
	exitOK = true;
});

window.onbeforeunload = function() {
	if(!exitOK){
		confirmExit()
	} else {
		return;
	}
};

var formState = "clean";
console.log(flString + formState);
var handleFormChange = function(){
	var fString = flString + "HANDLE_FORM_CHANGE(): ";
	formState = "dirty";
	console.log(fString + formState);
};

//var setConfirmUnload(true);

//check if user really wants to leave a window.
function confirmExit(){
	var fString = flString + "CONFIRM_EXIT: ";
	console.log(fString);

	//var formState = "clean";

	var message = fString + "You are trying to leave with unsaved data. Leave anyway?";
	var e = e || window.event;
	console.log(fString + "window.event: " + window.event);

	if(formState == "dirty"){
		if (e) {
			e.returnValue = message;
		}
		return message;
	}
};

/* QUESTIONS

1.	 CAN I set formState from window.onbeforeunload()?
2. setConfirmUnload - 

*/
