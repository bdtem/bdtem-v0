'use strict';

var STROKE_COLOR = '#FFF';

var cx = 250;
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



//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

var circleCoordinates = new CircleCoordinates(cx, cy, radius);

var buttonText = 'Gr. 1';
var graveButton = new GraveButton(circleCoordinates, buttonText, 5);


var svgGroup = graveButton.group;
var bBox = svgGroup.getBBox();

var VERT = BRANCH_TYPE.VERTICAL;
var HSPAN = BRANCH_TYPE.HORIZONTAL_SPAN;

var preTrunk = new Branch(svgGroup, bBox.cx, bBox.y2, BRANCH_LENGTH, null, VERT);
var heightOffset = bBox.y2 + BRANCH_LENGTH;
var realTrunk = new Branch(svgGroup, heightOffset, bBox.cx, TRUNK_LENGTH, null, HSPAN);


var leftSubBranch = new Branch(svgGroup, realTrunk.start - TRUNK_LENGTH, heightOffset, BRANCH_LENGTH, null, VERT);
var leftCrossTrunk = new Branch(svgGroup, heightOffset + leftSubBranch.length, leftSubBranch.getStartX(), BRANCH_LENGTH, null, HSPAN);
var leftCross = new BranchGroup(svgGroup, BRANCH_LENGTH, 3, BRANCH_LENGTH, 250, {trunk: leftCrossTrunk});

var rightSubBranch = new Branch(svgGroup, realTrunk.start + TRUNK_LENGTH, heightOffset, BRANCH_LENGTH + 50, null, VERT);
var rightCross = new Branch(svgGroup, heightOffset + rightSubBranch.length, rightSubBranch.getStartX(), BRANCH_LENGTH, null, HSPAN);


var crazyTrunk = new AdHocBranchGroup([preTrunk, realTrunk]);

var branchParameters = {
  trunk: crazyTrunk,
  branches: [
    new AdHocBranchGroup([leftSubBranch, leftCross]),
    new AdHocBranchGroup([rightSubBranch, rightCross])
  ]
};

var branchGroup = new BranchGroup(svgGroup, TRUNK_LENGTH, 5, BRANCH_LENGTH, DURATION_MS, branchParameters);


graveButton.setBranchGroup(branchGroup);

var group = svgGroup;
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
