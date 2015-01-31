if (Meteor.isClient) {
    this.Player = function Player(id) {
        var myPlayer = videojs(playerId({id: id}));

        myPlayer.ready(function () {

        });

        myPlayer.on('loadedmetadata',function(){
            console.log('dang tai/.//')
        });

        myPlayer.on('loadstart',function(){
            console.log('...........')
        })

        myPlayer.on('waiting',function(){
            console.log('đang tải..')
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
    }
}

