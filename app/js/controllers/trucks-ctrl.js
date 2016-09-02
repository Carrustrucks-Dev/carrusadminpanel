App.controller('trucksController', function ($state, $scope, $stateParams, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $window, ngDialog) {
    'use strict';
    $scope.loading = true;
    $scope.pdf_image = false;
    $scope.pdf_image1 = false;


    var getTruckList = function () {
        var accessToken = $cookieStore.get('accessToken');
        var i = 0;
        var j = 0;
        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTruck',
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
                    d.truckId = column._id;
                    d.truckerId = column.trucker[0] ? column.trucker[0]._id : null;
                    d.typeTruckId = column.typeTruck[0] ? column.typeTruck[0]._id : null;
                    d.driverName = column.trucker[0] ? column.trucker[0].driverName : '--';
                    d.phoneNumber = column.trucker[0] ? column.trucker[0].phoneNumber : "--";
                    d.truckNumber = column.truckNumber ? column.truckNumber : '--';
                    d.status = column.status ? column.status : '--';
                    d.model = column.model ? column.model : "--";
                    if(column.createdAt)
                    {console.log("trye")
                    d.registerDate = column.createdAt.split("T")[0];}
                    else {
                        d.registerDate = "--";
                        console.log("false")
                    }
                    if (column.manufactureDate == 0 || column.manufactureDate == " " || column.manufactureDate == "null")
                        d.manufactureDate = "--";
                    else
                        d.manufactureDate = column.manufactureDate;
                    d.truckName = column.truckName ? column.truckName : '--';
                    d.policy = column.insurance.policy ? column.insurance.policy : '--';
                    d.validity = column.insurance.validity ? column.insurance.validity : '--';
                    d.company = column.insurance.company ? column.insurance.company : '--';
                    d.typeTruckName = column.typeTruck[0] ? column.typeTruck[0].typeTruckName : '--';
                    d.ttDoc = column.taxToken.ttDoc;
                    if (column.taxToken.ttDoc) {
                        var ttdoc_image = d.ttDoc.substr(column.taxToken.ttDoc.lastIndexOf("."));
                        //console.log(ttdoc_image);
                        if (ttdoc_image == ".pdf")
                            d.ttdoc_html = "app/img/adobe_png.png"

                        else d.ttdoc_html = column.taxToken.ttDoc;
                    }
                    d.fcDoc = column.fitnessCertificate.fcDoc;
                    if (column.fitnessCertificate.fcDoc) {
                        var fcdoc_image = d.fcDoc.substr(column.fitnessCertificate.fcDoc.lastIndexOf("."));
                        //console.log(ttdoc_image);
                        if (fcdoc_image == ".pdf")
                            d.fcdoc_html = "app/img/adobe_png.png"

                        else d.fcdoc_html = column.fitnessCertificate.fcDoc;
                    }

                    d.rcDoc = column.registrationCertificate.rcDoc;
                    if (column.registrationCertificate.rcDoc) {
                        var rcdoc_image = d.rcDoc.substr(column.registrationCertificate.rcDoc.lastIndexOf("."));
                        //console.log(ttdoc_image);
                        if (rcdoc_image == ".pdf")
                            d.rcdoc_html = "app/img/adobe_png.png"

                        else d.rcdoc_html = column.registrationCertificate.rcDoc;
                    }


                    d.npDoc = column.notionalPermit.npDoc;
                    if (column.notionalPermit.npDoc) {
                        var npdoc_image = d.rcDoc.substr(column.notionalPermit.npDoc.lastIndexOf("."));
                        //console.log(ttdoc_image);
                        if (npdoc_image == ".pdf")
                            d.npdoc_html = "app/img/adobe_png.png"

                        else d.npdoc_html = column.notionalPermit.npDoc;
                    }
                    d.ttValidity = column.taxToken.ttValidity ? column.taxToken.ttValidity : '--';
                    d.fcValidity = column.fitnessCertificate.fcValidity ? column.fitnessCertificate.fcValidity : '--';
                    d.rcValidity = column.registrationCertificate.rcValidity ? column.registrationCertificate.rcValidity : '--';
                    d.npValidity = column.notionalPermit.npValidity ? column.notionalPermit.npValidity : '--';
                    d.truckcolor = column.truckColor ? column.truckColor : '--';
                    d.truckoem = column.oem ? column.oem : '--';
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

    getTruckList();
    //===================================================================
    $scope.pop = {};
    $scope.zoom_ttdoc = function (data_get) {
        //console.log("hieee",data_get.ttDoc);

        $scope.details = data_get;
        if (data_get.ttDoc == null)
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
        $scope.details = data_get;
        if (data_get.npDoc == null)
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
        //console.log("hieee");
        $scope.details = data_get;
        if (data_get.fcDoc == null)
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
        //console.log("hieee");
        $scope.details = data_get;
        if (data_get.rcDoc == null)
            return;
        else
            $scope.pop.image = data_get.rcDoc;
        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //map===================================================
    App.controller('MapCtrl', function ($scope, $http, MY_CONSTANT, $cookieStore) {

        $scope.loadMap = function () {
            $scope.loading1 = true;
            $http({
                url: MY_CONSTANT.url + '/api/v1/admin/getAllOnGoingBookings',
                method: "GET",
                headers: {
                    'authorization': $cookieStore.get('accessToken')
                }
            }).success(function (response, status) {
                $scope.loading1 = false;

                if (status == 200) {
                    //console.log("200  status");
                    var dataArray = [];
                    var custList = response.data.data;
                    //console.log("custlist",response);
                    custList.forEach(function (column) {
                        var mark = [];
                        mark.lat = column.dropOff.coordinates.dropOffLat;
                        mark.long = column.dropOff.coordinates.dropOffLong;
                        mark.name = column.assignTruck.truckName;
                        mark.desc = column.assignTruck.truckNumber;
                        //console.log("WW", mark.lat);
                        //console.log("name",mark.city);
                        createMarker(mark);
                    });
                }
            });
        };
        $scope.loadMap();

        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(20.59, 78.96),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };

        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

        $scope.markers = [];

        var infoWindow = new google.maps.InfoWindow();

        var createMarker = function (info) {

            var marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                title: info.name,
            });
            marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.setContent('<h4>' + marker.title + '</h4>' + marker.content);
                infoWindow.open($scope.map, marker);
            });
            $scope.markers.push(marker);
        };

        $scope.openInfoWindow = function (e, selectedMarker) {
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        }

    })
    // refresh button================
    $scope.refresh = function () {
        $state.reload();
    };
    // export to excel====================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Trucks_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };

