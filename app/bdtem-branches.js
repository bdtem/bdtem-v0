'use strict';

var STROKE_COLOR = '#FFF';


//TODO OBVIOUSLY CHANGE THIS:
var paper = Snap.select('#test');


function buildBranchLine(x1, y1, x2, y2) {
  var line = group.line(x1, y1, x2, y2);
  line.attr({stroke: STROKE_COLOR, 'stroke-width': 2});
  return line;
}

function Branch(startX, startY, endX, endY, text) {

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

  this.animateTrunk(this.branchLine);
}

Branch.prototype.destroyBranch = function () {
  this.animateTrunk(this.branchLine, true)
};

Branch.prototype.animateTrunk = function (line, destroyAfter, from, to, callback) {
  var textNode = this.textNode;

  if (destroyAfter) {
    from = from || this.endX;
    to = to || this.startX;


    callback = callback || function () {
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
      }
  } else {
    to = to || this.endX;
    from = from || this.startX;
  }

  var branchLine = this.branchLine;
  Snap.animate(
    from,
    to,
    this.updateHorizontal(this),
    250,
    mina.easeout,
    callback
  );
};

Branch.prototype.updateHorizontal = function (branch) {
  return function (value) {
    var txt = branch.textNode;
    if (txt)
      txt.attr({x: value, opacity: value});

    branch.branchLine.attr({x2: value});

  };
};

function BranchGroup(group, trunkLength, numberOfBranches, branchLength) {
  this.numberOfBranches = numberOfBranches || 1;
  this.currentBranch = 0;

  this.trunkLength = trunkLength || 150;
  this.branchLength = branchLength || 75;

  var bBox = group.getBBox();
  this.startY = bBox.y2;
  this.startX = bBox.cx;
  this.endY = this.startY + this.trunkLength;
  this.yDistance = (this.endY - this.startY);

  this.branches = [];
  this.branchPoints = numberOfBranches > 0 ? this.buildBranchPoints() : [];
}

BranchGroup.prototype.destroySubBranches = function () {
  this.branches.forEach(function (elem) {
    elem.destroyBranch();
  });
  this.branches = [];
};

BranchGroup.prototype.destroyBranch = function () {
  this.destroySubBranches();
  if (this.animationInProgress) {
    this.animationInProgress.stop();
  }
  this.trunk.stop();
  this.trunk.animate(
    {opacity: 0},
    500,
    removeAfterAnimation(this.trunk)
  );
  this.currentBranch = 0;
};

function removeAfterAnimation(node) {
  return function () {
    node.remove()
  };
}


var OFF_SCREEN = -1024;
function buildTextNode(text, x, y, centerX, centerY) {
  if (text) {
    var textNode = paper.text(OFF_SCREEN, OFF_SCREEN, text);
    var textBBox = textNode.getBBox();
    var height = textBBox.height;
    var width = textBBox.width;
    textNode.attr({
      'font-family': 'Libre Baskerville',
      x: centerX ? (x - width / 2) : x,
      y: centerY ? (y + height / 2) : y,
      fill: (text.length === 6 && Number('0x' + text) > 0) ? ('#' + text) : STROKE_COLOR
    });
    textNode.click(function (event) {
      event.stopPropagation();
      textNode.attr({fill: '#F0F', filter: shadowFilter});
      textNode.node.innerHTML = 'clicks'
    });
    return textNode;
  } else {
    return undefined;
  }
}

BranchGroup.prototype.buildBranchPoints = function () {
  var branchPoints = new Array(this.numberOfBranches);

  for (var i = 1; i <= this.numberOfBranches; i++) {
    branchPoints[i - 1] = this.startY + (i / this.numberOfBranches) * this.yDistance
  }

  return branchPoints
};

BranchGroup.prototype.drawTrunkWithBranchesTo = function (x, y) {
  this.trunk = buildBranchLine(this.startX, this.startY, x || this.startX, y || this.startY);

  this.animateTrunk();

  return this;
};

