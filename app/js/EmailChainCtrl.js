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
        var existing = Snap.select('#mission2');
        if (existing) {
            existing.clear();
            return existing;
        } else {
            //return Snap('100%', '100%').attr({
            //    viewBox: '0 0 600 600',
            //    id: 'mission',
            //    display: 'block',
            //    margin: '0 auto',
            //    preserveAspectRatio: 'none'
            //});
            return {};
        }
    }


    //These should be in the directive!
    var cx = 300;
    var cy = 300;
    var r = 250;
    var tinyR = r / 10 - 5;

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

    controller.animationClickHandler = animationClickHandler;
    controller.showText = showText;
    controller.hidetext = hideText;
    return controller;
});

bdtem.directive('bdtemEmailChainDot', function () {
    return {
        restrict: 'EA',
        controller: 'EmailChainCtrl',
        controllerAs: 'ctrl',
        templateUrl: 'templates/mission.html',
        replace: true
    };
});