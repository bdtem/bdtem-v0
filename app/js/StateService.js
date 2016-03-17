/**
 * Created by alacasse on 1/17/16.
 */

bdtem.config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('orb', {
                url: "/",
                templateUrl: "templates/orb.html"
            })
            .state('grave', {
                url: "/grave",
                templateUrl: "templates/svg_branchtest.html"
            })
            .state("video", {
                url: "/v",
                templateUrl: "templates/video.html"
            })
            .state("metadata", {
                url: "/m",
                templateUrl: "templates/metadata.html",
                controller: "MetadataCtrl"
            })
            .state("mission", {
                url: "/mission",
                templateUrl: "templates/email_chain.html",
                controller: "EmailChainCtrl"
            });
    }]);

bdtem.service('stateService', ['$state',
    function ($state) {
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


        var publicMethods = {
            go: self.go,
            goToLast: self.goToLast,
            toggleTo: self.toggleTo
        };

        return publicMethods;

    }]);
