Router.configure({
    layoutTemplate : 'defaultLayout',
    loadingTemplate: 'loading',
    notFoundTemplate : '404',
    yieldRegions :{
        'header' : {to : 'header'},
        'footer' : {to : 'footer'}
    }
});