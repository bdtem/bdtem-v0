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

  var startX = this.getStartX();
  var startY = this.getStartY();

  this.trunk = this.buildBranchLine(startX, startY, startX, startY);

  this.textNode = text && this.buildTextNode(text, startX, startY).attr({opacity: 0});
}

Branch.prototype.DEFAULT_ANIMATION_DURATION = 1000;

Branch.prototype.updateAnimation = function () {
  return this.branchType.updateAnimation.bind(this)();
};

Branch.prototype.buildTextNode = function (text, x, y) {
  var centerX, centerY = false;
  text = text || '';
  if (this.branchType.name[0] === 'H') {
    centerY = true;
  }
  centerX = !centerY;

  var textNode = paper.text(OFF_SCREEN, OFF_SCREEN, text);
  var textBBox = textNode.getBBox();
  var width = textBBox.width;
  var height = textBBox.height;

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

};


Branch.prototype.stopAnimation = function () {
  this.trunk.stop();
  var resetCallback = this.reset.bind(this);

  this.trunk.animate(
    {opacity: 0},
    500,
    resetCallback
  )
};

Branch.prototype.reset = function () {
  var startX = this.getStartX();
  var startY = this.getStartY();
  this.trunk.attr({
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
  this.animateTrunk(this.trunk.attr(animationParam), this.start, null, this.getRemovalAnimation());
};


Branch.prototype.buildPointsAndOffsets = function (numberOfPoints, animationDuration) {
  var points = [];
  var timeOffsets = [];

  var i = 0;
  var lengthProportion;
  var currentProportion;
  var timeOffset;

  if (this.branchType.span) {

    if (numberOfPoints % 2 != 0) {
      var center = {
        fixed: this.start,
        start: this.fixed
      };

      currentProportion = ((i + 1) / numberOfPoints);

      timeOffsets.push(currentProportion * animationDuration);
      points.push(center);

      --numberOfPoints;
    }

    numberOfPoints /= 2;

    for (i; i < numberOfPoints; ++i) {
      currentProportion = ((i + 1) / numberOfPoints);
      lengthProportion = currentProportion * this.length;

      timeOffset = currentProportion * animationDuration;

      var posPoint = {
          fixed: this.start + lengthProportion,
          start: this.fixed
        },
        negPoint = {
          fixed: this.start - lengthProportion,
          start: this.fixed
        };

      points.push(posPoint, negPoint);
      timeOffsets.push(timeOffset, timeOffset);
    }
  } else {
    for (i; i < numberOfPoints; ++i) {
      currentProportion = ((i + 1) / numberOfPoints);

      lengthProportion = currentProportion * this.length;
      timeOffset = currentProportion * animationDuration;

      var point = {
        fixed: this.start + lengthProportion,
        start: this.fixed
      };

      points.push(point);
      timeOffsets.push(timeOffset);
    }
  }

  return {points: points, offsets: timeOffsets};
};

Branch.prototype.animateIn = function (duration) {
  this.textNode && this.textNode.attr({opacity: 1});
  var start = this.start;
  var end = this.start + this.length;

  this.animateTrunk(start, end, duration);
};

Branch.prototype.getRemovalAnimation = function () {
  var self = this;
  return function () {
    self.reset();

    if (self.textNode && self.textNode.attr('opacity') > 0) {
      self.textNode.animate(
        {opacity: 0},
        250,
        function () {
          self.textNode.attr({opacity: 0})
        }
      );
    }
  }
};

Branch.prototype.animateTrunk = function (from, to, duration, callback) {

  duration = duration || 250;

  Snap.animate(
    from,
    to,
    this.updateAnimation(),
    duration,
    null,
    callback
  );

};
