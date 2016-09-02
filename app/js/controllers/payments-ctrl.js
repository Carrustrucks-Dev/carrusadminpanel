App.controller('Payments-Controller', function ($scope,$state, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getCustomerList = function () {

       //var Token=$cookieStore.get('accessToken');
       // console.log('acc',Token);


        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTransactions',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
            console.log(response.data);
            $scope.loading = false;
            if (status == 200) {

                var dataArray = [];
                var excelArray=[];
                var custList = response.data.transactionLogs;
                console.log('id',custList);
                custList.forEach(function (column) {
                    var d = {};
                    d._id = column._id;

                    d.fullName = column.shipper.firstName+" "+column.shipper.lastName;
                    d.fleetOwner = column.booking.fleetOwner;
                    d.driverName =column.driverDetail[0]? column.driverDetail[0].driverName:'';
                    d.paymentMode= column.booking.paymentMode;
                    d.amount = "Rs "+column.amount;
                    d.createdAt = column.createdAt;
                    d.paymentStatus = column.booking.paymentStatus;
                    dataArray.push(d);
                    excelArray.push(d);
                    $scope.excelList = excelArray;
                });
                $scope.list = dataArray;
                console.log($scope.list);
                var dtInstance;
                $timeout(function () {
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatable9').dataTable({
                        'paging': true,  // Table pagination
                        'ordering': true,// Column ordering
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

    getCustomerList();
    // refresh button================
    $scope.refresh=function()
    {
        $state.reload();
    };
    // export to excel====================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Payment_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };
 
});


