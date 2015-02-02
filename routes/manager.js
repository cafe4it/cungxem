UsersListController = RouteController.extend({
    template : 'manager_users',
    waitOn : function(){
        return Meteor.subscribe('managerUsers');
    },
    onAfterAction : function(){
        Session.set('title',titlePage({title : 'Quản lý thành viên'}));
    },
    fastRender : true
});

Meteor.startup(function(){
    Router.route('/4dmin/thanh-vien',{
        name : 'managerUsers',
        controller : UsersListController
    })
})