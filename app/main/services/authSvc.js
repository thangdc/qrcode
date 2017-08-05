vietsoftApp.factory('authService', function ($resource, $q, $http, ngAuthSettings, localStorageService) {

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
        $http.post(ngAuthSettings.apiServiceBaseUri + '/Account/Login', data, {
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
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/Account/Register', user).save(user);
    };

    var _resetPassword = function (user) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/Account/ForgetPassword', user).save(user);
    }

    var _updatePassword = function (user) {
        return $resource(ngAuthSettings.apiServiceBaseUri + '/api/Account/ChangePassword', user).save(user);
    }

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

    authServiceFactory.login = _login;
    authServiceFactory.register = _register;
    authServiceFactory.forgetPassword = _resetPassword;
    authServiceFactory.updatePassword = _updatePassword;
    authServiceFactory.logout = _logout;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;

    return authServiceFactory;

});
