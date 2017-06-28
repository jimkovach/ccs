flString = "APP_SERVER/CONTROLLERS/UTILITIES.JS: ";

module.exports.toTitleCase = function(str){
    if(typeof str == String){
        return str.toLowerCase()
            .split(" ")
            .map(function(v){return v.charAt(0).toUpperCase() + v.slice(1)})
            .join(" ");
    } else {
        return (str);
    }
};

module.exports.getSortOrder = function(key){
    return function(a, b) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]){
            return -1;
        }
        return 1;
    }
};

module.exports.convertToDate = function(dateObject) {
    var fString = flString + "CONVERT_TO_DATE: ";
    var d = dateObject;
    //allows the use of either 'a or 'p instead of full designation
    if(! d.toUpperCase().endsWith("M")){
        d += "M";
    }
    //allows for not leaving space between time and am/pm
    if (d.length - 3 != " "){
        var front = d.slice(0, d.length - 2);
        var back = d.slice(d.length - 2);
        d = front + " " + back;
    }
    //get the date number
    var date = Date.parse(d);
    return(date);
};
 
module.exports.dateFromNum = function(num){
    var date = new Date(num);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    date = month + "/" + day + "/" + year;
    return(date);
};

module.exports.timeFromNum = function(num){
    var ampm, minutes, hours, time;
    var date = new Date(num);
    hours = date.getHours();
    if(date.getHours() > 12){
        ampm = " PM";
        hours = (date.getHours() - 12);
    } else {
        ampm = " AM";
    }
    minutes = date.getMinutes();
    time = hours + ":" + minutes + "0 " + ampm;
    return(hours + ":" + minutes + "0 " + ampm);
};

module.exports.day = function(day){
    var weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    return(weekday[day]);
};

module.exports.fillTable = function(events) {
    var flString = flString + "FILL_TABLE: ";
    var roomArray = new Array('Fort Peck', 'Grand ABC', 'Lake Sammamish', "Lake Coeur d'Alene", 'Lake Chelan', 'Lake Washington A');
    var timeArray = new Array('8:30 AM', '9:50 AM', '11:00 AM', '12:15 AM', '1:30 PM', '3:00 PM', '3:30 PM', '5:30 PM', '8:00 PM');
    r = '';
    t = '';
    var string = '';
    for ( t in timeArray){
        for (r in roomArray){
            string += roomArray[i];
        }
    }
}
