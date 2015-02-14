if (Meteor.isClient) {
    this.Player = function Player(id, currentPlayer) {
        try {
            var myPlayer = videojs(playerId({id: id}));

            myPlayer.ready(function () {
                if (currentPlayer && !_.isEmpty(currentPlayer)) {
                    myPlayer.src(currentPlayer.url);
                    if (currentPlayer.currentTime > 0) myPlayer.currentTime(currentPlayer.currentTime);
                    (currentPlayer.state) ? myPlayer.pause() : myPlayer.play();
                }
            });

            myPlayer.on('loadedmetadata', function () {
                //console.log('dang tai/.//')
            });

            myPlayer.on('loadstart', function () {
                //console.log('...........')
            })

            myPlayer.on('waiting', function () {
                myPlayer.poster('/images/loading.gif');
                //console.log('đang tải..')
            });

            myPlayer.on('play', function () {
                //console.log('play');

                PlayerControls.emit(id + ':player_control', 'played');
            });

            myPlayer.on('pause', function () {
                //console.log('paused');
                PlayerControls.emit(id + ':player_control', 'paused');
            });

            myPlayer.on('timeupdate', function () {
                PlayerControls.emit(id + ':player_timeUpdate', id, myPlayer.currentSrc(), myPlayer.currentTime(), myPlayer.paused());
            });

            return myPlayer;
        } catch (ex) {
            console.log(ex)
        }

    }
}
var updateStateOfPlayer = function (state, currentTime) {
    try {
        var channel = Channels.findOne(id);
        if (channel && !_.isEmpty(channel.player)) {
            var player = channel.player;
            _.extend(player, {currentTime: currentTime, state: state});
            var item = {
                channelId: channel._id,
                modBy: channel.modBy,
                video: player
            }
            Meteor.call('updateCurrentPlayOnChannel', item, function (err, rs) {

            })
        }
    } catch (ex) {
        console.log(ex)
    }
}

