App.controller('DashboardController', function ($scope, $timeout, $http, $filter, $cookies, $cookieStore, MY_CONSTANT, $state, responseCode, ngDialog) {
    //var date = new Date();
    'use strict';
    $scope.currentDate = moment(new Date()).format('YYYY-MM-DD');
    //console.log("qwr", $scope.currentDate);
    //console.log("month",getmonth());
    // TOTAL ONGOINS SHIPMETS==========================================================================================
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllOnGoingBookings',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {
            $scope.totalOngoingBookings = response.data.total;
            console.log($scope.totalOngoingBookings);
        }
    });

    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllOnGoingBookings?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {
            $scope.todayOngoingBookings = response.data.total;
            console.log("today", $scope.todayOngoingBookings);
        }
    });


//TOTAL TRUCKS==========================================================================================================
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTruck',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.totalTruck = response.data.total;
        }

    });
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTruck?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.todayTruck = response.data.total;
        }

    });
    //TOTAL DRIVERS====================================================================================================
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTrucker ',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.totalTrucker = response.data.total;


        }

    });
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTrucker?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.todayTrucker = response.data.total;


        }

    });
    //TOTAL shippers====================================================================================================
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllShipper ',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.totalShipper = response.data.total;


        }

    });

    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllShipper?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.todayShipper = response.data.total;


        }

    });
    //TOTAL SHIPMENTS================================================================================================
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllBooking ',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.totalShipments = response.data.total;


        }

    });
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllBooking?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.todayShipments = response.data.total;


        }

    });
    //TOTAL PAYMENTS===================================================================================================


    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTransactions',
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.totalPayment = response.data.totalData;
            $scope.totalAmount = response.data.totalAmount;


        }

    });
    $http({

        url: MY_CONSTANT.url + '/api/v1/admin/getAllTransactions?date=' + $scope.currentDate,
        method: "GET",
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }

    }).success(function (response, status) {
        if (status) {

            $scope.todayPayment = response.data.totalData;


        }

    });
    //====================================================================
    //transactons weekly graph
    //====================================================================
    //console.log(new Date().getMonth());

    var url_transaction = MY_CONSTANT.url + '/api/v1/admin/getCountOfTransaction?sortBy=WEEKLY';
    $http.get(url_transaction, {
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }
    })
        .success(function (response) {

            $scope.graphData_weekly = [
                    {
                        "label": "Weekly Payment",
                        "color": "#f5994e",
                        "data": []
                    }

            ];
            //=======pushing zeroes in graphs=======
            console.log(response.data.transactionLogs.length);
           var i;
            for (i = 0; i < response.data.transactionLogs.length; i++) {
                $scope.graphData_weekly[0].data.push([response.data.transactionLogs[i]._id.week + "/" + response.data.transactionLogs[i]._id.month, response.data.transactionLogs[i].count]);
                console.log("in for loop");
            }
            $scope.lineData1 = $scope.graphData_weekly;
            console.log($scope.graphData_weekly);
        })
        .error(function (response, error) {
            $scope.Msg = response.message;
            ngDialog.open({
                template: 'app/views/forcelogout.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        });
    var url1 = MY_CONSTANT.url + '/api/v1/admin/getCountOfTransaction?sortBy=MONTHLY';
    $http.get(url1, {
        headers: {
            'authorization': $cookieStore.get('accessToken')
        }
    })
        .success(function (response) {
            //===================graphs===========
            $scope.graphData_monthly =
                [
                    {
                        "label": "Monthly Payment",
                        "color": "red",
                        "data": []
                    }
                ];

            //push zeroes in yearly graph===
            $scope.month = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var currentMonth=new Date().getMonth()+1;
            var myYear=new Date().getYear()+1900;
            console.log(myYear);
            var differenceMonth = 12 - currentMonth;


            var c = 12;
            var index = [];
            var countMonth = 0;
            $scope.count = 0;

            //console.log(response.data.transactionLogs.length);
            for (var i = currentMonth; i > currentMonth - 12; i--) {
                console.log("i",i);
                index = [];
                if (response.data.transactionLogs.length == 0) {
                    countMonth = 12;
                    console.log("IF")
                    break;
                }
                else {
                    if (i <= 0) {
                        console.log("break");
                        break;
                    }
                    else {
                        console.log("i2",i);
                        c--;
                        countMonth++;
                        for (var j = 0; j < response.data.transactionLogs.length; j++) {
                            if (response.data.transactionLogs[j]._id.month == i && response.data.transactionLogs[j]._id.year == myYear) {
                                $scope.count++;
                                index.push(j);
                                console.log("index",index)
                                console.log("index2",response.data.transactionLogs[j]._id.month)
                                console.log("month",currentMonth)
                            }
                            else {
                                //=====nothing happens=============
                            }
                            $scope.graphArray = [{
                                "data": [],
                            }];
                            $scope.graphArray[0].data[c] = [];
                            //console.log($scope.graphArray);
                            $scope.graphArray[0].data[c][0] = $scope.month[i] + ',' + myYear;
                            $scope.graphArray[0].data[c][1] = 0;
                        }
                        if (index.length == 0) {
                            $scope.graphArray[0].data[c][1] = 0;
                        }
                        else {
                            for (var l = 0; l < index.length; l++) {
                                $scope.graphArray[0].data[c][1] = $scope.graphArray[0].data[c][1] + response.data.transactionLogs[index[l]].count;
                            }
                        }

                    }

                }
            }
            console.log("this year",$scope.graphArray);
            // above:returns all values  of current year===


            //now : evaluating values of prev year===
            var newMonth = 13;
            //console.log(c);
            c=12;
            //console.log(countMonth)
            if (countMonth== 12) {
            //    nothing happens=========
            }
            else {
                console.log(response);
                for (var i = 0; i < 12-currentMonth; i++) {
                    c--;
                   newMonth--;
                     {
                        for (var j = 0; j < response.data.transactionLogs.length; j++) {
                            if (response.data.transactionLogs[j]._id.month == newMonth && response.data.transactionLogs[j]._id.year == myYear - 1) {
                                $scope.count++;
                                index.push(j);
                            }
                            else {
                            //    nothing happens====

                            }
                            $scope.graphArray[0].data[c] = [];
                            $scope.graphArray[0].data[c][0] = $scope.month[newMonth] + ',' + JSON.stringify(myYear - 1);
                            $scope.graphArray[0].data[c][1] = 0;
                        }

                        if (index.length == 0) {
                            $scope.graphArray[0].data[c][1] = 0;
                        }
                        else {
                            for (var l = 0; l < index.length; l++) {
                                $scope.graphArray[0].data[c][1] = $scope.graphArray[0].data[c][1] + response.data.transactionLogs[index[l]].count;
                            }
                        }
                     }
                }
            }
            console.log("previous year",$scope.graphArray);













            //for (var j = 0; j < response.data.transactionLogs.length; j++) {
            //    $scope.graphData_monthly[0].data.push([response.data.transactionLogs[j]._id.month + "/" + response.data.transactionLogs[j]._id.year, response.data.transactionLogs[j].count]);
            //}
            //$scope.lineData2 = $scope.graphData_monthly;
            //console.log($scope.graphData_monthly);
        })
        .error(function (response, error) {
            $scope.Msg = response.message;
            ngDialog.open({
                template: 'app/views/logout.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        });
    //$(function () {
    //    $('#flot-placeholder2').highcharts({
    //        exporting: {
    //            enabled: false
    //        },
    //        credits: {
    //            enabled: false
    //        },
    //        title: {
    //            text: 'Weekly User Logins'
    //        },
    //        xAxis: {
    //            title: {
    //                text: 'Dates',
    //                style: {
    //                    fontWeight: 'bold'
    //                }
    //            },
    //            //categories: $scope.graphData[0].dates
    //        },
    //        yAxis: {
    //            title: {
    //                text: 'Count',
    //                style: {
    //                    fontWeight: 'bold'
    //                }
    //            }
    //        },
    //        legend: {
    //            layout: 'vertical',
    //            align: 'right',
    //            verticalAlign: 'middle',
    //            borderWidth: 0
    //        },
    //        series: [{
    //            name: 'Users',
    //            //data: $scope.graphData[0].users
    //        }, {
    //            name: 'Students',
    //            //data: $scope.graphData[0].students
    //        }, {
    //            name: 'Tutors',
    //            //data: $scope.graphData[0].tutors
    //        }]
    //    });
    //});


//$scope.getshipper_week=function() {
//    var url2 = MY_CONSTANT.url + '/api/v1/admin/getCountOfShipper?sortBy=WEEKLY';
//    $http.get(url2, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.shipper_data = response.data;
//
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//};
//    $scope.getfleet_week=function() {
//        var url3 = MY_CONSTANT.url + '/api/v1/admin/getCountOfFleetOwner?sortBy=WEEKLY';
//        $http.get(url3, {
//                headers: {
//                    'authorization': $cookieStore.get('accessToken')
//                }
//            })
//            .success(function (response) {
//                console.log(response.data);
//                $scope.fleet_data = response.data;
//                //return xyz;
//            })
//            .error(function (response, error) {
//                $scope.Msg = response.message;
//                ngDialog.open({
//                    template: 'app/views/forcelogout.html',
//                    className: 'ngdialog-theme-default',
//                    scope: $scope
//                });
//            });
//    };
//
//    //===========Weekly graph fleet==================
//    $scope.getshipper_week();
//    $scope.getfleet_week();
//    $timeout(function() {
//        console.log($scope.fleet_data);
//        console.log($scope.shipper_data);
//        if ($scope.fleet_data[0]._id.dayOfWeek + "/" + $scope.fleet_data[0]._id.month <= $scope.shipper_data[0]._id.dayOfWeek + "/" + $scope.shipper_data[0]._id.month) {
//            $scope.graphData_weekly =
//                [
//                    {
//                        "label": "Fleet Owner",
//                        "color": "#f5994e",
//                        "data": []
//                    },
//                    {
//                        "label": "Shipper",
//                        "color": "red",
//                        "data": []
//                    }
//                ];
//            var i;
//            for (i = 0; i < $scope.fleet_data.length; i++) {
//                $scope.graphData_weekly[0].data.push([$scope.fleet_data[i]._id.dayOfWeek + "/" + $scope.fleet_data[i]._id.month, $scope.fleet_data[i].count]);
//            }
//
//            for (i = 0; i < $scope.shipper_data.length; i++) {
//                $scope.graphData_weekly[1].data.push([$scope.shipper_data[i]._id.dayOfWeek + "/" + $scope.shipper_data[i]._id.month, $scope.shipper_data[i].count]);
//            }
//            $scope.lineData3 = $scope.graphData_weekly;
//        }
//        else {
//            $scope.graphData_weekly =
//                [
//                    {
//                        "label": "Shipper",
//                        "color": "red",
//                        "data": []
//                    },
//                    {
//                        "label": "Fleet Owner",
//                        "color": "#f5994e",
//                        "data": []
//                    }
//
//                ];
//            for (i = 0; i < $scope.shipper_data.length; i++) {
//                $scope.graphData_weekly[1].data.push([$scope.shipper_data[i]._id.dayOfWeek + "/" + $scope.shipper_data[i]._id.month, $scope.shipper_data[i].count]);
//            }
//            for (i = 0; i < $scope.fleet_data.length; i++) {
//                $scope.graphData_weekly[0].data.push([$scope.fleet_data[i]._id.dayOfWeek + "/" + $scope.fleet_data[i]._id.month, $scope.fleet_data[i].count]);
//            }
//            $scope.lineData3 = $scope.graphData_weekly;
//        }
//    },4000);
//
//    var url4 = MY_CONSTANT.url + '/api/v1/admin/getCountOfShipper?sortBy=MONTHLY';
//    $http.get(url4, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.shipper_data1=response.data;
//
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//
//    var url5 = MY_CONSTANT.url + '/api/v1/admin/getCountOfFleetOwner?sortBy=MONTHLY';
//    $http.get(url5, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.fleet_data1=response.data;
//            //return xyz;
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//    //===========Weekly graph fleet==================\
//    $timeout(function() {
//        if ($scope.fleet_data1[0]._id.month + "/" + $scope.fleet_data1[0]._id.year <= $scope.shipper_data1[0]._id.month + "/" + $scope.shipper_data1[0]._id.year) {
//            $scope.graphData_monthly =
//                [
//                    {
//                        "label": "Fleet Owner",
//                        "color": "#f5994e",
//                        "data": []
//                    },
//                    {
//                        "label": "Shipper",
//                        "color": "red",
//                        "data": []
//                    }
//                ];
//            var i;
//            for (i = 0; i < $scope.fleet_data1.length; i++) {
//                $scope.graphData_monthly[0].data.push([$scope.fleet_data1[i]._id.month + "/" + $scope.fleet_data1[i]._id.year, $scope.fleet_data1[i].count]);
//            }
//
//            for (i = 0; i < $scope.shipper_data1.length; i++) {
//                $scope.graphData_monthly[1].data.push([$scope.shipper_data1[i]._id.month + "/" + $scope.shipper_data1[i]._id.year, $scope.shipper_data1[i].count]);
//            }
//            $scope.lineData4 = $scope.graphData_monthly;
//        }
//        else {
//            $scope.graphData_monthly =
//                [
//                    {
//                        "label": "Shipper",
//                        "color": "red",
//                        "data": []
//                    },
//                    {
//                        "label": "Fleet Owner",
//                        "color": "#f5994e",
//                        "data": []
//                    }
//
//                ];
//            for (i = 0; i < $scope.shipper_data1.length; i++) {
//                $scope.graphData_monthly[1].data.push([$scope.shipper_data1[i]._id.month + "/" + $scope.shipper_data1[i]._id.year, $scope.shipper_data1[i].count]);
//            }
//            for (i = 0; i < $scope.fleet_data.length; i++) {
//                $scope.graphData_monthly[0].data.push([$scope.fleet_data1[i]._id.month + "/" + $scope.fleet_data1[i]._id.year, $scope.fleet_data1[i].count]);
//            }
//            $scope.lineData4 = $scope.graphData_monthly;
//        }
//    },4000);
//
//    var url6 = MY_CONSTANT.url + '/api/v1/admin/getCountOfCompleteBooking?sortBy=WEEKLY';
//    $http.get(url6, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.complete_data=response.data;
//
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//
//    var url7 = MY_CONSTANT.url + '/api/v1/admin/getCountOfConfirmedBooking?sortBy=WEEKLY';
//    $http.get(url7, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.confirmed_data=response.data;
//            //return xyz;
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//
//    $timeout(function(){
//        console.log($scope.confirmed_data);
//        console.log( $scope.complete_data);
//        var i,j;
//        for(i=0;i<$scope.confirmed_data.length&& $scope.complete_data.length;i++) {
//            if ($scope.confirmed_data[i]._id.week + "/" + $scope.confirmed_data[i]._id.month <= $scope.complete_data[i]._id.week + "/" + $scope.complete_data[i]._id.month)
//            {
//                $scope.graphData_weekly =
//                    [
//                        {
//                            "label": "Confirmed Booking",
//                            "color": "#f5994e",
//                            "data": []
//                        },
//                        {
//                            "label": "Complete Booking",
//                            "color": "red",
//                            "data": []
//                        }
//                    ];
//                    for (i = 0; i < $scope.confirmed_data.length; i++) {
//                        $scope.graphData_weekly[0].data.push([$scope.confirmed_data[i]._id.week + "/" + $scope.confirmed_data[i]._id.month, $scope.confirmed_data[i].count]);
//                    }
//
//                    for (i = 0; i < $scope.complete_data.length; i++) {
//                        $scope.graphData_weekly[1].data.push([$scope.complete_data[i]._id.week + "/" + $scope.complete_data[i]._id.month, $scope.complete_data[i].count]);
//                    }
//                    $scope.lineData5 = $scope.graphData_weekly;
//            }
//            else {
//                $scope.graphData_weekly =
//                    [
//                        {
//                            "label": "Complete Booking",
//                            "color": "red",
//                            "data": []
//                        },
//                        {
//                            "label": "Confirmed Booking",
//                            "color": "#f5994e",
//                            "data": []
//                        }
//                    ];
//                    for (i = 0; i < $scope.complete_data.length; i++) {
//                        $scope.graphData_weekly[1].data.push([$scope.complete_data[i]._id.week + "/" + $scope.complete_data[i]._id.month, $scope.complete_data[i].count]);
//                    }
//                    for (i = 0; i < $scope.confirmed_data.length; i++) {
//                        $scope.graphData_weekly[0].data.push([$scope.confirmed_data[i]._id.week + "/" + $scope.confirmed_data[i]._id.month, $scope.confirmed_data[i].count]);
//                    }
//                    $scope.lineData5 = $scope.graphData_weekly;
//            }
//        }
//    },4000);
//
//    var url8 = MY_CONSTANT.url + '/api/v1/admin/getCountOfCompleteBooking?sortBy=MONTHLY';
//    $http.get(url8, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.complete_data1=response.data;
//
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//
//    var url9 = MY_CONSTANT.url + '/api/v1/admin/getCountOfConfirmedBooking?sortBy=MONTHLY';
//    $http.get(url9, {
//            headers: {
//                'authorization': $cookieStore.get('accessToken')
//            }
//        })
//        .success(function (response) {
//            console.log(response.data);
//            $scope.confirmed_data1=response.data;
//            //return xyz;
//        })
//        .error(function (response, error) {
//            $scope.Msg = response.message;
//            ngDialog.open({
//                template: 'app/views/forcelogout.html',
//                className: 'ngdialog-theme-default',
//                scope: $scope
//            });
//        });
//
//    $timeout(function(){
//        console.log($scope.confirmed_data1);
//        console.log( $scope.complete_data1);
//        var i,j;
//        for(i=0;i<$scope.confirmed_data1.length&& $scope.complete_data1.length;i++) {
//            if ($scope.confirmed_data1[i]._id.month + "/" + $scope.confirmed_data1[i]._id.year <= $scope.complete_data1[i]._id.month + "/" + $scope.complete_data1[i]._id.year)
//            {
//                $scope.graphData_monthly =
//                    [
//                        {
//                            "label": "Confirmed Booking",
//                            "color": "#f5994e",
//                            "data": []
//                        },
//                        {
//                            "label": "Complete Booking",
//                            "color": "red",
//                            "data": []
//                        }
//                    ];
//                for (i = 0; i < $scope.confirmed_data1.length; i++) {
//                    $scope.graphData_monthly[0].data.push([$scope.confirmed_data1[i]._id.month + "/" + $scope.confirmed_data1[i]._id.year, $scope.confirmed_data1[i].count]);
//                }
//
//                for (i = 0; i < $scope.complete_data1.length; i++) {
//                    $scope.graphData_monthly[1].data.push([$scope.complete_data1[i]._id.month + "/" + $scope.complete_data1[i]._id.year, $scope.complete_data1[i].count]);
//                }
//                $scope.lineData6 = $scope.graphData_monthly;
//            }
//            else {
//                $scope.graphData_monthly =
//                    [
//                        {
//                            "label": "Complete Booking",
//                            "color": "red",
//                            "data": []
//                        },
//                        {
//                            "label": "Confirmed Booking",
//                            "color": "#f5994e",
//                            "data": []
//                        }
//                    ];
//                for (i = 0; i < $scope.complete_data1.length; i++) {
//                    $scope.graphData_monthly[1].data.push([$scope.complete_data1[i]._id.month + "/" + $scope.complete_data1[i]._id.year, $scope.complete_data1[i].count]);
//                }
//                for (i = 0; i < $scope.confirmed_data.length; i++) {
//                    $scope.graphData_monthly[0].data.push([$scope.confirmed_data1[i]._id.month + "/" + $scope.confirmed_data1[i]._id.year, $scope.confirmed_data1[i].count]);
//                }
//                $scope.lineData6 = $scope.graphData_monthly;
//            }
//        }
//    },4000);
//    $scope.lineOptions1 = {
//        series: {
//            lines: {
//                show: true,
//                fill: 0.01
//            },
//            points: {
//                show: true,
//                radius: 4
//            }
//        },
//        grid: {
//            borderColor: '#eee',
//            borderWidth: 1,
//            hoverable: true,
//            backgroundColor: '#fcfcfc'
//        },
//        tooltip: true,
//        tooltipOpts: {
//            content: function (label, x, y) {
//                return x + ' : ' + y;
//            }
//        },
//        xaxis: {
//            tickColor: '#eee',
//            mode: 'categories'
////categories:['Oct/2015','Nov/2015']
//        },
//        yaxes: [{min: 0}, {
//            alignTicksWithAxis: 1,
//            position: 'right',
//            tickColor: '#eee'
//
//
//        }],
//        shadowSize: 0
//    };
});