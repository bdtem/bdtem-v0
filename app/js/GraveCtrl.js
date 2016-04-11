/**
 * Created by alacasse on 3/17/16.
 */
bdtem.controller('GraveCtrl', ['$attrs', function () {
    var self = this;

    // Simple sine wave oscillator
    function sineWithFrequency(frequency) {
        frequency = frequency || 440;
        return flock.synth({
            synthDef: {
                ugen: "flock.ugen.sinOsc",
                freq: frequency,
                mul: 0.25,
                start: 1,
                end: 50,
                duration: 100
            },
            time: 0.2
        });
    }

    function sawWithFrequency(frequency) {
        frequency = frequency || 440;
        return flock.synth({
            synthDef: {
                ugen: "flock.ugen.saw",
                freq: frequency,
                mul: 0.25,
                start: 1,
                end: 100,
                duration: 200
            },
            time: 0.4
        });
    }

    function squareWithFrequency(frequency) {
        frequency = frequency || 440;
        return flock.synth({
            synthDef: {
                ugen: "flock.ugen.square",
                freq: frequency,
                mul: 0.25,
                start: 1,
                end: 150,
                duration: 300
            },
            time: 0.6
        });
    }

    var baseSynth = sineWithFrequency(440);
    var thirdSynth;
    var fifthSynth;

    this.wasTriggered = false;
    this.clickHandler = function () {
        if (!this.wasTriggered) {
            this.wasTriggered = true;

            randomGradientAnimation();

            this.translationAnimation.pause();

            flock.enviro.shared.play();


            this.branchGroup.animateIn();

        } else {

            flock.enviro.shared.reset();
            var baseFreq = Math.random() * 5000;
            var third = (5/4) * baseFreq;
            var fifth = (6/4) * baseFreq;

            baseSynth = sineWithFrequency(baseFreq);
            thirdSynth = sawWithFrequency(third);
            fifthSynth = squareWithFrequency(fifth);

            this.wasTriggered = false;

            randomGradientAnimation();

            this.branchGroup.destroyBranch();

            this.translationAnimation.resume();
        }
    }.bind(this);

    this.svgContext = findSvgContext();

    function findSvgContext() {
        var existing = Snap.select('#graveButtons');
        return existing ? existing : Snap(600, 800).attr({id: 'graveButtons', display: 'block', margin: '0 auto', preserveAspectRatio: 'none'})
    }


    this.svgGroup = this.svgContext.group()
        .attr({cursor: 'pointer'})
        .click(this.clickHandler);

    this.svgGradient = null;
    this.branchGroup = null;
    this.translationAnimation = randomTranslation(this.svgGroup);
    this.translationAnimation.startAnimation();


    function randomGradientAnimation() {
        self.svgGradient.animate(
            {
                r: self.wasTriggered ?
                10 + Math.random() * SCALING_FACTOR :
                5 + Math.random() * SCALING_FACTOR
            },
            500
        );
    }

    function randomTranslation(group) {
        var animation = {
            scalingFactor: 5,
            animation: null
        };
        var self = animation;

        animation.startAnimation = function () {
            self.animation = Snap.animate(
                0,
                360,
                self.translateGroup,
                4000,
                null,
                self.loopAnimation
            )
        };

        var randomPhase = Math.random() * 360;

        animation.translateGroup = function (value) {
            var transformString = 't' + Snap.cos(value + randomPhase) * self.scalingFactor + ',' + (Snap.sin(value + randomPhase) * self.scalingFactor);
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
}]);
