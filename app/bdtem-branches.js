'use strict';

var STROKE_COLOR = '#FFF';


//TODO OBVIOUSLY CHANGE THIS:
var paper = Snap.select('#test');


function buildBranchLine(x1, y1, x2, y2) {
  var line = group.line(x1, y1, x2, y2);
  line.attr({stroke: STROKE_COLOR, 'stroke-width': 2});
  return line;
}

var Branch = function (startX, startY, endX, endY, text) {

  this.startX = startX;
  this.startY = startY;
  this.endX = endX;

  this.branchLine = buildBranchLine(startX, startY, startX, startY);
  this.textNode = undefined;

  var textNode = this.textNode;
  if (text) {
    textNode = buildTextNode(text, startX, startY, false, true);
    this.textNode = textNode;
  }

  this.destroyBranch = function () {
    this.animateBranch(this.branchLine, this.endX, this.startX, true);
  };

  this.animateBranch = function (line, from, to, destroying) {
    var branchLine = this.branchLine;
    to = to || endX;
    from = from || startX;
    Snap.animate(
      from,
      to,
      text ? updateHorizontalWithText : updateHorizontal,
      250,
      mina.easeout,
      destroying ? function () {
        branchLine.remove();
        if (textNode) {
          textNode.animate(
            {opacity: 0},
            250,
            function () {
              textNode.remove()
            }
          );
        }
      } : null
    );

    function updateHorizontal(value) {
      line.attr({x2: value});
    }

    function updateHorizontalWithText(value) {
      textNode.attr({x: value});
      updateHorizontal(value);
    }
  };

  this.animateBranch(this.branchLine);
  return this;
};

var BranchGroup = function (group) {
  var bBox = group.getBBox();
  var startY = bBox.y2;
  var startX = bBox.cx;
  var branchLength = 100;

  var trunk;
  var branches = [];

  this.destroyBranch = function () {
    branches.forEach(function (elem) {
      elem.destroyBranch();
    });
    trunk.animate(
      {opacity: 0},
      500,
      function () {
        trunk.remove();
      }
    );
  };

  this.makeBranchTo = function (x, y, branchesOnLine) {
    var endY = y;
    var yDistance = (endY - startY);
    var endX = x;
    var xDistance = (endX - startX);

    var isVertical = yDistance > 0 && xDistance == 0;

    var branchPoints = branchesOnLine > 0 ? buildBranchPoints() : [];

    function buildBranchPoints() {
      var branchPoints = new Array(branchesOnLine);
      for (var i = 1; i <= branchesOnLine; i++) {
        branchPoints[i - 1] = startY + (i / branchesOnLine) * yDistance
      }
      return branchPoints
    }

    function animateBranch(line) {
      Snap.animate(
        startY,
        endY,
        isVertical ? updateVertical : updateHorizontal,
        1000
      );


      function updateHorizontal(value) {
        line.attr({x2: value});
      }

      var currentBranch = 0;

      function updateVertical(value) {
        line.attr({y2: value});

        if (currentBranch < branchesOnLine && value >= branchPoints[currentBranch]) {
          ++currentBranch;
          var branch = new Branch(x, value, x + branchLength, value, Math.random().toString(16).substring(2, 10));
          branches.push(branch);
          group.append(branch.branchLine);
          var textNode = branch.textNode;
          if (textNode)
            group.append(textNode);
        }
      }

    }

    trunk = buildBranchLine(bBox.cx, startY, bBox.cx, endY);
    animateBranch(trunk);

    return this;
  };


};


function buildTextNode(text, x, y, centerX, centerY) {
  if (text) {
    var textNode = paper.text(-1024, -1024, text);
    var textBBox = textNode.getBBox();
    var height = textBBox.height;
    var width = textBBox.width;
    textNode.attr({
      'font-family': 'Libre Baskerville',
      x: centerX ? (x - width / 2) : x,
      y: centerY ? (y + height / 2) : y,
      fill: STROKE_COLOR
    });
    return textNode;
  } else {
    return undefined;
  }
}


var GraveButton = function (x, y, radius, text, numberOfCircles) {
  numberOfCircles = numberOfCircles || 3;

  this.group = paper.group();
  var group = this.group;
  group.attr({cursor: 'pointer'});
  var whiteMultiple = 0xFFFFFF / numberOfCircles;
  for (var i = 0; i < numberOfCircles; i++) {
    var fraction = ((numberOfCircles - i) / (numberOfCircles));

    var circle = paper.circle(x, y, (fraction * radius));

    var computedColor = '#' + Math.ceil(((numberOfCircles - i)) * whiteMultiple).toString(16);
    circle.attr({fill: computedColor});

    group.append(circle);
  }

  var bBox = group.getBBox();
  var centerX = bBox.cx;

  var textNode = buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: null});
  group.append(textNode);

  var wasTriggered = false;
  var branch;
  group.click(function () {
    if (!wasTriggered) {
      group.stop();
      group.attr({filter: shadowFilter});
      wasTriggered = true;
      branch = branchButton.makeBranchTo(150, 490, 10, 4);
    } else {

      group.attr({filter: comboFilter});
      wasTriggered = false;
      branch.destroyBranch();

      randomTranslate();
    }
  });

};

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var cx = 150;
var cy = 100;

var blurFilter = paper.filter(Snap.filter.blur(1, 1));
//  var shadowFilter = paper.filter(Snap.filter.sha);

var shadow = Snap.filter.shadow(0, 0, 10, '#CCC', 0.5);
var shadowFilter = paper.filter(shadow);

var comboFilter = paper.filter([Snap.filter.blur(1, 1), shadow].join('\n'));

var graveButton = new GraveButton(cx, cy, 100, 'Hello!', 15);

var group = graveButton.group;
group.attr({filter: comboFilter});

var branchButton = new BranchGroup(group);


////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
var scalingFactor = 250;
function randomTranslate() {
  group.animate(
    {
      transform: 't' + Math.random() * scalingFactor + ',' + Math.random() * scalingFactor
    },
    5000,
    mina.linear,
    function loopTranslate() {
      randomTranslate();
    }
  );
}
randomTranslate();


