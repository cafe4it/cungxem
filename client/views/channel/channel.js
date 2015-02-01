AutoForm.hooks({
    insertChannelForm: {
        /*        before: {
         insert: function (doc, template) {
         var currentUser = Meteor.userId();
         _.extend(doc, {"createdBy": currentUser, "modBy": currentUser});
         //console.log(doc);
         return doc;
         }
         },*/
        onSuccess: function (operation, result, template) {
            Router.go('detailChannel', {_id: result});
        }
    }
});

var searchYoutube = function (term) {
    if (!_.isEmpty(term)) {
        Session.set('resultSearch', {template: 'loading'});
        Meteor.call('searchYoutube', term, function (err, rs) {
            if (rs) {
                var result = EJSON.fromJSONValue(rs);
                //console.log(result);
                if (_.size(result) <= 0) {
                    Session.set('resultSearch', {template: 'playlist-search-empty-result'});
                } else {
                    var pagedItems = getPaginatedItems(result, 1);
                    //console.log(pagedItems)
                    Session.set('resultSearch', {
                        template: 'playlist-search-has-result',
                        data: {items: pagedItems.data}
                    })
                }

            }
        })
    }
}

var searchYoutube2 = function (term) {
    if (!_.isEmpty(term)) {
        Session.set('resultSearch', {template: 'loading'});
        Meteor.call('searchYoutube2', term, function (err, rs) {
            if (!err && rs && rs.pageInfo.totalResults > 0) {
                //console.log(rs)
                var a = rs.items, b = rs.durations.items;
                var url = _.template("https://www.youtube.com/watch?v=<%=id%>");
                var items = _.map(a, function (a0) {
                    var videoId = a0.id.videoId;
                    var duration = _.findWhere(b, {id: videoId}).contentDetails.duration || 0;
                    duration = moment.utc(moment.duration(duration).asMilliseconds()).format("HH:mm:ss");
                    return {
                        _id: videoId,
                        kind: 'youtube',
                        url: url({id: videoId}),
                        title: a0.snippet.title,
                        description: a0.snippet.description,
                        thumbnails: a0.snippet.thumbnails,
                        duration: duration
                    }
                });
                Session.set('searchResultItems', items);
                getPaginatedItems2(1);
                //console.log(pagedItems)
                //Session.set('resultSearch', {template: 'playlist-search-has-result', data: {items: Session.get('paginatedItems')}})
            } else {
                Session.set('resultSearch', {template: 'playlist-search-empty-result'});
            }
        })
    }
}

var getPaginatedItems = function (items, page) {
    var page = page || 1,
        per_page = 3,
        offset = (page - 1 ) * per_page,
        paginatedItems = _.rest(items, offset).slice(0, per_page);
    return {
        page: page,
        per_page: per_page,
        total: items.length,
        total_page: Math.ceil(items.length / per_page),
        data: paginatedItems
    }
}

var getPaginatedItems2 = function (page) {
    var page = page || 1,
        items = Session.get('searchResultItems', items),
        perPage = 3,
        offset = (page - 1) * perPage,
        paginatedItems = _.rest(items, offset).slice(0, perPage);
        Session.set('paginatedResultSearchItems',{
            total : Math.ceil(items.length / perPage),
            page : page,
            maxVisible : 10
        });
    //paginatedResultDep.changed();
    generatePaginationResultSearch();
    console.log(Session.get('paginatedResultSearchItems'));

    Session.set('resultSearch', {template: 'playlist-search-has-result', data: {items: paginatedItems}})
}

var sendChat = function (b) {
    var msg = $('#txtMessage').val(), userId = Meteor.userId(), username = Meteor.user().username, channelId = Router.current().params._id;

    chatCollection.insert({
        userId: userId,
        username: 'Tôi',
        channelId: channelId,
        message: displayMessage({username: 'Tôi', message: msg})
    });

    MessagesChat.emit('chat', channelId, userId, displayMessage({username: username, message: msg}));

    $('#txtMessage').val('');
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
var generatePaginationResultSearch = function(){
    Meteor.setTimeout(function () {
        //paginatedResultDep.depend()
        var paginatedResultSearchItems = Session.get('paginatedResultSearchItems');
        $('#paginatedResultSearchItems').bootpag(
            paginatedResultSearchItems
        ).on('page', function (event, num) {
                event.preventDefault();
                if(Session.get('paginatedResultSearchItems').total > 1){
                    getPaginatedItems2(num);
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
            var term = $('#txtSearchTerm').val();
            searchYoutube2(term);
        }
    }
});
