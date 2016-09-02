App.controller('LoginController', function ($scope,$timeout, $http, $cookies, $cookieStore, ngDialog, MY_CONSTANT, $state) {
    //initially set those objects to null to avoid undefined error
    // place the message if something goes wrong
    $scope.account = {};
    $scope.authMsg = '';
    $scope.loading=false;

    $scope.loginAdmin = function () {
        $scope.authMsg = '';
        $scope.loading=true;
        $.post(MY_CONSTANT.url + '/api/v1/admin/login',
            {
                "password": $scope.account.password,
                "email": $scope.account.email

            }).then(function (data) {
                //console.log(data);

                if (data.statusCode==401) {
                    //console.log("Error");
                    $scope.authMsg = data.message;
                    $scope.$apply();
                }
                else
                { $scope.loading=false;
                    $cookieStore.put('accessToken',data.data.accessToken);
                    $state.go('app.dashboard-new');
                }
            });
    };

    $scope.recover = function () {

        $.post(MY_CONSTANT.url + '/forgot_password',
            {
                email: $scope.account.email
            }).then(
            function (data) {
                data = JSON.parse(data);

                if (data.status == 200) {
                    $scope.successMsg = data.message.toString();
                } else {
                    $scope.errorMsg = data.message.toString();

                }
                $scope.$apply();
            })
    };

    //============================================
    //logout
    //=============================================
    $scope.logout = function () {
        ngDialog.open({
            template: 'app/views/logout-confirm.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.confirm=function(){
        ngDialog.close();
        $state.reload();
        $cookieStore.remove('accessToken');
        $state.go('page.login');
    }

    // refresh button================
    $scope.refresh=function()
    {
        $state.reload();
    };
});

