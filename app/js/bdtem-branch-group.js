/**
 * Created by alacasse on 1/17/16.
 */

angular.module('bdtemBranches', [])
    .directive('bdtemGraveButton', function () {
        return {
            link: function (scope, element, attr, GraveCtrl, graveTracks) {

                var svgContext = scope.svgContext;

                var nodes = graveTracks[attr.catalog];

                var circleCoordinates = new CircleCoordinates(cx, cy, radius);
                var svgCircle = new SvgCircle(circleCoordinates);

                var buttonText = 'Gr. 1';
                var graveButton = new GraveButton(svgContext, svgCircle, buttonText, 5);
                var svgGroup = graveButton.group;


                var bBox = svgGroup.getBBox();

                var VERT = BRANCH_TYPE.VERTICAL;
                var HSPAN = BRANCH_TYPE.HORIZONTAL_SPAN;

                var preTrunk = new Branch(svgGroup, bBox.cx, bBox.y2, BRANCH_LENGTH, null, VERT);
                var heightOffset = bBox.y2 + BRANCH_LENGTH;
                var realTrunk = new Branch(svgGroup, heightOffset, bBox.cx, TRUNK_LENGTH, null, HSPAN);


                var leftSubBranch = new Branch(svgGroup,
                    realTrunk.start - TRUNK_LENGTH,
                    heightOffset,
                    BRANCH_LENGTH,
                    null,
                    VERT);
                var leftCrossTrunk = new Branch(svgGroup,
                    heightOffset + leftSubBranch.length,
                    leftSubBranch.getStartX(),
                    BRANCH_LENGTH,
                    null,
                    HSPAN);
                var leftCross = new BranchGroup(svgGroup,
                    BRANCH_LENGTH,
                    3,
                    BRANCH_LENGTH,
                    250,
                    {trunk: leftCrossTrunk});

                var rightSubBranch = new Branch(svgGroup,
                    realTrunk.start + TRUNK_LENGTH,
                    heightOffset,
                    BRANCH_LENGTH + 50,
                    null,
                    VERT);
                var rightCrossTrunk = new Branch(svgGroup,
                    heightOffset + rightSubBranch.length,
                    rightSubBranch.getStartX(),
                    BRANCH_LENGTH,
                    null,
                    HSPAN);
                var rightCross = new BranchGroup(svgGroup,
                    BRANCH_LENGTH,
                    2,
                    BRANCH_LENGTH - Math.random() * 10,
                    250,
                    {trunk: rightCrossTrunk});


                var crazyTrunk = new AdHocBranchGroup([preTrunk, realTrunk]);

                var branchParameters = {
                    trunk: crazyTrunk,
                    branches: [
                        new AdHocBranchGroup([leftSubBranch, leftCross]),
                        new AdHocBranchGroup([rightSubBranch, rightCross])
                    ]
                };

                var branchGroup = new BranchGroup(svgGroup,
                    TRUNK_LENGTH,
                    5,
                    BRANCH_LENGTH,
                    DURATION_MS,
                    branchParameters);


                graveButton.setBranchGroup(branchGroup);

                svgGroup.attr({filter: $scope.filter});

            },
            restrict: 'E',
            transclude: true
        }

    })
    .directive('bdtem-branchGroup', function () {
        return {
            require: '^bdtem-graveButton',
            restrict: 'E',
            transclude: true
        }

    })
    .directive('bdtem-branch', function () {
        return {
            require: '^bdtem-branchGroup',
            restrict: 'E',
            transclude: true,
            scope: {
                fixed: '=fixed',
                start: '=fixed',
                length: '=fixed',
                text: '=text',
                branchType: '=type'
            }
        }
    });