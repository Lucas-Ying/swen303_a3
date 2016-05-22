$().ready(function(){
    changeLoginName();

    //login button
    $('#log-in').on('click',function(){
        //get the name/email of the login button
        var loginName = document.getElementById('log-in').text;
        if(loginName =='LOG IN'){
            location.href = 'login';
        }
        else if(loginName =='LOG OUT'){
            sessionStorage.setItem('useremail', "");
            sessionStorage.setItem('username', "");
            changeLoginName();
            location.href = 'login';
        }
    });

    //registeration button
    $('#registration').on('click',function(){
        var loginName = document.getElementById('registration').text;
        if(loginName!= 'SIGN UP'){
            location.href = 'login';
        }
        else{
            location.href = 'register';
        }
    });

    //signup
    $('#signupForm').submit(function(event){
        event.preventDefault();
        var first_name = $('input[id="first_name"]').val();
        var last_name = $('input[id="last_name"]').val();
        var email = $('input[id="email"]').val();
        var name = $('input[id="username"]').val();
        var pass = $('input[id="password"]').val();
        var conPass = $('input[id="confirm_password"]').val();

        //$('#email').on('click',function(){
        //    document.getElementById('err').style.visibility = 'hidden';
        //});

        var checker = false;
        //console.log("email: "+email+ "password: "+pass+" name: "+name);
        //if all values are not empty then add the user to table
        if(first_name && last_name && email && pass && name && conPass){
            //user can not use login as username
            if(name == "LOG IN"){
                document.getElementById('err').innerHTML="Can't use LOG IN as username, Please choose another username";
                document.getElementById('err').style.visibility = 'visible';
                return;
            }

            $.ajax({
                method:'GET',
                url:'/get_users',
                dataType:'json',
                data:{'email':email},

                success: function(data){
                    //go through database check if email already exist
                    for(i = 0; i<data.length; i++){
                        if(data[i].email == email){
                            checker = true;
                            document.getElementById('err').innerHTML="Email already exist please use a different email";
                            document.getElementById('err').style.visibility = 'visible';
                            break;
                        }
                    }

                    if(!checker){
                        document.getElementById('err').style.visibility = 'hidden';
                        console.log("user doesnt exist add user");
                        //if email doesnt exist add the user to the database
                        addUser();

                    }
                },
                error:function(){
                    console.log("Error: fail to get users");
                }
            });

            function addUser(){
                $.ajax({
                    method:'POST',
                    url:'/add_user',
                    dataType:'json',
                    data:{'first_name':first_name,'last_name':last_name,'email':email,"name":name,"pass":pass},

                    success:function(){
                        //alert("SignUp Successful!");
                        //addCart();
                        location.href = ""
                    },
                    error:function(){
                        //console.log("Error: fail to add user: "+name);
                    }
                });
            }

            //function addCart(){
            //    var userid=0;
            //    $.ajax({
            //        method:'GET',
            //        url:'/get_users',
            //        success: function(data){
            //            //go through database check if email already exist
            //            for(i = 0; i<data.length; i++){
            //                if(data[i].email == email){
            //                    userid = data[i].id;
            //                }
            //            }
            //
            //            if(userid!=0){
            //                //add cart
            //                $.ajax({
            //                    method:'PUT',
            //                    url:'/addCart',
            //                    dataType:'json',
            //                    data:{'userID':userid,"balance":0,"items":""},
            //
            //                    success:function(){
            //                        console.log('new cart added');
            //                        //redirect to homepage
            //                        location.href = 'login';
            //                        //reset form
            //                        $('#signupForm').trigger('reset');
            //                    },
            //                    error:function(){
            //                        console.log("Error: fail to add cart");
            //                    }
            //                });
            //            }
            //        },
            //        error:function(){
            //            console.log("Error: fail to get users");
            //        }
            //    });
            //}
        }//otherwise leave it to the form validation
    });


    //login
    $('#loginForm').submit(function(e){
        e.preventDefault();
        var email = $('input[id="email"]').val();
        //var passW = $('input[id="password"]').val();

        //$('#email,#password').on('click',function(){
        //    document.getElementById('err').style.visibility = 'hidden';
        //});

        if(email){
            //console.log("email: "+email+ "password: "+passW);
            $.ajax({
                method:'GET',
                url:'/get_users',

                success: function(data){
                    //go through database check if email exist
                    for(i = 0; i<data.length; i++){
                        if(data[i].email == email){
                            //if(data[i].pass == passW){
                                location.href = '/?account_id='+data[i].userid;
                                sessionStorage.setItem('useremail', data[i].email);
                                sessionStorage.setItem('username',data[i].userhandle);
                                //console.log(sessionStorage.getItem('username'));
                                changeLoginName();
                                alert("Login Successful!");

                                //reset form
                                $('#loginForm').trigger('reset');
                                return;
                                //do something here
                            //}
                            //else{
                            //    document.getElementById('err').innerHTML="Incorrect password";
                            //    document.getElementById('err').style.visibility = 'visible';
                            //    return;
                            //    //console.log("Error: incorrect password");
                            //}
                        }
                    }
                    document.getElementById('err').innerHTML="Email doesn't exists";
                    document.getElementById('err').style.visibility = 'visible';
                },
                error:function(){
                    console.log("Error: fail to get users");
                }
            });
        }
    });
});


function changeLoginName(){
    if(sessionStorage.getItem('useremail')){
        document.getElementById('registration').innerHTML=sessionStorage.getItem('username');
        document.getElementById('log-in').innerHTML='LOG OUT';
    }else{
        document.getElementById('registration').innerHTML='SIGN UP';
        document.getElementById('log-in').innerHTML='LOG IN';
    }
}