angular.module('bdtemFilters', [])
    .filter('timeFilter', function () {
    return function (timeInSeconds) {
        var minutes = Math.floor(timeInSeconds / 60);
        var remainingSeconds = Math.floor(timeInSeconds % 60);

        var pad = remainingSeconds < 10 ? "0" : "";
        return minutes + ":" + pad + remainingSeconds;
    };
}).filter('undefinedToZero', function () {
    return function (value) {
        return value ? value : 0;
    };
}).filter('padWithZero', function () {
    return function (value) {
        if(typeof value === "number") {
            if(value < 10) {
             return "0" + value;
            }
        }
        return value;
    };
}).filter('trustAsHtml', ['$sce', function ($sce) {
        return function (val) {
            return $sce.trustAsHtml(val);
        };
    }]);