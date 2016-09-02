

var myApp = angular.module('Carrus', ['carrus','angularPayments']);



myApp.run(["$log", function ($log) {
}]);

App.constant("MY_CONSTANT", {

    "url": "http://52.25.204.93:8080",// 3006:client's port, 8080:testing port

});

App.constant("responseCode", {
    "SUCCESS": 200
});
myApp.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

       // window.Stripe.setPublishableKey('pk_live_uG7GJhnmlrxyvrM5HnBRMAmw');
        //pk_test_rqQYt1cmUkEZKFIuHS4ji2ec  live_uG7GJhnmlrxyvrM5HnBRMAmw

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // default route
        $urlRouterProvider.otherwise('/page/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
                controller: ["$rootScope", function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.login', {
                url: '/login',
                title: "Login",
                templateUrl: 'app/pages/login.html',
                resolve: helper.resolveFor('ngDialog')

            })

            .state('page.404', {
                url: '/404',
                title: "Not Found",
                templateUrl: 'app/pages/404.html'
            })

            //App routes
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('modernizr', 'icons', 'screenfull', 'whirl', 'ngDialog')
            })
            .state('app.notifications', {
                url: "/notifications",
                title: 'Notifications',
                templateUrl: helper.basepath('notification-list.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })

            .state('app.dashboard-new', {
                url: '/dashboard-new',
                title: 'Dashboard New',
                templateUrl: helper.basepath('dashboard-new.html'),
                resolve: helper.resolveFor('ngDialog')
            })

            .state('app.enquiry2', {
                url: '/enquiry',
                title: 'Enquiry',
                templateUrl: helper.basepath('enquiry2.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')

            })
            .state('app.editFleet', {
                url: '/editFleet/{fleetId}',
                title: 'Edit Fleet',
                params:
                {
                    fleetId:null
                },
                templateUrl: helper.basepath('edit-fleet-owner.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ui.select')


            })
            .state('app.editTruck', {
                url: '/editTruck/{truckId}/{truckerId}/{typeTruckId}',
                title: 'Edit Truck Profile',
                params:
                {
                    truckId:null,
                    truckerId:null,
                    typeTruckId:null
                },
                templateUrl: helper.basepath('edit-truck-profile.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ui.select')


            })
            .state('app.truckerDetails', {
                url: '{truckerId}',
                title: 'Driver Details',
                params:
                {
                    truckerId:null

                },
                templateUrl: helper.basepath('trucker-details.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ui.select')


            })
            .state('app.editDriver', {
                url: '/editDriver/{driverId}',
                title: 'Edit Driver Profile',
                params:
                {
                    driverId:null

                },
                templateUrl: helper.basepath('edit-driver-profile.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ui.select')


            })
            .state('app.quotes', {
                url: '/quotes/{bidId}',
                title: 'Quotes',
                params:
                {
                    bidId:null
                },
                templateUrl: helper.basepath('quotes.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.typeofcargo', {
                url: '/type_of_cargo',
                title: 'Type of Cargo',
                templateUrl: helper.basepath('typeofcargo.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins')
            })
            .state('app.typeoftruck', {
                url: '/type_of_truck',
                title: 'Type of Truck',
                templateUrl: helper.basepath('typeoftruck.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.partnership', {
                url: '/partnership',
                title: 'Partnership',
                templateUrl: helper.basepath('partnership.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.addCargo', {
                url: '/addCargo',
                title: 'Add Cargo',
                templateUrl: helper.basepath('add-cargo-popup.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')

            })
            .state('app.ongoing_details', {
                url: '/ongoing_details',
                title: 'Details',
                templateUrl: helper.basepath('ongoing_details.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')

            })
            .state('app.shippers', {
                url: '/shippers',
                title: 'Shippers',
                templateUrl: helper.basepath('shippers.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')

            })
            .state('app.past', {
                url: '/past',
                title: 'Past Shipments',
                templateUrl: helper.basepath('past.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.upcoming', {
                url: '/upcoming',
                title: 'Upcoming Shipments',
                templateUrl: helper.basepath('upcoming.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.ongoing', {
                url: '/ongoing',
                title: 'Ongoing Shipments',
                templateUrl: helper.basepath('ongoing.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.fleet_owners', {
                url: '/fleet_owners',
                title: 'Fleet Owners',
                templateUrl: helper.basepath('fleet_owners.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog'),



    })
            .state('app.all_fleet_owners', {
                url: '/all_fleet_owners',
                title: 'All Fleet Owners',
                params:
                {
                    fleetId:null
                },
                templateUrl: helper.basepath('all_fleet_owners.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')


            })
            .state('app.truckexpire', {
                url: '/truck_expire',
                title: 'Truck Expire',
                templateUrl: helper.basepath('truckexpire.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })
            .state('app.driverexpire', {
                url: '/driver_expire',
                title: 'Driver Expire',
                templateUrl: helper.basepath('driverexpire.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })


        .state('app.trucks', {
                url: '/trucks',
                title: 'Trucks',
                templateUrl: helper.basepath('trucks.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog'),

            })
            .state('app.drivers', {
                url: '/drivers',
                title: 'Drivers',
                templateUrl: helper.basepath('drivers.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog'),

            })
            .state('app.payments', {
                url: '/payments',
                title: 'Payments',
                templateUrl: helper.basepath('payments.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog'),

            })


            .state('app.all_shipments_list', {
                url: '/all_shipments_list',
                title: 'All Shipments ',
                templateUrl: helper.basepath('all_shipments_list.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })

            .state('app.feedback', {
                url: '/feedback',
                title: 'Feedback',
                templateUrl: helper.basepath('feedback.html'),
                resolve: helper.resolveFor('datatables', 'datatables-pugins','ngDialog')
            })


        /**=========================================================
         * Conversion of Date & Time Format common factory
         =========================================================*/
        App.factory('convertdatetime', function () {
            return {

                convertDate: function (DateTime) {
                    var _utc = new Date(DateTime);
                    if (_utc.getUTCMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getUTCMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getUTCMonth()) + 1;
                    }
                    if (_utc.getUTCDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getUTCDate()) + 1);
                    } else {
                        day = parseInt(_utc.getUTCDate()) + 1;
                    }
                    var _utc = _utc.getUTCFullYear() + "-" + month + "-" + day;
                    return _utc;
                },

                convertPromoDate: function (DateTime) {
                    //if (dateTime) {
                    //    var date = dateTime;
                    //    if(!date.getTime()){
                    //        var str = dateTime.replace(/-/g,'/');
                    //        date = new Date(str);
                    //    }
                    //    var off_to_deduct = date.getTimezoneOffset();
                    //    date = new Date( date.getTime() + (off_to_deduct * 60000));
                    //
                    //    var date_appointment = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();


                    // }

                    var _utc = new Date(DateTime);
                    if (_utc.getMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getMonth() + 1);
                    }
                    if (_utc.getDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getDate()));
                    } else {
                        day = parseInt(_utc.getDate());
                    }
                    var _utc = _utc.getFullYear() + "-" + month + "-" + day;
                    return _utc;
                },


                convertDateTime: function (DateTime) {
                    var actualEndTimeDate = DateTime.split("T")[0];
                    var actualEndTimeTime = DateTime.split("T")[1];
                    var actualEndTimeDateString = actualEndTimeDate.split("-");
                    var finalEndDate = actualEndTimeDateString[1] + "/" + actualEndTimeDateString[2] + "/" + actualEndTimeDateString[0];
                    var actualEndTimeTimeString = actualEndTimeTime.split(".")[0];
                    actualEndTimeTimeString = actualEndTimeTimeString.split(":");
                    var actualEndsuffix = actualEndTimeTimeString[0] >= 12 ? "PM" : "AM",
                        actualEndhours12 = actualEndTimeTimeString[0] % 12;
                    var actualEnddisplayTime1 = actualEndhours12 + ":" + actualEndTimeTimeString[1] + " " + actualEndsuffix;
                    var actualEnddisplayTime = finalEndDate + " " + actualEnddisplayTime1;
                    return actualEnddisplayTime;
                },
                convertTime: function (time) {
                    var startTimeHours = time.split(":")[0];
                    var startTimeMinutes = time.split(":")[1];
                    var startsuffix = startTimeHours >= 12 ? "PM" : "AM",
                        starthours12 = startTimeHours % 12;
                    var startdisplayTime = starthours12 + ":" + startTimeMinutes + " " + startsuffix;
                    return startdisplayTime
                },
                localOffset: function () {
                    var date = new Date();
                    //var localOffset = date.getTimezoneOffset() * 60000;
                    var localOffset = (-1) * date.getTimezoneOffset();
                    //var stamp = Math.round(new Date(localOffset).getTime());
                    return localOffset;
                },
                convertCalendarDate: function (DateTime) {

                    /*Convert datetime in proper format*/
                    DateTime = DateTime + ":00";
                    var date_split = DateTime.split("/");
                    DateTime = date_split[0] + "-" + date_split[1] + "-" + date_split[2];

                    /*Convert datetime in utc format*/
                    var _utc = new Date(DateTime);
                    if (_utc.getUTCMonth().toString().length == 1) {
                        var month = "0" + (parseInt(_utc.getUTCMonth()) + 1);
                    } else {
                        month = parseInt(_utc.getUTCMonth()) + 1;
                    }
                    if (_utc.getUTCDate().toString().length == 1) {
                        var day = "0" + (parseInt(_utc.getUTCDate()));
                    } else {
                        day = parseInt(_utc.getUTCDate());
                    }

                    if (_utc.getUTCHours().toString().length == 1) {
                        var hour = "0" + (parseInt(_utc.getUTCHours()));
                    } else {
                        hour = parseInt(_utc.getUTCHours());
                    }
                    if (_utc.getUTCMinutes().toString().length == 1) {
                        var min = "0" + (parseInt(_utc.getUTCMinutes()));
                    } else {
                        min = parseInt(_utc.getUTCMinutes());
                    }
                    if (_utc.getUTCSeconds().toString().length == 1) {
                        var sec = "0" + (parseInt(_utc.getUTCSeconds()));
                    } else {
                        sec = parseInt(_utc.getUTCSeconds());
                    }
                    var _utc = _utc.getUTCFullYear() + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
                    return _utc;
                }
            };
        });
        /**=========================================================
         * Categories Function
         =========================================================*/
        //App.factory('getCategories', function (MY_CONSTANT) {
        //    //var categoryArr = [];
        //    return {
        //
        //        category: function (list) {
        //            var servicesArr = [];
        //            list.forEach(function (list_column) {
        //                servicesArr.push(list_column);
        //            });
        //            var services = servicesArr.toString();
        //            var service_list = services.replace(/,/g, " + ");
        //            return service_list;
        //        },
        //        service_category: function (list) {
        //            var servicesArr = [];
        //            var list_cat = list.toString().split(",");
        //            list_cat.forEach(function (list_column) {
        //                if (list_column == 1) {
        //                    var category = MY_CONSTANT.CATEGORY1;
        //                } else if (list_column == 2) {
        //                    category = MY_CONSTANT.CATEGORY2;
        //                } else if (list_column == 3) {
        //                    category = MY_CONSTANT.CATEGORY3;
        //                } else if (list_column == 4) {
        //                    category = MY_CONSTANT.CATEGORY4;
        //                } else if (list_column == 5) {
        //                    category = MY_CONSTANT.CATEGORY5;
        //                } else if (list_column == 6) {
        //                    category = MY_CONSTANT.CATEGORY6;
        //                } else if (list_column == 7) {
        //                    category = MY_CONSTANT.CATEGORY7;
        //                } else if (list_column == 8) {
        //                    category = MY_CONSTANT.CATEGORY8;
        //                } else if (list_column == 9) {
        //                    category = MY_CONSTANT.CATEGORY9;
        //                }
        //                servicesArr.push(category);
        //            });
        //            var services = servicesArr.toString();
        //            var service_list = services.replace(/,/g, " + ");
        //            return service_list;
        //        },
        //        getListFormat: function (list) {
        //            var list_unstyled = list.toString();
        //            var list_styled = list_unstyled.replace(/,/g, " + ");
        //            return list_styled;
        //        },
        //        getCategoryListForEditArtist: function (list) {
        //            var categoryArr = [];
        //            console.log(list);
        //            for (var i = 0; i < list.length; i++) {
        //                categoryArr.push(list[i].value);
        //            }
        //            var list_category = categoryArr.toString();
        //            return list_category;
        //        }
        //    };
        //})

        /**=========================================================
         * Provides a simple demo for bootstrap datepicker
         =========================================================*/

        App.controller('DatepickerDemoCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();

            $scope.clear = function () {
                $scope.dt = null;
            };

            // Disable weekend selection
            //$scope.disabled = function (date, mode) {
            //    //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            //};

            $scope.toggleMin = function () {
                $scope.minDate = $scope.minDate ? null : new Date();
            };
            $scope.toggleMin();

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=============================================================
         * Provides a simple demo for bootstrap datepicker for reports
         =============================================================*/

        App.controller('DatepickerReportsCtrl', ['$scope', function ($scope) {
            $scope.today = function () {
                $scope.dt = new Date();
            };
            $scope.today();
            //$scope.maxDate = new Date();

            $scope.clear = function () {
                $scope.dt = null;
            };

            $scope.open = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.dateOptions = {
                formatYear: 'yy',
                startingDay: 1
            };

            $scope.initDate = new Date('2016-15-20');
            $scope.formats = ['yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            $scope.format = $scope.formats[0];

        }]);

        /**=========================================================
         * Provides a simple demo for buttons actions
         =========================================================*/

        App.controller('ButtonsCtrl', ['$scope', function ($scope) {

            $scope.radioModel = 'Left';

        }]);

        /**=========================================================
         * Initializes the masked inputs
         =========================================================*/

        App.directive('masked', function () {
            return {
                restrict: 'A',
                controller: ["$scope", "$element", function ($scope, $element) {
                    var $elem = $($element);
                    if ($.fn.inputmask)
                        $elem.inputmask();
                }]
            };
        });

        /**=========================================================
         * Module: now.js
         * Provides a simple way to display the current time formatted
         =========================================================*/

        App.directive("now", ['dateFilter', '$interval', function (dateFilter, $interval) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {

                    var format = attrs.format;

                    function updateTime() {
                        var dt = dateFilter(new Date(), format);
                        element.text(dt);
                    }

                    updateTime();
                    $interval(updateTime, 1000);
                }
            };
        }]);

        /**=========================================================
         * Module: flot.js
         * Initializes the Flot chart plugin and handles data refresh
         =========================================================*/

        App.directive('flot', ['$http', '$timeout', function ($http, $timeout) {
            'use strict';
            return {
                restrict: 'EA',
                template: '<div></div>',
                scope: {
                    dataset: '=?',
                    options: '=',
                    series: '=',
                    callback: '=',
                    src: '='
                },
                link: linkFunction
            };

            function linkFunction(scope, element, attributes) {
                var height, plot, plotArea, width;
                var heightDefault = 220;

                plot = null;

                width = attributes.width || '100%';
                height = attributes.height || heightDefault;

                plotArea = $(element.children()[0]);
                plotArea.css({
                    width: width,
                    height: height
                });

                function init() {
                    var plotObj;
                    if (!scope.dataset || !scope.options) return;
                    plotObj = $.plot(plotArea, scope.dataset, scope.options);
                    scope.$emit('plotReady', plotObj);
                    if (scope.callback) {
                        scope.callback(plotObj, scope);
                    }

                    return plotObj;
                }

                function onDatasetChanged(dataset) {
                    if (plot) {
                        plot.setData(dataset);
                        plot.setupGrid();
                        return plot.draw();
                    } else {
                        plot = init();
                        onSerieToggled(scope.series);
                        return plot;
                    }
                }

                scope.$watchCollection('dataset', onDatasetChanged, true);

                function onSerieToggled(series) {
                    if (!plot || !series) return;
                    var someData = plot.getData();
                    for (var sName in series) {
                        angular.forEach(series[sName], toggleFor(sName));
                    }

                    plot.setData(someData);
                    plot.draw();

                    function toggleFor(sName) {
                        return function (s, i) {
                            if (someData[i] && someData[i][sName])
                                someData[i][sName].show = s;
                        };
                    }
                }

                scope.$watch('series', onSerieToggled, true);

                function onSrcChanged(src) {

                    if (src) {

                        $http.get(src)
                            .success(function (data) {

                                $timeout(function () {
                                    scope.dataset = data;
                                });

                            }).error(function () {
                                $.error('Flot chart: Bad request.');
                            });

                    }
                }

                scope.$watch('src', onSrcChanged);
            }

        }]);

    }]);
