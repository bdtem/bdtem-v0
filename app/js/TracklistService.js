/**
 * Created by alacasse on 3/6/16.
 */

bdtem.service('tracklistService',
    [
        '$sce',
        'AlbumTracks',
        'StoryEpisodes',
        'graveTracks',
        function tracklistService($sce, AlbumTracks, StoryEpisodes, graveTracks) {

            var currentlyPlayingKey = 'ALBUM';

            var tracklists = {
                "ALBUM": AlbumTracks.map(trustAsResource),
                "STORY": StoryEpisodes.map(trustAsResource),
                "GRAVE": graveTracks['Gr. 01'].tracks.map(trustAsResource)
            };
            var currentlyPlaying = tracklists[currentlyPlayingKey];

            function trustAsResource(track) {
                track.src = $sce.trustAsResourceUrl(track.src);
                return track;
            }


            return {
                changeToTracklist: function changeToTracklist(tracklistName) {
                    if (tracklistName != currentlyPlayingKey) {
                        var newTracklist = tracklists[tracklistName];
                        if (newTracklist) {
                            currentlyPlaying = newTracklist;
                            currentlyPlayingKey = tracklistName;
                        }
                        return currentlyPlaying;
                    }
                },
                getCurrentTracklist: function getCurrentTracklist() {
                    return currentlyPlaying;
                },
                getCurrentTracklistName: function getCurrentTracklistName() {
                    return currentlyPlayingKey;
                }
            }
        }
    ]
);