angular.module('bdtemFilters', []).filter('timeFilter', function() {
    return function(timeInSeconds) {
        var minutes = Math.floor(timeInSeconds / 60);
        var remainingSeconds = Math.floor(timeInSeconds % 60);

        var pad = remainingSeconds < 10 ? "0" : "";
        return minutes + ":" + pad + remainingSeconds;
    };
});