App.controller('feedback-Controller', function ($scope, $state, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getCompleteList = function () {

        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllFeedBack',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                console.log(response.data);
                $scope.loading = false;
                if (status == 200) {

                    var dataArray = [];
                    var custList = response.data.data;
                    console.log('id', custList);
                    custList.forEach(function (column) {
                        var d = {};
                        if (column.shipper) {
                            d.shippername = column.shipper.firstName + " " + column.shipper.lastName;
                            d.shipperemail = column.shipper.email;
                            d.shipperphoneNumber = column.shipper.phoneNumber;
                        }
                        else d.shippername = '--';
                        if (column.trucker) {
                            d.truckername = column.trucker.firstName ? column.trucker.firstName : '' + " " + column.trucker.lastName ? column.trucker.lastName : '';
                            d.truckeremail = column.trucker.email?column.trucker.email:'--';
                            d.truckerphoneNumber = column.trucker.phoneNumber;
                        }

                        else d.truckname = '--';
                        if (column.fleetOwner)
                        { d.fleetname = column.fleetOwner.firstName ? column.fleetOwner.firstName : '' + " " + column.fleetOwner.lastName ? column.fleetOwner.lastName : '';
                            d.fleetemail = column.fleetOwner.email;
                            d.fleetphoneNumber = column.fleetOwner.phoneNumber;
                        }
                        else d.fleetname = '--';
                        d.email = column.shipper.email;
                        d.phoneNumber = column.shipper.phoneNumber;
                        d.feedback = column.jobNote;
                        d.truckernote=column.truckerNote;


                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    console.log($scope.list);

                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                console.log(error);
                $state.go('page.404');
                if(error=='404' || error=='401')
                {
                    $state.go('page.404');
                }
                else
                {
                    $state.go('page.Nointernet');
                }
            });


    };

    getCompleteList();
    //refresh botton===============================
    $scope.refresh=function()
    {
        $state.reload();
    };

});


