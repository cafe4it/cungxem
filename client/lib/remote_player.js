if (Meteor.isClient) {

    this.RemotePlayer = function RemotePlayer(id, serverPlayer) {
        var player = videojs(playerId({id: id}));

        var syncPlayer = function(){

            if (serverPlayer) {
                player.src(serverPlayer.url);
                player.currentTime(serverPlayer.currentTime);
                (serverPlayer.state) ? player.pause() : player.play();
            }else{
                var adminCurrentTime = playerTimeUpdate.findOne({channelId: id});
                if (adminCurrentTime) {
                    player.currentTime(adminCurrentTime.currentTime);
                    if (adminCurrentTime.state) {
                        player.pause();
                    } else {
                        player.play();
                    }
                } else {
                    //Session.setDefault('playerServerTimer',0);

                    player.currentTime(0);
                    player.pause();
                }
            }
        };
        player.on('ready', function () {
            $('.vjs-play-control').remove();
            syncPlayer();
        });

        player.on('play',function(e){
            var playerServer = Session.get('playerServer');
            if(playerServer.timer != player.currentTime()){
                player.currentTime(playerServer.timer);
            }
        })

        player.on('pause',function(e){
            var playerServer = Session.get('playerServer');
            if(playerServer.timer != player.currentTime()){
                player.currentTime(playerServer.timer);
            }
        });

        player.on('wait', function (e) {
            player.poster('/images/loading.gif')
        })

        PlayerControls.on(id + ':player_control', function (state) {
            if(Session.get('playerServer')){
                player.src(Session.get('playerServer').source);
                player.currentTime(Session.get('playerServer').timer);
            }
            switch (state) {
                case 'played' :
                    player.play();
                    break;
                case 'paused' :
                    player.pause();
                    break;
            }
        });

        PlayerControls.on(id + ':player_timeUpdate', function (channelId, source, timer, state) {
            var playerServer = {
                channelId : channelId,
                source : source,
                timer : timer,
                state : state
            };

            Session.set('playerServer',playerServer);

            playerTimeUpdate.upsert({channelId: channelId}, {
                channelId: channelId,
                currentSrc: source,
                currentTime: timer,
                paused: state
            });
        });
        return player;
    }
}