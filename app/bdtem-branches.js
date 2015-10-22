'use strict';

var STROKE_COLOR = '#FFF';

var cx = 150;
var cy = 125;
var radius = 100;

var shadow = Snap.filter.shadow(0, 0, 10, '#CCC', 0.5);

var trunkLength = 200;
var NUMBER_OF_BRANCHES = 8;
var BRANCH_LENGTH = 75;


//TODO OBVIOUSLY CHANGE THIS:
var paper = Snap.select('#test');

var shadowFilter = paper.filter(shadow);


function buildBranchLine(x1, y1, x2, y2) {
  var line = group.line(x1, y1, x2, y2);
  line.attr({stroke: STROKE_COLOR, 'stroke-width': 2});
  return line;
}

var BRANCH_TYPE = {
  HORIZONTAL: {
    value: 0,
    name: 'Horizontal',
    shortName: 'H',
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
        }

        self.branchLine.attr({x2: value});
      };
    }
  },
  HORIZONTAL_SPAN: {
    value: 1,
    name: "Horizontal Span",
    shortName: "Hs",
    updateAnimation: function () {
      var self = this;
      return function (value) {

        var txt = self.textNode;
        if (txt) {
          txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
        }

        self.branchLine.attr({x1: 2 * self.startX - value, x2: value});
      };
    }

  },
  VERTICAL: {
    value: 2,
    name: "Vertical",
    shortName: "V"
  },
  VERTICAL_SPAN: {
    value: 3,
    name: "Vertical Span",
    shortName: "Vs"
  }
};


function Branch(startX, startY, endX, endY, text, branchType) {
  this.startX = startX;
  this.startY = startY;
  this.endX = endX;

  if (branchType) {
    this.updateAnimation = branchType.updateAnimation;
  }

  this.length = endX - startX;

  this.branchLine = buildBranchLine(startX, startY, startX, startY);

  this.textNode = text && buildTextNode(text, startX, startY, false, true);

  this.animateTrunk(startX, endX);
}

Branch.prototype.destroyBranch = function () {
  this.animateTrunk(this.endX, this.startX, this.getRemovalAnimation());
};

Branch.prototype.getRemovalAnimation = function () {
  var self = this;
  return function () {
    self.branchLine.remove();
    if (self.textNode) {
      self.textNode.animate(
        {opacity: 0},
        250,
        function () {
          self.textNode.remove()
        }
      );
    }
  }

};

Branch.prototype.animateTrunk = function (from, to, callback) {
  Snap.animate(
    from,
    to,
    this.updateAnimation(),
    250,
    mina.easeout,
    callback
  );
};

Branch.prototype.updateAnimation = function () {
  var self = this;
  return function (value) {

    var txt = self.textNode;
    if (txt) {
      txt.attr({x: self.length < 0 ? value - (txt.getBBox().width + 1) : value});
    }

    self.branchLine.attr({x2: value});
  };
};

function BranchGroup(svgGroup,
                     trunkLength,
                     numberOfBranches,
                     branchLength,
                     animationDuration,
                     vertical) {
  this.animationDuration = animationDuration || 1000;
  this.numberOfBranches = numberOfBranches || 1;
  this.currentBranch = 0;

  this.trunkLength = trunkLength || 150;
  this.branchLength = branchLength || 75;

  var bBox = svgGroup.getBBox();
  this.startY = bBox.y2;
  this.startX = bBox.cx;
  this.endY = this.startY + this.trunkLength;


  this.yDistance = (this.endY - this.startY);


  this.branches = [];
  this.buildBranchTimeOffsetsAndPoints();
  this.pendingBranchAnimations = new Array(numberOfBranches);
}

BranchGroup.prototype.destroySubBranches = function () {
  this.pendingBranchAnimations.forEach(function(elem){
    clearTimeout(elem);
  });

  this.branches.forEach(function (elem) {
    elem.destroyBranch();
  });
  this.branches = [];
  this.pendingBranchAnimations = [];
};

BranchGroup.prototype.stopAnimation = function () {
  if (this.animationInProgress) {
    this.animationInProgress.stop();
  }
};

