angular.module('testApp', ['ui.bootstrap']);
angular.module('testApp', ['ui.bootstrap']).controller('TestCtrl', function($scope) {

    $scope.currentTime = 35;

    $scope.randomnumber = function () {
            return Math.floor(Math.random() * 100);
        };

    $scope.__defineGetter__('currentDuration', $scope.randomnumber);

    $scope.helloThere = 'Hello world!';

});