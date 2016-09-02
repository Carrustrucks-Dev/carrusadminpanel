App.controller('driversController', function ($scope, $http, $location, $cookies, $cookieStore, MY_CONSTANT, $timeout, $state, $window, ngDialog) {
    'use strict';
    $scope.loading = true;


    var getDriverList = function () {

        var accessToken = $cookieStore.get('accessToken');

        $http({
            url: MY_CONSTANT.url + '/api/v1/admin/getAllTrucker',
            method: "GET",
            headers: {
                'authorization': $cookieStore.get('accessToken')
            }
        }).success(function (response, status) {
                console.log(response.data);
                $scope.loading = false;
                if (status == 200) {

                    var dataArray = [];
                    var excelArray = [];
                    var custList = response.data.data;
                    var i = 0;
                    custList.forEach(function (column) {
                        //i++;
                        //console.log(i);
                        var d = {};
                        d.driverId1 = column.driverId;
                        d.driverId = column._id;

                        if (column.profilePicture == null || column.profilePicture == "null")
                            $scope.no_profileImage = true;
                        else {
                            d.profilePicture = column.profilePicture.thumb ? column.profilePicture.thumb : "";
                            $scope.no_profileImage = false;
                        }
                         d.driverName = column.driverName;
                        d.driverphoneNumber = column.phoneNumber;
                        d.phoneNumber = column.fleetOwner[0] ? column.fleetOwner[0].phoneNumber : '';
                        d.email = column.fleetOwner[0] ? column.fleetOwner[0].email : '';
                        d.address = column.address ? column.address : "--";
                        d.drivingLicenseNo = column.drivingLicense.drivingLicenseNo;
                        d.registerDate = moment(column.createdAt).format("lll");
                        d.licenseImage = column.drivingLicense.drivingLicenseDoc;
                        if(column.drivingLicense.drivingLicenseDoc)
                        {var lisence_image = d.licenseImage.substr(column.drivingLicense.drivingLicenseDoc.lastIndexOf("."));
                            //console.log(lisence_image);
                            if (lisence_image == ".pdf") {
                                d.license_html_image = "app/img/adobe_png.png";

                            }

                            else
                                d.license_html_image = column.drivingLicense.drivingLicenseDoc;}


                        d.voteridNo = column.VoterId.VoterIdNo;
                        d.voteridImage = column.VoterId.VoterIdDoc;
                        if(column.VoterId.VoterIdDoc)
                        { var voterid_image = d.voteridImage.substr(column.VoterId.VoterIdDoc.lastIndexOf("."));
                            if (voterid_image == ".pdf") {
                                d.voterid_html_image = "app/img/adobe_png.png";

                            }

                            else
                                d.voterid_html_image = column.VoterId.VoterIdDoc;}


                        d.adharcardNo = column.adharCard.adharNo;
                        d.adharImage = column.adharCard.adharDoc;
                        if(column.adharCard.adharDoc)
                        {
                            var adhar_image = d.adharImage.substr(column.adharCard.adharDoc.lastIndexOf("."));
                            if (adhar_image == ".pdf") {
                                d.adhar_html_image = "app/img/adobe_png.png";

                            }

                            else
                                d.adhar_html_image = column.adharCard.adharDoc;
                        }


                        d.drivingLicenseNumber = column.drivingLicense.drivingLicenseNo;
                        d.drivingLicenseValidity = moment(column.drivingLicense.validity).format("lll");
                        //console.log(dataArray);
                        dataArray.push(d);
                        excelArray.push(d);
                    });
                    $scope.list = dataArray;
                    $scope.excelList = excelArray;
                    console.log($scope.list);
                    var dtInstance;
                    $timeout(function () {
                        if (!$.fn.dataTable) return;
                        dtInstance = $('#datatable8').dataTable({
                            'paging': true,  // Table pagination
                            'ordering': true, // Column ordering
                            'scrollX': true,
                            "scrollY": '50vh',
                            "sScrollX": "100%",
                            "sScrollXInner": "150%",
                            "bScrollCollapse": true,
                            'info': true, // Bottom left status text

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
                console.log("sdf");
                $state.go('page.404');
                if (error == '404' || error == '401') {
                    $state.go('page.404');
                }
                else {
                    $state.go('page.Nointernet');
                }
            });


    };

    getDriverList();

    $scope.pop = {};
    $scope.zoom1 = function (data_get) {
        //console.log("hieee",data_get);
        $scope.details = data_get;
        //console.log(data_get.profilePicture);
        if (data_get.profilePicture == undefined ||data_get.profilePicture== "" )
            return;
        else
            $scope.pop.image = data_get.profilePicture;


        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.pop = {};
    $scope.zoom2 = function (data_get) {
        //console.log("license image",data_get.licenseImage);
        $scope.details = data_get;
        if(data_get.licenseImage==null)
        return;
        else
        $scope.pop.image = data_get.licenseImage;


        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.pop = {};
    $scope.zoom3 = function (data_get) {
        //console.log("voterid",data_get.voteridImage);
        $scope.details = data_get;
        if(data_get.voteridImage== null)
        return;
        else
        $scope.pop.image = data_get.voteridImage;


        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    $scope.pop = {};
    $scope.zoom4 = function (data_get) {
        //console.log("adhar image",data_get.adharImage);
        $scope.details = data_get;
        if(data_get.adharImage== null)
        return;
        else
        $scope.pop.image = data_get.adharImage;


        ngDialog.openConfirm({
            template: 'modalDialog',
            className: 'ngdialog-theme-default',
            scope: $scope
        });
    };
    //==========================================
    //map
    //==========================================
    App.controller('MapCtrl', function ($scope, $http, MY_CONSTANT, $cookieStore) {
        $scope.loadMap = function () {
            $scope.loading1 = true;
            $http({
                url: MY_CONSTANT.url + '/api/v1/admin/getAllTrucker',
                method: "GET",
                headers: {
                    'authorization': $cookieStore.get('accessToken')
                }
            }).success(function (response, status) {
                $scope.loading1 = false;

                if (status == 200) {
                    var dataArray = [];
                    var custList = response.data.data;
                    custList.forEach(function (column) {
                        var mark = [];
                        mark.lat = column.currentCoordinates.lat;
                        mark.long = column.currentCoordinates.long;
                        mark.driverName = column.driverName;
                        mark.phoneNumber = column.fleetOwner[0] ? column.fleetOwner[0].phoneNumber : ''

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
                title: info.driverName,
            });
            marker.content = '<div class="infoWindowContent">' + info.phoneNumber + '</div>';

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

    //refresh button=======================================================
    $scope.refresh = function () {
        $state.reload();
    };
    // export to excel====================================================
    $scope.exportExcel = function () {
        alasql('SELECT * INTO CSV("Driver_Excel.csv",{headers:true}) FROM ?', [$scope.excelList]);
    };

    //storing driver details in cookie=======================================
    $scope.DriverDetails = function (data) {

        $cookieStore.put('Driver Form', data);
    };


});
App.controller('EditDriverProfileController', function ($scope, $http, $stateParams, $rootScope, $location, $cookies, $cookieStore, MY_CONSTANT, $state, ngDialog) {
    'use strict';
    $scope.license_image_sent = 0;
    $scope.voter_image_sent = 0;
    $scope.adhar_image_sent = 0;
    $scope.driverId = $stateParams.driverId;
    console.log($scope.driverId);


    $scope.driver_form = $cookieStore.get('Driver Form');

    $scope.file_to_upload = function (files, id) {

        if (id == 1) { //license image
            $scope.license_image = files[0];
            $scope.license_image_sent = 1;
            $scope.license_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("license_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if (id == 2) { //voter id image
            $scope.voter_image = files[0];
            $scope.voter_image_sent = 1;

            $scope.voter_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("voter_image");
            img.file = file;
            var reader = new FileReader();
            reader.onload = (function (aImg) {
                return function (e) {
                    aImg.src = e.target.result;
                };
            })(img);
            reader.readAsDataURL(file);

        }
        if (id == 3) { //adhar image
            $scope.adhar_image = files[0];

            $scope.adhar_image_sent = 1;

            $scope.adhar_image_name = files[0].name;
            var file = files[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {

            }
            var img = document.getElementById("adhar_image");
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
    $scope.driver_form.licenseImage = $scope.license_image;
    $scope.driver_form.voteridImage = $scope.voter_image;
    $scope.driver_form.adharImage = $scope.adhar_image;


    $scope.EditService = function (driver_form) {
        $scope.loading=true;
        console.log(driver_form);

        var fd = new FormData();
        fd.append('driverName', driver_form.driverName);
        fd.append('phoneNumber', driver_form.driverphoneNumber);
        //console.log(driver_form.address);
        if(driver_form.address != "" && driver_form.address!= "undefined")
        fd.append('fullAddress', driver_form.address);
        if(driver_form.drivingLicenseNo !="" && driver_form.drivingLicenseNo!="umdefined")
        fd.append('drivingLicenseNo', driver_form.drivingLicenseNo);
        if(driver_form.voteridNo !="" && driver_form.voteridNo !="undefined")
        fd.append('VoterIdNo', driver_form.voteridNo);
        if(driver_form.adharcardNo !="" && driver_form.adharcardNo!="undefined")
        fd.append('adharNo', driver_form.adharcardNo);

        fd.append('validity', moment(driver_form.drivingLicenseValidity).format("YYYY-MM-DD"));


        if ($scope.driver_form.licenseImage != '' && typeof driver_form.licenseImage != 'undefined')
            fd.append('drivingLicenseDoc', $scope.driver_form.licenseImage);

        if ($scope.driver_form.voteridImage != '' && typeof $scope.driver_form.voteridImage != 'undefined')
            fd.append('VoterIdDoc', $scope.driver_form.voteridImage);

        if ($scope.driver_form.adharImage != '' && typeof $scope.driver_form.adharImage != 'undefined')
            fd.append('adharDoc', $scope.driver_form.adharImage);

        console.log(fd);

        //-----------------------------form---------------------------------------
        $.ajax({
            type: 'PUT',
            url: MY_CONSTANT.url + '/api/v1/fleetOwner/trucker/' + $scope.driverId,
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
    };
//edit panel end=========================================

// close function========================================
    $scope.closeThisDialog = function () {
        ngDialog.close();
        //$state.go('app.all_fleet_owners');
    }

});


