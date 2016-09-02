App.controller('typeoftruckController', function ($state,$scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.error = false;
$scope.error=false;
    var getCustomerList = function () {
        //var accessToken = $cookieStore.get('accessToken');
        //var i = 0;
        //var j = 0;
        $http({
            url: MY_CONSTANT.url + '/api/v1/typeTruck',
            method: "GET",
            //headers: {
            //    'authorization': $cookieStore.get('accessToken')
            //}
        }).success(function (response, status) {
                console.log(response.data);
                $scope.loading = false;
                // $scope.nationalPermit = data.notionalPermit[0].npDoc;
                if (status == 200) {
                    var dataArray = [];
                    var custList = response.data;
                    console.log("ss", custList);
                    custList.forEach(function (column) {
                        var d = {};

                        d.id = column._id;
                        d.typeTruckName = column.typeTruckName;
                        d.status = column.status;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable13').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'scrollX':'true',
                            "scrollY": '50vh',
                            "sScrollX": "100%",
                            "sScrollXInner": "150%",
                            "bScrollCollapse": true,
                            'info': true,  // Bottom left status text
                            oLanguage: {
                                sSearch: 'Search all columns:',
                                sLengthMenu: '_MENU_ Records per page',
                                info: 'Showing page ?PAGE? of ?PAGES?',
                                zeroRecords: 'Nothing found - sorry',
                                infoEmpty: 'No records available',
                                infoFiltered: '(filtered from ?MAX? total records)'
                            },
                            "pageLength": 10
                        });
                        var inputSearchClass = 'datatable_input_col_search';
                        var columnInputs = $('tfoot .' + inputSearchClass);                    // On input keyup trigger filtering
                        columnInputs
                            .keyup(function () {
                                dtInstance.fnFilter(this.value, columnInputs.index(this));
                            });
                    });
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    })
                } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                //console.log("sdf");
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

    getCustomerList();
    //===add cargo================================================================
    $scope.addTruck=function()
    {
        ngDialog.open({
            template: 'app/views/add-truck-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.Truck=function(truckname) {
        console.log("Function");
        console.log(truckname);
        if(truckname == "" || truckname == undefined)
        {$scope.error=true;
        return;}

        $.ajax({
            type: 'POST',
            url: MY_CONSTANT.url +'/api/v1/typeTruck ',
            headers: {'authorization': $cookieStore.get('accessToken')},
            data: {

                "typeTruckName": truckname
            },
            success: function (data) {
                if (data.statusCode = 200) {

                    $scope.$apply();
                    ngDialog.close(0);
                    alert('Data Added');
                    $window.location.reload();
                    //$scope.error = false;

                }
                else
                    alert("Error");
            },


        });
        //$scope.error = false;
    }
    //==change status================================================================================================================
    $scope.changeStatus = function (status, userid) {
        console.log("aa",status);
        $scope.user_val = userid;
        if (status == "DEACTIVATE") {
            $scope.stat = "activate";
            $scope.stat_btn = "Activate";
            $scope.status = "ACTIVATE";
        }
        else {
            $scope.stat = "deactivate";
            $scope.stat_btn = "Deactivate";
            $scope.status = "DEACTIVATE";
        }
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/status-dialog-truck.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };


    $scope.change = function () {
        console.log($scope.status);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/typeTruck/changeStatus/'+$scope.user_val,
            headers: {
                authorization: $cookieStore.get("accessToken")
            },
            data:{
                status: $scope.status
            }
        }).success(function(data,response) {
            console.log(response);
            location.reload();
            getCustomerList();

        });


    };
    //    update=============================
    $scope.update=function(userid,name)
    { $scope.user_val=userid;
        $scope.truckName=name;
        ngDialog.open({
            template: 'app/views/update-truck-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

    };
    $scope.updateTruck = function (truckname) {

        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/typeTruck/'+$scope.user_val,
            headers: {
                authorization: $cookieStore.get("accessToken")
            },
            data:{
                typeTruckName: truckname
            },
        }).success(function(data,response) {
            setTimeout(function () {
                $scope.$apply();
                ngDialog.close({
                    template: 'app/views/update-truck-popup.html',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }, 2000);
            ngDialog.open({
                template: 'app/views/okEditedTruck-popup.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

        });


    };
    $scope.edited=function()
    {
        $state.reload();
        ngDialog.close();
    }






});


