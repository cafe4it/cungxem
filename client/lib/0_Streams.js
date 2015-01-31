if(Meteor.isClient){
    MessagesChat = new Meteor.Stream('messages');
    PlayerControls = new Meteor.Stream('controls');

    chatCollection = new Meteor.Collection(null);

    playerTimeUpdate = new Meteor.Collection(null);

    MessagesChat.on('chat',function(channelId,username,message){
        chatCollection.insert({
            userId : this.userId,
            username : username,
            subscriptionId: this.subscriptionId,
            message: message,
            channelId : channelId
        });
    });
}
