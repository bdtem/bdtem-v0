function Branch(svgGroup,
                fixed,
                start,
                length,
                text,
                branchType) {

  this.svgGroup = svgGroup;

  this.fixed = fixed;
  this.start = start;
  this.length = length;

  this.branchType = branchType;

  this.updateAnimation = branchType.updateAnimation;

  var startX = this.getStartX();
  var startY = this.getStartY();

  this.branchLine = this.buildBranchLine(startX, startY, startX, startY);

  this.textNode = text && buildTextNode(text, startX, startY, false, true).attr({opacity: 0});
}


Branch.prototype.reset = function () {
  var startX = this.getStartX();
  var startY = this.getStartY();
  this.branchLine.attr({
    x1: startX,
    y1: startY,
    x2: startX,
    y2: startY,
    opacity: 1
  });
};

Branch.prototype.getStartX = function () {
  return this.branchType.getStartX(this);
};
Branch.prototype.getStartY = function () {
  return this.branchType.getStartY(this);
};
Branch.prototype.getEndX = function () {
  return this.branchType.getEndX(this);
};
Branch.prototype.getEndY = function () {
  return this.branchType.getEndY(this);
};

Branch.prototype.buildBranchLine = function (x1, y1, x2, y2) {
  var line = this.svgGroup.line(x1, y1, x2, y2);
  line.attr({stroke: STROKE_COLOR, 'stroke-width': 2});
  return line;
};

Branch.prototype.destroyBranch = function () {
  var animationParam = this.branchType.animationParam;
  this.animateTrunk(this.branchLine.attr(animationParam), this.start, this.getRemovalAnimation());
};

Branch.prototype.animateIn = function () {
  this.textNode && this.textNode.attr({opacity: 1});
  var start = this.start;
  var end = this.start + this.length;

  this.animateTrunk(start, end);
};

Branch.prototype.getRemovalAnimation = function () {
  var self = this;
  return function () {
    self.branchLine.remove();

    if (self.textNode && self.textNode.attr('opacity') > 0) {
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

  var duration = 250;
  Snap.animate(
    from,
    to,
    this.updateAnimation(),
    duration,
    null,
    callback
  );

};
