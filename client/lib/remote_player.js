if (Meteor.isClient) {

    this.RemotePlayer = function RemotePlayer(id) {
        var player = videojs(playerId({id: id}));

        var syncPlayer = function(){
            var adminCurrentTime = playerTimeUpdate.findOne({channelId: id});
            if (adminCurrentTime) {
                player.currentTime(adminCurrentTime.currentTime);
                if(adminCurrentTime.state){
                    player.pause();
                }else{
                    player.play();
                }
            }else{
                //Session.setDefault('playerServerTimer',0);

                player.currentTime(0);
                player.pause();
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
        })

        PlayerControls.on(id + ':player_control', function (state) {
            if(Session.get('playerServer')){
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
    }
}