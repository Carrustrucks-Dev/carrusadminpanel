App.controller('UpcomingController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT,$state, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var    getUpcomingShipmentsList = function () {
        var accessToken=$cookieStore.get('accessToken');
        //var i=0;
        //var j=0;
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllUpComingBookings',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                //console.log(response.data);
                $scope.loading = false;
                // $scope.nationalPermit = data.notionalPermit[0].npDoc;
                if (status == 200) {
                    var dataArray = [];
                    var excelArray=[];
                    var custList = response.data.data;
                    //console.log("ss",custList);
                    custList.forEach(function (column) {
                        var d = {};
                        d.firstName=column.shipper.firstName;
                        d.email=column.shipper.email;
                        d.rating=column.shipper.rating;
                        d.rating= Math.round(d.rating,3);
                        d.tracking=column.tracking;
                        d.driverName = column.trucker?column.trucker.driverName:'--';
                        //if(column.trucker.profilePicture)
                        //console.log(column.trucker.profilePicture.thumb);
                        //else console.log("null");
                        d.profilePicture=column.trucker?(column.trucker.profilePicture?column.trucker.profilePicture.thumb:column.trucker.profilePicture):'app/img/no_image.png';
                        d.pickUp=column.pickUp.companyName +" "+ column.pickUp.name + " "+ column.pickUp.tin + " " + column.pickUp.contactNumber;
                        d.pickaddress=column.pickUp.address +" "+column.pickUp.city +" "+ column.pickUp.state + " "+ column.pickUp.zipCode;
                        d.dropOff=column.dropOff.companyName +" "+ column.dropOff.name + " "+ column.dropOff.tin + " " + column.dropOff.contactNumber;
                        d.dropoffaddress=column.dropOff.address +" "+column.dropOff.city +" "+ column.dropOff.state + " "+ column.dropOff.zipCode;
                        d.pickuptime=column.pickUp.time;
                        d.dropofftime=column.dropOff.time;
                        d.acceptPrice="Rs"+" "+column.acceptPrice;
                        d.cargoType = column.cargo.cargoType.typeCargoName;
                        d.weight = column.cargo.weight+" "+"Ton";
                        d.truckType = column.truck.truckType.typeTruckName;
                        d.truckNumber=column.truck.truckNumber;
                        d.bookingStatus=column.bookingStatus;
                        d.paymentMode=column.paymentMode;
                        d.promoCode="--";
                        d.consigmentNote= column.doc.consigmentNote?column.doc.consigmentNote:'app/img/no_image.png';
                        d.pod= column.pod?column.pod:'app/img/no_image.png';
                        //console.log(dataArray);
                        dataArray.push(d);
                        excelArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                    //console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable3').dataTable({
                            //'fixedColumns': true,
                            'paging': true,  // Table pagination
                            'ordering': true, // Column ordering
                            'scrollX':true,
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

    getUpcomingShipmentsList();
    //===============================================================================
    //download inages
    //================================================================================
    $scope.pop={};
    $scope.zoom_profile=function(data_get)
    {
        console.log("hieee");
        $scope.details = data_get;

 console.log(data_get.profilePicture);
        if((data_get.profilePicture == 'app/img/no_image.png' )||(data_get.profilePicture == null ) || (data_get.profilePicture == " "))
        return;
        else $scope.pop.image=data_get.profilePicture;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //================================================================================
    $scope.pop={};
    $scope.zoom_consign=function(data_get)
    {
        console.log("hieee");
        $scope.details = data_get;
        //console.log(data_get.consigmentNote);
        if(data_get.consigmentNote!='app/img/no_image.png')
        $scope.pop.image=data_get.consigmentNote;
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //==================================================================================
    $scope.pop={};
    $scope.zoom_pod=function(data_get)
    {
        console.log("hieee");
        $scope.details = data_get;
        //console.log(data_get.pod);
        if(data_get.pod!='app/img/no_image.png')
        $scope.pop.image=data_get.pod;
        else return;
        //console.log(data_get.pod);
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //==============================================================================
    // refresh button
    // ===============================================================================
    $scope.refresh=function()
    {
        $state.reload();
    };
//    =====================================================================================
// export to excel
// =========================================================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Upcoming_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };
});


