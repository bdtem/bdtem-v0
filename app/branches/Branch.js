function Branch(svgGroup,
                startX,
                startY,
                endX,
                endY,
                text,
                branchType) {

  this.svgGroup = svgGroup;
  this.startX = startX;
  this.startY = startY;
  this.endX = endX;

  if (branchType) {
    this.updateAnimation = branchType.updateAnimation;
  }

  this.length = endX - startX;

  this.branchLine = this.buildBranchLine(startX, startY, startX, startY);

  this.textNode = text && buildTextNode(text, startX, startY, false, true).attr({opacity: 0});
}

Branch.prototype.destroyBranch = function () {
  this.animateTrunk(this.branchLine.attr('x2'), this.startX, this.getRemovalAnimation());
};

Branch.prototype.animateIn = function () {
  this.textNode && this.textNode.attr({opacity: 1});
  this.animateTrunk(this.startX, this.endX);
};

Branch.prototype.buildBranchLine = function (x1, y1, x2, y2) {
  var line = this.svgGroup.line(x1, y1, x2, y2);
  line.attr({stroke: STROKE_COLOR, 'stroke-width': 2});
  return line;
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
