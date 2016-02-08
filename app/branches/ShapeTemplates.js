/**
 * Created by alacasse on 12/5/15.
 */

//Pre-cache some handy trig values:
var c120 = Snap.cos(120);
var s120 = Snap.sin(120);
var c240 = Snap.cos(240);
var s240 = Snap.sin(240);


var CircleCoordinates = function (x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
};

var SvgCircle = function (circleCoordinates) {
    this.coordinates = circleCoordinates;
};

SvgCircle.prototype.build = function (svgContext) {
    var coordinates = this.coordinates;
    return svgContext.circle(coordinates.x, coordinates.y, coordinates.radius);
};

var SvgPolygon = function (points) {
    this.points = points;
};

SvgPolygon.prototype.build = function (svgContext) {
    return svgContext.polyline(this.points);
};


var SvgEquilateralTriangle = function (circleCoordinates) {
    var a = {}, b = {}, c = {
        x: 0,
        y: -circleCoordinates.radius
    };

    b.x = c.x * c120 - ( c.y * s120 );
    b.y = c.x * s120 + ( c.y * c120 );
    a.x = c.x * c240 - ( c.y * s240 );
    a.y = c.x * s240 + ( c.y * c240 );

    this.points = [a, b, c].map(function addOffsets(point) {
        point.x += circleCoordinates.x;
        point.y += circleCoordinates.y;
        return point;
    }).reduce(function flattenCoordinates(acc, point) {
        acc.push(point.x);
        acc.push(point.y);
        return acc;
    }, []);
};

SvgEquilateralTriangle.prototype = SvgPolygon.prototype;
