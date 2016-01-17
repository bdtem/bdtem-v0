/**
 * Created by alacasse on 12/5/15.
 */

var STROKE_COLOR = '#F0F';


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

  var randomPhase = Math.random() * 360;

  animation.translateGroup = function (value) {
    var transformString = 't0,' + (Snap.sin(value + randomPhase) * self.scalingFactor);
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


var GraveButton = function (svgContext,
                            shapeTemplate,
                            text,
                            gradientSteps) {

  this.svgContext = svgContext;

  this.gradientSteps = gradientSteps || 3;

  //TODO Make a CSS class for the groups and use that instead of inline styling.
  this.group = svgContext.group().attr({cursor: 'pointer'});

  this.buildGradient();
  this.buildSvgShape(shapeTemplate);


  var bBox = this.group.getBBox();
  var centerX = bBox.cx;


  var textNode = this.buildTextNode(text, centerX, bBox.y2 + 20, true, false);
  textNode.attr({filter: '', opacity: 1});
  this.group.append(textNode);

  this.wasTriggered = false;

  this.translationAnimation = randomTranslation(this.group, Math.random() * 10 - Math.random());
  this.translationAnimation.startAnimation();
};

GraveButton.prototype.buildTextNode = function (text, x, y) {
  var centerX = true;

  if (text) {
    var textNode = this.svgContext.text(OFF_SCREEN, OFF_SCREEN, text);
    var textBBox = textNode.getBBox();
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

      self.randomGradientAnimation();

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

var SCALING_FACTOR = 2;

GraveButton.prototype.randomGradientAnimation = function () {
  this.gradient.animate(
    {r: this.wasTriggered ? 10 + Math.random() * SCALING_FACTOR : 8 + Math.random() * SCALING_FACTOR},
    500
  );
};

GraveButton.prototype.buildSvgShape = function (shapeTemplate) {
  var svgShape = shapeTemplate.build(this.svgContext);

  this.group.append(svgShape);
  svgShape.attr({fill: this.gradient});
};

GraveButton.prototype.buildGradient = function () {
  var whiteMultiple = 0xFFFFFF / this.gradientSteps;
  // Building a gradient string with form described here:
  // http://snapsvg.io/docs/#Paper.gradient
  var gradientString = '#000';

  for (var i = 0; i < this.gradientSteps; i++) {
    var RGB_value = Math.ceil(((this.gradientSteps - i)) * whiteMultiple);
    gradientString += '-#' + RGB_value.toString(16);
  }

  this.gradient = this.svgContext.gradient('r(' + [0.5, 0.5, 12].join(',') + ')' + gradientString);
};



