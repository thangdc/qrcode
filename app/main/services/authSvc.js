vietsoftApp.factory('authService', function ($resource, $q, $http, localStorageService, ngAuthSettings) {

    var domain = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};
    var _authentication = {
        isAuth: false,
        userName: ""
    };

    var _login = function (user) {
        var data = "grant_type=password&username=" +
            user.UserName + "&password=" + user.Password;

        var deferred = $q.defer();
        var current = this;
        $http.post(domain + '/token', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).success(function (response) {

            localStorageService.set('authorizationData',
            { token: response.access_token, userName: user.UserName });

            _authentication.isAuth = true;
            _authentication.userName = user.UserName;

            deferred.resolve(response);

        }).error(function (err, status) {
            current.logout();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    var _register = function (user) {
        this.logout();
        return $resource(domain + '/api/Account/Register', user).save(user);
    };

    var _logout = function () {

        localStorageService.remove('authorizationData');
        _authentication.isAuth = false;
        _authentication.userName = "";
    };

    var _fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }
    };

    var _forgetPassword = function (email) {
        return $resource(domain + '/api/Account/ForgetPassword', email).query(email);
    };

    authServiceFactory.login = _login;
    authServiceFactory.register = _register;
    authServiceFactory.logout = _logout;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;

});