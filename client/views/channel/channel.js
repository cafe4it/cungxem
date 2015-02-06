AutoForm.hooks({
    insertChannelForm: {
        onSuccess: function (operation, result, template) {
            Router.go('detailChannel', {_id: result});
        }
    }
});

var searchYoutubeApiV2 = function (keyword) {
    if (!_.isEmpty(keyword)) {
        clearSessionVariables();
        Session.set('resultSearch', {template: 'loading'});
        var channelId = Router.current().params._id;
        var channel = Channels.findOne({_id: channelId});
        Meteor.call('searchYoutubeApiV2', keyword, function (err, rs) {
            if (!err && rs && rs.totalItems > 0) {
                var items = _.map(rs.items, function (i) {
                    var item = _.pick(i, 'id', 'title', 'description', 'thumbnail', 'duration');
                    var duration = moment.utc(item.duration * 1000).format("HH:mm:ss");
                    var isExists = false;
                    if (channel.playlist) {
                        isExists = _.some(channel.playlist, function (j) {
                            return item.id == j.id
                        })
                    }
                    //state = false có nghĩa là pause=false;
                    return _.extend(item, {
                        kind: 'youtube',
                        duration: duration,
                        url: youtubeWatch({id: item.id}),
                        channelId: channelId,
                        isExists: isExists,
                        state: false,
                        currentTime: 0
                    });
                });
                Session.set('searchResultItems', items);
                getPaginatedItemsV2(1);
            } else {
                //Session.set('resultSearch', {template: 'playlist-search-empty-result'});
                clearSessionVariables()
            }
        })
    } else {
        //Session.set('resultSearch', {template: 'playlist-search-empty-result'});
        clearSessionVariables()
    }
}

var getPaginatedItemsV2 = function (page) {
    if (Session.get('searchResultItems')) {
        var page = page || 1,
            items = Session.get('searchResultItems'),
            per_page = 3,
            offset = (page - 1 ) * per_page,
            paginatedItems = _.rest(items, offset).slice(0, per_page);
        Session.set('paginatedResultSearchItems', {
            total: Math.ceil(items.length / per_page),
            page: page,
            maxVisible: 10
        })
        $('#paginatedResultSearchItems').bootpag(Session.get('paginatedResultSearchItems'));
        //console.log(Session.get('paginatedResultSearchItems'))
        Session.set('resultSearch', {template: 'playlist_search_has_result', data: {items: paginatedItems}})
    }
}

var clearSessionVariables = function () {
    Session.set('resultSearch', {template: 'playlist-search-empty-result', data: {}});
    Session.set('paginatedResultSearchItems', {
        page: 1,
        total: 1,
        maxVisible: 1
    });
    Session.set('searchResultItems', {});
    $('#paginatedResultSearchItems').bootpag(Session.get('paginatedResultSearchItems'));
}

var sendChat = function (b) {
    var msg = _.escape($('#txtMessage').val()), userId = Meteor.userId(), username = Meteor.user().username, channelId = Router.current().params._id;

    chatCollection.insert({
        userId: userId,
        username: 'Tôi',
        channelId: channelId,
        message: displayMessage({username: 'Tôi', message: msg})
    });

    MessagesChat.emit('chat', channelId, userId, displayMessage({username: username, message: msg}));

    $('#txtMessage').val('');
}


Template.detailChannel.created = function () {
    Session.set('resultSearch', {template: 'playlist-search-empty-result', data: {}});
    Session.set('paginatedItem', {});
    var paginatedResultSearchItems = {
        page: 1,
        total: 1,
        maxVisible: 1
    }
    Session.set('paginatedResultSearchItems', paginatedResultSearchItems);
}

Template.detailChannel.helpers({
    playerTemplate: function () {
        var playerTemplate = Session.get('playerTemplate');
        return Session.get('playerTemplate');
    }
})

Template.detailChannel.rendered = function () {
    initPlayers();
}

var initPlayers = function (controller, currentPlayer, channelInfo) {
    try {
        var controller = controller || Iron.controller();
        var currentPlayer = currentPlayer || controller.state.get('currentPlayer');
        var channelInfo = channelInfo || controller.state.get('channelInfo');
        if (currentPlayer && !_.isEmpty(currentPlayer)) {
            Meteor.setTimeout(function () {
                if (Meteor.userId() == channelInfo.modBy) {
                    selfPlayer = new Player(channelInfo.channelId, currentPlayer);
                } else {
                    remotePlayer = new RemotePlayer(channelInfo.channelId);
                }
            }, 2000)
        }
    } catch (ex) {
        console.log(ex);
    }
}

Template.detailChannel.events({
    'click #btnSendChat': function (e, t) {
        e.preventDefault();
        //sendChat();
    },
    'keyup #txtMessage': function (e, t) {
        e.preventDefault();
        if (e.keyCode == 13) {
            sendChat();
        }
    },
    'click #shareLink': function (e, t) {
        e.preventDefault();
        var fullChannelUrl = Router.current().originalUrl;
        if (fullChannelUrl) {
            var msg = Blaze.toHTMLWithData(Template.shareLink, {channelUrl: fullChannelUrl});
            bootbox.dialog({
                message: msg,
                title: "Chia sẻ kênh",
                buttons: {
                    main: {
                        label: "Đóng lại",
                        className: "btn-primary"
                    }
                }
            });
        }
    },
    'click #shareFacebook': function (e, t) {
        e.preventDefault()
    }
})

