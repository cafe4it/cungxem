Schemas = {};
Channels = new Mongo.Collection('channels');
Schemas.Player = new SimpleSchema({
   title : {
       type : String,
       optional : true
   },
    description : {
        type : String,
        optional : true
    },
    kind : {
        type : String,
        optional : true
    },
    url : {
        type : String,
        optional : true
    },
    state : {
        type : Boolean,
        optional : true
    },
    currentTime : {
        type : Number,
        optional : true
    },
    duration : {
        type: String,
        optional : true
    },
    addedTime: {
        type: Date,
        optional: true
    },
    playedTime: {
        type: Date,
        optional: true
    }
});
Schemas.PlaylistItem = new SimpleSchema({
    id : {
        type : String
    },
    kind : {
        type : String
    },
    title : {
        type : String
    },
    description : {
        type : String
    },
    duration : {
        type : String
    },
    thumbnail : {
        type : String
    },
    watchUrl : {
        type : String
    }
})
Schemas.Channel = new SimpleSchema({
    title: {
        type: String,
        label: 'Tên kênh',
        max: 60
    },
    description: {
        type: String,
        label: 'Miêu tả',
        max: 100,
        optional: true
    },
    password: {
        type: String,
        label: 'Mật khẩu',
        max: 30,
        optional: true
    },
    displayPublic: {
        type: Boolean,
        label: 'Hiển thị Public'
    },
    hideChat: {
        type: Boolean,
        label: 'Không bật Chat'
    },
    createdBy: {
        type: String,
        autoValue: function() {
            if (this.isInsert) {
                return Meteor.userId();
            } else if (this.isUpsert) {
                return {$setOnInsert: Meteor.userId()};
            } else {
                this.unset();
            }
        }
    },
    createdAt :{
        type : Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date;
            } else if (this.isUpsert) {
                return {$setOnInsert: new Date};
            } else {
                this.unset();
            }
        }
    },
    modBy: {
        type: String,
        label: 'Điều hành bởi',
        autoValue: function() {
            if (this.isInsert) {
                return Meteor.userId();
            } else if (this.isUpsert) {
                return {$setOnInsert: Meteor.userId()};
            } else {
                this.unset();
            }
        }
    },
    player:{
        type : Schemas.Player,
        optional : true
    },
    playlist: {
        type: [Schemas.PlaylistItem],
        optional: true
    }
});
Channels.attachSchema(Schemas.Channel);

