var useragent = require('useragent');

exports.index = function(req, res){
    var flags = useragent.is(req.headers['user-agent']);
    if (flags.mobile_safari || flags.android) {
        res.render('mobile', {title: 'Mobile'});
    }
    else {
        res.render('desktop', {title: 'Desktop'});
    }
};
