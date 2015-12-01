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

  this.trunk = this.buildTrunk();

  this.yDistance = (this.endY - this.startY);

  this.branches = [];
  this.buildBranchTimeOffsetsAndPoints();
  this.pendingBranchAnimations = new Array(numberOfBranches);
}


BranchGroup.prototype.buildTrunk = function () {
  var branch = new Branch(this.svgGroup, this.startX, this.startY, this.trunkLength, null, this.branchParameters.branchType);
  return branch;
};

BranchGroup.prototype.getEndY = function () {
  //TODO GET THIS FROM THE BRANCH TYPE
  return this.startY + this.trunkLength;
};

BranchGroup.prototype.getEndX = function () {
  //TODO GET THIS FROM THE BRANCH TYPE
  return this.branchParameters.branchType.getEndX(this);
};

BranchGroup.prototype.destroyBranch = function () {
  this.destroySubBranches();
  var trunkLine = this.trunk.branchLine;

  this.stopAnimation();

  trunkLine.stop();
  trunkLine.animate(
    {opacity: 0},
    500,
    this.resetBranchLine()
  );
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

BranchGroup.prototype.resetBranchLine = function () {
  var self = this;
  return function () {
    self.trunk.branchLine.attr(
      {
        'x1': self.startX,
        'x2': self.startX,
        'y1': self.startY,
        'y2': self.startY,
        'opacity': 1
      }
    );
  };
};

BranchGroup.prototype.buildBranchTimeOffsetsAndPoints = function () {
  var self = this;

  if (this.branchParameters && this.branchParameters.branches) {

    this.branches = this.branchParameters.branches;
    this.branches.forEach(function (branch) {
      self.svgGroup.append(branch);
    });

  } else {

    var numberOfBranches = this.numberOfBranches;
    if (numberOfBranches > 0) {
      for (var i = 1; i <= numberOfBranches; i++) {
        var branchPoint = this.startY + (i / numberOfBranches) * this.yDistance;
        this.addBranch(this.startX, branchPoint);
      }
    }

  }

  this.branchTimeOffsets = new Array(numberOfBranches);
  this.branches.forEach(function (elem, index) {
    self.branchTimeOffsets[index] = (index + 1) / numberOfBranches * self.animationDuration;
  })
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

  return self.trunk.updateAnimation()
};

BranchGroup.prototype.addBranch = function (startX, branchY) {
  startX = startX || this.startX;

  var branch = new Branch(
    this.svgGroup,
    branchY,
    startX,
    Math.random() >= 0.5 ? this.branchLength : -this.branchLength, //Just fo' fun.
    this.getBranchText(),
    this.branchParameters.branchType.orthogonal
  );

  this.branches.push(branch);
  this.svgGroup.append(branch.branchLine);
};


BranchGroup.prototype.getBranchText = function () {
  return randomColor();
};
