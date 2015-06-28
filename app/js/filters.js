angular.module('bdtemFilters', [])
    .filter('undefinedToZero', function () {
        return function (value) {
            return value ? value : 0;
        };
    }).filter('padWithZero', function () {
        return function (value) {
            if (typeof value === "number") {
                if (value < 10) {
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