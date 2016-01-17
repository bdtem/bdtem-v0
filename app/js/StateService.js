/**
 * Created by alacasse on 1/17/16.
 */

bdtem.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("orb", {
                url: "/",
                templateUrl: "templates/orb.html"
            })
            .state("grave", {
                url: "/",
                templateUrl: "templates/svg_branchtest.html"
            })
            .state("video", {
                url: "/",
                templateUrl: "templates/video.html"
            })
            .state("metadata", {
                url: "/",
                templateUrl: "templates/metadata.html",
                controller: 'MetadataCtrl'
            });
    }]);

bdtem.service('stateService', function ($state) {

    this.previousState = null;
    var self = this;

    self.go = function (targetState) {
        var currentState = $state.current.name;
        if (currentState != targetState) {
            self.previousState = currentState;
            $state.go(targetState);
        }
    };

    self.goToLast = function () {
        self.go(self.previousState);
    };

    self.toggleTo = function (targetState) {

        if ($state.current.name != targetState) {
            self.go(targetState);
        } else {
            self.goToLast();
        }
    };

    return {
        go: self.go,
        goToLast: self.goToLast,
        toggleTo: self.toggleTo
    };

});
