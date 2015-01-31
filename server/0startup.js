/*
 var before = new Date();
 before.setHours(before.getHours() - 2);
 Accounts.removeOldGuests(before);*/

MessagesChat = new Meteor.Stream('messages');
UsersConnected = new Meteor.Stream('usersConnected');
PlayerControls = new Meteor.Stream('controls');

if (Meteor.isServer) {
    MessagesChat.permissions.read(function () {
        return true;
    });
    MessagesChat.permissions.write(function () {
        return true;
    });

    UsersConnected.permissions.read(function () {
        return true;
    });
    UsersConnected.permissions.write(function () {
        return true;
    });
    PlayerControls.permissions.read(function () {
        return true;
    });
    PlayerControls.permissions.write(function () {
        return true;
    });
}

Meteor.startup(function(){
    YoutubeApi.authenticate({
        type: "key",
        key: "AIzaSyAJl6zx7U-2jFG-T6EO43elRgmHNT-fGng"
    });
})