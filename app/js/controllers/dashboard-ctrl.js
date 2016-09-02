App.controller('DashboardController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, convertdatetime) {
    'use strict';
    //console.log("hello");
    $scope.loading = true;
    $scope.current = {};
    $scope.gross = {};
    $scope.registered = {};
    $scope.customerlist = function () {
        // $http.get(MY_CONSTANT.url + '/api/adminPanel/dashboard' + $cookieStore.get('obj').accesstoken)

        $http({
            url: MY_CONSTANT.url + '/api/adminPanel/dashboard',
            method: "GET",
            headers: {
                'authorization': 'bearer' + " " + $cookieStore.get('accessToken')
            }
        })
            .success(function (data, status) {
                if (status == 200) {
                    console.log(data);
                    $scope.current.todayrevenue = data.data.TodayRevenue;
                    $scope.current.servicescompleted = data.data.todayCompleteAppointment;
                    $scope.current.servicesscheduled = data.data.TodayScheduledAppointment;

                    $scope.gross.totalrevenue = data.data.totalRevenue;
                    $scope.gross.servicescompleted = data.data.totalCompleteAppointment;
                    $scope.gross.servicesscheduled = data.data.totalScheduledAppointment;
                }
                else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
            })
            .error(function (error) {
                //  console.log(error);
            });
    };
    //$scope.customerlist();

    $scope.add = {};
    $scope.maxDate2 = new Date();
    var x = new Date();
    console.log(x);

    $scope.maxDate1 = new Date( x.setDate(x.getDate()-7));

     $scope.add.from_date = $scope.maxDate1;
     $scope.add.to_date = $scope.maxDate2;



    $scope.updateGraph = function (flag) {
        console.log($scope.add.from_date);
        console.log($scope.add.to_date);
        if (!$scope.add.from_date) {
            /*ngDialog.open({
             template: '<p class="del-dialog">Please select start date first !!</p>',
             plain: true,
             className: 'ngdialog-theme-default'

             });*/
            return;
        }
        if (!$scope.add.to_date) {
            /*ngDialog.open({
             template: '<p class="del-dialog">Please select end date first !!</p>',
             plain: true,
             className: 'ngdialog-theme-default'

             });*/
            return false;
        }
        if ($scope.add.to_date < $scope.add.from_date) {
            ngDialog.open({
                template: '<p class="del-dialog">End date must be greater than start date !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        console.log("diff", $scope.add.to_date.getDate() - $scope.add.from_date.getDate());
        if ($scope.add.to_date.getDate() - $scope.add.from_date.getDate() < 7) {
            ngDialog.open({
                template: '<p class="del-dialog">There should be a difference of 7 days !!</p>',
                plain: true,
                className: 'ngdialog-theme-default'

            });
            return false;
        }
        var from_date = convertdatetime.convertDate($scope.add.from_date);
        var to_date = convertdatetime.convertDate($scope.add.to_date);
        $http({
            url: MY_CONSTANT.url + '/api/adminPanel/AppointmentGraph?currentDate=2015-11-24&startDate=' + from_date + '&endDate=' + to_date,
            method: "GET",
            headers: {
                'authorization': 'bearer' + " " + $cookieStore.get('accessToken')
            }
        })
            .success(function (response, status) {
                if (status == 200) {
                    console.log(response);
                    /*$scope.graphData =
                     [
                     {
                     //"label":"XYZ",
                     //"color":"red",
                     "data1": []
                     }
                     //{
                     //    "label":"XYZ",
                     //    "color":"red",
                     //    "data1":[]
                     //}

                     ];*/
                    var i;
                    var date;

                    $scope.graphData = [{
                        "series": ["Revenue"],
                        "color": "#9cd159",
                        "labels": [],
                        "data": []
                    },
                        {
                            series2: ["Bookings"],
                            "color": "#9cd159",
                            "labels2": [],
                            "data2": []

                        }
                    ];

                    for (i = 0; i < response.data.DateBetweenEarningPrice.length; i++) {
                        var temp =new Date(response.data.DateBetweenEarning[i]._id);
                        var mnth =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

                        //date=convertdatetime.convertDate(response.data.DateBetweenEarningPrice[i]._id);
                        $scope.graphData[0].labels.push(x.getDate()+" "+ mnth[x.getMonth()]+", "+ x.getFullYear());
                        $scope.graphData[0].data.push(response.data.DateBetweenEarningPrice[i].Totalappointment);

                    }
                    console.log($scope.graphData);
                    $scope.series = $scope.graphData[0].series;
                    $scope.labels = $scope.graphData[0].labels;
                    $scope.barData1 = [$scope.graphData[0].data];
                    $scope.barOptions1 = {
                        series: {
                            bars: {
                                align: 'center',
                                lineWidth: 0,
                                show: true,
                                barWidth: 0.6,
                                fill: 0.9
                            }
                        },
                        grid: {
                            borderColor: '#eee',
                            borderWidth: 1,
                            hoverable: true,
                            backgroundColor: '#fcfcfc '
                        },
                        tooltip: true,
                        tooltipOpts: {
                            content: function (label, x, y) {
                                return x + ' : ' + y;
                            }
                        },
                        xaxis: {
                            tickColor: '#fcfcfc ',
                            mode: 'categories'
                        },
                        //yaxis: {
                        //    position: ($scope.app.layout.isRTL ? 'right' : 'left'),
                        //    tickColor: '#eee'
                        //},
                        shadowSize: 0
                    };


                }
                else {
                    alert("Something went wrong, please try again later.");
                    return false;
                }
                for (i = 0; i < response.data.DateBetweenEarning.length; i++) {
            //date=convertdatetime.convertDate(response.data.DateBetweenEarningPrice[i]._id);
                    var temp =new Date(response.data.DateBetweenEarning[i]._id);
                    var mnth =  ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

                    $scope.graphData[1].labels2.push(x.getDate()+" "+ mnth[x.getMonth()]+", "+ x.getFullYear());
            $scope.graphData[1].data2.push(response.data.DateBetweenEarning[i].Totalappointment);
        }
        console.log($scope.graphData);
        $scope.series2 = $scope.graphData[1].series2;
        $scope.labels2 = $scope.graphData[1].labels2;
        $scope.barData2 = [$scope.graphData[1].data2];
                $scope.red=[
                    {
                        fillColor:"rgba(0,0,0,0)",
                        strokeColor:"rgba(105,142,172,0.9)"
                    }
                ];
    })
};
    $scope.updateGraph('to');
});

/**=========================================================
 * Module: flot-chart.js
 * Setup options and data for flot chart directive
 =========================================================*/

App.controller('FlotChartController', function ($scope, $http, $cookies, $cookieStore, MY_CONSTANT, $timeout, ngDialog, convertdatetime) {
    'use strict';

});