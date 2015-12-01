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

  this.trunk = this.branchParameters.trunk || this.buildTrunk();


  this.branches = [];
  this.buildBranchTimeOffsetsAndPoints();
  this.pendingBranchAnimations = new Array(numberOfBranches);
}


BranchGroup.prototype.buildTrunk = function () {
  return new Branch(this.svgGroup, this.startX, this.startY, this.trunkLength, null, this.branchParameters.branchType);
};

BranchGroup.prototype.destroyBranch = function () {
  this.destroySubBranches();

  this.stopAnimation();

  this.trunk.stopAnimation();
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

BranchGroup.prototype.buildBranchTimeOffsetsAndPoints = function () {
  var self = this;
  var numberOfBranches = this.numberOfBranches;

  var pointsAndOffsets = this.trunk.buildPointsAndOffsets(numberOfBranches, this.animationDuration);

  if (this.branchParameters && this.branchParameters.branches) {

    this.branches = this.branchParameters.branches;
    this.branches.forEach(function (branch) {
      self.svgGroup.append(branch);
    });
  } else {

    pointsAndOffsets.points.forEach(function (elem) {
      self.addBranch(elem.start, elem.fixed);
    });
  }

  this.branchTimeOffsets = pointsAndOffsets.offsets;
};


BranchGroup.prototype.animateTrunk = function (from, to, callback) {
  this.animationInProgress = Snap.animate(
    from || this.trunk.start,
    to || this.trunk.start + this.trunk.length,
    this.updateAnimation(),
    this.animationDuration,
    null,
    callback
  );
};

BranchGroup.prototype.updateAnimation = function () {
  var branchAnimations = this.pendingBranchAnimations;
  var self = this;

  this.branchTimeOffsets.forEach(function (timeOffset, index) {
    var asyncAnimation = setTimeout(function () {
      var branch = self.branches[index];
      branch.animateIn();
    }, timeOffset);

    branchAnimations.push(asyncAnimation)
  });

  return self.trunk.updateAnimation();
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
  this.svgGroup.append(branch.branchLine);
};


BranchGroup.prototype.getBranchText = function () {
  return randomColor();
};
