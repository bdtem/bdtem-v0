/**
 * Created by antoine on 03/10/15.
 */
'use strict';


function randomByte() {
  return (Math.floor(Math.random() * (0xFF)));
}

function randomColor() {
  var colorString = '#';
  for (var i = 0; i < 3; i++) {
    var byteString = randomByte().toString(16);
    if (byteString.length < 2) {
      byteString = '0' + byteString;
    }
    colorString = colorString.concat(byteString);
  }

  return colorString;
}


var paper = Snap.select("#bdtem-orb");

var centerX = 250;
var centerY = 250;
var radius = 100;

var circle = paper.circle(centerX, centerY, radius);

var desiredWidth = 50;
var desiredHeight = 100;

var theta = Math.asin((1 - ((Math.pow(desiredWidth, 2) / (2 * Math.pow(radius, 2)))))) / 2;

var rstheta = radius * Math.sin(theta);
var rctheta = radius * Math.cos(theta);

var height = radius + desiredHeight;

var pointFiveRadians = Snap.rad(45);

var Point = function (x, y) {
  this.x = x;
  this.y = y;

  this.transform = function (transformationMatrix) {
    return new Point(
      transformationMatrix.x(x, y),
      transformationMatrix.y(x, y)
    );
  }

};

var Triangle = function (b1, b2, h) {
  this.b1 = b1;
  this.b2 = b2;
  this.h = h;

  this.transform = function (transformationMatrix) {
    return new Triangle(
      b1.transform(transformationMatrix),
      b2.transform(transformationMatrix),
      h.transform(transformationMatrix)
    );
  };

  this.toPath = function () {
    return [b1.x, b1.y, b2.x, b2.y, h.x, h.y];
  }

};

var basePoint1 = new Point(centerX + rctheta, centerY + rstheta);
var basePoint2 = new Point(centerX + rstheta, centerY + rctheta);
var topPoint = new Point(centerX + height * Math.cos(pointFiveRadians), centerY + height * Math.sin(pointFiveRadians));
var templateTriangle = new Triangle(basePoint1, basePoint2, topPoint);

var topRightRotator = new Snap.Matrix().rotate(-110, centerX, centerY);
var bottomLeftRotator = new Snap.Matrix().rotate(70, centerX, centerY);

var topRightTriangle = paper.polygon(templateTriangle.transform(topRightRotator).toPath());
var bottomLeftTriangle = paper.polygon(templateTriangle.transform(bottomLeftRotator).toPath());


var padLeftPixel = paper.polyline(50, 50);
padLeftPixel.attr({
  fill: '#FFF'
});
var padRightPixel = paper.polyline(1000, 400);
padRightPixel.attr({
  fill: '#FFF'
});

var group = paper.group(circle, bottomLeftTriangle, topRightTriangle, padLeftPixel, padRightPixel);


/* ====================================================================================================*/
/* === FILTERS */
/* ====================================================================================================*/

Snap.filter.turbulence = function () {
  return '<feTurbulence stitchTiles="stitch"  baseFrequency="0.05" numOctaves="2" type="fractalNoise"/>';
};


var blurFilter = Snap.filter.blur(5, 10);

var darkenFilter = Snap.filter.brightness(0);
var contrastFilter = Snap.filter.contrast(1);
var turbulenceFilter = Snap.filter.turbulence();
//var rshadowFilter = Snap.filter.shadow(10, 10, 10, '#F00', 2);
//var gshadowFilter = Snap.filter.shadow(20, 20, 2, '#0F0', 1)  ;
//var bshadowFilter = Snap.filter.shadow(30, 30, 2, '#00F', 1);

var blurAndTurbulence = paper.filter(
  turbulenceFilter,
  blurFilter
);

var comboFilter = paper.filter([
    blurFilter,
    //darkenFilter,
    //contrastFilter,
    //rshadowFilter,
    //gshadowFilter,
    //bshadowFilter
  ].join('\n')
);

var blurChild = comboFilter.node.childNodes[0];
var turbulenceChild = blurAndTurbulence.node.childNodes[0];
var brightnessChild = comboFilter.node.childNodes[2];


/* ====================================================================================================*/
/* === TRANSLATION */
/* ====================================================================================================*/

var xScalingFactor = 5;
var yScalingFactor = 5;
function randomTranslate() {
  function scaleWithDistribution(scalingFactor) {
    return ((Math.random() * scalingFactor) - (scalingFactor / 2));
  }

  group.animate(
    {
      transform: 't' + scaleWithDistribution(xScalingFactor) + ',' +
      (scaleWithDistribution(yScalingFactor))
    },
    1000,
    mina.bounce,
    function loopTranslate() {
      //group.clone();
      randomTranslate();
    }
  );
}
randomTranslate();


/* ====================================================================================================*/
/* === ANIMATIONS */
/* ====================================================================================================*/


var blurXScalingFactor = 3;
var blurYScalingFactor = 2;

function randomBlur() {
  return Math.random() + 4;
}
var blurStart = randomBlur();
var blurStop = randomBlur();

var turbulenceScalingFactor = 1 / 8;

function alterBlur(value) {
  blurChild.attributes[0].value = (value * blurXScalingFactor) + ',' + (value * blurYScalingFactor);

  turbulenceChild.attributes[1].value = Math.random() / turbulenceScalingFactor + ',' + Math.random() / turbulenceScalingFactor;

  var scaledValue = value * 1024;
  group.attr({
    //fill: '#' + Math.floor(scaledValue % 2).toString(16) + Math.floor(scaledValue % 3).toString(16) + Math.floor(scaledValue % 4).toString(16)
    fill: scaledValue.toString(16)
  });

  //cloneMask.attr({fill: randomColor()});
}


var loopBlurOut = function () {
  animateBlurOut();
};

function animateBlurIn() {

  blurStop = randomBlur();

  Snap.animate(
    blurStart,
    blurStop,
    alterBlur,
    750,
    mina.easeinout,
    loopBlurOut
  );
}

function loopBlurIn() {
  animateBlurIn();
}

function animateBlurOut() {
  blurStart = randomBlur();

  Snap.animate(
    blurStop,
    blurStart,
    alterBlur,
    750,
    mina.bounce,
    loopBlurIn
  );
}

animateBlurIn();


/* ====================================================================================================*/
/* === MASKING AND ATTRIBUTES */
/* ====================================================================================================*/
//
//var cloneMask = group.clone();
//
//
//cloneMask.attr({
//  transform: 's1.25',
//  fill: '#FFFFFF',
//  filter: blurAndTurbulence
//});

group.attr({
  //mask: cloneMask,
  fill: '#CCC',
  filter: comboFilter
});

group.mouseover(function () {

//      var childNodes = brightnessChild.childNodes;
//
//
//      for (var node in childNodes) {
//        this.attributes[1] = 1;
//      }

  blurXScalingFactor *= 1.5;
  blurYScalingFactor /= 1.1;
  group.stop();

  loopBlurOut = function () {
  };

});

group.mouseout(function () {
  blurXScalingFactor /= 1.5;
  blurYScalingFactor *= 1.1;
  turbulenceScalingFactor = (1 / 8);

  loopBlurOut = function () {
    animateBlurOut();
  };
  animateBlurIn();
  randomTranslate();
});
