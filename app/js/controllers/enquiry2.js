
App.controller('enquiry2Controller', function ($scope, $http, $location, $cookies, $stateParams, $cookieStore, MY_CONSTANT, $timeout, $state, $window, ngDialog) {
    'use strict';

    $scope.loading = true;
    $scope.show = false;


    var getEnquiryList = function () {

        var accessToken = $cookieStore.get('accessToken');

        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllBid?limit=' + 0 + '&skip=' + 0,
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                console.log(response.data);
                $scope.loading = false;
                if (status == 200) {

                    var dataArray = [];
                    var excelArray = [];
                    var custList = response.data.data;
                    var i = 0;
                    custList.forEach(function (column) {
                        i++;
                        console.log(i);
                        var d = {};
                        d.bidId = column._id;
                        d.shipper_id = column.shipper._id;
                        d.shipper_name = column.shipper.firstName + " " + column.shipper.lastName;
                        d.shipper_email = column.shipper.email;
                        d.shipper_phone = column.shipper.phoneNumber;
                        d.budget = "Rs" + " " + column.budget;
                        d.note = column.note ? column.note : "--";
                        d.truckType = column.truck.truckType.typeTruckName;

                        d.registerDate = moment(column.createdAt).format("lll");
                        d.truckNumber = column.truck.truckNumber;
                        d.pickuplocation = column.pickUp ? column.pickUp.location ? column.pickUp.location : '--' : '--';
                        d.pickupState = column.pickUp ? column.pickUp.state ? column.pickUp.state : '--' : '--';
                        d.pickupDate = moment(column.pickUp ? column.pickUp.date ? column.pickUp.date : '--' : '--').format("ll");
                        d.pickuptime = column.pickUp ? column.pickUp.time ? column.pickUp.time : '--' : '--';
                        d.dropofflocation = column.dropOff ? (column.dropOff.location ? column.dropOff.location : '--') : '--';

                        d.dropoffState = column.dropOff ? column.dropOff.state ? column.dropOff.state : '--' : '--';
                        d.dropoffDate = moment(column.dropOff ? column.dropOff.date ? column.dropOff.date : '--' : '--').format("ll");
                        d.dropofftime = column.dropOff ? column.dropOff.time ? column.dropOff.time : '--' : '--';
                        d.cargoType = column.cargo.cargoType.typeCargoName;
                        d.cargowt = column.cargo.weight + " " + "Ton";
                        if (column.bidStatus == "QUOTE" || column.bidStatus == "ACTIVE")
                            d.bidStatus = "OPEN";
                        else if (column.bidStatus == "CANCELLED")
                            d.bidStatus = "CANCELLED";
                        else
                            d.bidStatus = "CLOSED";

                        //d.quote=column.acceptQuote.note;

                        dataArray.push(d);
                        excelArray.push(d);


                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;

                    //console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable8').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true, // Column ordering
                            'scrollX': true,
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
                console.log("sdf");
                $state.go('page.404');
                if (error == '404' || error == '401') {
                    $state.go('page.404');
                }
                else {
                    $state.go('page.Nointernet');
                }
            });


    };

    getEnquiryList();
    // refresh button=============================================
    $scope.refresh = function () {
        $state.reload();
    };
// export to excel====================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Enquiry_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };
});


App.controller('getQuoteController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $stateParams, $timeout, $state, $window, ngDialog) {
    var bidId = $stateParams.bidId;
    $scope.flag = false;

    console.log(bidId);
    $http({
        method: 'GET',
        url: MY_CONSTANT.url + '/api/v1/admin/getQuotes?bidId=' + bidId,
        headers: {
            authorization: $cookieStore.get("accessToken")
        }

    }).success(function (data) {
        console.log("ss", $scope.bidId);
        if (data) {
            console.log(data);
            var dataArray = [];
            var custList = data.data.data;
            if (custList == "") {
                $scope.flag = true;
                return;
            }
            else {

                $scope.details = true;
                console.log('hello', data.data.data);
                custList.forEach(function (column) {
                    var d = {};
                    $scope.budget = "Rs " + column.bid.budget ? "Rs " + column.bid.budget : '--';
                    if (column.bid.bidStatus == "CLOSED" || column.bid.bidStatus == "ACTIVE")
                        $scope.bidStatus = "Open";
                    else if (column.bid.bidStatus == "ACCEPTED")
                        $scope.bidStatus = "Closed";
                    else $scope.bidStatus = column.bid.bidStatus;
                    if (column.bid.bidStatus == "CANCELLED" || column.bid.bidStatus == "ACTIVE" || column.bid.bidStatus == "QUOTE") {

                        d.acceptPrice = "--";

                    }
                    else {
                        if (column.bid.fleetOwner === column.fleetOwner._id)
                            d.acceptPrice = "Rs " + column.bid.acceptPrice;
                        else {
                            d.acceptPrice = "Bid Closed";
                        }
                    }


                    $scope.acceptQuote = column.bid._id;
                    d.offerCost = "Rs " + column.offerCost;
                    $scope.quoteStatus = column.quoteStatus;
                    d.fleetId = column.fleetOwner._id;
                    d.fleetEmail = column.fleetOwner.email;
                    d.fleetPhone = column.fleetOwner.phoneNumber;
                    $scope.shipperId = column.shipper._id;
                    $scope.shipperEmail = column.shipper.email;
                    $scope.shipperName = column.shipper.firstName + " " + column.shipper.lastName;
                    $scope.shipperPhone = column.shipper.phoneNumber;


                    dataArray.push(d);
                });
                $scope.list1 = dataArray;
                var dtInstance;
                $timeout(function () {
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable81').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,
                        'scrollX': true,// Column ordering
                        'info': true,  // Bottom left status text
                        'bDestroy': false,
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
                    //dtInstance.fnDestroy();
                    $('[class*=ColVis]').remove();
                })
            }


        }
        else {
            alert("Something went wrong, please try again later.");
            return false;

        }
    });
});
