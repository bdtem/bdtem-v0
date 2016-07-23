/**
 * Created by alacasse on 7/12/16.
 */

function __SETUP__() {
    function NO_OP() {
    }


// HACKY AF TODO RETHINK
    function _registry() {
        this.uids = [];
        this.reset();

    }

    _registry.prototype.register = function (node) {
        this.active[node.uid] = true;
        console.log("registered " + node.uid);
    };

    _registry.prototype.deregister = function (node) {
        console.log("deregistered " + node.uid);

        this.active[node.uid] = node;
        this.verifyIfDone();
    };

    _registry.prototype.verifyIfDone = function () {
        var nodes = [];
        for (var prop in this.active) {
            if (!this.active.hasOwnProperty(prop))
                continue;

            var node = this.active[prop];
            if (!isDone(node)) {
                return false;
            }
            nodes.push(node);
        }

        console.log("reset " + nodes.length);

        nodes.forEach(resetNode);
    };

    _registry.prototype.isDone = function () {

    }

    _registry.prototype.reset = function () {
        this.active = {};
    };

    function isDone(entry) {
        return typeof entry !== 'undefined' && entry !== true;
    }

    function resetNode(node) {
        node.reset();
    }

    var GLOBAL_REGISTRY = new _registry();


    function hasUid(uid) {
        return function (node) {
            return node.uid === uid;
        }
    }

    var START_LEVEL = 0;
    var MAX_LEVEL = 5;

    var TICK_LENGTH_MS = 200;


    const WIDTH = 1200;
    const HEIGHT = 1200;

    var SVG_CONTEXT = Snap(WIDTH, HEIGHT).attr({
        id: 'graph',
        display: 'block',
        margin: '0 auto',
        preserveAspectRatio: 'none'
    });


    var startX = 175;
    var startY = 300;
    var radius = 25;

    var DISTANCE_SCALE = 60;

    function scaleDistance(distance) {
        return DISTANCE_SCALE * distance;
    }


    function svgElementFor(SampleNode, x, y) {

        if (SampleNode.svgNode) {
            console.log(SampleNode.uid + ' already')
            return;
        }

        var uninitializedEdges = SampleNode.neighborEdges.filter(function (edge) {
            return edge.isUninitialized();
        });

        var numberOfNeighbors = uninitializedEdges.length;

        var xs = [];
        var ys = [];
        var neighborNodes = [];

        var radianSpread = (2 * Math.PI) / (numberOfNeighbors);

        if (numberOfNeighbors > 0) {
            uninitializedEdges.forEach(function (edge, number) {
                if (edge.isUninitialized()) {
                    var endNode = edge.flowingFrom(SampleNode).endNode;
                    var radians = (number * radianSpread);
                    var scaledDistance = scaleDistance(edge.distance);

                    neighborNodes.push(endNode);
                    xs.push(x + (scaledDistance * Math.cos(radians)));
                    ys.push(y + (scaledDistance * Math.sin(radians)));
                } else {
                    console.log(edge.endNode)
                }
            });
        }


        for (var pos = 0; pos < xs.length; pos++) {
            var line = SVG_CONTEXT.polyline(x, y, xs[pos], ys[pos]);
            line.attr({stroke: '#000', 'stroke-width': 2});
        }

        var circle = SVG_CONTEXT.circle(x, y, radius);
        circle.attr({fill: '#000'});

        var text = SVG_CONTEXT.text(x, y, SampleNode.uid);
        text.attr({fill: '#FFF'});

        circle.click(function () {
            this.poke();
        }.bind(SampleNode));

        SampleNode.setSvgNode(circle);

        for (var i = 0; i < neighborNodes.length; i++) {
            svgElementFor(neighborNodes[i], xs[i], ys[i]);
        }

    }


    function Edge(nodeA, nodeB, distance) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;

        this.startNode = undefined;
        this.endNode = undefined;

        this.distance = distance;

        nodeA.neighborEdges.push(this);
        nodeB.neighborEdges.push(this);
    }

    Edge.prototype.isUninitialized = function () {
        return typeof this.startNode === 'undefined';
    };

    Edge.prototype.flowingFrom = function (node) {
        var isFlowingFromNodeA = this.nodeA.uid === node.uid;

        this.startNode = isFlowingFromNodeA ? this.nodeA : this.nodeB;
        this.endNode = isFlowingFromNodeA ? this.nodeB : this.nodeA;

        return this;
    };

    function SampleNode(neighbors) {
        this.uid = Math.random().toString().substr(2, 2);
        this.triggeredBy = [];

        this.level = START_LEVEL;
        this.hasPeaked = false;

        this.neighborEdges = neighbors || [];

        //What should this be?
        this.sample = undefined;

        this.svgNode = null;

        this.callback = NO_OP;
    }

    SampleNode.prototype.setSvgNode = function (svgNode) {
        this.svgNode = svgNode;
    };

    SampleNode.prototype.increaseLevel = function () {
        if (++this.level >= MAX_LEVEL) {
            this.peak();
        }

        report.bind(this)();
    };

    SampleNode.prototype.decreaseLevel = function () {
        if (this.level > START_LEVEL) {
            --this.level;
        } else {
            this.callback = NO_OP;
            GLOBAL_REGISTRY.deregister(this);
        }
    };

    SampleNode.prototype.peak = function () {
        this.hasPeaked = true;

        var triggeringNode = this;

        this.neighborEdges.forEach(function (edge) {
            var targetNode = edge.flowingFrom(triggeringNode).endNode;

            if (notTriggeredBy(targetNode.uid)(triggeringNode)) {
                var triggerChain = triggeringNode.triggeredBy.slice();
                triggerChain.push(triggeringNode.uid);

                setTimeout(targetNode.startTicking.bind(targetNode, triggerChain), edge.distance * TICK_LENGTH_MS);

            }
        });
    };

    SampleNode.prototype.reset = function () {
        this.hasPeaked = false;
        this.triggeredBy = [];
    };

    function report() {
        //console.log(this.uid + ": " + this.level);
    }

    function notTriggeredBy(uid) {
        return function (node) {
            return !node.triggeredBy.includes(uid)
        }
    }

    SampleNode.prototype.poke = function () {
        if (this.callback === NO_OP) {
            console.log(this.uid + ' has been poked!');
            this.level = MAX_LEVEL;

            this.peak();
            this.startTicking();
        } else {
            console.log(this.uid + ' is already active!');
        }
    };

    SampleNode.prototype.startTicking = function (triggerChain) {
        GLOBAL_REGISTRY.register(this);
        this.triggeredBy = triggerChain;
        this.callback = this.tick.bind(this);
        this.callback();
    };

    SampleNode.prototype.tick = function () {
        this.hasPeaked ? this.decreaseLevel() : this.increaseLevel();
        var to = _colorForLevel(this.level);

        this.svgNode.animate({fill: to}, TICK_LENGTH_MS);

        setTimeout(this.callback, TICK_LENGTH_MS);
        report.bind(this)()
    };

    function _colorForLevel(level) {
        var hexString = Math.floor((level / MAX_LEVEL) * 0xFFF).toString(16);

        while (hexString.length < 3) {
            hexString += '0'
        }

        return '#' + hexString;
    }


    var rootNode = new SampleNode();

    var otherNode = new SampleNode();
    var thirdNode = new SampleNode();
    var fourthNode = new SampleNode();
    var fifthNode = new SampleNode();

    var firstEdge = new Edge(rootNode, otherNode, 5);
    var secondEdge = new Edge(rootNode, thirdNode, 4);
    var thirdEdge = new Edge(rootNode, fourthNode, 3);
    var fourthEdge = new Edge(rootNode, fifthNode, 2);
    var fifthhEdge = new Edge(rootNode, new SampleNode(), 2);

    var farOff = new SampleNode();

    new Edge(otherNode, farOff, 2.5);
    new Edge(otherNode, new SampleNode(), 1);
    new Edge(otherNode, new SampleNode(), 4);


    new Edge(farOff, new SampleNode(), 2)
    new Edge(farOff, new SampleNode(), 2.25)
    new Edge(farOff, new SampleNode(), 1.5)

///////////////
    svgElementFor(rootNode, startX, startY);
///////////////
}

__SETUP__();
