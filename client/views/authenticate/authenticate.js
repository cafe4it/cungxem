Template.SignIn.created = function(){
    Session.set('title',titlePage({title : 'Đăng nhập'}));
}

Template.SignUp.created = function(){
    Session.set('title',titlePage({title : 'Đăng ký thành viên'}));
}

Template.allowGuest.created = function(){
    Session.set('title',titlePage({title : 'Kiểm tra thông tin khách'}));
    if(Meteor.userId()) Router.go('home');
};

Template.allowGuest.rendered = function(){
    $(document).ready(function(){
        try {
            if(!Meteor.userId()){
                var rs = Meteor.call('createGuest', null, function (error, result) {
                    if (error) {
                        console.log('Error in creating Guest ' + error);
                        return false;
                    }

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
                });
                var channelId = Router.current().params._id;
                if(rs) Router.go('detailChannel',{_id : channelId});
            }

    } catch (ex) {
        console.log(ex)
    }
    })
}