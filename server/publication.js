Meteor.publish(null,function(){
    return Meteor.roles.find({})
});

Meteor.publish('channel',function(id){
    return Channels.find({_id : id});
});

Meteor.publish('channels', function(){
    return Channels.find();
});

Meteor.publish('channelsByMe',function(userId){
     return Channels.find({createdBy : userId});
});

Meteor.publish('managerUsers',function(){
    return Meteor.users.find();
})