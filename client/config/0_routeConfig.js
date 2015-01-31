Router.configure({
    layoutTemplate : 'defaultLayout',
    notFoundTemplate : '404',
    yieldRegions :{
        'header' : {to : 'header'},
        'footer' : {to : 'footer'}
    }
});