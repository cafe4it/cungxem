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