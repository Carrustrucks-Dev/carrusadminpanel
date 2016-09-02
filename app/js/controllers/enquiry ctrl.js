App.controller('enquiryController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT,$state, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getCustomerList = function () {
        var accessToken=$cookieStore.get('accessToken');
        var i=0;
        var j=0;
        var k;
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllBid',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                console.log(response.data);
                $scope.loading = false;
                // $scope.nationalPermit = data.notionalPermit[0].npDoc;
                if (status == 200) {
                    var dataArray = [];
                    var custList = response.data.data;
                    console.log("ss",custList);
                    custList.forEach(function (column) {
                        var d = {};
                        //createMarker(column)

                        //d.index = index;
                        d.bidId = column._id;
                        d.budget = column.budget;
                        d.note = column.note;
                        //d.truckNumber = column.bid.truck.truckNumber;
                        //d.pickuplocation = column.bid.pickUp.location;
                        //d.pickupdate = column.bid.pickUp.date;
                        //d.dropofflocation = column.bid.dropOff.location;
                        //d.dropoffdate = column.bid.dropOff.date;
                        //d.cargoType = column.bid.cargo.cargoType;
                        //d.cargowt = column.bid.cargo.weight;
                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable4').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,
                            'scrollX':true,// Column ordering
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
                                dtInstance.fnFilter(this.value, columnInputs.index(this));});
                    });
                    $scope.$on('$destroy', function () {
                        dtInstance.fnDestroy();
                        $('[class*=ColVis]').remove();
                    })            } else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                //console.log("sdf");
                $state.go('page.404');
                //if(error=='404' || error=='401')
                //{
                //    $state.go('page.404');
                //}
                //else
                //{
                //    $state.go('page.Nointernet');
                //}
            });


    };

    getCustomerList();
    $scope.pop={};
    $scope.zoom=function(data_get)
    {
        console.log("hieee");
        $scope.details = data_get;
        $scope.pop.image=data_get.profilePicture;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    //refresh button====================================================================================================
    $scope.refresh=function()
    {
        $state.reload();
    };
    //view details======================================================================================================


});

