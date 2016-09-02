App.controller('trucksexpireController', function ($state, $scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getExpiredTruckList = function () {
        var accessToken = $cookieStore.get('accessToken');
        //var i = 0;
        //var j = 0;
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTruckExpiryDoc',
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
                    var excelArray = [];
                    var custList = response.data.data;
                    //console.log("ss", custList);
                    custList.forEach(function (column) {
                        var d = {};
                        d.fleetOwnerEmail = (column.fleetOwner.length == 1) ? column.fleetOwner[0].email : "--";
                        d.fleetOwnerPhoneNumber = (column.fleetOwner.length == 1) ? column.fleetOwner[0].phoneNumber : "--";
                        d.truckNumber = column.truckNumber?column.truckNumber:'--';
                        d.truckName = column.truckName?column.truckName:'--';
                        d.model = column.model?column.model:'--';
                        d.typeTruck=column.typeTruck[0].typeTruckName?column.typeTruck[0].typeTruckName:'--';
                        console.log("type of truck",d.typeTruck);
                        d.manufactureDate = column.manufactureDate?column.manufactureDate:'--';
                        d.truckoem = column.oem?column.oem:'--';
                        d.createdAt = column.createdAt?moment(column.createdAt).format("ll"):'--';
                        d.typeTruckName = column.typeTruck.typeTruckName?column.typeTruck.typeTruckName:'--';
                        d.ttValidity =column.taxToken.ttValidity?column.taxToken.ttValidity.split("T")[0]:"--";
                        d.fcValidity =column.fitnessCertificate.fcValidity?column.fitnessCertificate.fcValidity.split("T")[0]:"--";
                        d.rcValidity = column.registrationCertificate.rcValidity?column.registrationCertificate.rcValidity.split("T")[0]:"--";
                        d.npValidity =column.notionalPermit.npValidity?column.notionalPermit.npValidity.split("T")[0]:"--";
                        d.insuranceValidity=column.insurance.validity?column.insurance.validity.split("T")[0]:'--';
                        d.insurancePolicy=column.insurance.policy?column.insurance.policy:'--';
                        d.insuranceCompany=column.insurance.company?column.insurance.company:'--';
                        d.ttDoc = column.taxToken.ttDoc!=null? column.taxToken.ttDoc:"--";
                        if(column.taxToken.ttValidity)
                        {
                        //console.log(moment(new Date()).format("YYYY-MM-DD"),column.taxToken.ttValidity.split("T")[0]);
                            if(moment(new Date()).format("YYYY-MM-DD") > column.taxToken.ttValidity.split("T")[0])
                            {
                                //console.log("expire, pic show");
                                if (column.taxToken.ttDoc != null)
                                {
                                    var ttdoc_image = d.ttDoc.substr(column.taxToken.ttDoc.lastIndexOf("."));
                                    //console.log(ttdoc_image);
                                    if (ttdoc_image == ".pdf")
                                        d.ttdoc_html = "app/img/adobe_png.png";

                                    else d.ttdoc_html = column.taxToken.ttDoc;
                                }
                                else {
                                 d.ttdoc_html = "app/img/no_image.png";
                                }

                            }
                            else {
                                //console.log(" not expire, default pic show")
                            d.ttdoc_html="app/img/doc_available.jpg";
                            }
                        }
                         else
                        {
                            //console.log("no date available");
                            d.ttdoc_html="app/img/no_image.png";
                        }

                        d.fcDoc = column.fitnessCertificate.fcDoc!=null ?column.fitnessCertificate.fcDoc:'--';
                        if(column.fitnessCertificate.fcValidity)
                        {
                        //console.log(moment(new Date()).format("YYYY-MM-DD"),column.fitnessCertificate.fcValidity.split("T")[0]);
                            if(moment(new Date()).format("YYYY-MM-DD") > column.fitnessCertificate.fcValidity.split("T")[0])
                            {
                                //console.log("expire, pic show");
                                if(column.fitnessCertificate.fcDoc!=null)
                                { var fcdoc_image = d.fcDoc.substr(column.fitnessCertificate.fcDoc.lastIndexOf("."));
                                    //console.log(ttdoc_image);
                                    if (fcdoc_image == ".pdf")
                                        d.fcdoc_html = "app/img/adobe_png.png"

                                    else d.fcdoc_html = column.fitnessCertificate.fcDoc;}

                                else {
                                    d.fcdoc_html = "app/img/no_image.png";
                                }

                            }
                            else {
                                //console.log(" not expire, default pic show")
                                d.fcdoc_html="app/img/doc_available.jpg";
                            }
                        }
                        else
                        {
                            //console.log("no date available");
                            d.fcdoc_html="app/img/no_image.png";
                        }

                        //console.log(column.fitnessCertificate);


                        d.rcDoc = column.registrationCertificate!=null?column.registrationCertificate.rcDoc:'';
                        if(column.registrationCertificate.rcValidity)
                        {
                            //console.log(moment(new Date()).format("YYYY-MM-DD"),column.fitnessCertificate.fcValidity.split("T")[0]);
                            if(moment(new Date()).format("YYYY-MM-DD") > column.registrationCertificate.rcValidity.split("T")[0])
                            {
                                //console.log("expire, pic show");
                                if(column.registrationCertificate.rcDoc!=null)
                                { var rcdoc_image = d.rcDoc.substr(column.registrationCertificate.rcDoc.lastIndexOf("."));
                                    //console.log(ttdoc_image);
                                    if (rcdoc_image == ".pdf")
                                        d.rcdoc_html = "app/img/adobe_png.png"

                                    else d.rcdoc_html = column.registrationCertificate.rcDoc;
                                }
                                else {
                                    d.rcdoc_html = "app/img/no_image.png";
                                }

                            }
                            else {
                                //console.log(" not expire, default pic show")
                                d.rcdoc_html="app/img/doc_available.jpg";
                            }
                        }
                        else
                        {
                            //console.log("no date available");
                            d.rcdoc_html="app/img/no_image.png";
                        }


                        d.npDoc = column.notionalPermit1=null?column.notionalPermit.npDoc:"--";
                        if(column.notionalPermit.npValidity)
                        {
                            //console.log(moment(new Date()).format("YYYY-MM-DD"),column.fitnessCertificate.fcValidity.split("T")[0]);
                            if(moment(new Date()).format("YYYY-MM-DD") > column.notionalPermit.npValidity.split("T")[0])
                            {
                                //console.log("expire, pic show");
                                if(column.notionalPermit1=null)
                                { var npdoc_image = d.rcDoc.substr(column.notionalPermit.npDoc.lastIndexOf("."));
                                    //console.log(ttdoc_image);
                                    if (npdoc_image == ".pdf")
                                        d.npdoc_html = "app/img/adobe_png.png"

                                    else d.npdoc_html = column.notionalPermit.npDoc;
                                }

                                else {
                                    d.npdoc_html = "app/img/no_image.png";
                                }

                            }
                            else {
                                //console.log(" not expire, default pic show")
                                d.npdoc_html="app/img/doc_available.jpg";
                            }
                        }
                        else
                        {
                            //console.log("no date available");
                            d.npdoc_html="app/img/no_image.png";
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

    getExpiredTruckList();


//===================================================================
//    download images
//    ===============================================================
    $scope.pop = {};
    $scope.zoom_ttdoc = function (data_get) {
        //console.log(data_get.ttDoc);
        $scope.details = data_get;
        if(data_get.ttDoc== "--")
        return;
        else
        $scope.pop.image = data_get.ttDoc;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
//======================================================================
    $scope.pop = {};
    $scope.zoom_npdoc = function (data_get) {
        //console.log(data_get.npDoc);
        $scope.details = data_get
        if(data_get.npDoc=='--')
        return;
        else
        $scope.pop.image = data_get.npDoc;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
//===================================================================
    $scope.pop = {};
    $scope.zoom_fcdoc = function (data_get) {
        //console.log(data_get.fcDoc);
        $scope.details = data_get;
        if(data_get.fcDoc=="--")
        return;
        else
        $scope.pop.image = data_get.fcDoc;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
//======================================================================
    $scope.pop = {};
    $scope.zoom_rcdoc = function (data_get) {
        //console.log(data_get.rcDoc);
        $scope.details = data_get;
        if(data_get.rcDoc==null)
        return;
        else
        $scope.pop.image = data_get.rcDoc;
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
