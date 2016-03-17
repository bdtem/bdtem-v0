/**
 * Created by alacasse on 11/30/15.
 */

function AdHocBranchGroup(branches) {
  this.branches = branches;
  this.setMasterBranch(branches[0]);
}

AdHocBranchGroup.prototype.setMasterBranch = function (branch) {
  this.master = branch;
  this.branchType = branch.branchType;
};

AdHocBranchGroup.prototype.stopAnimation = function () {
  this.branches.forEach(function (e) {
    e.stopAnimation()
  });
};

AdHocBranchGroup.prototype.reset = function () {
  this.branches.forEach(function (e) {
    e.reset()
  });
};

AdHocBranchGroup.prototype.getStartX = function () {
  return this.master.branchType.getStartX(this);
};
AdHocBranchGroup.prototype.getStartY = function () {
  return this.master.branchType.getStartY(this);
};
AdHocBranchGroup.prototype.getEndX = function () {
  return this.master.branchType.getEndX(this);
};
AdHocBranchGroup.prototype.getEndY = function () {
  return this.master.branchType.getEndY(this);
};

AdHocBranchGroup.prototype.destroyBranch = function () {
  this.branches.forEach(function (e) {
    e.destroyBranch()
  });
};


AdHocBranchGroup.prototype.buildPointsAndOffsets = function (numberOfPoints, animationDuration) {
  return this.master.buildPointsAndOffsets(numberOfPoints, animationDuration || this.DEFAULT_ANIMATION_DURATION);
};

AdHocBranchGroup.prototype.DEFAULT_ANIMATION_DURATION = Branch.prototype.DEFAULT_ANIMATION_DURATION;

AdHocBranchGroup.prototype.animateIn = function (duration) {
  var durationFraction = (duration || this.DEFAULT_ANIMATION_DURATION) / PHI;

  this.branches.forEach(function (elem, index) {
    setTimeout(function () {
        elem.animateIn(durationFraction);
      },
      index * durationFraction
    );
  });

};
