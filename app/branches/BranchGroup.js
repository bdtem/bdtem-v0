function BranchGroup(svgGroup,
                     trunkLength,
                     numberOfBranches,
                     branchLength,
                     animationDuration,
                     branchParameters) {

  this.svgGroup = svgGroup;
  this.branchParameters = branchParameters || {};
  this.animationDuration = animationDuration || 1000;
  this.numberOfBranches = this.branchParameters.branches ? this.branchParameters.branches.length : (numberOfBranches || 1);

  this.trunkLength = trunkLength || 150;
  this.branchLength = branchLength || 75;

  this.determineStart();

  this.trunk = this.branchParameters.trunk || this.buildTrunk();


  this.branches = [];
  this.pendingBranchAnimations = [];

  this.buildPointsAndOffsets();
}

BranchGroup.prototype.determineStart = function () {

  var bBox = this.svgGroup.getBBox();
  this.startY = bBox.y2;
  this.startX = bBox.cx;

};


BranchGroup.prototype.buildTrunk = function () {
  return new Branch(this.svgGroup, this.startX, this.startY, this.trunkLength, null, this.branchParameters.branchType);
};

BranchGroup.prototype.destroyBranch = function () {
  this.stopAnimation();
  this.destroySubBranches();
};

BranchGroup.prototype.destroySubBranches = function () {
  this.pendingBranchAnimations.forEach(clearTimeout);
  this.branches.forEach(function (elem) {
    elem.destroyBranch();
  });

  this.pendingBranchAnimations = [];
};

BranchGroup.prototype.stopAnimation = function () {
  this.trunk.stopAnimation();
  if (this.animationInProgress) {
    this.animationInProgress.stop();
  }
};

BranchGroup.prototype.buildPointsAndOffsets = function () {
  var self = this;
  var numberOfBranches = this.numberOfBranches;

  var pointsAndOffsets = this.trunk.buildPointsAndOffsets(numberOfBranches, this.animationDuration);

  if (this.branchParameters && this.branchParameters.branches) {

    this.branches = this.branchParameters.branches;

  } else {

    pointsAndOffsets.points.forEach(function (elem) {
      self.addBranch(elem.start, elem.fixed);
    });

  }

  this.branches.forEach(function (branch) {
    self.svgGroup.append(branch.trunk);
  });

  this.branchTimeOffsets = pointsAndOffsets.offsets;

  return pointsAndOffsets;
};


BranchGroup.prototype.animateIn = function () {
  var branchAnimations = this.pendingBranchAnimations;
  var self = this;

  this.branchTimeOffsets.forEach(function (timeOffset, index) {
    var asyncAnimation = setTimeout(function () {
      var branch = self.branches[index];
      branch.animateIn(self.animationDuration * 5);
    }, timeOffset);

    branchAnimations.push(asyncAnimation)
  });

  this.animationInProgress = self.trunk.animateIn(this.animationDuration);
};

BranchGroup.prototype.addBranch = function (start, fixed) {
  start = start || this.startX;

  var branch = new Branch(
    this.svgGroup,
    fixed,
    start,
    this.branchLength,
    this.getBranchText(),
    this.trunk.branchType.orthogonal
  );

  this.branches.push(branch);
};


BranchGroup.prototype.getBranchText = function () {
  return randomColor();
};
