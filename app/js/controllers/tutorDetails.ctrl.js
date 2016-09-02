/**
 * Created by ruchi1 on 2/12/2016.
 */
/**
 * Created by clicklabs9 on 10/27/15.
 */

//get details of a particular tutor
angular.module('tuli_admin').controller('tutorDetailsCtrl',['$scope','MY_CONSTANT','$cookieStore','$http','$state','$timeout',function($scope,MY_CONSTANT,$cookieStore,$http,$state,$timeout){

    //intital declarations
    $scope.init = function(){
        $scope.role = $cookieStore.get('role');
        $scope.loading= true; //loading indicator
        $scope.showthis = false;
        $scope.final = false;
        $scope.initial1 = true;
        $scope.repeated = false;

        $scope.noTra= false;
        $scope.aa= "Select Courses";
        $scope.unapproved=true;
        $scope.approved=true;

        //success and error messages initially empty
        $scope.successMsg = '';
        $scope.successMsg2 = '';
        $scope.errorMsg = '';
        $scope.errorMsg2 = '';
        $scope.info="";
        $scope.stored= "";
        $scope.addcourses1=[];
        $scope.addedcourses=[];
        $scope.allCourseIds = [];
        $scope.added=[];
        $scope.message = false;
        $scope.add= false;
        $scope.isEdit = false;
        $scope.add1= function () {
            $scope.add=!$scope.add;
            $scope.message = "";
        };

        $scope.updateCourses3={};
        $scope.updateCourses3.tutorCourses=[];
        $scope.updateCourses3.approvedCourses = [];



        $scope.av={};
    };

    $scope.init();


    //get details of a particular tutor
    $scope.singletutor = function(){
        $http.get(MY_CONSTANT.url+'/api/admin/user/view'+'?userId='+ $cookieStore.get('tutorId') + '&&limit=1&&' ,{ headers : {
            'Authorization' :'Bearer'+' '+ $cookieStore.get('accessToken')
        }
        }).success(function(response) {

            $scope.updateCourses3={};
            $scope.updateCourses3.tutorCourses=[];
            $scope.updateCourses3.approvedCourses = [];

            $scope.allCourseIds = [];

            $scope.info=response.data;


            if($scope.info[0].transcripts === null || $scope.info[0].transcripts.length == 0){

                $scope.showthis = true;

            }
            $scope.message = false;
            $scope.addcourses1 = [];

            $scope.stored=$scope.info[0].courses.canTeach;

            $scope.loading= false;
            $scope.bits=[];

            $scope.added=[];

            for(var i=0;i<$scope.info[0].approvedCourses.length;i++){
                $scope.added.push($scope.info[0].approvedCourses[i]._id);
            }


            for(var i=0;i<$scope.info[0].approvedCourses.length;i++){
                $scope.allCourseIds.push($scope.info[0].approvedCourses[i]._id);
            }

            for(var k=0;k<$scope.stored.length;k++){
                $scope.allCourseIds.push($scope.stored[k].courseId._id)
            }


            $scope.getCourses($scope.info[0].college._id,'a');


            $scope.details={};
            $scope.details.availability = $scope.info[0].availability;
            $scope.details.avail = [];

            var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            var i,j;

            //get the availability of a particular tutor
            for(i=0;i<$scope.details.availability.length;i++)
            {
                $scope.details.avail.push({day:days[i],lines:[]});

                for(j=0;j<$scope.details.availability[i].bit.length;j++)
                {

                    if($scope.details.availability[i].bit[j]==1)
                    {
                        var temp = '';

                        if(j<12)
                            temp = j+ " AM - ";
                        else if(j==12)
                            temp = j+" PM - ";
                        else
                            temp = (j-12)+" PM - ";

                        var count=0;
                        while(j<23 && $scope.details.availability[i].bit[j+1]==1)
                        {
                            j++;
                        }

                        var x = j+1;
                        if(x<12)
                            temp = temp + x+" AM";
                        else if(x==12)
                            temp = temp + x+" PM";
                        else if(x<24)
                            temp = temp + (x-12)+" PM";
                        else
                            temp = temp + "12 AM";

                        $scope.details.avail[i].lines.push(temp);
                    }


                }
                if($scope.details.avail[i].lines.length==0)
                    $scope.details.avail[i].lines.push('-');
            }


        }).error(function(response){
            $scope.errorMsg=response.message;
            $timeout(function(){

                $scope.errorMsg = ""
            }, 2000)
        });
    };




    $scope.singletutor();
    $scope.canMark = true;

    $scope.index2="";


    //$scope.editFee = function(){
    //    $scope.isEdit = true;
    //    $scope.canMark = false;
    //};
    //$scope.cancelEdit = function(){
    //    $scope.canMark = true;
    //    $scope.singletutor();
    //        $scope.isEdit = false;
    //};
    $scope.editFeeHit = function(){
        $scope.updateCourses4 = {};
        $scope.updateCourses4.tutorCourses = [];


        var len = $scope.info[0].courses.canTeach.length;
        for(var i=0;i<len;i++){
            $scope.updateCourses4.tutorCourses.push({
                "courseId" : $scope.info[0].courses.canTeach[i].courseId._id,
                "courseFee" : $scope.info[0].courses.canTeach[i].courseFee,
                "isFree" : $scope.info[0].courses.canTeach[i].isFree
            })
        }


        $http.put(MY_CONSTANT.url + '/api/admin/user/' + $scope.info[0]._id ,$scope.updateCourses4,{
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){
            $scope.successMsg2 = response.message;
            $scope.canMark = true;
            $timeout(function(){
                $scope.successMsg2 = false;
                $scope.updateCourses4 = '';
                $scope.singletutor();
            },1500)
        }).
        error(function(response){

            $scope.errorMsg2 = response.message;
            $timeout(function(){
                $scope.errorMsg2 = false;
            },1500)
        })
    };

    $scope.change2 = function(index,flag){
        if(flag == 0){
            $scope.info[0].courses.canTeach[index].isFree = true;

        }
        else if(flag == 1){
            $scope.info[0].courses.canTeach[index].isFree = false;

        }
    };


    //$scope.markFree = function(){
    //    if($scope.isEdit == true){
    //        return;
    //    }
    //    else{
    //        $scope.updateCourses4 = {};
    //        $scope.updateCourses4.tutorCourses = [];
    //        var len = $scope.info[0].courses.canTeach.length;
    //        for(var i=0;i<len;i++){
    //            $scope.updateCourses4.tutorCourses.push({
    //                "courseId" : $scope.info[0].courses.canTeach[i].courseId._id,
    //                "courseFee" : $scope.info[0].courses.canTeach[i].courseFee,
    //                "isFree": $scope.info[0].courses.canTeach[i].isFree
    //            })
    //        }
    //        $http.put(MY_CONSTANT.url + '/api/admin/user/' + $scope.info[0]._id ,$scope.updateCourses4,{
    //            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
    //        }).success(function(response){
    //            $scope.successMsg = response.message;
    //            $scope.canMark = true;
    //            $timeout(function(){
    //                $scope.successMsg = false;
    //                $scope.updateCourses4 = '';
    //                $scope.singletutor();
    //            },1000)
    //        }).
    //        error(function(response){
    //
    //            $scope.errorMsg = response.message;
    //            $timeout(function(){
    //                $scope.errorMsg = false;
    //            },1000)
    //        })
    //    }
    //
    //};



    //basic show hide variables
    $scope.one= true;
    $scope.two= false;
    $scope.three= false;
    $scope.four= false;
    $scope.five= false;
    $scope.done = false;


    //toggle view for courses
    $scope.toggle1=function(){
        $scope.two= false;
        $scope.three= false;
        $scope.one= true;
        $scope.four= false;
        $scope.five= false;
    };

    //toggle view for transcripts
    $scope.toggle2=function(){
        $scope.one= false;
        $scope.three= false;
        $scope.two= true;
        $scope.four= false;
        $scope.five= false;

    };

    //toggle view for approved Courses
    $scope.toggle4=function(){
        $scope.one= false;
        $scope.three= false;
        $scope.two= false;
        $scope.four= true;
        $scope.five= false;

    };

    //toggle view for availability
    $scope.toggle3=function(){
        $scope.one= false;
        $scope.two= false;
        $scope.three= true;
        $scope.four= false;
        $scope.five= false;

    };

    //toggle view for average feedback
    $scope.toggle5=function(){
        $scope.one= false;
        $scope.two= false;
        $scope.three= false;
        $scope.four= false;
        $scope.five= true;

    };

    $scope.try1 = false;


    //when a course is selected from the list it is saved in another object
    $scope.change = function(index,z){
        $scope.index2 = index;


        $scope.addedcourses.push({
            "title" : z.title,
            "_id": z._id,
            "code": z.code
        });


    };


    //delete a course from selected courses list
    $scope.rejectCourse = function(rejected,index){

        $scope.addedcourses.splice(index,1);
        for(var i=0;i<$scope.addcourses1.length;i++){
            if($scope.addcourses1[i]._id == rejected._id){

                var ind = $scope.addcourses1.indexOf($scope.addcourses1[i]);

                $scope.addcourses1[ind].active = false;


            }
        }


    };





    //reject a particular tutor
    $scope.unapprove=function(ID){
        $scope.Id=ID;

        $http.put(MY_CONSTANT.url + '/api/admin/changeApproveStatus/' + $scope.Id + '?action=unapprove',{"approvedCourses":$scope.added},{
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){

            $scope.successMsg=response.message;
            $scope.approved=false;
            $scope.unapproved=false;
            $timeout(function(){
                $scope.successMsg = false;
                $state.go('app.tutors3.rejected');
            }, 500)

        }).error(function(response){

            $scope.errorMsg=response.message;
            $timeout(function(){

                $scope.errorMsg = false
            }, 2000)

        })
    };


    //save selected courses in a variable
    $scope.saveCourses = function(){

        if($scope.addedcourses.length == 0){
            $scope.message = "Please select a course";
            $scope.seachText = "";
        }
        else{

            $scope.added = [];

            for(var i=0;i<$scope.info[0].approvedCourses.length;i++){
                $scope.added.push($scope.info[0].approvedCourses[i]._id);
            }

            for(var i=0;i<$scope.addedcourses.length;i++){

                $scope.added.push($scope.addedcourses[i]._id)

            }

            $scope.initial1 = false;
            $scope.final = true;


            $scope.searchText = "";
            $scope.add = false;

        }

    };





//search in the list of all courses available
    $scope.getCourses=function(x,b){

        if(!b)
            return;

        var req = {
            method: 'GET',
            url: MY_CONSTANT.url + '/api/user/courses/available?collegeId=' + x + '&charFilter=' + b,
            headers: {
                'Authorization': 'Bearer' + ' ' + $cookieStore.get('accessToken')
            }
        };

        $http(req).then(function(data) {
                $scope.addcourses1 = '';

                $scope.len = data.data.length;
                $scope.addcourses1 = data.data.data;

            },
            function(data) {
                $scope.errorMsg2 = data.data.message;
                $timeout(function(){
                    $scope.errorMsg2 = false
                }, 1000)
            }

        );

    };





    //save the courses suggested by admin
    $scope.suggestCourses=function(){
        //$scope.Id=ID;



        if($scope.addedcourses != ""){
            count = 0;

            for(var i=0;i<$scope.addedcourses.length;i++){
                for(var k=0;k<$scope.allCourseIds.length;k++){

                    if($scope.addedcourses[i]._id != $scope.allCourseIds[k]){

                        count++;

                    }
                }

                if(count == $scope.allCourseIds.length){

                    $scope.added.push($scope.addedcourses[i]._id)
                }
                else{
                    $scope.repeated = true;
                }
                count = 0;

            }



            $scope.updateCourses={};
            $scope.updateCourses.tutorCourses=[];
            $scope.updateCourses.approvedCourses="";
            $scope.updateCourses.approvedCourses = $scope.added;

            if($scope.stored.length != 0){
                for(var j=0;j<$scope.stored.length;j++){

                    $scope.updateCourses.tutorCourses.push({
                        "courseId": $scope.stored[j].courseId._id,
                        "courseFee": $scope.stored[j].courseFee,
                        "isFree": $scope.stored[j].isFree

                    })
                }
            }



            var req = {
                method: 'PUT',
                url: MY_CONSTANT.url + '/api/admin/user/' + $cookieStore.get('tutorId'),
                headers: {
                    'Authorization': 'Bearer' + ' ' + $cookieStore.get('accessToken')
                },
                data: $scope.updateCourses
            };


            $http(req).then(function(data) {
                $scope.added=[];


                if (data.status == 201) {
                    $scope.updatedData="";
                    $scope.added=[];
                    $scope.searchText="";
                    $scope.add= false;
                    $scope.addedcourses = [];
                    if($scope.repeated == true){
                        $scope.delay = 1000;
                    }
                    else{
                        $scope.delay = 0;
                    }
                    $timeout(function(){
                        $scope.repeated = false;
                        $scope.singletutor();
                    },$scope.delay);


                } else if(data.status == undefined){

                    alert("Something went wrong")
                }

            });


        }

        else{
            $scope.message = "Please select a course"
        }

    };



    //block a particular tutor
    $scope.block=function(ID){
        $scope.Id=ID;
        $http.put(MY_CONSTANT.url + '/api/admin/changeBlockStatus/' + $scope.Id + '?action=block', {'isBlocked': true}, {
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){

            $scope.singletutor();
            $scope.successMsg = response.message;
            $timeout(function(){

                $scope.successMsg = false
            }, 2000)


        }).error(function(response){

            $scope.errorMsg=response.message;
            $timeout(function(){
                $scope.errorMsg = false
            }, 2000)
        })

    };

    //unblock a particular tutor
    $scope.unblock=function(ID){
        $scope.Id=ID;
        $http.put(MY_CONSTANT.url + '/api/admin/changeBlockStatus/' + $scope.Id + '?action=unblock',  {'isBlocked': false}, {
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){

            $scope.successMsg = response.message;
            $timeout(function(){

                $scope.successMsg = false
            }, 2000);
            $scope.singletutor();


        }).error(function(response){

            $scope.errorMsg=response.message;
            $timeout(function(){

                $scope.errorMsg = false
            }, 2000)
        })

    };



    var inp = [];


    //store id of course1
    $scope.confirmDelete = function(id)
    {
        $scope.focusId =id;

    };


    var count2 = 0;

    $scope.saveToCanTeach = function(status,course){

        if(status == true){
            if($scope.updateCourses3.tutorCourses.length != 0){
                for(var i=0;i<$scope.updateCourses3.tutorCourses.length;i++) {
                    if (course.courseId._id != $scope.updateCourses3.tutorCourses[i].courseId) {
                        count2++;
                    }
                }
                if(count2 == $scope.updateCourses3.tutorCourses.length){
                    $scope.updateCourses3.tutorCourses.push({
                        "courseId": course.courseId._id,
                        "courseFee": course.courseFee,
                        "isFree": course.isFree
                    });
                    count2 = 0;
                }
            }
            else{
                $scope.updateCourses3.tutorCourses.push({
                    "courseId": course.courseId._id,
                    "courseFee": course.courseFee,
                    "isFree" : course.isFree
                });
            }


            return;
        }
        else{
            $scope.finalList = [];
            for(var i=0;i<$scope.updateCourses3.tutorCourses.length; i++){
                if($scope.updateCourses3.tutorCourses[i].courseId != course.courseId._id){
                    $scope.finalList.push($scope.updateCourses3.tutorCourses[i])
                }
            }

            $scope.updateCourses3.tutorCourses = $scope.finalList;

            return;
        }

    };



    //approve a particular tutor
    $scope.approve=function(ID){
        $scope.Id=ID;


        if($scope.updateCourses3.tutorCourses.length == 0){
            alert('Select atleast 1 course from teaching list');
            return;
        }
        else{
            for (var j = 0; j < $scope.added.length; j++) {
                $scope.updateCourses3.approvedCourses.push($scope.added[j]);
            }
            for (var i = 0; i < $scope.updateCourses3.tutorCourses.length; i++) {
                $scope.updateCourses3.approvedCourses.push($scope.updateCourses3.tutorCourses[i].courseId)
            }
            $scope.added = $scope.updateCourses3.approvedCourses;


            var req = {
                method: 'PUT',
                url: MY_CONSTANT.url + '/api/admin/user/' + $cookieStore.get('tutorId'),
                headers: {
                    'Authorization': 'Bearer' + ' ' + $cookieStore.get('accessToken')
                },
                data: $scope.updateCourses3
            };

            $http(req).then(function (data) {


                if (data.status == 201) {

                    $scope.updateCourses3="";

                    $http.put(MY_CONSTANT.url + '/api/admin/changeApproveStatus/' + $scope.Id + '?action=approve',{"approvedCourses":$scope.added},{
                        headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
                    }).success(function(response){

                        $scope.successMsg=response.message;
                        $scope.unapproved=false;
                        $scope.approved=false;
                        $timeout(function(){
                            $scope.successMsg = false;
                            $state.go('app.tutors.approved');
                        }, 300)


                    }).error(function(response){

                        $scope.errorMsg=response.message;
                        $timeout(function(){

                            $scope.errorMsg = false
                        }, 1000)

                    })
                } else if (data.status == undefined) {

                    alert("Something went wrong")
                }

            });

        }



    };

    //delete the selected course after confirmation
    $scope.delete=function(flag){
        $scope.myFlag = flag;

        var j=-1;


        if($scope.one == true){
            $scope.store2=[];
            $scope.store=$scope.info[0].courses.canTeach;
            if($scope.store.length > 1){

                for(var i=0;i<$scope.store.length;i++){

                    if($scope.store[i].courseId._id != $scope.focusId){
                        j=j+1;
                        $scope.store2[j]= $scope.store[i];
                    }
                }



                $scope.update($scope.store2,flag)


            }

            else{
                alert('Single course cannot be deleted');
                return false;
            }
        }

        else if($scope.four == true){
            $scope.store3=[];
            $scope.store=$scope.info[0].approvedCourses;

            for(var k=0;k<$scope.store.length;k++){
                if($scope.store[k]._id!==$scope.focusId){
                    j=j+1;
                    $scope.store3[j]= $scope.store[k]._id;
                }
            }
            $scope.update2($scope.store3);

        }

    };



    //updates the list of teaching courses
    $scope.update=function(a){

        $scope.updateCourses3={};
        $scope.updateCourses3.tutorCourses=[];


        angular.forEach(a,function(value, key){

            $scope.updateCourses3.tutorCourses.push({
                "courseId": value.courseId._id,
                "courseFee": value.courseFee,
                "isFree": value.isFree
            });
        });

        var req2 = {
            method: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/user/' + $cookieStore.get('tutorId'),
            headers: {
                'Authorization': 'Bearer' + ' ' + $cookieStore.get('accessToken')
            },
            data: $scope.updateCourses3
        };

        $http(req2).then(function(data) {


            if (data.status == 201) {
                $scope.updatedData={};
                $scope.singletutor();
                $scope.add = false;

            }
            else if(data.status == undefined){

                alert("Something went wrong")
            }

        });


    };




    ////updates the list of can teach courses
    $scope.update2 = function(a) {


        $scope.updateCourses2 = {};
        $scope.updateCourses2.tutorCourses = [];
        $scope.updateCourses2.approvedCourses = "";

        if ($scope.stored.length != 0) {
            for (var j = 0; j < $scope.stored.length; j++) {

                $scope.updateCourses2.tutorCourses.push({
                    "courseId": $scope.stored[j].courseId._id,
                    "courseFee": $scope.stored[j].courseFee,
                    "isFree": $scope.stored[j].isFree

                })
            }
        }


        $scope.updateCourses2.approvedCourses = a;


        var req = {
            method: 'PUT',
            url: MY_CONSTANT.url + '/api/admin/user/' + $cookieStore.get('tutorId'),
            headers: {
                'Authorization': 'Bearer' + ' ' + $cookieStore.get('accessToken')
            },
            data: $scope.updateCourses2
        };

        $http(req).then(function (data) {


            if (data.status == 201) {

                $scope.updateCourses2="";

                $scope.singletutor();

            } else if (data.status == undefined) {

                alert("Something went wrong")
            }

        });
    };


    //verify email
    $scope.verify = function(ID){
        $http.put(MY_CONSTANT.url + '/api/admin/changeVerificationStatus/' + ID + '?action=verify',  {'isVerified': true}, {
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){
            $scope.successMsg = response.message;
            $timeout(function(){
                $scope.successMsg = false
            }, 2000);
            $scope.singletutor();
        }).error(function(response){
            $scope.errorMsg=response.message;
            $timeout(function(){
                $scope.errorMsg = false
            }, 2000)
        });
    };

    //resend email verification
    $scope.verifyresend = function(ID){

        $http.put(MY_CONSTANT.url + '/api/admin/resendVerificationEmail/' + ID,  {'isVerified': true}, {
            headers: {'Authorization': 'Bearer '+ $cookieStore.get('accessToken')}
        }).success(function(response){
            $scope.successMsg = response.message;
            $timeout(function(){
                $scope.successMsg = false
            }, 2000);
            $scope.singlestudent();
        }).error(function(response){
            $scope.errorMsg=response.message;
            $timeout(function(){
                $scope.errorMsg = false
            }, 2000)
        });
    }



}]);