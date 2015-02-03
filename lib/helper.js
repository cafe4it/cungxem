redirectTo  = function(routeName){
    Router.go(routeName);
};

paginatedItems = function(items,per_page,page){
    var page = page || 1,
        per_page = per_page || 3,
        offset = (page - 1) * per_page,
        paginateItems = _.rest(items, offset).slice(0, per_page);
    return {
        total_page : Math.ceil(items.length / per_page),
        total : items.length,
        data : paginateItems,
        page: page,
        per_page: per_page,
        items : items
    }
}