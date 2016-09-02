App.controller('partnershipController', function ($state,$scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.error=false;

    var getCustomerList = function () {
        //var accessToken = $cookieStore.get('accessToken');
        //var i = 0;
        //var j = 0;
        $http.get(MY_CONSTANT.url + '/api/v1/partnership'
            //headers: {
            //    'authorization': $cookieStore.get('accessToken')
            //}
        ).success(function (response, status) {
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
                        d.partnershipName = column.partnershipName;
                        d.status = column.status;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable14').dataTable({
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
    //===add partnership================================================================
    $scope.addNewPartnership=function()
    {
        $scope.error=false;
        ngDialog.open({
            template: 'app/views/add-partnership-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.Partnership=function(partnershipname) {
        if(partnershipname == "" || partnershipname == undefined)
        {
            $scope.error=true;
            return;
        }
        $.ajax({
            type: 'POST',
            url: MY_CONSTANT.url +'/api/v1/partnership',
            headers: {'authorization': $cookieStore.get('accessToken')},
            data: {

                "partnershipName": partnershipname,
            },
            success: function (data) {
                if (data.statusCode == 201) {

                    $scope.$apply();
                    ngDialog.close(0);
                    alert('Data Added');
                    $window.location.reload();


                }
                else
                    alert("Error");
            }
        });
    }
    //change status=========================================
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
            template: 'app/views/status-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };


    $scope.change = function () {
        console.log($scope.status);
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/partnership/changeStatus/'+$scope.user_val,
            headers: {
                authorization: $cookieStore.get("accessToken")
            },
            data:{
                status: $scope.status
            },
        }).success(function(data,response) {
            console.log(response);
            location.reload();
            getCustomerList();

        });


    };
//    update========================================================


    $scope.update=function(userid,name)
    { $scope.user_val=userid;
        $scope.partnershipName=name;
        ngDialog.open({
            template: 'app/views/update-partnership-popup.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

    };
    $scope.updatePartnership = function (partnershipname) {

        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/partnership/'+$scope.user_val,
            headers: {
                authorization: $cookieStore.get("accessToken")
            },
            data:{
                partnershipName: partnershipname
            },
        }).success(function(data,response) {
            setTimeout(function () {
                $scope.$apply();
                ngDialog.close({
                    template: 'app/views/update-partnership-popup.html',
                    className: 'ngdialog-theme-default',
                    showClose: false,
                    scope: $scope
                });
            }, 2000);
            ngDialog.open({
                template: 'app/views/okEditedPartnership-popup.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });

   //$state.reload();
        });


    };

    $scope.edited=function()
    {
        $state.reload();
            ngDialog.close();
    }


});


