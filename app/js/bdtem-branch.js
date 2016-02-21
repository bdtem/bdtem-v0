var branchesModule = angular.module('bdtem.branches', []);
/**
 * Created by alacasse on 1/17/16.
 */
var SCALING_FACTOR = 2;
var OFF_SCREEN = -1024;
var TRUNK_LENGTH = 150;
var BRANCH_LENGTH = 75;
var DURATION_MS = 750;
var STROKE_COLOR = '#F0F';


var BRANCH_TYPE = {
    HORIZONTAL: {
        value: 0,
        name: 'Horizontal',
        shortName: 'H',
        animationParam: 'x2',
        getStartX: function (branch) {
            return branch.start;
        },
        getStartY: function (branch) {
            return branch.fixed;
        },
        getEndX: function (branch) {
            return branch.length ? branch.start + branch.length : branch.start;
        },
        getEndY: function (branch) {
            return branch.fixed;
        },
        updateAnimation: function () {
            var self = this;
            return function (value) {

                var txt = self.textNode;
                if (txt) {
                    txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
                }

                var attrs = {};
                attrs[self.branchType.animationParam] = value;
                self.trunk.attr(attrs);
            };
        }
    },
    HORIZONTAL_SPAN: {
        span: true,
        value: 1,
        name: "Horizontal Span",
        shortName: "Hs",
        animationParam: 'x2',
        getStartX: function (branch) {
            return branch.start;
        },
        getStartY: function (branch) {
            return branch.fixed;
        },
        getEndX: function (branch) {
            return branch.length ? branch.start + branch.length : branch.start;
        },
        getEndY: function (branch) {
            return branch.fixed;
        },
        updateAnimation: function () {
            var self = this;
            return function (value) {

                var txt = self.textNode;
                if (txt) {
                    txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
                }

                self.trunk.attr({
                    x1: 2 * self.start - value,
                    x2: value
                });
            };
        }

    },
    VERTICAL: {
        value: 2,
        name: "Vertical",
        shortName: "V",
        animationParam: 'y2',
        getStartX: function (branch) {
            return branch.fixed;
        },
        getStartY: function (branch) {
            return branch.start;
        },
        getEndX: function (branch) {
            return branch.fixed;
        },
        getEndY: function (branch) {
            return branch.length ? branch.start + branch.length : branch.start;
        },
        updateAnimation: function () {
            var self = this;
            return function (value) {
                var txt = self.textNode;
                if (txt) {
                    var bBox = txt.getBBox();
                    var heightOffset = self.length > 0 ? bBox.height : -bBox.height;
                    txt.attr({y: value + heightOffset});
                }

                var attrs = {};
                attrs[self.branchType.animationParam] = value;
                self.trunk.attr(attrs);
            }
        }
    },
    VERTICAL_SPAN: {
        span: true,
        value: 3,
        name: "Vertical Span",
        shortName: "Vs",
        animationParam: 'y2',
        getStartX: function (branch) {
            return branch.fixed;
        },
        getStartY: function (branch) {
            return branch.start;
        },
        getEndX: function (branch) {
            return branch.fixed;
        },
        getEndY: function (branch) {
            return branch.length ? branch.start + branch.length : branch.start;
        },
        updateAnimation: function () {
            var self = this;
            return function (value) {
                var txt = self.textNode;
                if (txt) {
                    txt.attr({y: self.length < 0 ? value - (txt.getBBox().height) : value});
                }

                self.trunk.attr({
                    y1: 2 * self.start - value,
                    y2: value
                });
            };
        }

    }
};
//Define orthogonalities:
BRANCH_TYPE.HORIZONTAL.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.HORIZONTAL_SPAN.orthogonal = BRANCH_TYPE.VERTICAL;
BRANCH_TYPE.VERTICAL.orthogonal = BRANCH_TYPE.HORIZONTAL;
BRANCH_TYPE.VERTICAL_SPAN.orthogonal = BRANCH_TYPE.HORIZONTAL;

