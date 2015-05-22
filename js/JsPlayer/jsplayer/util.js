/**
 * @module JsPlayer
 */


console.log('This is JsPlayer 1.0.0');


/**
 * returns the unix timestamp in secondes
 * @function getTimeStamp
 * @return {Number}
 */
var getTimeStamp = function() {
    return Math.round(new Date().getTime() / 1000);
};


/**
 * convert unix timestamp to hh:mm:ss
 * @function toHMS
 * @param t unix timestamp
 * @return {String}
 */
var toHMS = function(t) {
    var d = new Date(t * 1000);
    return paddingZero(d.getHours()) + ':' + paddingZero(d.getMinutes()) + ':' + paddingZero(d.getSeconds());
};


/**
 * convert unix timestamp to hh:mm
 * @function toHM
 * @param t unix timestamp
 * @return {String}
 */
var toHM = function(t) {
    var d = new Date(t * 1000);
    return paddingZero(d.getHours()) + 'h' + paddingZero(d.getMinutes());
};


/**
 * convert seconds to hh:mm:ss
 * @function secondsToHMS
 * @param s
 * @return {String}
 */
var secondsToHMS = function(s) {
    var hours = Math.floor(s / 3600);
    s -= hours * 3600;

    var minutes = Math.floor(s / 60);
    s -= minutes * 60;

    var seconds = s;

    return (hours > 0 ? paddingZero(hours) + ":" : "") + paddingZero(minutes) + ":" + paddingZero(seconds);
};


/**
 * format 2 digits number with padding zero if necessary
 * @function paddingZero
 * @param v
 * @return {String}
 */
var paddingZero = function(v) {
    return (v < 10 ? "0" : "") + v;
};


/**
 * check if value is in array
 * @function inArray
 * @param needle the value to look for
 * @param haystack the array
 * @return {Boolean}
 */
var inArray = function (needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}