//storing truck details in cookie=======================================
    $scope.TruckDetails = function (data) {

        $cookieStore.put('Truck Form', data);
    };

//=======================================================================
//storing type truck in cookie
// ======================================================================
    $scope.getTypeTruck = function () {
        $http.get(MY_CONSTANT.url + '/api/v1/typeTruck?status=ACTIVATE')
            .success(function (response, status) {
                // console.log(response);
                $scope.list2 = response.data;
                //console.log("list of truck",$scope.list2);
                localStorage.setItem("type_truck", JSON.stringify($scope.list2));


            });
    };
    $scope.getTypeTruck();

});

//edit truck profile controller===========================================================================================

App.controller('EditTruckProfileController', function ($scope, $http, $stateParams, $rootScope, $location, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {
    'use strict';
    $scope.flag_id = false;
    $scope.tt_image_sent = 0;
    $scope.np_image_sent = 0;
    $scope.fc_image_sent = 0;
    $scope.rc_image_sent = 0;
    $scope.truckId = $stateParams.truckId;
    $scope.truckerId = $stateParams.truckerId;
    $scope.typeTruckId = $stateParams.typeTruckId;

    $scope.truck_form = $cookieStore.get('Truck Form');
    $scope.typeTruckList = JSON.parse(localStorage.getItem("type_truck"));
    //console.log(JSON.parse(localStorage.getItem("type_truck")));
    //console.log("typeTrucklist",$scope.typeTruckList);

    $scope.file_to_upload = function (files, id) {

        if (id == 1) { //tax token image
            $scope.tt_image = files[0];
            $scope.tt_image_sent = 1;
            $scope.tt_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("tt_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if (id == 2) { //national permit image
            $scope.np_image = files[0];
            $scope.np_image_sent = 1;

            $scope.np_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("np_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if (id == 3) { //fitness cirtificate image
            $scope.fc_image = files[0];
            $scope.fc_image_sent = 1;

            $scope.fc_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("fc_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if (id == 4) { //registration cirtificate image
            $scope.rc_image = files[0];
            $scope.rc_image_sent = 1;

            $scope.rc_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("rc_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        $scope.$apply();
    }
    $scope.typeName_to_Id = function () {
        $scope.flag_id = true;
    }

    //==============================================================
    //edit truck form
    //==============================================================
    $scope.EditService = function (truck_form) {
        //console.log("Id", truck_form.typeTruckName);
        $scope.loading = true;
        truck_form.ttValidity = moment(truck_form.ttValidity).format("ll");
        truck_form.npValidity = moment(truck_form.npValidity).format("ll");
        truck_form.fcValidity = moment(truck_form.fcValidity).format("ll");
        truck_form.rcValidity = moment(truck_form.rcValidity).format("ll");
        $scope.truck_form.ttImage = $scope.tt_image;
        $scope.truck_form.npImage = $scope.np_image;
        $scope.truck_form.fcImage = $scope.fc_image;
        $scope.truck_form.rcImage = $scope.rc_image;
        var fd = new FormData();
        var truckerID_array = [];
        var typeOftruck_array = [];
        var changed_typeOftruck_array = [];

        for (var i = 0; i < 1; i++) {
            truckerID_array[i] = $scope.truckerId;
        }
        fd.append('truckerIds', JSON.stringify(truckerID_array));


        for (var j = 0; j < 1; j++) {
            typeOftruck_array[j] = $scope.typeTruckId;
        }
        for (var k = 0; k < 1; k++) {
            changed_typeOftruck_array[k] = truck_form.typeTruckName;
        }
        if ($scope.flag_id == true)
            fd.append('typeTruckIds', JSON.stringify(changed_typeOftruck_array));
        else
            fd.append('typeTruckIds', JSON.stringify(typeOftruck_array));
        fd.append('truckName', truck_form.truckName);
        fd.append('truckNumber', truck_form.truckNumber);
        if(truck_form.model!="" )
        fd.append('model', truck_form.model);
        if(truck_form.truckoem!="" )
        fd.append('oem', truck_form.truckoem);
        //console.log(truck_form.ttValidity);
        if(truck_form.ttValidity!="Invalid date" )
        fd.append('ttValidity', truck_form.ttValidity);
        if(truck_form.npValidity!="Invalid date" )
        fd.append('npValidity', truck_form.npValidity);
        if(truck_form.fcValidity!="Invalid date" )
        fd.append('fcValidity', truck_form.fcValidity);
        if(truck_form.rcValidity!="Invalid date" )
        fd.append('rcValidity', truck_form.rcValidity);
        if (truck_form.manufactureDate != '--' || truck_form.manufactureDate!= "") {
            var manDate = truck_form.manufactureDate.toString();
            if (manDate.length != 4) {
                //console.log("true if length !=4");
                $scope.loading = false;
                ngDialog.open({
                    template: '<p class="del-dialog">Please Enter Correct  Year Manufacturing  </p>',
                    plain: true,
                    className: 'ngdialog-theme-default'
                });
                return;
                fd.append('manufactureDate', truck_form.manufactureDate);
            }
            else fd.append('manufactureDate', truck_form.manufactureDate);
        }
        if ($scope.truck_form.ttImage != '' && typeof $scope.truck_form.ttImage != 'undefined') {
            fd.append('ttDoc', $scope.truck_form.ttImage);
        }
        if ($scope.truck_form.npImage != '' && typeof $scope.truck_form.npImage != 'undefined') {
            fd.append('npDoc', $scope.truck_form.npImage);
        }
        if ($scope.truck_form.fcImage != '' && typeof $scope.truck_form.fcImage != 'undefined') {
            fd.append('fcDoc', $scope.truck_form.fcImage);
        }
        if ($scope.truck_form.rcImage != '' && typeof $scope.truck_form.rcImage != 'undefined') {
            fd.append('rcDoc', $scope.truck_form.rcImage);
        }
        if ($scope.truck_form.validity) {
            fd.append('validity', moment($scope.truck_form.validity).format("YYYY-MM-DD"));
        }
        //console.log(fd);

        //-----------------------------form---------------------------------------
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/fleetOwner/truck/' + $scope.truckId,
            headers: {
                'authorization': $cookieStore.get('accessToken')
            },
            dataType: "json",
            data: fd,
            async: true,
            processData: false,
            contentType: false,
            success: function (data) {

                $scope.loading = false;
                ngDialog.open({
                    template: 'app/views/okEdited-popup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope
                })
            },
            error: function (data) {
                $scope.loading = false;

                if (data.statusCode == 401) {
                    $state.go('app.logout');
                }
                else {
                    ngDialog.open
                    ({
                        template: '<p class="del-dialog" style="align:center">Please fill all the mandatory fields </p>',
                        plain: true,
                        className: 'ngdialog-theme-default'
                    });
                }
            }
        });
    }
    ;
//edit panel end=========================================

// close function========================================
    $scope.closeThisDialog = function () {
        ngDialog.close();
        //$state.go('app.all_fleet_owners');
    }

})
;



