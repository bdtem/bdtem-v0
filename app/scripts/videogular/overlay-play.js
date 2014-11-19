/**
 * @license Videogular v0.7.0 http://videogular.com
 * Two Fucking Developers http://twofuckingdevelopers.com
 * License: MIT
 */
/**
 * @ngdoc directive
 * @name com.2fdevs.videogular.plugins.overlayplay:vgOverlayPlay
 * @restrict E
 * @description
 * Shows a big play button centered when player is paused or stopped.
 *
 * ```html
 * <videogular vg-theme="config.theme.url" vg-autoplay="config.autoPlay">
 *    <vg-video vg-src="sources"></vg-video>
 *
 *    <vg-overlay-play></vg-overlay-play>
 * </videogular>
 * ```
 *
 * BDTEM EDIT :D
 *
 */
"use strict";
angular.module("com.2fdevs.videogular.plugins.overlayplay", [])
    .directive(
    "vgOverlayPlay",
    ["VG_STATES", function (VG_STATES) {
        return {
            restrict: "E",
            require: "^videogular",
            template: "<div class='overlayPlayContainer' ng-click='customClickOverlayPlay()'>" +
                "<div class='iconButton' ng-class='overlayPlayIcon'></div>" +
                "</div>",
            link: function (scope, elem, attr, API) {
                function onComplete(target, params) {
                    scope.overlayPlayIcon = {bdtemPlay: false};
                }

                function onPlay(target, params) {
                    scope.overlayPlayIcon = {};
                }

                function onChangeState(newState) {
                    switch (newState) {
                        case VG_STATES.PLAY:
                            scope.overlayPlayIcon = {};
                            break;

                        case VG_STATES.PAUSE:
                            scope.overlayPlayIcon = {bdtemPlay: false};
                            break;

                        case VG_STATES.STOP:
                            scope.overlayPlayIcon = {};
                            break;
                    }
                }

                scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                    API.playPause();
                };

                scope.overlayPlayIcon = {};

                scope.$watch(
                    function () {
                        return API.currentState;
                    },
                    function (newVal, oldVal) {
                        if (newVal != oldVal) {
                            onChangeState(newVal);
                        }
                    }
                );
            }
        }
    }
    ]);

