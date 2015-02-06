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
        'updateCurrentPlayOnChannel': function (item) {
            try {
                if (Meteor.userId() == item.modBy) {
                    var rs = Async.runSync(function (done) {
                        Channels.update({_id: item.channelId}, {
                            $set: {
                                player: {
                                    title: item.video.title,
                                    description: item.video.description,
                                    kind: item.video.kind,
                                    url: item.video.url,
                                    state: item.video.state,
                                    currentTime: item.video.currentTime,
                                    duration: item.video.duration
                                }
                            }
                        }, function (err, result) {
                            //console.log(err);
                            done(err, result);
                        })
                    })
                    return rs;
                }
            } catch (ex) {
                console.log(ex);
            }
        },
        'addToPlaylist' : function(item){
            try{
                var rs = Async.runSync(function(done){
                    Channels.update({_id : item.channelId},{
                        $push : {
                            playlist : {
                                id : item.id,
                                kind : item.kind,
                                title : item.title,
                                description : item.description,
                                thumbnail : item.thumbnail.hqDefault,
                                duration : item.duration,
                                watchUrl : item.url
                            }
                        }
                    },function(err,rs){
                        done(err,rs);
                    });
                })
                return rs;
            }catch(ex){
                console.log(ex)
            }
        },
        'searchYoutubeApiV2' : function(term){
            var data = Async.runSync(function(done){
                YoutubeApiV2.feeds.videos({
                    q : term,
                    'max-results':  50,
                    region : 'VN'
                },function(err,rs){
                    done(err,rs);
                })
            });
            return data.result;
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