BranchGroup.prototype.destroyBranch = function () {
  this.destroySubBranches();
  var trunk = this.trunk;

  this.stopAnimation();

  trunk.stop();
  trunk.animate(
    {opacity: 0},
    500,
    removeAfterAnimation(trunk)
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

BranchGroup.prototype.buildBranchTimeOffsetsAndPoints = function () {
  this.branchTimeOffsets = new Array(this.numberOfBranches);
  this.branchPoints = new Array(this.numberOfBranches);

  for (var i = 1; i <= this.numberOfBranches; i++) {
    this.branchTimeOffsets[i - 1] = (i / this.numberOfBranches) * this.animationDuration;
    this.branchPoints[i - 1] = this.startY + (i / this.numberOfBranches) * this.yDistance

  }
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
    this.animationDuration
  );
};

BranchGroup.prototype.updateVertical = function (branchGroup) {
  var branchAnimations = this.pendingBranchAnimations;

  this.branchTimeOffsets.forEach(function (timeOffset, index) {
    var asyncAnimation = setTimeout(function () {
      branchGroup.addBranch(branchGroup.startX, branchGroup.branchPoints[index])
    }, timeOffset);

    branchAnimations.push(asyncAnimation)
  });

  return function updateLine(value) {
    branchGroup.trunk.attr({y2: value});
  }
};

BranchGroup.prototype.addBranch = function (startX, branchY) {
  startX = startX || this.startX;
  ++this.currentBranch;

  var branch = new Branch(
    startX,
    branchY,
    Math.random() >= 0.5 ? startX - this.branchLength : startX + this.branchLength,
    branchY,
    this.getBranchText(),
    BRANCH_TYPE.HORIZONTAL
  );

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
  this.numberOfCircles = numberOfCircles || 3;

  //TODO Make a CSS class for the groups and use that instead of inline styling.
  this.group = paper.group().attr({cursor: 'pointer'});


  var whiteMultiple = 0xFFFFFF / numberOfCircles;
  // Building a gradient string with form described here:
  // http://snapsvg.io/docs/#Paper.gradient
  var gradientString = '#000';

  var circle = paper.circle(x, y, radius);
  this.group.append(circle);
  for (var i = 0; i < this.numberOfCircles; i++) {
    var RGB_value = Math.ceil(((this.numberOfCircles - i)) * whiteMultiple);
    gradientString += '-#' + RGB_value.toString(16);
  }

  var bBox = this.group.getBBox();
  var centerX = bBox.cx;

  this.gradient = paper.gradient('r(' + [0.5, 0.5, 12].join(',') + ')' + gradientString);
  circle.attr({fill: this.gradient});

  var textNode = buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: '', opacity: 1});
  this.group.append(textNode);

  this.wasTriggered = false;
  this.branch = {};

  this.translationAnimation = randomTranslation(this.group);
  this.translationAnimation.startAnimation();

  this.branchGroup = new BranchGroup(this.group, trunkLength, NUMBER_OF_BRANCHES, BRANCH_LENGTH);

  var self = this;
  this.group.click(function () {
    if (!self.wasTriggered) {

      self.gradient.animate(
        {r: 1},
        1000
      );

      self.translationAnimation.pause();

      //group.attr({filter: ''});
      self.wasTriggered = true;
      self.branch = self.branchGroup.drawTrunkWithBranchesTo(centerX, bBox.cy + 150, 10, 4);
    } else {

      self.randomGradientAnimation();

      //group.attr({filter: shadowFilter});
      self.wasTriggered = false;
      self.branch.destroyBranch();

      self.translationAnimation.resume();
    }
  });

};

GraveButton.prototype.randomGradientAnimation = function () {
  this.gradient.animate(
    {r: this.wasTriggered ? 12 + Math.random() * 10 : 0.5 + Math.random() * 10},
    1000
  );
};


//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////


var graveButton = new GraveButton(cx, cy, radius, 'Horizontal!', 5 + Math.random() * 10);
var group = graveButton.group;
group.attr({filter: shadowFilter});


var verticalGraveButton = new GraveButton(cx + 2 * radius + 100, cy, radius, 'Vertical!', 5 + Math.random() * 10);


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
