App.controller('truckerDetailsController', function ($state, $scope, $stateParams, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.truckerId = $stateParams.truckerId;


    //var getTruckerDetails = function () {
        var accessToken = $cookieStore.get('accessToken');
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTrucker?truckerId='+$scope.truckerId,
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
            $scope.loading = false;
            var custList = response.data.data;
            custList.forEach(function (column) {

                $scope.name=column.driverName;
                $scope.driverId=column.driverId;
                $scope.address=column.address;
                $scope.phoneNumber=column.phoneNumber;
                $scope.date=column.createdAt.split("T")[0];
                $scope.fleet_email=column.fleetOwner[0].email;
                $scope.fleet_phone=column.fleetOwner[0].phoneNumber;
                $scope.profilePicture=column.profilePicture.original?column.profilePicture.original:"app/img/no_image.png";
                $scope.drivingLicenseDoc=column.drivingLicense.drivingLicenseDoc?column.drivingLicense.drivingLicenseDoc:"app/img/no_image.png";
                $scope.drivingLicenseNo=column.drivingLicense.drivingLicenseNo?column.drivingLicense.drivingLicenseNo:"--";
                $scope.VoterIdDoc=column.VoterId.VoterIdDoc?column.VoterId.VoterIdDoc:"app/img/no_image.png";
                $scope.VoterIdNo=column.VoterId.VoterIdNo?column.VoterId.VoterIdNo:"--";
                $scope.adharCardDoc=column.adharCard.adharDoc?column.adharCard.adharDoc:"app/img/no_image.png";
                $scope.adharCardNo=column.adharCard.adharNo?column.adharCard.adharNo:"--";


            });
        }) .error(function (error) {
            //console.log("sdf");
            $state.go('page.404');
            if (error == '404' || error == '401') {
                $state.go('page.404');
            }
            else {
                $state.go('page.Nointernet');
            }
        });
    $scope.pop = {};
    $scope.download_image = function (data,id) {
        console.log(data,id);
        if(id==1)
        {
            $scope.details = data;
            console.log($scope.details);
            if (data == "app/img/no_image.png")
                return;
            else
                $scope.pop.image = data;
            ngDialog.openConfirm({
                template: 'modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }
        else if(id==2)
        {
            $scope.details = data;
            console.log($scope.details);
            if (data == "app/img/no_image.png")
                return;
            else
                $scope.pop.image = data;
            ngDialog.openConfirm({
                template: 'modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }
        else if(id==3)
        {
            $scope.details = data;
            console.log($scope.details);
            if (data == "app/img/no_image.png")
                return;
            else
                $scope.pop.image = data;
            ngDialog.openConfirm({
                template: 'modalDialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        }
        else if(id==4)
        {
            $scope.details = data;
            console.log($scope.details);
            if (data == "app/img/no_image.png")
                return;
            else
                $scope.pop.image = data;
            ngDialog.openConfirm({
                template: 'modalDialog',
                className: 'ngdialog-theme-default',
                 scope: $scope
            });
        }


    };

    //};
});

