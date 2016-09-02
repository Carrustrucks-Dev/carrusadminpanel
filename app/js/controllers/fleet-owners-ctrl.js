App.controller('fleet-ownerController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout,$state, $window, ngDialog) {
    'use strict';
    $scope.loading = false;

    var getFleetOwnerList = function () {

        var accessToken=$cookieStore.get('accessToken');

        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllFleetOwner?review=NOTAPPROVE',
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
                    var custList = response.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d.fleetId=column._id;
                        d.fullName = column.fullName;
                        d.email = column.email;
                        d.phoneNumber = column.phoneNumber;
                        d.areaOfOperation = column.areaOfOperation.length?column.areaOfOperation:"--";
                        d.numberOfTrucks=column.numberOfTrucks;
                        d.companyName=column.companyName;
                        if(column.addressDetails.address ==null || column.addressDetails.address=="0" ||column.addressDetails.address == "null" )
                            d.address = "--";

                        else
                            d.address =column.addressDetails.address;

                        if(column.addressDetails.city== null || column.addressDetails.city=="0")
                            d.city="--";
                        else
                            d.city=column.addressDetails.city;

                        if(column.addressDetails.state== null || column.addressDetails.state=="0")
                            d.state="--";
                        else
                            d.state=column.addressDetails.state;
                        if(column.addressDetails.pinCode == null|| column.addressDetails.pinCode=="0" || column.addressDetails.pinCode=="null")
                            d.pinCode="--";
                        else
                            d.pinCode = column.addressDetails.pinCode;
                        d.typeOfCargo =column.typeOfCargo;
                        if(column.doc)
                        {
                            if (column.doc.panCardNumber == null || column.doc.panCardNumber == "" || column.doc.panCardNumber=="false" )
                                d.panCardNumber="--";
                            else
                                d.panCardNumber = column.doc.panCardNumber;
                        }
                        else
                            d.panCardNumber="--";



                        if(column.doc)
                        {
                            if (column.doc.serviceTaxNumber == null || column.doc.serviceTaxNumber == "" || column.doc.serviceTaxNumber=="false" )
                                d.serviceTaxNumber="--";
                            else
                                d.serviceTaxNumber = column.doc.panCardNumber;
                        }
                        else
                            d.serviceTaxNumber="--";

                        if(column.doc)
                        {
                            if (column.doc.tinNumber == null || column.doc.tinNumber == "" || column.doc.tinNumber=="false" )
                                d.tinNumber="--";
                            else
                                d.tinNumber = column.doc.panCardNumber;
                        }
                        else
                            d.tinNumber="--";



                        if(column.doc)
                        {
                            if (column.doc.tradeLicenceNumber == null || column.doc.tradeLicenceNumber == "" || column.doc.tradeLicenceNumber=="false" )
                                d.tradeLicenceNumber="--";
                            else
                                d.tradeLicenceNumber = column.doc.tradeLicenceNumber;
                        }
                        else
                            d.tradeLicenceNumber="--";


                        d.status ='Active';
                        if (column.bankDetails.bankName == null || column.bankDetails.bankName == "" || column.bankDetails.bankName=="false" )
                            d.bankName="--";
                        else
                            d.bankName = column.bankDetails.bankName;
                        if (column.bankDetails.accountNumber == null || column.bankDetails.accountNumber == "" || column.bankDetails.accountNumber=="false" )
                            d.accountNumber="--";
                        else
                            d.accountNumber = column.bankDetails.accountNumber;

                        if (column.bankDetails.micrCode == null || column.bankDetails.micrCode == "" || column.bankDetails.micrCode == "false" )
                            d.micr="--";
                        else
                            d.micr = column.bankDetails.micrCode;

                        if (column.bankDetails.rtgsCode == null || column.bankDetails.rtgsCode == "" || column.bankDetails.rtgsCode == "false" )
                            d.rtgs="--";
                        else
                            d.rtgs = column.bankDetails.rtgsCode;


                        d.is_block=column.isBlocked;
                        if(column.consignmentNote == "1")
                            d.consignmentnote="By Admin";
                        else if(column.consignmentNote == "2")
                            d.consignmentnote="By Me";
                        else
                            d.consignmentnote=column.consignmentNote;

                        d.tinImage = column.doc ? column.doc.tin : "";
                        if (column.doc.tin!=null)
                        { var tin_image = d.tinImage.substr(column.doc.tin.lastIndexOf("."));
                            //console.log(tin_image);
                            if(tin_image==".pdf")
                                d.tin_html="app/img/adobe_png.png";
                            else
                                d.tin_html=column.doc.tin;
                        }
                        d.serviceTaxImage = column.doc ? column.doc.serviceTax : "";
                        if (column.doc.serviceTax!=null)
                        { var servicetax_image = d.serviceTaxImage.substr(column.doc.serviceTax.lastIndexOf("."));
                            //console.log(tin_image);
                            if(servicetax_image==".pdf")
                                d.servicetax_html="app/img/adobe_png.png";
                            else
                                d.servicetax_html=column.doc.serviceTax ;
                        }
                        d.panCardImage = column.doc ? column.doc.panCard : '';
                        if (column.doc.panCard!=null)
                        { var pancard_image = d.panCardImage.substr(column.doc.panCard.lastIndexOf("."));
                            console.log("pancard_image",pancard_image);
                            if(pancard_image==".pdf")
                                d.pancard_html="app/img/adobe_png.png";
                            else
                                d.pancard_html=column.doc.panCard ;
                        }
                        d.tradeLicence = column.doc ? column.doc.tradeLicence : '';
                        if (column.doc.tradeLicence!=null)
                        { var tradelicence_image = d.tradeLicence.substr(column.doc.tradeLicence.lastIndexOf("."));

                            if(tradelicence_image==".pdf")
                                d.tradelicence_html="app/img/adobe_png.png";
                            else
                                d.tradelicence_html=column.doc.tradeLicence ;
                        }

                        dataArray.push(d);
                        excelArray.push(d);

                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                    console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable5').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
                            'scrollX':true,
                            "scrollY": '50vh',
                            "sScrollX": "100%",
                            "sScrollXInner": "150%",
                            "bScrollCollapse": true,
                            'searching': true,
                            'info': true,
                            // Bottom left status text
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

    getFleetOwnerList();
    //image download=================================================================================================
    $scope.pop = {};
    $scope.zoom_pan = function (data_get) {
         $scope.details = data_get;
        if (data_get.panCardImage != null) {
            $scope.pop.image = data_get.panCardImage;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //================================================================================================================
    $scope.pop = {};
    $scope.zoom_tin = function (data_get) {
       $scope.details = data_get;
        if (data_get.tinImage != null) {
            $scope.pop.image = data_get.tinImage;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //================================================================================================================
    $scope.pop = {};
    $scope.zoom_serviceTax = function (data_get) {
         $scope.details = data_get;
        if (data_get.serviceTaxImage != null) {
            $scope.pop.image = data_get.serviceTaxImage;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //================================================================================================================
    $scope.pop = {};
    $scope.zoom_tradeLicence = function (data_get) {
         $scope.details = data_get;
        if (data_get.tradeLicence != null) {
            $scope.pop.image = data_get.tradeLicence;
        }
        else return;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //=================================================================================================================

    // approve==========================================================================================================
$scope.approveStatus=function (email){
    $scope.email=email;
    ngDialog.open({
        template: 'app/views/approved-dialog.html',
        className: 'ngdialog-theme-default',
        scope: $scope
    });

    };
    $scope.approve = function () {
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/admin/approveFleetOwner'+'/{fleetOwnerEmail}' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data: {
                "fleetOwnerEmail":$scope.email,
                "approve": true,

            },
            success: function (data) {
                $state.reload();
                ngDialog.close();

            },
            error: function(){
                alert("Fleet Owner Already Approved");
            }
        });

    };

//approve ends==========================================================================================================

// disapprove===========================================================================================================
    $scope.disapproveStatus=function (email){
        $scope.email1=email;
        ngDialog.open({
            template: 'app/views/disapproved-dialog.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });

    };
    $scope.disapprove = function () {
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/admin/approveFleetOwner/'+'{fleetOwnerEmail}' ,
            //headers: {'authorization': 'bearer' + " " + $cookieStore.get('accessToken')},
            data: {
                "fleetOwnerEmail":$scope.email1,
                "approve": false,

            },
            success: function (data) {
                $state.reload();
                ngDialog.close();


            },
            error: function(){
                alert("Fleet Owner Already Approved");
            }
        });

    };
    // Change Status Dialog===========================================================================================
    $scope.changeStatus = function (status, userid) {
        //console.log(status);
        //console.log(userid);
        $scope.user_val = userid;
        $scope.new_status=status;
        console.log($scope.user_val);
        if (status == 1) {
            $scope.stat = "block";
            $scope.stat_btn = "Block";
            $scope.status = 1;
        }
        else {
            $scope.stat = "unblock";
            $scope.stat_btn = "Unblock";
            $scope.status = 0;
        }
        $scope.value = true;
        $scope.addTeam = {};
        ngDialog.open({
            template: 'app/views/status-dialog-all-fleet-owner.html',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };

    $scope.change = function (is_Blocked, id) {

        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/changeStatusFleetOwner/'+$scope.user_val,
            method: "PUT",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            },
            data:{
                "isBlocked": $scope.new_status
            }

        }).success(function(data,response) {
            console.log(response);
            location.reload();})
    };
    //refresh botton====================================================================================================
    $scope.refresh=function()
    {
        $state.reload();
    };
    // export to excel==================================================================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("New_Fleet_Owner_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };


});


