App.controller('ShippersController', function ($scope, $http, $location, $cookies, $state, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog, $sce) {
    'use strict';
    $scope.pdf_image = false;
    $scope.pdf_image1 = false;
    $scope.pdf_RegistrationImage1 = false;
    $scope.pdf_RegistrationImage = false;
    $scope.pdf_ServiceTax = false;
    $scope.nonPdf_ServiceTax = false;
    $scope.pdf_pan = false;
    $scope.nonpdf_pan = false;

    var getShipperList = function () {
        $scope.loading = true;
        var accessToken = $cookieStore.get('obj');
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllShipper',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                $scope.loading = false;
                if (status == 200) {
                    //console.log(response.data);
                    $scope.loading = false;
                    var dataArray = [];
                    var excelArray=[];
                    var custList = response.data.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d.booking_id = column._id;

                        d.name = column.firstName + column.lastName;
                        d.phoneNumber = column.phoneNumber;
                        d.createdAt = column.createdAt.split("T")[0];
                        d.email = column.email;
                        d.companyName = column.companyName? column.companyName:"--";
                        if (column.doc.panCardNumber== "undefined" || column.doc.panCardNumber== null)
                            d.panCardNumber="--";
                        else
                        d.panCardNumber=column.doc.panCardNumber;
                        if (column.doc.panCard) {
                            d.panCard = column.doc.panCard;
                            var pan_image = d.panCard.substr(column.doc.panCard.lastIndexOf("."));
                            //console.log(tin_image);
                            if (pan_image == '.pdf') {
                                $scope.pdf_pan = true;
                                $scope.nonpdf_pan = false;
                                var file = new Blob([column.doc.panCard], {type: 'application/pdf'});
                                var fileUrl = URL.createObjectURL(file);
                                d.subpanCard = $sce.trustAsResourceUrl(fileUrl);
                                d.adobe = 'app/img/adobe.pdf';

                            }
                            else {
                                $scope.pdf_pan = false;
                                $scope.nonpdf_pan = true;
                                d.subpanCard1 = column.doc.panCard;
                            }
                        }
                        else {
                            d.subpanCard1 = 'app/img/no_image.png';
                            d.subpanCard = 'app/img/adobe_png.png';
                            d.adobe = 'app/img/adobe_png.png';
                        }

                        d.tinNumber = column.doc.tinNumber ? column.doc.tinNumber : "--";


                        if (column.doc.tin) {
                            d.tin = column.doc.tin
                            var tin_image = d.tin.substr(column.doc.tin.lastIndexOf("."));
                            //console.log(tin_image);
                            if (tin_image == '.pdf') {
                                $scope.pdf_image = true;
                                $scope.pdf_image1 = false;
                                var file = new Blob([column.doc.tin], {type: 'application/pdf'});
                                var fileUrl = URL.createObjectURL(file);
                                d.subTin = $sce.trustAsResourceUrl(fileUrl);
                                d.adobe = 'app/img/adobe.pdf';

                            }
                            else {
                                $scope.pdf_image = false;
                                $scope.pdf_image1 = true;
                                d.subTin1 = column.doc.tin;
                            }
                        }
                        else {
                            d.subTin1 = 'app/img/no_image.png';
                            d.subTin = 'app/img/adobe_png.png';
                            d.adobe = 'app/img/adobe_png.png';
                        }

                        //console.log("subtin",d.subTin);

                        d.serviceTaxNumber = column.doc.serviceTaxNumber?column.doc.serviceTaxNumber:"--";
                        //d.serviceTax = column.doc.serviceTax;
                        if (column.doc.serviceTax) {
                            d.serviceTax = column.doc.serviceTax;
                            var image_get = d.serviceTax.substr(column.doc.serviceTax.lastIndexOf("."));
                            //console.log(image_get);
                            $scope.nonPdf_ServiceTax = true;
                            if (image_get == ".pdf") {
                                $scope.pdf_ServiceTax = false;
                                $scope.nonPdf_ServiceTax = true;
                                var file = new Blob([column.doc.serviceTax], {type: 'application/pdf'});
                                //console.log(file);
                                var fileUrl = URL.createObjectURL(file);
                                //console.log(fileUrl);
                                //window.open(fileUrl);
                                d.subServiceTax = $sce.trustAsResourceUrl(fileUrl);
                                d.adobe = 'app/img/adobe.pdf';
                            }
                            else {
                                $scope.pdf_ServiceTax = true;
                                $scope.nonPdf_ServiceTax = false;
                                d.subServiceTax1 = column.doc.serviceTax;
                                //console.log("serviceTax",column.doc.serviceTax );
                            }
                        }
                        else {
                            d.subServiceTax1 = 'app/img/no_image.png';
                            d.adobe = 'app/img/adobe.pdf';
                            d.subServiceTax = 'app/img/no_image.png';
                        }


                        d.exciseRegistrationNumber = column.doc.exciseRegistrationNumber?column.doc.exciseRegistrationNumber:"--";


                        if (column.doc.exciseRegistrationDoc) {
                            d.exciseRegistrationDoc = column.doc.exciseRegistrationDoc;
                            var reg_image = d.exciseRegistrationDoc.substr(column.doc.exciseRegistrationDoc.lastIndexOf("."));
                            if (reg_image == ".pdf") {
                                $scope.pdf_RegistrationImage = true;
                                $scope.pdf_RegistrationImage1 = false;
                                var file = new Blob([column.doc.exciseRegistrationDoc], {type: 'application/pdf'});
                                var fileUrl = URL.createObjectURL(file);
                                d.subRegistration = $sce.trustAsResourceUrl(fileUrl);
                            }
                            else {
                                d.subRegistration1 = column.doc.exciseRegistrationDoc;
                                $scope.pdf_RegistrationImage1 = true;
                                $scope.pdf_RegistrationImage = false;
                                d.adobe = 'app/img/adobe.pdf';
                            }
                        }
                        else {
                            d.adobe = 'app/img/adobe.pdf';
                            d.subRegistration1 = 'app/img/no_image.png';
                            d.subRegistration = 'app/img/no_image.png';

                        }


                        if(column.addressDetails.address ==null || column.addressDetails.address=="0" ||column.addressDetails.address == "null" )
                        d.address = "--";

                        else
                            d.address =column.addressDetails.address;

                        if(column.addressDetails.city=="" || column.addressDetails.city=="0")
                            d.city="--";
                        else
                            d.city=column.addressDetails.city;

                       if(column.addressDetails.state== "" || column.addressDetails.state=="0")
                           d.state="--";
                        else
                           d.state=column.addressDetails.state;
                        if(column.addressDetails.pinCode == null|| column.addressDetails.pinCode=="0" || column.addressDetails.pinCode=="null")
                            d.pinCode="--";
                        else
                        d.pinCode = column.addressDetails.pinCode;
                        d.is_blocked = column.isBlocked;
                        dataArray.push(d);
                        excelArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                    //console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable1').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'scrollX': true,
                            "scrollY": '50vh',
                            "sScrollX": "100%",
                            "sScrollXInner": "150%",
                            "bScrollCollapse": true,
                            'searching': true,
                            'info': true,  // Bottom left status text
                            oLanguage: {
                                sSearch: 'Search all columns:',
                                sLengthMenu: '_MENU_ Records per page',
                                info: 'Showing page _PAGE_ of _PAGES_',
                                zeroRecords: 'Nothing found - sorry',
                                infoEmpty: 'No records available',
                                infoFiltered: '(filtered from _MAX_ total records)'
                            },
                            "pageLength": 10
                        });
                        var inputSearchClass = 'datatable_input_col_search';
                        var columnInputs = $('tfoot .' + inputSearchClass);

                        // On input keyup trigger filtering
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
                //console.log(error);
                $state.go('page.404');
                if (error == '404' || error == '401') {
                    $state.go('page.404');
                }
                else {
                    $state.go('page.Nointernet');
                }
            });

    };

    getShipperList();
    //=========================================================================================
    //downloading images
    //=========================================================================================
    $scope.pop = {};
    $scope.zoom_tin = function (data_get) {
        $scope.details = data_get;
        if (data_get.subTin1 != 'app/img/no_image.png') {
            $scope.pop.image = data_get.tin;
        }
        else return;


        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //===================================================================
    $scope.pop = {};
    $scope.zoom_service = function (data_get) {

        $scope.details = data_get;
        if (data_get.subServiceTax1 != 'app/img/no_image.png') {
            $scope.pop.image = data_get.serviceTax;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //======================================================================
    $scope.pop = {};
    $scope.zoom_excise = function (data_get) {

        $scope.details = data_get;
        if (data_get.subRegistration1 != 'app/img/no_image.png') {
            $scope.pop.image = data_get.exciseRegistrationDoc;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
//============================================================================
    $scope.pop = {};
    $scope.zoom_pan = function (data_get) {

        $scope.details = data_get;
        if (data_get.subpanCard1 != 'app/img/no_image.png') {
            $scope.pop.image = data_get.panCard;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

   //==================================================================================================
   // export to csv
   // =================================================================================================

        $scope.exportExcel = function () {
            alasql('SELECT * INTO CSV("Shippers_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
        };
    //=================================================================================================
    // refresh button
    //=================================================================================================
    $scope.refresh = function () {
        $state.reload();
    };


});

