/**
 * Created by alacasse on 3/6/16.
 */

bdtem.controller('EmailChainCtrl', function EmailChainCtrl() {
    var controller = this;

    controller.svgContext = Snap(800, 800).attr({display: 'block', margin: '0 auto', preserveAspectRatio: 'none'});
    var cx = 450;
    var cy = 300;
    var r = 250;
    var circle = controller.svgContext.circle(cx, cy, r).attr({fill: '#000'});

    var text = controller.svgContext.text({
        text: [
            "I denigrate myself and blame myself,",
            "And what I presume you shall presume",
            "For every neuron belonging to me as good belongs to you"]
    }).attr({fill: '#FFF', fontSize: "12px", display: 'none'});
    text.selectAll("tspan").forEach(function (tspan, i) {
        tspan.attr({x: (cx - (r / 1.25)), y: (cy - 40) + ((20) * (i + 1))});
    });

    circle.mouseover(function () {
        text.attr({display: 'block'});
    });
    circle.mouseout(function () {
        text.attr({display: 'none'});
    });


    var tinyR = r / 10;
    var tinyCircle = null;

    function updateRotation(value) {
        tinyCircle.transform('r' + value + ' ' + cx + ' ' + cy);
    }

    function loop() {
        tinyCircle.transform('r0' + ' ' + cx + ' ' + cy);
        animate();
    }

    function animate() {
        Snap.animate(
            0,
            360,
            updateRotation,
            1000,
            null,
            loop
        );
    }


    circle.click(function () {
        if (!tinyCircle) {
            tinyCircle = controller.svgContext.circle(cx, (cy - r) + tinyR, tinyR).attr({fill: '#FFF'});
        }

        animate();
    });


});

bdtem.directive('bdtemEmailChainDot', function () {
    return {
        restrict: 'EA',
        controller: 'EmailChainCtrl',
        controllerAs: 'ctrl',
        link: function (scope, element, attrs, ctrl) {

            $(element).replaceWith(ctrl.svgContext.node);

        }
    };
});