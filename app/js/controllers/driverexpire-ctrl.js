App.controller('driverexpireController', function ($state, $scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getExpiredDriverList = function () {
        var accessToken = $cookieStore.get('accessToken');
        //var i = 0;
        //var j = 0;
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTruckerExpiryDoc',
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
                    var excelArray = [];
                    var custList = response.data.data;
                    //console.log("ss", custList);
                    custList.forEach(function (column) {
                        var d = {};
                        d.fleetOwnerEmail = (column.fleetOwner.length == 1) ? column.fleetOwner[0].email : "--";
                        d.fleetOwnerPhoneNumber = (column.fleetOwner.length == 1) ? column.fleetOwner[0].phoneNumber : "--";
                        d.driverName = column.driverName?column.driverName:'--';
                        d.phoneNumber=column.phoneNumber?column.phoneNumber:'--';
                        d.driverId=column.driverId?column.driverId:'--';
                        d.licenceValidity=column.drivingLicense.validity?moment(column.drivingLicense.validity).format("ll"):"--";
                        d.licenceNumber=column.drivingLicense.drivingLicenseNo?column.drivingLicense.drivingLicenseNo:'--';
                        d.licenceImage = column.drivingLicense.drivingLicenseDoc!=null? column.drivingLicense.drivingLicenseDoc:"--";

                        if(column.drivingLicense.validity)
                        {
                            //console.log(moment(new Date()).format("YYYY-MM-DD"),column.taxToken.ttValidity.split("T")[0]);
                            if(moment(new Date()).format("YYYY-MM-DD") > column.drivingLicense.validity.split("T")[0])
                            {
                                //console.log("expire, pic show");
                                if(column.drivingLicense.drivingLicenseDoc!=null)
                                {var licence_image = d.licenceImage.substr(column.drivingLicense.drivingLicenseDoc.lastIndexOf("."));
                                    if( licence_image==".pdf")
                                        d.licenceImage_html="app/img/adobe_png.png"

                                    else d.licenceImage_html=column.drivingLicense.drivingLicenseDoc;}
                                else {
                                    d.licenceImage_html = "app/img/no_image.png";
                                }

                            }
                            else {
                                //console.log(" not expire, default pic show")
                                d.licenceImage_html="app/img/doc_available.jpg";
                            }
                        }
                        else
                        {
                            //console.log("no date available");
                            d.licenceImage_html="app/img/no_image.png";
                        }



                        dataArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                    //console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable7').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'scrollX': 'true',
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
                if (error == '404' || error == '401') {
                    $state.go('page.404');
                }
                else {
                    $state.go('page.Nointernet');
                }
            });


    };

    getExpiredDriverList();


//===================================================================
//    download images
//===================================================================
    $scope.pop = {};
    $scope.zoom= function (data_get) {
        //console.log("hieee");
        $scope.details = data_get;
        //console.log(data_get.licenceImage)
        if(data_get.licenceImage=="--")
        return;
        else
        $scope.pop.image = data_get.licenceImage;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
//======================================================================
// refresh button
// =====================================================================
    $scope.refresh = function () {
        $state.reload();
    };
//    =================================================================
// export to excel
// ====================================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Trucks_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };
});