branchesModule.value('branchTypes', BRANCH_TYPE);


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
        animationScale: 2,
        strokeColor: '#FFFFFF'
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
        this.branchGroup = null;
        this.translationAnimation = {};

        this.wasTriggered = false;

        this.setSvgGroup = function (group) {
            self.svgGroup = group;

            self.translationAnimation = randomTranslation(group, Math.random() * 10 - Math.random());

            setTimeout(function () {
                    self.translationAnimation.startAnimation()
                },
                Math.random() * 2000);
        }.bind(this);

        this.setBranchGroup = function (group) {
            this.branchGroup = group;
        }.bind(this);


        function randomGradientAnimation() {
            self.svgGradient.animate(
                {
                    r: $scope.wasTriggered ?
                    10 + Math.random() * SCALING_FACTOR :
                    5 + Math.random() * SCALING_FACTOR
                },
                500.
            );
        }

        function randomTranslation(group) {
            var animation = {
                scalingFactor: 5,
                animation: null
            };
            var self = animation;

            animation.startAnimation = function () {
                self.animation = Snap.animate(
                    0,
                    360,
                    self.translateGroup,
                    4000,
                    null,
                    self.loopAnimation
                )
            };

            var randomPhase = Math.random() * 360;

            animation.translateGroup = function (value) {
                var transformString = 't' + Snap.cos(value + randomPhase) * self.scalingFactor + ',' + (Snap.sin(value + randomPhase) * self.scalingFactor);
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
            if (!this.wasTriggered) {
                this.wasTriggered = true;

                randomGradientAnimation();

                this.translationAnimation.pause();

                this.branchGroup.animateIn();

            } else {
                this.wasTriggered = false;

                randomGradientAnimation();

                this.branchGroup.destroyBranch();

                this.translationAnimation.resume();
            }
        }.bind(this);

    }])
    .controller('BranchCtrl', ['$scope', function ($scope) {

        $scope.startX = 200;
        $scope.endX = 400;
        $scope.startY = 200;
        $scope.endY = 400;
        $scope.stroke = '#FFFFFF';

    }])
    .directive('bdtemCircle', ['branchesConfig', 'branchTypes', function (branchesConfig, branchTypes) {
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
            var textNode = svgContext.text(OFF_SCREEN, OFF_SCREEN, text);
            var textBBox = textNode.getBBox();
            var width = textBBox.width;

            textNode.attr({
                'font-family': 'Libre Baskerville',
                x: x - (width / 2),
                y: y,
                fill: (text.length === 6 && Number('0x' + text) > 0) ? ('#' + text) : branchesConfig.strokeColor
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

                var centerX = attrs['cx'] || branchesConfig.cx;
                var centerY = attrs['cy'] || branchesConfig.cy;
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


                var bBox = group.getBBox();
                if (text) {
                    var textNode = buildTextNode(text, centerX, bBox.y2 + 20);
                    group.append(textNode);
                }

                var type = branchTypes[attrs['type'] || 'VERTICAL'];
                var branchPattern = attrs['branchPattern'] || '';

                var tree = parseNewickTree(branchPattern);

                var isHorizontal = type.name[0] === 'H';
                var fixed = isHorizontal ? bBox.cy : bBox.cx;
                var start = isHorizontal ? bBox.x2 : bBox.y2;

                var branchParams = {
                    trunk: null,
                    branches: []
                };

                var level = 0;

                function convertToBranches(tree) {

                    tree.fixed = fixed;
                    tree.start = start;
                    tree.position = 0;
                    tree.levelWidth = 1;

                    branchParams.trunk = branchFromNode(tree);

                    if (tree.branchset) {
                        var length = tree.branchset.length;
                        tree.branchset.forEach(function (e, i) {
                            e.fixed = fixed;
                            e.start = level * start;
                            e.position = i;
                            e.levelWidth = length;
                            branchParams.branches.push(branchGroupFromNode(e));
                        });
                    }

                    return new BranchGroup(group, TRUNK_LENGTH, 5, BRANCH_LENGTH, DURATION_MS, branchParams);
                }

                function branchGroupFromNode(node) {
                    var branches = [];
                    branches.push(branchFromNode(node));
                    if (node.branchset) {
                        level++;
                        console.log(level);
                        var length = node.branchset.length;
                        node.branchset.forEach(function (e, i) {
                            e.fixed = fixed;
                            e.start = level * start;
                            e.position = i;
                            e.levelWidth = length;
                            console.log(e);
                            branches.push(branchGroupFromNode(e));
                        });
                        level--;
                    }

                    return branches.length > 1 ? new AdHocBranchGroup(branches) : branches[0];
                }

                function branchFromNode(node) {

                    var offset = calculatePointOffset(
                        node.position,
                        node.levelWidth,
                        BRANCH_LENGTH,
                        node.fixed || fixed,
                        node.start || start,
                        false);

                    return new Branch(group,
                        offset.fixed || fixed,
                        offset.start || start,
                        node.length || BRANCH_LENGTH,
                        null,
                        type
                    );
                }

                function calculatePointOffset(position, numberOfPoints, length, fixed, start, isSpan) {

                    var currentProportion = ((position + 1) / numberOfPoints);
                    var lengthProportion = currentProportion * length;
                    var offset;

                    if (isSpan) {
                        var hasCenter = numberOfPoints % 2 != 0;
                        var centerPosition = Math.floor(numberOfPoints / 2) + 1;
                        if (hasCenter && position === centerPosition) {
                            offset = 0;
                        } else {
                            offset = position >= centerPosition ? lengthProportion : -lengthProportion;
                        }
                    } else {
                        offset = lengthProportion;
                    }

                    return {
                        fixed: start + offset,
                        start: fixed
                    };
                }

                console.log(tree);
                var converted = convertToBranches(tree);
                ctrl.setBranchGroup(converted);
                console.log(converted);

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


function parseNewickTree(string) {
    var subtree;
    var ancestors = [];
    var tree = {};
    var tokens = string.split(/\s*(;|\(|\)|,|:)\s*/);
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        switch (token) {
            case '(': // new branchset
                subtree = {};
                tree.branchset = [subtree];
                ancestors.push(tree);
                tree = subtree;
                break;
            case ',': // another branch
                subtree = {};
                ancestors[ancestors.length - 1].branchset.push(subtree);
                tree = subtree;
                break;
            case ')': // optional name next
                tree = ancestors.pop();
                break;
            case ':': // optional length next
                break;
            default:
                var x = tokens[i - 1];
                if (x == ')' || x == '(' || x == ',') {
                    tree.name = token;
                } else if (x == ':') {
                    tree.length = parseFloat(token);
                }
        }
    }
    return tree;
}