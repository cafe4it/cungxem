if (Meteor.isClient) {
    this.Player = function Player(id, currentPlayer) {
        var myPlayer = videojs(playerId({id: id}));
        myPlayer.ready(function () {
            var myPlayer = this;
            if (currentPlayer && !_.isEmpty(currentPlayer)) {
                myPlayer.src(currentPlayer.url);

                //(playedTime < currentPlayer.duration) ? myPlayer.currentTime(playedTime) : myPlayer.currentTime(currentPlayer.duration);
                var playedTime = moment().diff(currentPlayer.playedTime, 'seconds');
                if (playedTime < currentPlayer.duration) {
                    myPlayer.currentTime(playedTime);
                    (currentPlayer.state) ? myPlayer.pause() : myPlayer.play();
                } else {
                    myPlayer.currentTime(currentPlayer.duration);
                    myPlayer.pause();
                }

            }

            myPlayer.on('loadedmetadata', function () {
                /*var playedTime = moment().diff(currentPlayer.playedTime,'seconds');
                 if(playedTime < currentPlayer.duration){
                 myPlayer.currentTime(playedTime);
                 (currentPlayer.state) ? myPlayer.pause() : myPlayer.play();
                 }else{
                 myPlayer.currentTime(currentPlayer.duration);
                 myPlayer.pause();
                 }*/
            });

            myPlayer.on('loadstart', function () {
                //console.log('...........')
            })

            myPlayer.on('waiting', function () {
                myPlayer.poster('/images/loading.gif');
                //console.log('đang tải..')
            });

            myPlayer.on('play', function () {
                //console.log('play');Object

                PlayerControls.emit(id + ':player_control', 'played');
            });

            myPlayer.on('pause', function () {
                //console.log('paused');
                PlayerControls.emit(id + ':player_control', 'paused');
            });

            myPlayer.on('timeupdate', function () {
                PlayerControls.emit(id + ':player_timeUpdate', id, myPlayer.currentSrc(), myPlayer.currentTime(), myPlayer.paused());
            });

            var syncPlayTime = function () {
                try {


                } catch (ex) {
                    console.log(ex)
                }
            }
        });

        return myPlayer;
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

