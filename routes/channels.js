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

    }
});

allowGuest = function () {

}

ChannelController = RouteController.extend({
    template: 'detailChannel',
    waitOn: function () {
        return Meteor.subscribe('channel', this.params._id);
    },
    onBeforeAction: function () {
        if (!Meteor.user()) {
            this.render('allowGuest')
        } else {
            var channel = this.channel(), user = Meteor.user();

            if (channel.createdBy != user._id) {
                var username = user.username;

                MessagesChat.emit('chat', channel._id, username, displayMessage({
                    username: username,
                    message: 'đã kết nối.'
                }));
            }
            this.next();
        }
    },
    onAfterAction: function () {
        if (Meteor.user()) {
            var channel = this.channel(), user = Meteor.user();
            Session.set('title', titlePage({title: channel.title}));
            if (channel.player) {
                Session.set('title', titlePage({title: channel.player.title + ' - ' + channel.title}));
            }
        }
    },
    onStop: function () {
        if (Meteor.user()) {
            MessagesChat.emit('chat', this.params._id, Meteor.userId(), displayMessage({
                username: Meteor.user().username,
                message: 'đã thoát.'
            }))
        }
    },
    channel: function () {
        return Channels.findOne({_id: this.params._id});
    },
    data: function () {
        if (Meteor.user()) {
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
            Session.set('playerTemplate', playerTemplate);
            if (channel.player && !_.isEmpty(channel.player)) {
                var player = channel.player;
                _.extend(player, {channelId: channel._id});
                switch (player.kind) {

                    default :
                        _.extend(playerTemplate, {template: 'youtube-player', data: {player: player}});
                        Session.set('playerTemplate', playerTemplate);
                        break;
                }
                this.state.set('currentPlayer', player);
            }

            var playlistSize = 0;
            if (channel.playlist) {
                playlistSize = _.size(channel.playlist);
                var rs = paginatedItems(channel.playlist, 3, 1);
                playlistTemplate = {
                    template: 'channel_playlist_items',
                    data: {
                        paginatedItems: rs.data,
                        items: channel.playlist,
                        page: rs.page,
                        total: rs.total_page
                    }
                }
            }

            Session.set('playlistTemplate', playlistTemplate);


            _.extend(channel, {isMod: isMod, playlistSize: playlistSize});

            return {
                channel: channel,
                chatLog: chatCollection.find({channelId: this.params._id}, {userId: {$slice: -5}})
            }
        }
    },
    action: function () {
        var channel = this.channel();
        this.state.set('playlist', channel.playlist);
        this.state.set('channelInfo', {
            title: channel.title,
            channelId: channel._id,
            modBy: channel.modBy
        });
        this.render();
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