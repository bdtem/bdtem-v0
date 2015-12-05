/**
 * Created by alacasse on 12/5/15.
 */

var GraveButton = function (circleCoordinates,
                            text,
                            numberOfCircles) {

  this.numberOfCircles = numberOfCircles || 3;

  //TODO Make a CSS class for the groups and use that instead of inline styling.
  this.group = paper.group().attr({cursor: 'pointer'});


  this.buildSvgCircle(circleCoordinates);


  var bBox = this.group.getBBox();
  var centerX = bBox.cx;


  var textNode = this.buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: '', opacity: 1});
  this.group.append(textNode);

  this.wasTriggered = false;

  this.translationAnimation = randomTranslation(this.group);
  this.translationAnimation.startAnimation();
};

GraveButton.prototype.buildTextNode = function (text, x, y) {
  var centerX = true;

  if (text) {
    var textNode = paper.text(OFF_SCREEN, OFF_SCREEN, text);
    var textBBox = textNode.getBBox();
    var height = textBBox.height;
    var width = textBBox.width;

    textNode.attr({
      'font-family': 'Libre Baskerville',
      x: centerX ? (x - width / 2) : x,
      y: y,
      fill: (text.length === 6 && Number('0x' + text) > 0) ? ('#' + text) : STROKE_COLOR
    });

    textNode.click(function (event) {
      event.stopPropagation();
      textNode.attr({fill: '#F0F', filter: shadowFilter});
      textNode.node.innerHTML = 'clicks'
    });
    return textNode;
  } else {
    return null;
  }
};


GraveButton.prototype.setBranchGroup = function (branchGroup) {
  branchGroup.group = this.group;

  this.branchGroup = branchGroup;

  this.group.click(this.buildClickAnimation());
};

GraveButton.prototype.buildClickAnimation = function () {
  var self = this;

  var branchGroup = self.branchGroup;

  return function () {
    if (!self.wasTriggered) {
      self.wasTriggered = true;

      self.gradient.animate(
        {r: 1},
        1000
      );

      self.translationAnimation.pause();

      branchGroup.animateIn();
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

