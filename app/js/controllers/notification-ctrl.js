App.controller('NotificationController', function ($scope,$http,$timeout, ngDialog, MY_CONSTANT, $state) {
    //=============================================
    //notifcation list
    //=============================================

    $http({

        url: MY_CONSTANT.url + '/api/v2/notification/get',
        method: "GET"

    }).success(function (response, status) {
            if (status == 200) {
                $scope.loading=false;
                var dataArray = [];
                var custList = response.data;
                console.log(response.data);
                custList.forEach(function (column) {
                    var d = {};
                    d.notification = column.notification;
                    d.updatedAt=column.updatedAt.split("T")[0];
                    dataArray.push(d);

                });
                $scope.list = dataArray;
                var dtInstance;
                $timeout(function () {
                    if (!$.fn.dataTable) return;
                    dtInstance = $('#datatabe82').dataTable({
                        'paging': true,  // Table pagination
                        //'ordering': true,  // Column ordering
                        'scrollX': true,
                        "scrollY": '50vh',
                        "sScrollX": "100%",
                        "sScrollXInner": "150%",
                        "bScrollCollapse": true,
                        'info': true,  // Bottom left status text
                        'searching': true,
                        'bDestroy': true,
                        //"order": [ 0, "asc" ],
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
            }
            else
            {
                alert("Something went wrong, please try again later.");
                return false;
            }
        }
    )
    $scope.openNotification=function()
    {
        $state.go('app.notifications');

    }

});
