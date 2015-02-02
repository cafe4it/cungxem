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
        var channel = Channels.findOne({_id : channelId});
        Meteor.call('searchYoutubeApiV2', keyword, function (err, rs) {
            if (!err && rs && rs.totalItems > 0) {
                var items = _.map(rs.items, function (i) {
                    var item = _.pick(i, 'id', 'title', 'description', 'thumbnail', 'duration');
                    var duration = moment.utc(item.duration * 1000).format("HH:mm:ss");
                    var isExists = false;
                    if(channel.playlist){
                        isExists = _.some(channel.playlist,function(j){return item.id == j.id})
                    }
                    return _.extend(item, {kind: 'youtube',duration : duration, url : youtubeWatch({id : item.id}),channelId : channelId,isExists : isExists});
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
    if(Session.get('searchResultItems')){
        var page = page || 1,
            items = Session.get('searchResultItems'),
            per_page = 3,
            offset = (page - 1 ) * per_page,
            paginatedItems = _.rest(items, offset).slice(0, per_page);
        Session.set('paginatedResultSearchItems',{
            total : Math.ceil(items.length / per_page),
            page : page,
            maxVisible : 10
        })
        $('#paginatedResultSearchItems').bootpag(Session.get('paginatedResultSearchItems'));
        //console.log(Session.get('paginatedResultSearchItems'))
        Session.set('resultSearch', {template: 'playlist_search_has_result', data: {items: paginatedItems}})
    }
}

var clearSessionVariables = function(){
    Session.set('resultSearch', {template: 'playlist-search-empty-result',data :{}});
    Session.set('paginatedResultSearchItems',{
        page : 1,
        total :1,
        maxVisible :1
    });
    Session.set('searchResultItems',{});
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


Template.detailChannel.created = function(){
    Session.set('resultSearch',{template : 'playlist-search-empty-result',data :{}});
    Session.set('paginatedItem',{});
    var paginatedResultSearchItems = {
        page : 1,
        total :1,
        maxVisible :1
    }
    Session.set('paginatedResultSearchItems',paginatedResultSearchItems);
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
    }
})

//var paginatedResultDep = new Tracker.Dependency;
var generatePaginationResultSearch = function () {
    Meteor.setTimeout(function () {
        //paginatedResultDep.depend()
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
    'click button[id^="btnAddToPlaylist_K"]' : function(e,t){
        e.preventDefault();
        if(e.currentTarget){
            var buttonId=jquerySelectorId({id : e.currentTarget.id}),button = $(buttonId),
                videoId = button.attr('data-id'),
                searchResultItems = Session.get('searchResultItems');
            if(videoId && searchResultItems){
                var index = -1;
                var item = _.find(searchResultItems,function(i){
                    index++;
                    return i.id == videoId
                });

                if(item){
                    Meteor.call('addToPlaylist',item,function(err,rs){
                        if(rs.result == 1){
                            item.isExists = true;
                            searchResultItems[index] = item;
                            Session.set('searchResultItems',searchResultItems);
                            $(buttonId).removeClass('btn-success');
                            $(buttonId).addClass('btn-default');
                            $('button'+buttonId+' > i').replaceWith("<i class='fa fa-minus'></i>");
                        }
                    })
                }
            }
        }
    }
})


