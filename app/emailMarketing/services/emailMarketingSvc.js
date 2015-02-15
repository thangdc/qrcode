vietsoftApp.factory('emailMarketingServices', function ($resource, ngAuthSettings) {

    var result = {};

    var _crawlEmail = function (emailMarketing) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/EmailMarketing/CrawlEmail', emailMarketing).save(emailMarketing);
    }

    result.crawlEmail = _crawlEmail;

    return result;

});