Template.channel_playlist.helpers({
    playlistTemplate: function () {
        /*        var controller = Iron.controller();
         var playlist = controller.state.get('playlist');
         var rs = paginatedItems(playlist,3,1);
         var playlistTemplate = {
         template : 'channel_playlist_items',
         data : {
         items : playlist,
         total : rs.total_page,
         page : rs.page,
         paginatedItems : rs.data
         }

         }

         Session.set('playlistTemplate',playlistTemplate);*/
        return Session.get('playlistTemplate');
    }
})

Template.channel_playlist.rendered = function () {
    var playlistTemplate = Session.get('playlistTemplate');
    var self = this;
    $('#playlistPaginated').bootpag({
        total: playlistTemplate.data.total,
        page: playlistTemplate.data.page || 1,
        maxVisible: 10
    }).on('page', function (e, p) {
        e.preventDefault();
        playlistTemplate = Session.get('playlistTemplate');
        var rs = paginatedItems(playlistTemplate.data.items, 3, p);
        playlistTemplate = {
            data: {
                total: rs.total_page,
                items: rs.items,
                page: rs.page,
                paginatedItems: rs.data
            },
            template: 'channel_playlist_items'
        }
        Session.set('playlistTemplate', playlistTemplate);
    })
}

/*Template.channel_playlist.created = function(){

 }


 var generatePaginatedPlaylist = function(){

 var playlistTemplate = Session.get('playlistTemplate');
 console.log(playlistTemplate)
 $('#playlistPaginated').bootpag({
 total : playlistTemplate.data.total,
 page : playlistTemplate.data.page || 1,
 maxVisible : 10
 }).on('page',function(e,p){
 e.preventDefault();
 var playlistTemplate = Session.get('playlistTemplate');
 var rs = paginatedItems(playlistTemplate.data.items,3, p);
 playlistTemplate.data.paginatedItems = rs.data;
 playlistTemplate.data.page = rs.page;
 playlistTemplate.data.total= rs.total_page;
 Session.set('playlistTemplate',playlistTemplate);
 console.log(playlistTemplate)
 })
 }
 Template.channel_playlist.rendered = function(){
 generatePaginatedPlaylist();
 }*/

//var paginatedResultDep = new Tracker.Dependency;
var generatePaginationResultSearch = function () {
    Meteor.setTimeout(function () {
        var paginatedResultSearchItems = Session.get('paginatedResultSearchItems');
        $('#paginatedResultSearchItems').bootpag(
            paginatedResultSearchItems
        ).on('page', function (event, num) {
                event.preventDefault();
                if (Session.get('paginatedResultSearchItems').total > 1) {
                    getPaginatedItemsV2(num);
                }
            });
    }, 0)
}

Template.playlist_search.rendered = function () {
    $(document).ready(function () {
        generatePaginationResultSearch();
    })
}

Template.playlist_search.helpers({
    resultTemplate: function () {
        return Session.get('resultSearch');
    }
});


Template.playlist_search.events({
    'click .disabled-link': function (e) {
        e.preventDefault();
    },
    'click #btnVideosSource': function (e) {
        e.preventDefault();
        bootbox.alert('Nguồn video trên SoundCloud và Vimeo sẽ sớm được cập nhật.');
    },
    'keyup #txtSearchTerm': function (e) {
        e.preventDefault();
        if (e.keyCode == 13) {
            var term = _.escape($('#txtSearchTerm').val());
            searchYoutubeApiV2(_.unescape(term));
        }
    }
});

Template.playlist_search_has_result.events({
    'click button[id^="btnAddToPlaylist_K"]': function (e, t) {
        e.preventDefault();
        if (e.currentTarget) {
            var buttonId = jquerySelectorId({id: e.currentTarget.id}), button = $(buttonId),
                videoId = button.attr('data-id'),
                searchResultItems = Session.get('searchResultItems');
            if (videoId && searchResultItems) {
                var index = -1;
                var item = _.find(searchResultItems, function (i) {
                    index++;
                    return i.id == videoId
                });

                if (item) {
                    Meteor.call('addToPlaylist', item, function (err, rs) {
                        if (rs.result == 1) {
                            item.isExists = true;
                            searchResultItems[index] = item;

                            Session.set('searchResultItems', searchResultItems);
                            $(buttonId).removeClass('btn-success');
                            $(buttonId).addClass('btn-default');
                            $('button' + buttonId + ' > i').replaceWith("<i class='fa fa-minus'></i>");
                        }
                    })
                }
            }
        }
    },
    'click button[id^="btnPlayNow_N"]': function (e, t) {
        e.preventDefault();
        if (e.currentTarget) {

            var controller = Iron.controller();
            var channelInfo = controller.state.get('channelInfo');
            if (channelInfo) {
                if (channelInfo.modBy == Meteor.userId()) {
                    var videoId = $(jquerySelectorId({id: e.currentTarget.id})).attr('data-id');
                    var searchResultItems = Session.get('searchResultItems');
                    var currentVideo = _.find(searchResultItems, function (i) {
                        return i.id == videoId
                    });
                    if (currentVideo) {
                        var item = {
                            channelId: channelInfo.channelId,
                            modBy: channelInfo.modBy,
                            video: currentVideo
                        }
                        Meteor.call('updateCurrentPlayOnChannel', item, function (err, rs) {
                            if (!rs.error) {
                                selfPlayer.src(item.video.url);
                                selfPlayer.play();
                            }
                        })
                    }
                }
            }
        }
    }
})


