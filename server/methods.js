if (Meteor.isServer) {
    Meteor.methods({
        "userExists": function (username) {
            return !!Meteor.users.findOne({username: username});
        },
        createGuest: function (email) {
            //this.unblock();
            var count = Meteor.users.find().count() + 1;

            var guestName = _.uniqueId("Khach_") + count;
            if (!email) {
                email = guestName + "@guest.cungxem.com";
            }
            var guest = {
                username: guestName,
                email: email,
                password: Meteor.uuid()
            };
            var guestId = Accounts.createUser({
                username: guest.username,
                email: guest.email,
                password: guest.password
            });
            // console.log("createGuest" + guestName);
            //Roles.addUsersToRoles(guestId, ["guest"]);
            return guest;
        },
        'updateChannel': function () {
            try {

            } catch (ex) {
                console.log(ex);
            }
        },
        'searchYoutube' : function(term){
            var a = function(term,callback){
                YoutubeApi.search.list({
                    part: "snippet",
                    type: "video",
                    maxResults: 50,
                    regionCode : 'vn',
                    q: term
                }, function (err, data) {
                    if(err) throw new Meteor.Error(err);
 /*                   if(data && data.pageInfo.totalResults > 0){

                        var videoIds =_.pluck(_.pluck(data.items,'id'),'videoId');
                        YoutubeApi.videos.list({
                            part : 'contentDetails',
                            type :'video',
                            id : videoIds,
                            regionCode : 'vn'
                        },function(err1,data1){
                            if(err1) throw new Meteor.Error(err1);
                            callback(err1,data1);
                        })
                    }else{
                        callback(err,data);
                    }*/
                    callback(err,data);
                });
            }
            var b = Meteor.wrapAsync(a);
            var rs = b(term);
            var self = this;
            if(rs && rs.pageInfo.totalResults > 0){
                var d = function(videoIds,callback){
                    self.unblock();
                    YoutubeApi.videos.list({
                        part : 'contentDetails',
                        type :'video',
                        id : videoIds
                    },function(err1,data1){
                        if(err1) throw new Meteor.Error(err1);
                        callback(err1,data1);
                    });
                };
                var videoIds =_.pluck(_.pluck(rs.items,'id'),'videoId');

                var bb = Meteor.wrapAsync(d);
                var rss = bb(videoIds);

                var url = _.template("https://www.youtube.com/watch?v=<%=id%>");
                //var moment = moment();
                var items = _.map(rs.items,function(i){
                    var duration = _.findWhere(rss.items,{id : i.id.videoId}).contentDetails.duration || 0;
                    duration = moment.utc(moment.duration(duration).asMilliseconds()).format("HH:mm:ss");
                    return {
                        _id : i.id.videoId,
                        kind : 'youtube',
                        url : url({id : i.id.videoId}),
                        title : i.snippet.title,
                        description : i.snippet.description,
                        thumbnails : i.snippet.thumbnails,
                        duration : duration
                    }
                });

                //console.log(items);
                return items;
            }else{
                return rs;
            }
        }
    });
    Accounts.onCreateUser(function (option, user) {
        var roles = ['user'];
        if (user.username == 'nxcong' || user.username == 'admin' || user.username == 'administrator') {
            roles = ['admin', 'mod', 'user'];
        }
        //console.log(user);
        if (user.emails[0].address.indexOf('@guest.cungxem.com') != -1) {
            roles = ['guest'];
        }
        _.extend(user, {'roles': roles});
        Roles.addUsersToRoles(user._id, roles);
        return user;
    });
    Accounts.removeOldGuests = function (before) {
        if (typeof before === 'undefined') {
            before = new Date();
            before.setHours(before.getHours() - 1);
        }
        res = Meteor.users.remove({createdAt: {$lte: before}, 'roles': 'guest'});
        console.log('remove old guest...');
        return res;
    };
    Accounts.removeOldGuests();
}