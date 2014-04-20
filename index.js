/**
 * Created with JetBrains WebStorm.
 * User: admin
 * Date: 13-5-26
 * Time: 下午10:21
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {

    $("#doctorLogin").click(function(){
        $.ajax({
            type: "get",
            url: 'http://www.ysrule.com/yy/doctorLogin.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
            data: {doctorName:escape($("#doctorName").val()),password:$("#password").val()
            },
            cache: true, //默认值true
            dataType: "jsonp",
            jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "jsonpCallback",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
            success: function (json) {
                var data = json.magazineTab.records;
                $.each(data, function(i, n){
                   // addQuestions(n);
                    localStorage.setItem('currentDoctorID', n.ID);
                    localStorage.setItem('currentDoctorName',unescape(n.username));
                    alert("登入成功");
                });

            },
            error: function (error) {
                alert("erroe");
            }
        });

    });
    $("#adviceList").on("pageinit",function(event){
        $("#messageList").empty();
        getMyQuestions();

    });

    function getMyQuestions() {

        $.ajax({
            type: "get",
            url: 'http://www.ysrule.com/yy/doctorPrivateQuestion.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
            data: {doctorid:localStorage.getItem('currentDoctorID')
            },
            cache: true, //默认值true
            dataType: "jsonp",
            jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "jsonpCallback",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
            success: function (json) {
                var data = json.magazineTab.records;
                $.each(data, function(i, n){
                    addQuestions(n);

                });
                $("#messageList").listview("refresh");
                var ulHomes = $("#messageList")[0].children;

                $(ulHomes).each(function(){
                    if(this.id!=""){
                        $(this).click(function(){
                            $("#messageDetails").empty();
                            getmessageDetail(this.id);
                            localStorage.setItem('currentChatId', this.id);
                            $.mobile.changePage("#adviceListDetail", { transition: "slideup", changeHash: false });
                        });
                    }

                });

            },
            error: function (error) {
                alert("erroe");
            }
        });


        function jsonpCallback(data) //回调函数
        {
            alert(data.message); //
        }

    }



    function trim(str)
    {
        return str.replace(/(^\s*)|(\s*$)/g,'');
    }

    function changepage() {
        $.mobile.changePage("#index", { transition: "slideup", changeHash: false });
    }

    $("#welcome").bind("pagecreate", function () {

        setTimeout(function () {
            changepage();
        }, 3000);
    });


    $("#adviceHistory").click(function (){
        $("#messageList").empty();
         getQuestionList();
        $.mobile.changePage("#adviceList", { transition: "slideup", changeHash: false });

    });

    $("#submitQuestion").click(function () {

            $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/yy/askQuestion.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {userId:localStorage.getItem('userId'),username: escape($("#username").val()), doctorid: localStorage.getItem('currentDoctorID'), content: escape($("#questionAsk").val()),
                    doctorname: escape(localStorage.getItem('currentDoctorName'))
                },
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                   alert("提问成功！");

                },
                error: function (error) {
                    alert("提问失败！");
                }
            });


            function jsonpCallback(data) //回调函数
            {
                alert(data.message); //
            }

        }

    );
 function getDoctors() {

            $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/yy/doctorView.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {userId:localStorage.getItem('userId')
                },
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                    var data = json.magazineTab.records;
                    $.each(data, function(i, n){
                        addDoctor(n);

                    });
                    $("#listDoctor").listview("refresh");
                    var ulHomes = $("#listDoctor")[0].children;

                    $(ulHomes).each(function(){
                        $(this).click(function(){
                            localStorage.setItem('currentID', this.id);

                            $.each(data, function(i, n){
                                if(n.ID==localStorage.getItem('currentID')){
                                    localStorage.setItem('currentDoctorName', unescape(n.username));
                                    localStorage.setItem('currentDoctorID', n.ID);
                                    $("#doctorUsername")[0].innerText=unescape(n.username);
                                    //$("#doctorSex")[0].innerText=$("#doctorSex")[0].innerText.substr(0,3)+(unescape(n.sex)=="man"?"男":"女");
                                    //$("#doctorBirthday")[0].innerText=$("#doctorBirthday")[0].innerText.substr(0,3)+ages(unescape(n.birthday));
                                    $("#doctorTitle")[0].innerText=unescape(n.title);
                                    $("#doctorRemark")[0].innerText=unescape(n.remark);
                                    $("#doctorAddress")[0].innerText=unescape(n.address);
                                    //$("#doctorSickContent")[0].innerText=$("#doctorSickContent")[0].innerText.substr(0,3)+unescape(n.sickContent);
                                    //$("#doctorSickDate")[0].innerText=$("#doctorSickDate")[0].innerText.substr(0,3)+ages(unescape(n.sickDate));

                                }

                            });

                            $.mobile.changePage("#doctorDetail", { transition: "slideup", changeHash: false });
                        });

                    });
                   // hideLoader();

                },
                error: function (error) {
                    alert("erroe");
                }
            });


            function jsonpCallback(data) //回调函数
            {
                alert(data.message); //
            }

        }

    $("#submitQuestionMore").click(function () {

            $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/yy/askMoreQuestion.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {userId:localStorage.getItem('userId'),username: escape($("#username").val()), doctorid: localStorage.getItem('currentDoctorID'), content: escape($("#questionAskMore").val()),
                    doctorname: escape(localStorage.getItem('currentDoctorName')),currentChatId:localStorage.getItem('currentChatId'),isDoctor:1
                },
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                    alert("提问成功！");
                    $("#messageDetails").empty();
                    getmessageDetail( localStorage.getItem('currentChatId'));
                   // localStorage.setItem('currentChatId', this.id);

                },
                error: function (error) {
                    alert("提问失败！");
                }
            });


            function jsonpCallback(data) //回调函数
            {
                alert(data.message); //
            }

        }

    );
    function getQuestionList() {

        $.ajax({
            type: "get",
            url: 'http://www.ysrule.com/yy/doctorPrivateQuestion.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
            data: {doctorid:localStorage.getItem('currentDoctorID')
            },
            cache: true, //默认值true
            dataType: "jsonp",
            jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "jsonpCallback",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
            success: function (json) {
                var data = json.magazineTab.records;
                $.each(data, function(i, n){
                    addQuestions(n);

                });
               $("#messageList").listview("refresh");
                   var ulHomes = $("#messageList")[0].children;

                $(ulHomes).each(function(){
                    if(this.id!=""){
                    $(this).click(function(){
                         $("#messageDetails").empty();
                         getmessageDetail(this.id);
                        localStorage.setItem('currentChatId', this.id);
                        $.mobile.changePage("#adviceListDetail", { transition: "slideup", changeHash: false });
                    });
                    }

                });

            },
            error: function (error) {
                alert("erroe");
            }
        });


        function jsonpCallback(data) //回调函数
        {
            alert(data.message); //
        }

    }

    function getmessageDetail(parentid){
        $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/yy/questionListDetails.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {parentid:parentid
                },
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                    var data = json.magazineTab.records;
                    $.each(data, function(i, n){
                        addQuestionDetails(n);

                    });
                     $("#messageDetails").listview("refresh");
                    //               var ulHomes = $("#listDoctor")[0].children;

//                    $(ulHomes).each(function(){
//                        $(this).click(function(){
//                            localStorage.setItem('currentID', this.id);
//
//                            $.each(data, function(i, n){
//                                if(n.ID==localStorage.getItem('currentID')){
//                                    localStorage.setItem('currentDoctorName', unescape(n.username));
//                                    localStorage.setItem('currentDoctorID', n.ID);
//                                    $("#doctorUsername")[0].innerText=unescape(n.username);
//                                    //$("#doctorSex")[0].innerText=$("#doctorSex")[0].innerText.substr(0,3)+(unescape(n.sex)=="man"?"男":"女");
//                                    //$("#doctorBirthday")[0].innerText=$("#doctorBirthday")[0].innerText.substr(0,3)+ages(unescape(n.birthday));
//                                    //$("#doctorJob")[0].innerText=$("#doctorJob")[0].innerText.substr(0,3)+unescape(n.job);
//                                    //$("#doctorSickContent")[0].innerText=$("#doctorSickContent")[0].innerText.substr(0,3)+unescape(n.sickContent);
//                                    //$("#doctorSickDate")[0].innerText=$("#doctorSickDate")[0].innerText.substr(0,3)+ages(unescape(n.sickDate));
//
//                                }
//
//                            });
//
                        //   $.mobile.changePage("#adviceListDetail", { transition: "slideup", changeHash: false });
//                        });
//
//                    });

                },
                error: function (error) {
                    alert("erroe");
                }
            });


            function jsonpCallback(data) //回调函数
            {
                alert(data.message); //
            }

        }

    $("#compare").click(function () {

            $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/yy/searchFolder.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {userId:localStorage.getItem('userId'),username: escape($("#username").val()), career: $("#career").val(), birthday: $("#birthday").val(),
                    sex: $('input[type="radio"][name="sex"]:checked').val(),sickDate:$("#sickDate").val(),sickContent:escape($("#sickContent").html().substring(15).substr(0,$("#sickContent").html().substring(15).length-5))
                },
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                    var data = json.magazineTab.records;
                    $.each(data, function(i, n){
                        addLi(n);

                    });

                    $.mobile.changePage("#similiarCase", { transition: "none", changeHash: false });
                    $("#listViewUser").listview("refresh");
                    var ulHomes = $("#listViewUser")[0].children;

                    $(ulHomes).each(function(){
                        $(this).click(function(){
                            localStorage.setItem('currentID', this.id);
                            $.each(data, function(i, n){
                               if(n.ID==localStorage.getItem('currentID')){
                                   $("#detailUsername")[0].innerText=unescape(n.username);
                                   $("#detailSex")[0].innerText=$("#detailSex")[0].innerText.substr(0,3)+(unescape(n.sex)=="man"?"男":"女");
                                   $("#detailBirthday")[0].innerText=$("#detailBirthday")[0].innerText.substr(0,3)+ages(unescape(n.birthday));
                                   $("#detailJob")[0].innerText=$("#detailJob")[0].innerText.substr(0,3)+unescape(n.job);
                                   $("#detailSickContent")[0].innerText=$("#detailSickContent")[0].innerText.substr(0,3)+unescape(n.sickContent);
                                   $("#detailSickDate")[0].innerText=$("#detailSickDate")[0].innerText.substr(0,3)+ages(unescape(n.sickDate));

                               }

                            });

                            $.mobile.changePage("#userDetail", { transition: "slideup", changeHash: false });
                        });

                    });

                },
                error: function (error) {
                    alert("erroe");
                }
            });


            function jsonpCallback(data) //回调函数
            {
                alert(data.message); //
            }

        }

    );
    function  ages(str)
    {
        var r =  str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if(r==null)return false;
        var d= new  Date(r[1],r[3]-1,r[4]);
        if(d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])
        {
            var Y = new Date().getFullYear();
            return (Y-r[1]);
        }
        return "error";
    }
    function addLi(obj) {
        var ul=$("#listViewUser");
        var li= document.createElement("li");
        var href_a = document.createElement("a");
        var head = document.createElement("h2");
        var img = document.createElement("img");
        href_a.innerHTML="<img src='../img/apple.png'><h2>"+unescape(obj.username)+"</h2><p>"+unescape(obj.sickContent)+"</p> <p class='ui-li-aside'>iOS</p>";
        //href_a.href="javascript:del('"+id+"');";
       // href_a.innerHTML ="del";
        //li.innerHTML=txt;
        //li.id=id;
        li.innerHTML= href_a.outerHTML;
        li.id=obj.ID;
        li.class="userListClass";
        ul[0].innerHTML+=li.outerHTML;
    }
    function addDoctor(obj) {
        var ul=$("#listDoctor");
        var li= document.createElement("li");
        var href_a = document.createElement("a");
        var head = document.createElement("h2");
        var img = document.createElement("img");
        href_a.innerHTML="<img src='images/apple.jpg'><h2>"+unescape(obj.username)+"</h2><p>"+unescape(obj.remark)+"</p> <p class='ui-li-aside'>iOS</p>";
        //href_a.href="javascript:del('"+id+"');";
        // href_a.innerHTML ="del";
        //li.innerHTML=txt;
        //li.id=id;
        li.innerHTML= href_a.outerHTML;
        li.id=obj.ID;
        li.class="userListClass";
        ul[0].innerHTML+=li.outerHTML;
    }


    function addQuestions(obj) {

       var ul=$("#messageList");
       //" <ul data-role='listview'  class='ui-listview' data-inset='true' role='listbox' >"+
       var listStr= "<li data-role='list-divider' role='heading' tabindex='0' class='ui-li ui-li-divider ui-btn ui-bar-b ui-btn-up-c' style='font-size:8pt;font-weight:normal'>"+
           unescape(obj.username)+" 发布于："+unescape(obj.createtime)+
           "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:55px;background: url(../images/comment.png) no-repeat;padding:3px;padding-left:20px'>34</span>"+
           "<span onclick='spanClick("+obj.ID+");' class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:5px;" +
           "background: url(images/like.png) no-repeat;padding:4px;padding-left:20px'>"+obj.agreenumber+"</span></li>"+
           "<li id='"+obj.ID+"' role='option' tabindex='0' data-theme='c' >"+
            "<a href='#'>"+
                "<img width='40' height='40' src='images/apple.jpg'/>"+
                "<div style='font-size:9pt;font-weight:normal;'>"+unescape(obj.content)+"</div></a></li>";
       // $("#messageList").append(listStr);

        ul[0].innerHTML+=listStr;
    }
    function addQuestionDetails(obj) {
        var ul=$("#messageDetails");
        var listStr="";
        if(obj.isDoctor!="True"){
            listStr= "<li data-role='list-divider' role='heading' tabindex='0' data-theme='c' class='ui-li ui-li-divider ui-btn ui-bar-e ui-btn-up-d' style='font-size:8pt;font-weight:normal'>"+
            unescape(obj.username)+" 发布于："+unescape(obj.createtime)+
            "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:55px;background: url(../images/comment.png) no-repeat;padding:3px;padding-left:20px'>34</span>"+
            "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:5px;background: url(../images/like.gif) no-repeat;padding:3px;padding-left:20px'>442</span></li>"+
            "<li id='"+obj.ID+"' role='option' tabindex='0' data-theme='c' >"+
            "<a href='#'>"+
            "<img width='40' height='40' src='images/apple.jpg'/>"+
            "<div style='font-size:9pt;font-weight:normal;'>"+unescape(obj.content)+"</div></a></li>";
        }else{
             listStr= "<li data-role='list-divider'  role='heading' tabindex='0' class='ui-li ui-li-divider ui-btn-b ui-bar-e ui-btn-up-c' style='font-size:8pt;font-weight:normal'>"+
                unescape(obj.doctorname)+" 发布于："+unescape(obj.createtime)+
                "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:55px;background: url(../images/comment.png) no-repeat;padding:3px;padding-left:20px'>34</span>"+
                "<span class='ui-li-count ui-btn-up-c ui-btn-corner-all' style='right:5px;background: url(../images/like.gif) no-repeat;padding:3px;padding-left:20px'>442</span></li>"+
                "<li id='"+obj.ID+"' role='option' tabindex='0' data-theme='c' >"+
                "<a href='#'>"+
                "<img width='40' height='40' src='images/apple.jpg'/>"+
                "<div style='font-size:9pt;font-weight:normal;'>"+unescape(obj.content)+"</div></a></li>";
        }
        ul[0].innerHTML+=listStr;
    }
    function setMySituation() {
        if (localStorage.getItem('my-1') == "true") {
             $("#my-1").attr('checked','true') ;
        }
        if (localStorage.getItem('my-2') == "true") {
            $("#my-2").attr('checked','true') ;
        }
        if (localStorage.getItem('my-3') == "true") {
            $("#my-3").attr('checked','true') ;
        }
        if (localStorage.getItem('my-4') == "true") {
            $("#my-4").attr('checked','true') ;
        }
        if (localStorage.getItem('my-5') == "true") {
            $("#my-5").attr('checked','true') ;
        }
        if (localStorage.getItem('my-6') == "true") {
            $("#my-6").attr('checked','true') ;
        }
        if (localStorage.getItem('my-7') == "true") {
            $("#my-7").attr('checked','true') ;
        }
        if (localStorage.getItem('my-8') == "true") {
            $("#my-8").attr('checked','true') ;
        }
        if (localStorage.getItem('my-9') == "true") {
            $("#my-9").attr('checked','true') ;
        }
        if (localStorage.getItem('my-10') == "true") {
            $("#my-10").attr('checked','true') ;
        }

    }
    function getmysitution() {
        var txt = '';
        if (localStorage.getItem('my-1') == "true") {
            txt = txt + trim($("#my-1").prev('label').text());
        }
        if (localStorage.getItem('my-2') == "true") {
            txt =txt+',' + trim($("#my-2").prev('label').text());
        }
        if (localStorage.getItem('my-3') == "true") {
            txt = txt+',' + trim($("#my-3").prev('label').text());
        }
        if (localStorage.getItem('my-4') == "true") {
            txt = txt+',' + trim($("#my-4").prev('label').text());
        }
        if (localStorage.getItem('my-5') == "true") {
            txt = txt+',' +trim( $("#my-5").prev('label').text());
        }
        if (localStorage.getItem('my-6') == "true") {
            txt = txt+',' + trim($("#my-6").prev('label').text());
        }
        if (localStorage.getItem('my-7') == "true") {
            txt = txt+',' + trim($("#my-7").prev('label').text());
        }
        if (localStorage.getItem('my-8') == "true") {
            txt = txt+',' + trim($("#my-8").prev('label').text());
        }
        if (localStorage.getItem('my-9') == "true") {
            txt = txt+',' + trim($("#my-9").prev('label').text());
        }
        if (localStorage.getItem('my-10') == "true") {
            txt = txt+',' + trim($("#my-10").prev('label').text());
        }
        $("#sickContent").append('从' + $("#sickDate").val() + '开始： ' + txt + ' 点击修改');
    }

    $("#submitmy").click(function () {

        //alert($("#my-1").prev('label').text());
        localStorage.setItem('my-1', $("#my-1").prop("checked"));
        localStorage.setItem('my-2', $("#my-2").prop("checked"));
        localStorage.setItem('my-3', $("#my-3").prop("checked"));
        localStorage.setItem('my-4', $("#my-4").prop("checked"));
        localStorage.setItem('my-5', $("#my-5").prop("checked"));
        localStorage.setItem('my-6', $("#my-6").prop("checked"));
        localStorage.setItem('my-7', $("#my-7").prop("checked"));
        localStorage.setItem('my-8', $("#my-8").prop("checked"));
        localStorage.setItem('my-9', $("#my-9").prop("checked"));
        localStorage.setItem('my-10', $("#my-10").prop("checked"));
        localStorage.setItem('sickdate', $("sickdate").text());
        $("#situation").hide();
        //alert($("#my-1").prev('label').text());
        $("#sickContent").show();
        $("#sickContent").empty();
        getmysitution();
        $("#sickContent").click(function () {
            $.mobile.changePage("#mysituaton", { transition: "none", changeHash: false });
        });

        $.mobile.changePage("#register", { transition: "none", changeHash: false });
    });


    $("#submit3").click(function () {
        localStorage.setItem('s7', $('input[type="radio"][name="s7"]:checked').val());
        localStorage.setItem('phoneNumber', $('#phoneNumber').val());
        // $.mobile.changePage( "#survey-3", { transition: "slideup", changeHash: false });


        $.ajax({
            type: "get",
            url: 'http://www.ysrule.com/ysrule/survey.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
            data: {id: 10, code: $("#phoneNumber").val()},
            cache: true, //默认值true
            dataType: "jsonp",
            jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
            jsonpCallback: "jsonpCallback",
            //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
            //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
            success: function (json) {
                alert(json.message);
            },
            error: function (error) {
                alert("erroe");
            }
        });


        function jsonpCallback(data) //回调函数
        {
            alert(data.message); //
        }

    });

    $("#submitques").click(function () {
        if (!localStorage.getItem('phoneNumber')) {
            alert(1);
        } else {
            $.ajax({
                type: "get",
                url: 'http://www.ysrule.com/ysrule/question.asp', //实际上访问时产生的地址为: ajax.ashx?callbackfun=jsonpCallback&id=10
                data: {id: 10, code: localStorage.getItem('phoneNumber'), question: $('#question').val()},
                cache: true, //默认值true
                dataType: "jsonp",
                jsonp: "callbackfun",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                jsonpCallback: "jsonpCallback",
                //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
                //如果这里自定了jsonp的回调函数，则success函数则不起作用;否则success将起作用
                success: function (json) {
                    if (json.message == 0) {
                        alert('提交成功！');
                    }
                },
                error: function (error) {
                    alert("error");
                }
            });
        }


        function jsonpCallback(data) //回调函数
        {
            alert(data.message); //
        }


    });

});