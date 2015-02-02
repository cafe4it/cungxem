ChannelsPublicController = RouteController.extend({});

ChannelsByMeController = RouteController.extend({
    template: 'listChannelsByMe',
    waitOn: function () {
        return Meteor.subscribe('channelsByMe', Meteor.userId());
    },
    onAfterAction: function () {
        Session.set('title', titlePage({title: 'Danh sách kênh của tôi'}));
    },
    channels: function () {
        return Channels.find();
    },
    data: function () {
        return {
            channels: this.channels()
        }
    },
    fastRender: true
});

ChannelAllowGuestController = RouteController.extend({
    template: 'allowGuest',
    onAfterAction: function () {

    },
    action : function(){
        console.log(this.params._id)
    }
});

allowGuest = function(){

}

ChannelController = RouteController.extend({
    template: 'detailChannel',
    waitOn: function () {
        return Meteor.subscribe('channel', this.params._id);
    },
    onBeforeAction : function(){
        if(!Meteor.user()){
            this.render('allowGuest')
        }else{
            var channel = this.channel(),user = Meteor.user();
            if(channel.createdBy != user._id){
                var username = user.username;

                MessagesChat.emit('chat', channel._id, username, displayMessage({
                    username: username,
                    message: 'đã kết nối.'
                }));
            }
            this.next();
        }
    },
    onAfterAction : function(){
        if(Meteor.user()){
            var channel = this.channel(), user = Meteor.user();
            Session.set('title', titlePage({title: channel.title}));
        }
    },
    onStop: function () {
        if(Meteor.user()){
            MessagesChat.emit('chat', this.params._id, Meteor.userId(), displayMessage({
                username: Meteor.user().username,
                message: 'đã thoát.'
            }))
        }
    },
    channel: function () {
        return Channels.findOne({_id: this.params._id});
    },
    onRun : function(){
        if(Meteor.user()){
            var channel = this.channel();
            if(channel.Player){
                if (Meteor.userId() == channel.modBy) {
                    var player = new Player(channel._id);
                } else {
                    var remote = new RemotePlayer(channel._id);
                }
            }
        }
    },
    data: function () {
        if(Meteor.user()){
            var channel = this.channel();

            var isMod = (Meteor.userId() == channel.modBy) ? true : false;
            var playlistTemplate = {
                template: 'empty-playlist',
                data: {
                    isMod: isMod
                }
            };
            var playerTemplate = {
                template: 'empty-player',
                data: {
                    isMod: isMod
                }
            }

            if (channel.Player) {

            }
            var playlistSize = 0;
            if (channel.playlist) {
                playlistSize = _.size(channel.playlist);
                playlistTemplate = {
                    template : 'channel_playlist',
                    data : {
                        items : channel.playlist
                    }
                }
            }

            Session.set('playlistTemplate',playerTemplate);

            _.extend(channel, {isMod: isMod, playlistTemplate: playlistTemplate, playerTemplate: playerTemplate,playlistSize : playlistSize});

            //console.log(channel);

            return {
                channel: channel,
                chatLog : chatCollection.find({channelId: this.params._id}, {userId: {$slice: -5}})
            }
        }
    },
    fastRender: true
});

Meteor.startup(function () {
    Router.route('/danh-sach-kenh', {
        name: 'listChannelsByMe',
        controller: ChannelsByMeController
    });


    Router.route('/kenh/:_id', {
        name: 'detailChannel',
        controller: ChannelController
    });

    Router.route('/kiem-tra-thong-tin-guest/:_id', {
        name: 'allowGuest',
        controller: ChannelAllowGuestController
    })

    Router.route('/tao-kenh', {
        name: 'addChannel',
        template: 'addChannel',
        onAfterAction: function () {
            Session.set('title', titlePage({title: 'Tạo kênh mới'}));
        },
        fastRender: true
    });
})