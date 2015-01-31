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
    source : {
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
        type : Number,
        optional : true
    }
});
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
        type: String
    },
    modBy: {
        type: String,
        label: 'Điều hành bởi'
    },
    player:{
        type : Schemas.Player,
        optional : true
    },
    playlist: {
        type: [String],
        optional: true
    }
});
Channels.attachSchema(Schemas.Channel);

