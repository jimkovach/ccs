/* GET index */
module.exports.index = function (req, res){
    res.render('index', {
        title: 'CCS',
        pageHeader: {
            title: 'Conference Construction Set',
            strapline: 'a quick guide to using this application'
        },
    });
};
