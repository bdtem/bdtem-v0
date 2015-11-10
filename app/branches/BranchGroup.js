function BranchGroup(svgGroup,
                     trunkLength,
                     numberOfBranches,
                     branchLength,
                     animationDuration,
                     branchParameters) {

  this.svgGroup = svgGroup;
  this.branchParameters = branchParameters;
  this.animationDuration = animationDuration || 1000;
  this.numberOfBranches = numberOfBranches || 1;

  this.trunkLength = trunkLength || 150;
  this.branchLength = branchLength || 75;

  var bBox = svgGroup.getBBox();
  this.startY = bBox.y2;
  this.startX = bBox.cx;
  this.endX = this.getEndX();
  this.endY = this.getEndY();

  this.yDistance = (this.endY - this.startY);

  this.branches = [];
  this.buildBranchTimeOffsetsAndPoints();
  this.pendingBranchAnimations = new Array(numberOfBranches);
}

BranchGroup.prototype.getEndY = function () {
  //TODO GET THIS FROM THE BRANCH TYPE
  return this.startY + this.trunkLength;
};

BranchGroup.prototype.getEndX = function () {
  //TODO GET THIS FROM THE BRANCH TYPE
  return this.startX;
};

BranchGroup.prototype.destroySubBranches = function () {
  this.pendingBranchAnimations.forEach(clearTimeout);
  this.branches.forEach(function (elem) {
    elem.destroyBranch();
  });

  this.branches = [];
  this.pendingBranchAnimations = [];

  //Pre-rebuild branches for next run:
  this.buildBranchTimeOffsetsAndPoints();
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
    this.removeAfterAnimation()
  );
};

BranchGroup.prototype. removeAfterAnimation = function() {
  var trunk = this.trunk;
  return function () {
    trunk.remove()
  };
};

BranchGroup.prototype.buildBranchTimeOffsetsAndPoints = function () {
  var self = this;

  if (this.branchParameters) {

    this.branches = this.branchParameters.branches;
    this.branches.forEach(function (branch) {
      self.svgGroup.append(branch);
    });

  } else {

    var numberOfBranches = this.numberOfBranches;
    for (var i = 1; i <= numberOfBranches; i++) {
      var branchPoint = this.startY + (i / numberOfBranches) * this.yDistance;
      this.addBranch(this.startX, branchPoint);
    }

  }

  this.branchTimeOffsets = new Array(numberOfBranches);
  this.branches.forEach(function (elem, index) {
    self.branchTimeOffsets[index] = (index + 1) / numberOfBranches * self.animationDuration;
  })
};

BranchGroup.prototype.drawTrunkWithBranchesTo = function (x, y) {
  this.trunk = new Branch(this.svgGroup, this.startX, this.startY, x || this.startX, y || this.startY, '', BRANCH_TYPE.VERTICAL).branchLine;

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
      var branch = branchGroup.branches[index];
      branch.animateIn();
    }, timeOffset);

    branchAnimations.push(asyncAnimation)
  });

  return function updateLine(value) {
    branchGroup.trunk.attr({y2: value});
  }
};

BranchGroup.prototype.addBranch = function (startX, branchY) {
  startX = startX || this.startX;

  var branch = new Branch(
    this.svgGroup,
    startX,
    branchY,
    Math.random() >= 0.5 ? startX - this.branchLength : startX + this.branchLength,
    branchY,
    this.getBranchText(),
    BRANCH_TYPE.HORIZONTAL
  );

  this.branches.push(branch);
  this.svgGroup.append(branch.branchLine);
};


BranchGroup.prototype.getBranchText = function () {
  return randomColor();
};
