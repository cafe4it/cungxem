Router.route('/', function () {
    this.render('home');
}, {
    name: 'home',
    fastRender: true
});

/*
 * Authenticates Routes
 */

Router.onBeforeAction(AccountsTemplates.ensureSignedIn, {
    except: ['home', 'SignIn', 'SignUp', 'Logout', 'ForgotPassword', '404', 'detailChannel','allowGuest']
});
AccountsTemplates.configureRoute('ensureSignedIn', {
    template: 'SignIn',
    layoutTemplate: 'defaultLayout'
});

AccountsTemplates.configureRoute('signIn', {
    name: 'SignIn',
    path: '/dang-nhap',
    template: 'SignIn',
    layoutTemplate: 'defaultLayout',
    redirect: '/thong-tin-tai-khoan'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'SignUp',
    path: '/dang-ky-tai-khoan',
    template: 'SignUp',
    layoutTemplate: 'defaultLayout',
    redirect: '/thong-tin-tai-khoan'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'ForgotPassword',
    path: '/quen-mat-khau',
    template: 'ForgotPassword',
    layoutTemplate: 'defaultLayout',
    redirect: '/'
});

Router.route('/thong-tin-tai-khoan', function () {
    this.render('home')
}, {
    fastRender: true
});

Router.route('/dang-xuat', function () {
    Meteor.logout();
    Router.go('home');
}, {
    name: 'Logout'
});

/*
 * Channel Routes
 */

/*Router.route('/kiem-tra-thong-tin-guest',{
    name : 'allowGuest',
    onBeforeAction: function(){
        if(Meteor.user()){
            Router.go('home')
        }else{
            this.next();
        }
    },
    onAfterAction : function(){
        try {
            console.log(this.request);

            *//*var rs = Meteor.call('createGuest', null, function (error, result) {
                if (error) {
                    console.log('Error in creating Guest ' + error);
                    return false;
                }
                *//**//* if a simple "true" is returned, we are in a disabled mode *//**//*
                if (result === true) {
                    return true;
                }
                Meteor.loginWithPassword(result.email, result.password, function (err) {
                    if (err) {
                        console.log('Error logging in ' + err);
                        return false;
                    }
                });
                return true;
            });*//*

        } catch (ex) {
            console.log(ex)
        }
    },
    action : function(){
        this.render();
    }
});*/

/*Router.route('/kenh/:_id', {
    name: 'detailChannel',
    path: '/kenh/:_id',
    fastRender : true,
    waitOn: function () {
        return Meteor.subscribe('channel', this.params._id);
    },
    onBeforeAction: function () {
        if (_.isNull(Meteor.userId())) {
            Router.go('allowGuest')
        }
        else{
            this.next();
        }
    },
    onAfterAction: function () {


    },
    action : function(){
        this.render()
    },
    onStop: function () {
        MessagesChat.emit('chat', this.params._id, Meteor.userId(), displayMessage({
            username: Meteor.user().username,
            message: 'đã rời phòng.'
        }))
    }
});*/


/*Router.route('/danh-sach-kenh', {
    name: 'listChannelsByMe',
    waitOn: function () {
        return Meteor.subscribe('channelsByMe', Meteor.userId());
    },
    danh
}, function () {
    this.render();
});*/


