var branchesModule = angular.module('bdtem.branches', []);
/**
 * Created by alacasse on 1/17/16.
 */

var SCALING_FACTOR = 2;

function randomColor() {
    return Math.random().toString(16).substring(2, 8);
}

angular.forEach(['x1', 'x2', 'y1', 'y2'], function (name) {
    var ngName = 'ng' + name[0].toUpperCase() + name.slice(1);
    branchesModule.directive(ngName, function () {
        return function (scope, element, attrs) {
            attrs.$observe(ngName, function (value) {
                attrs.$set(name, value);
            })
        };
    });
});

branchesModule
    .constant('trigValues', {
        c120: Snap.cos(120),
        s120: Snap.sin(120),
        c240: Snap.cos(240),
        s240: Snap.sin(240)
    })
    .constant('branchesConfig', {
        gradientSteps: 5,
        cx: 350,
        cy: 125,
        radius: 66,
        trunkLength: 150,
        branchLength: 75,
        animationDuration: 750,
        animationScale: 2
    })
    .value('textConfig', {
        strokeColor: '#FFFFFF',
        OFF_SCREEN: -1024
    })
    // might be useful to bypass Snap if we need to...
    //
    //.value('createSVGNode', function (name, element, settings) {
    //    var namespace = 'http://www.w3.org/2000/svg';
    //    var node = document.createElementNS(namespace, name);
    //    for (var attribute in settings) {
    //        if (!settings.hasOwnProperty(attribute))
    //            continue;
    //
    //        var value = settings[attribute];
    //        if (value !== null && !attribute.match(/\$/) && (typeof value !== 'string' || value !== '')) {
    //            node.setAttribute(attribute, value);
    //        }
    //    }
    //    return node;
    //})
    .controller('GraveCtrl', ['$scope', '$attrs', function ($scope) {
        var self = this;
        this.svgGroup = null; //Initialized by link... this smells! We should probably do the group init here and have the directive get it.
        this.svgGradient = null;
        this.translationAnimation = {};

        $scope.wasTriggered = false;

        this.setSvgGroup = function (group) {
            self.svgGroup = group;
            self.translationAnimation = randomTranslation(group, Math.random() * 10 - Math.random());
            self.translationAnimation.startAnimation();
        };

        function randomGradientAnimation() {
            self.svgGradient.animate(
                {
                    r: $scope.wasTriggered ?
                    10 + Math.random() * SCALING_FACTOR :
                    8 + Math.random() * SCALING_FACTOR
                },
                500
            );
        }

        function randomTranslation(group, scalingFactor) {
            var animation = {
                scalingFactor: scalingFactor || 2,
                animation: null
            };
            var self = animation;

            animation.startAnimation = function () {
                self.animation = Snap.animate(
                    0,
                    360,
                    self.translateGroup,
                    4000,
                    self.loopAnimation
                );
            };

            var randomPhase = Math.random() * 360;

            animation.translateGroup = function (value) {
                var transformString = 't0,' + (Snap.sin(value + randomPhase) * self.scalingFactor);
                group.attr({
                    transform: transformString
                });
            };

            animation.loopAnimation = function () {
                group.attr({
                    transform: 't0,0'
                });
                self.startAnimation();
            };

            animation.pause = function () {
                if (self.animation) self.animation.pause();
            };

            animation.resume = function () {
                if (self.animation) self.animation.resume();
            };

            return animation;
        }


        this.clickHandler = function () {
            if (!$scope.wasTriggered) {
                $scope.wasTriggered = true;

                randomGradientAnimation();

                self.translationAnimation.pause();

            } else {
                $scope.wasTriggered = false;

                randomGradientAnimation();

                self.translationAnimation.resume();
            }
        }

    }])
    .controller('BranchCtrl', ['$scope', function ($scope) {

        $scope.startX = 200;
        $scope.endX = 400;
        $scope.startY = 200;
        $scope.endY = 400;
        $scope.stroke = '#FFFFFF';

    }])
    .directive('bdtemCircle', ['textConfig', function (textConfig) {
        var gradientSteps = branchesConfig.gradientSteps;
        var svgContext = Snap(800, 600);

        function buildGradient(svgContext) {
            var whiteMultiple = 0xFFFFFF / gradientSteps;
            // Building a gradient string with form described here:
            // http://snapsvg.io/docs/#Paper.gradient
            var gradientString = '#000';

            for (var i = 0; i < gradientSteps; i++) {
                var RGB_value = Math.ceil(((gradientSteps - i)) * whiteMultiple);
                gradientString += '-#' + RGB_value.toString(16);
            }

            return svgContext.gradient('r(' + [0.5, 0.5, 12].join(',') + ')' + gradientString);
        }

        function buildTextNode(text, x, y) {
            var offScreen = textConfig.OFF_SCREEN;
            var textNode = svgContext.text(offScreen, offScreen, text);
            var textBBox = textNode.getBBox();
            var width = textBBox.width;

            console.log(width)

            textNode.attr({
                'font-family': 'Libre Baskerville',
                x: x - (width / 2),
                y: y,
                fill: (text.length === 6 && Number('0x' + text) > 0) ? ('#' + text) : textConfig.strokeColor
            });

            textNode.click(function (event) {
                event.stopPropagation();
                textNode.attr({fill: '#F0F'});
                textNode.node.innerHTML = 'clicks'
            });

            return textNode;
        }

        return {
            restrict: 'EA',
            controller: 'GraveCtrl',
            controllerAs: 'ctrl',

            link: function (scope, element, attrs, ctrl) {

                var centerX = branchesConfig.cx;
                var centerY = branchesConfig.cy;
                var radius = branchesConfig.radius;

                var gradient = buildGradient(svgContext);
                ctrl.svgGradient = gradient;

                var group = svgContext.group()
                    .attr({cursor: 'pointer'})
                    .click(ctrl.clickHandler);
                ctrl.setSvgGroup(group);

                var bdtemButton = group.circle(centerX, centerY, radius).attr({fill: gradient});
                group.append(bdtemButton);


                var text = attrs['text'];
                if (text) {
                    var textNode = buildTextNode(text, centerX, group.getBBox().y2 + 20);
                    group.append(textNode);
                }

                angular.element(svgContext).append(element[0].childNodes);
                element.replaceWith(svgContext.node);
            }
        }
    }])
    .directive('bdtemBranch', ['branchesConfig', function (branchesConfig) {
        return {
            restrict: 'EA',
            require: '^^bdtemCircle',
            controller: 'BranchCtrl',
            controllerAs: 'ctrl',
            templateNamespace: 'svg',
            templateUrl: 'templates/bdtem-branch.html',

            link: function (scope, element, attrs, ctrl) {
                var group = ctrl.svgGroup;

                var branchType = attrs['type'];


            }
        }
    }]
);