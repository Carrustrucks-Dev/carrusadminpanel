App.controller('allfleetownersController', function ($rootScope, $scope, $stateParams, $state, $sce, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;

    var getFleetOwnerList = function () {
        var accessToken = $cookieStore.get('accessToken');
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllFleetOwner?review=APPROVE',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                //console.log(response.data);
                $scope.loading = false;
                if (status == 200) {

                    var dataArray = [];
                    var excelArray = [];
                    var custList = response.data;
                    custList.forEach(function (column) {
                        var d = {};
                        d.fleetId = column._id;
                        d.fullName = column.fullName;
                        d.email = column.email;
                        d.phoneNumber = column.phoneNumber;
                        d.areaOfOperation = column.areaOfOperation.length ? column.areaOfOperation : "--";
                        d.numberOfTrucks = column.numberOfTrucks;
                        d.companyName = column.companyName;
                        d.noOfTrucker = column.truckerCount;
                        if (column.addressDetails.address == null || column.addressDetails.address == "0" || column.addressDetails.address == "null")
                            d.address = "--";

                        else
                            d.address = column.addressDetails.address;

                        if (column.addressDetails.city == null || column.addressDetails.city == "null" || column.addressDetails.city == "0")
                            d.city = "--";
                        else
                            d.city = column.addressDetails.city;

                        if (column.addressDetails.state == null || column.addressDetails.state == "null" || column.addressDetails.state == "0")
                            d.state = "--";
                        else
                            d.state = column.addressDetails.state;
                        if (column.addressDetails.pinCode == null || column.addressDetails.pinCode == "null" || column.addressDetails.pinCode == "0" || column.addressDetails.pinCode == "null")
                            d.pinCode = "--";
                        else
                            d.pinCode = column.addressDetails.pinCode;
                        if (column.consignmentNote == "1")
                            d.consignmentnote = "By Admin";
                        else if (column.consignmentNote == "2")
                            d.consignmentnote = "By Me";
                        else
                            d.consignmentnote = column.consignmentNote;
                        if (column.bankDetails.micrCode == null || column.bankDetails.micrCode == "null" || column.bankDetails.micrCode == "false")
                            d.micr = "--";
                        else
                            d.micr = column.bankDetails.micrCode;

                        if (column.bankDetails.rtgsCode == null || column.bankDetails.rtgsCode == "null" || column.bankDetails.rtgsCode == "false")
                            d.rtgs = "--";
                        else
                            d.rtgs = column.bankDetails.rtgsCode;


                        console.log(column.typeOfCargo.length);
                        //if(column.typeOfCargo.length==0)
                        //    d.typeOfCargo='no cargo name';
                        d.typeOfCargo = column.typeOfCargo;
                        if (column.doc) {
                            if (column.doc.panCardNumber == null || column.doc.panCardNumber == "null" || column.doc.panCardNumber == "undefined" || column.doc.panCardNumber == "false")
                                d.panCardNumber = "--";
                            else
                                d.panCardNumber = column.doc.panCardNumber;
                        }
                        else
                            d.panCardNumber = "--";


                        if (column.doc) {
                            if (column.doc.serviceTaxNumber == null || column.doc.serviceTaxNumber == "null" || column.doc.serviceTaxNumber == "undefined" || column.doc.serviceTaxNumber == "false")
                                d.serviceTaxNumber = "--";
                            else
                                d.serviceTaxNumber = column.doc.serviceTaxNumber;
                        }
                        else
                            d.serviceTaxNumber = "--";


                        if (column.doc) {
                            if (column.doc.tinNumber == null || column.doc.tinNumber == "null" || column.doc.tinNumber == "undefined" || column.doc.tinNumber == "false")
                                d.tinNumber = "--";
                            else
                                d.tinNumber = column.doc.tinNumber;
                        }
                        else
                            d.tinNumber = "--";


                        if (column.doc) {
                            if (column.doc.tradeLicenceNumber == null || column.doc.tradeLicenceNumber == "null" || column.doc.tradeLicenceNumber == "undefined" || column.doc.tradeLicenceNumber == "false")
                                d.tradeLicenceNumber = "--";
                            else
                                d.tradeLicenceNumber = column.doc.tradeLicenceNumber;
                        }
                        else
                            d.tradeLicenceNumber = "--";

                        d.status = 'Active';

                        if (column.bankDetails.bankName == null || column.bankDetails.bankName == "null" || column.bankDetails.bankName == "false")
                            d.bankName = "--";
                        else
                            d.bankName = column.bankDetails.bankName;
                        if (column.bankDetails.accountNumber == null || column.bankDetails.accountNumber == "null" || column.bankDetails.accountNumber == "false")
                            d.accountNumber = "--";
                        else
                            d.accountNumber = column.bankDetails.accountNumber;

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

                        d.is_block = column.isBlocked;
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
                        dtInstance = $('#datatable6').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true,  // Column ordering
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

    getFleetOwnerList();
    //=================================================================
    //download images
    //=================================================================
    $scope.pop = {};
    $scope.zoom_pan = function (data_get) {
        //console.log("pancard",data_get.panCardImage);

        $scope.details = data_get;
        //console.log("pancard",data_get.panCardImage);

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
    //================================================
    $scope.pop = {};
    $scope.zoom_tin = function (data_get) {
        //console.log("pancard",data_get.tinImage);

        $scope.details = data_get;
        //console.log("pancard",data_get.panCardImage);

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
    //==================================================
    $scope.pop = {};
    $scope.zoom_serviceTax = function (data_get) {
        //console.log("pancard",data_get.tinImage);

        $scope.details = data_get;
        //console.log("pancard",data_get.panCardImage);

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
    //=====================================================
    $scope.pop = {};
    $scope.zoom_tradeLicence = function (data_get) {
        //console.log("pancard",data_get.tinImage);

        $scope.details = data_get;
        //console.log("pancard",data_get.panCardImage);

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
    //==============================================================
    // Change Status
    //==============================================================

    $scope.changeStatus = function (status, userid) {
        $scope.user_val = userid;
        $scope.new_status = status;
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
        console.log("id", $scope.user_val);
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/changeStatusFleetOwner/' + $scope.user_val,
            method: "PUT",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            },
            data: {
                "isBlocked": $scope.new_status
            }

        }).success(function (data, response) {
            console.log(response);
            location.reload();
        })
    };
    //===================================================================
    //refresh button
    // ==================================================================

    $scope.refresh = function () {
        $state.reload();
    };

    //===================================================================
    // export to excel
    // ===================================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("All_Fleet_Owner_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };


    //=====================================================================
    //edit button
    // =====================================================================

    $scope.FleetDetails = function (data) {

        $cookieStore.put('Fleet Form', data);
    };
    //------------------------------------cargoType in form-----------------------
    $scope.getcargo = function () {
        $http.get(MY_CONSTANT.url + '/api/v1/typeCargo'
        ).success(function (response, status) {
            $scope.list2 = response.data;
            console.log($scope.list2);
            $cookieStore.put('cargo data', $scope.list2);
            console.log("cargo list", $cookieStore.get('cargo data'))
            //console.log("id",data._id);

        });
    };

    $scope.getcargo();


    console.log("getting cargo list", $cookieStore.get('cargo data'));


});

App.controller('EditFleetController', function ($scope, $http, $rootScope, $location, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {
    'use strict';

    $scope.indian_states = [
        {name: 'Andhra Pradesh', value: 1},
        {name: 'Arunachal Pradesh', value: 2},
        {name: 'Assam', value: 3},
        {name: 'Bihar', value: 4},
        {name: 'Chhattisgarh', value: 5},
        {name: 'Chandigarh', value: 6},
        {name: 'Goa', value: 7},
        {name: 'Gujarat', value: 8},
        {name: 'Haryana', value: 9},
        {name: 'Himachal Pradesh', value: 10},
        {name: 'Jammu & Kashmir', value: 11},
        {name: 'Jharkhand', value: 12},
        {name: 'Karnataka', value: 13},
        {name: 'Kerala', value: 14},
        {name: 'Madhya Pradesh', value: 15},
        {name: 'Maharashtra', value: 16},
        {name: 'Manipur', value: 17},
        {name: 'Meghalaya', value: 18},
        {name: 'Mizoram', value: 19},
        {name: 'Nagaland', value: 20},
        {name: 'Odisha', value: 21},
        {name: 'Punjab', value: 22},
        {name: 'Rajasthan', value: 23},
        {name: 'Sikkim', value: 24},
        {name: 'Tamil Nadu', value: 25},
        {name: 'Tripura', value: 26},
        {name: 'Telangana', value: 27},
        {name: 'Uttarakhand', value: 28},
        {name: 'Uttar Pradesh', value: 29},
        {name: 'West Bengal', value: 30}
    ];

    var count=0;
    $rootScope.selected_state = [];
    $scope.fleet_form = $cookieStore.get('Fleet Form');
    $scope.areaOfOperation_selected = [];
    $scope.selectedOrNot = function (id, isChecked, index, name) {
        //console.log("index:" + index + " " + isChecked);
        var selected_index_state = $scope.indian_states[index].name;
        if (isChecked) {
            $rootScope.selected_state.push(selected_index_state)
            //console.log($rootScope.selected_state)
            array2string($rootScope.selected_state);
        }
        else {
            var index1 = $rootScope.selected_state.indexOf(selected_index_state);
            //console.log(index1)
            if (index1 > -1) {
                $rootScope.selected_state.splice(index1, 1)
                array2string($rootScope.selected_state);
            }            //array2string($rootScope.selected_state);
        }
        //console.log($rootScope.selected_state);
    };
    var array2string = function (data) {
        $rootScope.selected_state1 = [];
        //console.log(data);
        for (var j = 0; j < data.length; j++) {
            $rootScope.selected_state1[j] = data[j];
        }
        //console.log($rootScope.selected_state1);
        convert2string($rootScope.selected_state1);
    }
    var convert2string = function (data) {
        data = data.toString();
        //console.log(data,'calleddfgdfg');
    }

    for (var i = 0; i < 30; i++)
    {
        for(var j=0;j<$scope.fleet_form.areaOfOperation.length;j++){
            if ( $scope.indian_states[i].name != $scope.fleet_form.areaOfOperation[j]){
                count++;
            }
        }
        console.log(count);
        if(count == $scope.fleet_form.areaOfOperation.length){
            $scope.indian_states[i].selected = false;
        }
        else{
            $scope.indian_states[i].selected = true;
            $scope.indian_states[i].checked = true;
            $rootScope.selected_state.push($scope.indian_states[i].name);
            array2string($rootScope.selected_state);
            //$rootScope.selected_state1.push($scope.indian_states[i].name);
        }
        count = 0;
    }

    //==select type of cargo====================================================


    $scope.cargoName = $cookieStore. get('cargo data');
    //console.log($scope.cargoName);
    $rootScope.selected_cargo = [];
    $rootScope.selected_cargo_name = [];
    $scope.selected_cargo = function (id, isChecked, index, name) {
       var selected_index_cargo = $scope.cargoName[index]._id;
        var selected_cargo_name = $scope.cargoName[index].typeCargoName;
        console.log(selected_cargo_name);
        if (isChecked) {
            $rootScope.selected_cargo.push(selected_index_cargo);
            $rootScope.selected_cargo_name.push(selected_cargo_name);
            //console.log($rootScope.selected_cargo)
            array2string_cargo($rootScope.selected_cargo_name);
        }
        else {
            var index1 = $rootScope.selected_cargo.indexOf(selected_index_cargo);
            //console.log(index1)
            if (index1 > -1) {
                $rootScope.selected_cargo.splice(index1, 1)
                array2string_cargo($rootScope.selected_cargo);
            }            //array2string($rootScope.selected_cargo);
        }
        //console.log($rootScope.selected_cargo);
    };
    var array2string_cargo = function (data) {
        $rootScope.selected_cargo1 = [];
        //console.log(data);
        for (var i = 0; i < data.length; i++) {
            $rootScope.selected_cargo1[i] = data[i];
        }
        //console.log($rootScope.selected_cargo1);
        convert2string_cargo($rootScope.selected_cargo1);
    }
    var convert2string_cargo = function (data) {
        data = data.toString();

    }
    //=to select cargo=================================================

    console.log("cargo nameeee",$scope.cargoName);
    console.log("cargo nameeee",$scope.cargoName.length);

    console.log($scope.fleet_form.typeOfCargo.length);
var count1=0;


    for (var i = 0; i <$scope.cargoName.length ; i++) {
        //console.log($scope.cargoName[i].typeCargoName);
        for (var j = 0; j < $scope.fleet_form.typeOfCargo.length; j++) {
            if ($scope.cargoName[i].typeCargoName != $scope.fleet_form.typeOfCargo[j].typeCargoName) {
                count1++;
            }
        }

        console.log(count1);
            if(count1 ==$scope.fleet_form.typeOfCargo.length){
                $scope.cargoName[i].selected = false;
            }
            else{
                $scope.cargoName[i].selected = true;
                $scope.cargoName[i].checked = true;


                $rootScope.selected_cargo.push($scope.cargoName[i]._id);
                $rootScope.selected_cargo_name.push($scope.cargoName[i].typeCargoName);
                array2string_cargo($rootScope.selected_cargo_name);

            }
            count1 = 0;
    }
    for (var j = 0; j <$scope.cargoName.length ; j++)
    {
        console.log(i,$scope.cargoName[j])
    }


    //====type of cargo ends here=======================================================================================

    $("#default").show();
    $("#default1").hide();

    $('#fleetimage').click(function () {
        $("#default1").show();
        $("#default").hide();
    });

    $scope.file_to_upload = function (files) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image;
            $('#default1').attr('src', e.target.result);
            img.onload = function () {
                $scope.Image = files[0];
                //console.log($scope.Image);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    };


    $scope.EditService = function (fleet_form) {
        $scope.loading=true;
        console.log(fleet_form);
        $scope.fleet_form.tradeLicence = $scope.Image;
        var fd = new FormData();
        var areaOfOperation_array = [];
        var typeOfCargo_array = [];
        console.log(fleet_form.areaOfOperation.length);
        for (var i = 0; i < fleet_form.areaOfOperation.length; i++) {
            areaOfOperation_array[i] = fleet_form.areaOfOperation[i];
        }
        console.log(areaOfOperation_array);
        //if ($rootScope.selected_state != '' && typeof $rootScope.selected_state != 'undefined') {
        //    fd.append('areaOfOperation', JSON.stringify($rootScope.selected_state));
        //}
        //else
        //alert(" area of operation can not be empty!");
        fd.append('areaOfOperation', JSON.stringify($rootScope.selected_state));


        console.log(fleet_form.typeOfCargo.length);
        for (var j = 0; j < fleet_form.typeOfCargo.length; j++) {
            typeOfCargo_array[j] = fleet_form.typeOfCargo[j];
        }
        console.log(typeOfCargo_array);
        if ($rootScope.selected_cargo != '' && typeof $rootScope.selected_cargo != 'undefined') {
            fd.append('typeOfCargo', JSON.stringify($rootScope.selected_cargo));
        }
        fd.append('numberOfTrucks', fleet_form.numberOfTrucks);
        fd.append('companyName', fleet_form.companyName);
        fd.append('address', fleet_form.address);
        fd.append('state', fleet_form.state);
        fd.append('city', fleet_form.city);
        fd.append('pinCode', fleet_form.pinCode);


        if (fleet_form.panCardNumber != " " && fleet_form.panCardNumber != '--') {
            var pan_card_no = fleet_form.panCardNumber;
            var panPat = /^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/;
            var code = /([C,P,H,F,A,T,B,L,J,G])/;
            var code_chk = pan_card_no.substring(3,4);
            if (pan_card_no.search(panPat) == -1) {
                $scope.loading=false;
                ngDialog.open({
                            template: '<p class="del-dialog">Please Enter Valid Pan Card Number </p>',
                            plain: true,
                            className: 'ngdialog-theme-default'
                        });
                //Obj.focus();
                return false;
            }
           else if (code.test(code_chk) == false) {
                $scope.loading=false;
                ngDialog.open({
                    template: '<p class="del-dialog">Please Enter Valid Pan Card Number </p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
                return false;
            }
            else {
                fd.append('panCardNumber', fleet_form.panCardNumber);
            }

        }

        fd.append('tradeLicenceNumber', fleet_form.tradeLicenceNumber);
        fd.append('bankName', fleet_form.bankName);
        fd.append('accountNumber', fleet_form.accountNumber);
        fd.append('fleetOwner', fleet_form.fleetId);
        console.log(fd);


        if ($scope.fleet_form.tradeLicence != '' && typeof $scope.fleet_form.tradeLicence != 'undefined') {
            fd.append('tradeLicence', $scope.fleet_form.tradeLicence);
        }


        //-----------------------------form---------------------------------------
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/admin/editFleetOwner ',
            headers: {
                'authorization': $cookieStore.get('accessToken')
            },
            dataType: "json",
            data: fd,
            async: true,
            processData: false,
            contentType: false,
            success: function (data) {
                $scope.loading=false;
                ngDialog.open({
                    template: 'app/views/okEdited-popup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                });

                $scope.$apply();
                //ngDialog.close();
                //$state.go('app.all_fleet_owners');
            },
            error: function ()
                {$scope.loading=false;
                    if(code==401)
                    $state.go('app.logout');
                    else{ngDialog.open({
                        template: '<p class="del-dialog" style="align:center">Please fill all the mandatory fields </p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });}

            }
        });
    };
//edit panel ends here=================================================



//close===================================================
//    $scope.close = function () {
//        $state.go('app.all_fleet_owners')
//    };



//    =================================================================
    // close function
    // =================================================================
    $scope.closeThisDialog = function () {
        ngDialog.close();

    }

});
