flString = "APP_SERVER/CONTROLLERS/UTILITIES.JS: ";
console.log(flString);

module.exports.toTitleCase = function(str){
    return str.toLowerCase()
           .split(" ")
           .map(function(v){return v.charAt(0).toUpperCase() + v.slice(1)})
           .join(" ");
};

module.exports.getSortOrder = function(key){
    return function(a, b) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]){
            return -1;
        }
        return 0;
    }
};
