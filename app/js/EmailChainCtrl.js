/**
 * Created by alacasse on 3/6/16.
 */

var PHI = 1.61803398875;

bdtem.controller('EmailChainCtrl', function EmailChainCtrl() {
    var controller = this;
    controller.animation = null;
    controller.tinyCircle = null;

    controller.svgContext = findSvgContext();

    function findSvgContext() {
        var existing = Snap.select('#mission');
        return existing ? existing :  Snap('100%', '100%').attr({viewBox: '0 0 550 550', id: 'mission', display: 'block', margin: '0 auto', preserveAspectRatio: 'none'});
    }

    var cx = 250;
    var cy = 250;
    var r = 250;
    var tinyR = r / 10 - 5;

    var group = controller.svgContext.group();

    group.circle(cx, cy, r).attr({fill: '#000'});
    var text = group.text({
        text: [
            "I denigrate myself and blame myself,",
            "And what I presume you shall presume",
            "For every neuron belonging to me as good belongs to you"]
    }).attr({fill: '#FFF', fontSize: "12px", display: 'none', class: 'noselect'});
    text.selectAll("tspan").forEach(function (tspan, i) {
        tspan.attr({x: (cx - (r / PHI)), y: (cy - 40) + ((20) * (i + 1))});
    });

    group.mouseover(showText);
    group.mouseout(hideText);
    group.click(animationClickHandler);


    function showText() {
        text.attr({display: 'block'});
    }

    function hideText() {
        text.attr({display: 'none'});
    }


    function updateRotation(value) {
        controller.tinyCircle.transform('r' + value + ' ' + cx + ' ' + cy);
    }

    function loop() {
        controller.tinyCircle.transform('r0' + ' ' + cx + ' ' + cy);
        animate();
    }

    function animationClickHandler() {
        if (!controller.tinyCircle) {
            controller.tinyCircle = controller.svgContext.circle(cx,
                (cy - r) + (tinyR + 5),
                tinyR).attr({fill: '#FFF'});
            animate();
            return;
        }

        var animation = controller.animation;
        if (animation) {
            console.log(animation.paused);
            if (animation.paused) {
                //Hacky Workaround for https://github.com/adobe-webplatform/Snap.svg/issues/139
                controller.tinyCircle.animate({dummy: 0}, 1);

                animation.resume();
                animation.paused = false;
            } else {
                animation.pause();
                animation.paused = true;
            }
        }

    }

    function animate() {
        controller.animation = Snap.animate(
            0,
            360,
            updateRotation,
            1000,
            null,
            loop
        );
        controller.animation.paused = false;
    }


});

bdtem.directive('bdtemEmailChainDot', function () {
    return {
        restrict: 'EA',
        controller: 'EmailChainCtrl',
        controllerAs: 'ctrl',
        link: function (scope, element, attrs, ctrl) {
            element.replaceWith(ctrl.svgContext.node);
        }
    };
});