'use strict';

var STROKE_COLOR = '#FFF';

var cx = 150;
var cy = 125;
var radius = 100;

var shadow = Snap.filter.shadow(0, 0, 10, '#CCC', 0.5);

var NUMBER_OF_BRANCHES = 8;
var TRUNK_LENGTH = 150;
var BRANCH_LENGTH = 75;
var DURATION_MS = 750;

//TODO OBVIOUSLY CHANGE THIS:
var paper = Snap.select('#test');

var shadowFilter = paper.filter(shadow);

function randomColor() {
  return Math.random().toString(16).substring(2, 8);
}

var GraveButton = function (circleCoordinates,
                            text,
                            numberOfCircles) {

  this.numberOfCircles = numberOfCircles || 3;

  //TODO Make a CSS class for the groups and use that instead of inline styling.
  this.group = paper.group().attr({cursor: 'pointer'});


  this.buildSvgCircle(circleCoordinates);


  var bBox = this.group.getBBox();
  var centerX = bBox.cx;


  var textNode = buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: '', opacity: 1});
  this.group.append(textNode);

  this.wasTriggered = false;

  this.translationAnimation = randomTranslation(this.group);
  this.translationAnimation.startAnimation();
};

GraveButton.prototype.setBranchGroup = function (branchGroup) {
  branchGroup.group = this.group;

  this.branchGroup = branchGroup;

  this.group.click(this.buildClickAnimation());
};

GraveButton.prototype.buildClickAnimation = function () {
  var self = this;
  var bBox = self.group.getBBox();
  var branchGroup = self.branchGroup;

  return function () {
    if (!self.wasTriggered) {
      self.wasTriggered = true;

      self.gradient.animate(
        {r: 1},
        1000
      );

      self.translationAnimation.pause();

      branchGroup.animateTrunk();
    } else {
      self.wasTriggered = false;

      self.randomGradientAnimation();

      branchGroup.destroyBranch();

      self.translationAnimation.resume();
    }
  }
};

GraveButton.prototype.randomGradientAnimation = function () {
  this.gradient.animate(
    {r: this.wasTriggered ? 12 + Math.random() * 10 : 0.5 + Math.random() * 10},
    1000
  );
};

GraveButton.prototype.buildSvgCircle = function (circleCoordinates) {
  var whiteMultiple = 0xFFFFFF / this.numberOfCircles;
  // Building a gradient string with form described here:
  // http://snapsvg.io/docs/#Paper.gradient
  var gradientString = '#000';

  var circle = paper.circle(circleCoordinates.x, circleCoordinates.y, circleCoordinates.radius);
  this.group.append(circle);
  for (var i = 0; i < this.numberOfCircles; i++) {
    var RGB_value = Math.ceil(((this.numberOfCircles - i)) * whiteMultiple);
    gradientString += '-#' + RGB_value.toString(16);
  }

  this.gradient = paper.gradient('r(' + [0.5, 0.5, 12].join(',') + ')' + gradientString);
  circle.attr({fill: this.gradient});

};

var CircleCoordinates = function (x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
};


//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var circleCoordinates = new CircleCoordinates(cx, cy, radius);

var graveButton = new GraveButton(circleCoordinates, 'Helo/Ehlo', 5);

var branchGroup = new BranchGroup(graveButton.group, TRUNK_LENGTH, 5, BRANCH_LENGTH, DURATION_MS, {branchType: BRANCH_TYPE.HORIZONTAL});

var verticalBranchGroup = Object.create(branchGroup);


graveButton.setBranchGroup(branchGroup);

var group = graveButton.group;
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
