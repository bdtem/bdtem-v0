var branchesModule = bdtem;
var SCALING_FACTOR = 2;
var OFF_SCREEN = -1024;
var BRANCH_LENGTH = 75;
var DURATION_MS = 250;
var STROKE_COLOR = '#000';


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

BRANCH_TYPE.HORIZONTAL.orthogonalSpan = BRANCH_TYPE.VERTICAL_SPAN;
BRANCH_TYPE.HORIZONTAL_SPAN.orthogonalSpan = BRANCH_TYPE.VERTICAL_SPAN;
BRANCH_TYPE.VERTICAL.orthogonalSpan = BRANCH_TYPE.HORIZONTAL_SPAN;
BRANCH_TYPE.VERTICAL_SPAN.orthogonalSpan = BRANCH_TYPE.HORIZONTAL_SPAN;

bdtem.value('branchTypes', BRANCH_TYPE);


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


bdtem
    .constant('trigValues', {
        c120: Snap.cos(120),
        s120: Snap.sin(120),
        c240: Snap.cos(240),
        s240: Snap.sin(240)
    })
    .constant('branchesConfig', {
        gradientSteps: 5,
        cx: 350,
        cy: 250,
        radius: 66,
        trunkLength: 150,
        branchLength: 75,
        animationDuration: 750,
        animationScale: 2,
        strokeColor: '#000'
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
    .directive('bdtemCircle',
    ['branchesConfig', 'branchTypes', 'graveTracks', 'playerService', function (branchesConfig,
                                                                                branchTypes,
                                                                                graveTracks,
                                                                                playerService) {
        var gradientSteps = branchesConfig.gradientSteps;

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


        return {
            restrict: 'EA',
            controller: 'GraveCtrl',
            controllerAs: 'ctrl',

            link: function (scope, element, attrs, ctrl) {

                var svgContext = ctrl.svgContext;

                var centerX = attrs['cx'] || branchesConfig.cx;
                var centerY = attrs['cy'] || branchesConfig.cy;
                var radius = branchesConfig.radius;

                var gradient = buildGradient(svgContext);
                ctrl.svgGradient = gradient;
                var group = ctrl.svgGroup;

                var bdtemButton = group.circle(centerX, centerY, radius).attr({fill: gradient});

                group.append(bdtemButton);

                var bBox = group.getBBox();
                var cx = bBox.cx;
                var cy = bBox.cy;

                var catalog = attrs['catalog'];

                if (catalog) {
                    var textNode = buildTextNode(catalog, cx, bBox.y2 + 20);
                    group.append(textNode);
                    bBox = group.getBBox();
                }

                var type = branchTypes[attrs['type'] || 'VERTICAL'];


                var branchPattern = attrs['branchPattern'] || '';

                var tree = catalog ? graveTracks[catalog] : parseNewickTree(branchPattern);


                var isHorizontal = type.name[0] === 'H';
                var fixed = isHorizontal ? cy : cx;
                var start = isHorizontal ? bBox.x2 : bBox.y2;

                console.log('fixed: ' + fixed + ' ' + 'start: ' + start);
                var circle = group.circle(fixed, start, 2);
                circle.attr({fill: '#FFF'});

                var branchParams = {
                    trunk: null,
                    branches: []
                };

                var level = 0;
                var levelHeights = {};

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

                function convertToBranches(tree) {

                    tree.fixed = fixed;
                    tree.start = start;
                    tree.position = 0;
                    tree.levelWidth = 1;

                    branchParams.trunk = branchFromNode(tree);

                    if (tree.branchset) {
                        level++;

                        var length = tree.branchset.length;
                        var subBranches = [];

                        subBranches.push(crossBar(tree));
                        var levelStart = (levelHeights[level - 1] || start);

                        console.log('level ' + level + ' is starting at ' + levelStart);

                        tree.branchset.forEach(function (e, i) {
                            e.fixed = fixed;
                            e.start = levelStart;
                            e.position = i;
                            e.levelWidth = length;
                            subBranches.push(branchGroupFromNode(e));
                        });

                        branchParams.branches.push(new AdHocBranchGroup(subBranches));
                    }

                    return new BranchGroup(group, 5, BRANCH_LENGTH, DURATION_MS, branchParams);
                }

                function branchGroupFromNode(node) {
                    var branches = [];

                    var items = branchFromNode(node);

                    branches.push(items);

                    if (node.branchset) {
                        var parent = node;

                        level++;

                        var length = node.branchset.length;
                        var subBranches = [];
                        subBranches.push(crossBar(node));

                        node.branchset.forEach(function (e, i) {
                            e.fixed = parent.fixed;
                            e.start = parent.start + parent.length;
                            e.position = i;
                            e.levelWidth = length;
                            subBranches.push(branchGroupFromNode(e));
                        });

                        branches.push(new AdHocBranchGroup(subBranches));

                        level--;
                    }

                    return branches.length > 1 ? new AdHocBranchGroup(branches) : branches[0];
                }

                function widthForCurrentLevel(width) {
                    return width * (BRANCH_LENGTH / (level + 1));
                }

                function branchFromNode(node) {
                    var nodeStart = node.start || start;

                    var nodeEnd = (nodeStart + (node.length || BRANCH_LENGTH));
                    if (nodeEnd > (levelHeights[level] || 0)) {
                        levelHeights[level] = nodeEnd;
                    }

                    var offset = calculatePointOffset(
                        node.position,
                        node.levelWidth,
                        node.fixed || fixed,
                        nodeStart,
                        true);

                    node.fixed = offset.fixed || fixed;
                    node.start = offset.start || start;
                    node.length = node.length || BRANCH_LENGTH;

                    var branch = new Branch(group,
                        node.fixed,
                        node.start,
                        node.length,
                        node.name,
                        type
                    );

                    var textNode = branch.textNode;
                    if (textNode) {
                        textNode.click(function (event) {
                            event.stopPropagation();
                            playerService.skipTo("GRAVE", node.position)
                        });
                    }

                    return branch;

                }

                function crossBar(node) {
                    var width = node.branchset.length;

                    var crossBar = new Branch(
                        group,
                        node.start + node.length,
                        node.fixed,
                        widthForCurrentLevel(width),
                        null,
                        type.orthogonalSpan
                    );

                    console.log(crossBar.trunk.node);
                    return crossBar;
                }

                function calculatePointOffset(position, numberOfPoints, fixed, start, isSpan) {

                    var length = widthForCurrentLevel(numberOfPoints);

                    if (!numberOfPoints || numberOfPoints < 2)
                        return {fixed: fixed, start: start};


                    if (isSpan) {
                        fixed -= length;
                        length *= 2;

                        var hasCenter = numberOfPoints % 2 != 0;

                        if (hasCenter) {
                            var centerPosition = Math.floor(numberOfPoints / 2) + 1;

                            if (position === centerPosition) {
                                return {fixed: fixed, start: start};
                            }

                            ++position;
                        }

                        --numberOfPoints;
                    }

                    var currentProportion = ((position) / numberOfPoints);
                    var lengthProportion = currentProportion * length;

                    return {
                        fixed: fixed + lengthProportion,
                        start: start
                    };
                }

                ctrl.branchGroup = convertToBranches(tree);
                element.replaceWith(svgContext.node);
            }
        }
    }])
;


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