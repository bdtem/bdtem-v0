'use strict';

var STROKE_COLOR = '#000';
var TRUNK_LENGTH = 150;
var BRANCH_LENGTH = 75;
var DURATION_MS = 200;

function randomColor() {
    return Math.random().toString(16).substring(2, 8);
}


bdtem.controller("GraveCtrl", function GraveCtrl($scope, playerService) {

        var cx = 400;
        var cy = 125;
        var radius = 66;

        var shadow = Snap.filter.shadow(0, 0, 10, '#CCC', 0.5);

//TODO OBVIOUSLY CHANGE THIS:
        var paper = Snap.select('#test');

        $scope.svgContext = paper;

        if (paper) {

            $scope.filter = paper.filter(shadow);




////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

            var secondButtonText = 'Gr. 2';

            var secondGraveButton = new GraveButton(
                paper,
                new SvgEquilateralTriangle(new CircleCoordinates(cx * 2, cy * 1.5, radius)),
                secondButtonText,
                5
            );

            var secondSvgGroup = secondGraveButton.group;

            var secondBranchGroup = new BranchGroup(secondSvgGroup, TRUNK_LENGTH, 2, BRANCH_LENGTH, DURATION_MS, {branchType: VERT});
            secondGraveButton.setBranchGroup(secondBranchGroup);

            secondSvgGroup.attr({filter: $scope.filter});

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////


        }

    }
);