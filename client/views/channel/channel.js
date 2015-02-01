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

Template.playlist_search.created = function(){

}

Template.playlist_search.helpers({
    resultTemplate: function () {
        return Session.get('resultSearch');
    }
});

var getPaginatedItems = function(items,page){
    var page = page || 1,
        per_page = 3,
        offset = (page -1 ) * per_page,
        paginatedItems = _.rest(items, offset).slice(0, per_page);
    return {
        page : page,
        per_page :per_page,
        total : items.length,
        total_page : Math.ceil(items.length / per_page),
        data: paginatedItems
    }
}

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
            if (!_.isEmpty(term)) {
                Session.set('resultSearch',{template : 'loading'});
                Meteor.call('searchYoutube',term,function(err,rs){
                    if(rs){
                        var result = EJSON.fromJSONValue(rs);
                        //console.log(result);
                        if(_.size(result) <= 0){
                            Session.set('resultSearch',{template : 'playlist-search-empty-result'});
                        }else{
                            var pagedItems = getPaginatedItems(result,1);
                            console.log(pagedItems)
                            Session.set('resultSearch',{template : 'playlist-search-has-result',data : {items : pagedItems.data}})
                        }

                    }
                })
            }
        }
    }
})