BranchGroup.prototype.animateTrunk = function () {
  this.animationInProgress = Snap.animate(
    this.startY,
    this.endY,
    this.updateVertical(this),
    1000
  );
};

BranchGroup.prototype.updateVertical = function (branchGroup) {
  return function updateLine(value) {
    branchGroup.trunk.attr({y2: value});

    if (branchGroup.currentBranch < branchGroup.numberOfBranches &&
      value >= branchGroup.branchPoints[branchGroup.currentBranch]) {
      branchGroup.addBranch(branchGroup.startX, value);
    }
  }
};

BranchGroup.prototype.addBranch = function (startX, branchY) {
  startX = startX || this.startX;
  ++this.currentBranch;

  var branch = new Branch(startX, branchY, startX + this.branchLength, branchY, this.getBranchText());

  this.branches.push(branch);
  group.append(branch.branchLine);

  //TODO Stylistic decision: apply same effects to text as to the geometric shapes?
  //var textNode = branch.textNode;
  //if (textNode) {
  //  group.append(textNode);
  //}
};


BranchGroup.prototype.getBranchText = function () {
  return Math.random().toString(16).substring(2, 8);
};


var GraveButton = function (x, y, radius, text, numberOfCircles) {
  numberOfCircles = numberOfCircles || 3;

  //TODO Make a CSS class for the groups and use that instead of inline styling.
  this.group = paper.group().attr({cursor: 'pointer'});


  var whiteMultiple = 0xFFFFFF / numberOfCircles;
  // Building a gradient string with form described here:
  // http://snapsvg.io/docs/#Paper.gradient
  var gradientString = '#000';

  var circle = paper.circle(cx, cy, radius);
  this.group.append(circle);
  for (var i = 0; i < numberOfCircles; i++) {
    var RGB_value = Math.ceil(((numberOfCircles - i)) * whiteMultiple);
    gradientString += '-#' + RGB_value.toString(16);
  }

  var bBox = this.group.getBBox();
  var centerX = bBox.cx;

  var gradient = paper.gradient('r(' + [0.5, 0.5, 12].join(',') + ')' + gradientString);
  circle.attr({fill: gradient});

  var textNode = buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: '', opacity: 1});
  this.group.append(textNode);

  var wasTriggered = false;
  var branch;

  var translationAnimation = randomTranslation(this.group);
  translationAnimation.startAnimation();


  function randomGradientAnimation() {
    return function () {
      gradient.animate(
        {r: wasTriggered ? 12 + Math.random() * 10 : 0.5 + Math.random() * 10},
        1000
      );
    };
  }

  this.group.click(function () {
    if (!wasTriggered) {


      gradient.animate(
        {r: 1},
        1000
      );


      translationAnimation.pause();

      //group.attr({filter: ''});
      wasTriggered = true;
      branch = branchButton.drawTrunkWithBranchesTo(centerX, bBox.cy + 150, 10, 4);
    } else {

      randomGradientAnimation()();

      //group.attr({filter: shadowFilter});
      wasTriggered = false;
      branch.destroyBranch();

      translationAnimation.resume();
    }
  });

};

//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var cx = 150;
var cy = 125;


var shadow = Snap.filter.shadow(0, 0, 10, '#CCC', 0.5);
var shadowFilter = paper.filter(shadow);

var graveButton = new GraveButton(cx, cy, 100, 'Hello!', Math.random() * 100);
var group = graveButton.group;


var trunkLength = 200;
var NUMBER_OF_BRANCHES = 8;
var BRANCH_LENGTH = 75;

var branchButton = new BranchGroup(group, trunkLength, NUMBER_OF_BRANCHES, BRANCH_LENGTH);

group.attr({filter: shadowFilter});


////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////


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

  animation.translateGroup = function (value) {
    var transformString = 't0,' + (Snap.sin(value) * self.scalingFactor);
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
