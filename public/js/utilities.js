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
    console.log(flString + d);
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
    console.log(fString + "return: " + date);
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
    var ampm, minutes, hours;
    var date = new Date(num);
    hours = date.getHours();
    if(date.getHours() > 12){
        ampm = "PM";
        hours = (date.getHours() - 12);
    } else {
        ampm = "AM";
    }
    minutes = date.getMinutes();
    return(hours + ":" + minutes + "0 " + ampm);
};

module.exports.day = function(day){
    var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
};
