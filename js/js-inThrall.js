function addClass (el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else if (!hasClass(el, className)) {
		el.className += " " + className
	}
}

function removeClass (el, className) {
	if (el.classList) {
		el.classList.remove(className);
	} else if (hasClass(el, className)) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		el.className = el.className.replace(reg, ' ')
	}
}

function hasClass(el, className) {
	if (el.classList) {
		return el.classList.contains(className)
	} else {
		return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
	}
}
function checkBowerInPc(){
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return "mobile"
    } else {
        return "pc"
    }
}
function loadUserInfo() {
	// Close the login from
	var loginDailog = UIkit.modal(".uk-modal");
	if (loginDailog) {
		loginDailog.hide();
	}
	// Display the user name on the top right. and set the link.
	var userInfo = getCurrentUserInfo();
    var isPc=checkBowerInPc()
    // UIkit.offcanvas('#sc-nav-mobile').show();
	if (userInfo) {
		// hide login button
        if(isPc=='pc'){
            
                  $("#divNotLogin").hide();
         
                  // display user info
                  $("#divUserInfo").removeClass();
                  $("#lnkUserName").html(userInfo.userName);

        }else{
            $("#divNotLogin2").hide();
            $("#lnkUserName2").html(userInfo.userName);
        }
         
        
	
	}
}

function getCurrentUserInfo() {

	if (localStorage["UserInfo"]) {
		return JSON.parse(localStorage["UserInfo"]);
	}
	return null;
}

function logout() {
	localStorage.clear();
	location.reload();
}

function redirectTo(sectionName) {
    window.location = sectionName;
}

function buyNow(product) {
    // check if the user login
    if (localStorage["UserInfo"] == null) {
        window.location = "admin/login_page.html?from=buynow&type=login&product=" + product + "&amount=" + $("#txt" + product + "Price").html() + "&promocode=" + $("#txt" + product + "PromoCode").val();
    } else {
        window.location = "admin/forms_subscription.html?product=" + product + "&amount=" + $("#txt" + product + "Price").html() + "&promocode=" + $("#txt" + product + "PromoCode").val();
    }
}
// input events
UIkit.util.on('input, textarea', 'blur', function () {
	if (this.value === '') {
		removeClass(this, 'sc-input-filled');
	}
	else {
		addClass(this, 'sc-input-filled');
	}
});

// hide offcanvas on scrolled
UIkit.util.on('.sc-js-scroll-trigger', 'scrolled', function () {
	UIkit.offcanvas('#sc-nav-mobile').hide();
});

function ajaxInCode(type, code, price, el,i) {
    let url = `/api/promo/getpromo?code=${code}&type=${type}`
    $.ajax({
        type: "get",
        url: url,
        success: function (data) {
            if(Math.abs(data.result*1)=='99'){
                UIkit.notification("The promo code not correct", { status: 'warning',pos:'top-left'});
                return false;
            }else{
                el.text(data.result);
                if(data.result==='0.00'){ //go to free and auto buy code
                    var productList=['PayAsYouGo','Starter','Professional','AdvancedUser']
                    setTimeout(()=>{
                        buyNow(productList[i])
                    },1000)
                }
               
            }
        },
        error: function (e) {
           
        }
    })
}
function hasReferralcode(url){
   var code= new URL(window.location.href).searchParams.get("referralcode")   
    return {
        flag:code?true:false,
        code:code
    }
}
$(document).ready(function () {
    //   $('.downLoadApp').on('click',function(e){
    //       var src="https://play.google.com/store/apps/details?id=com.inthrall.wavgenerator"
            
        
    //       var a=document.createElement('a')   
    //       a.setAttribute('href',src)
          
    //       a.setAttribute('target','_blank')
   

    //       a.click()
       
    //   })
     // deal referralcode
        // https://inthrall.studio/index.html?referralcode=xxx`
    var url=window.location.href;
    var result=hasReferralcode(url)
    if(result.flag){
        sessionStorage.setItem("invitcode",result.code)
    }else{
        sessionStorage.removeItem('invitcode')
    }

    $("#btnSendMessage").click(function () {
        var requiredFields = "";
        var name = $("#txtName").val();
        if (name == "") {
            requiredFields = requiredFields + "#txtName";
        }
        var email = $("#txtEmail").val();
        if (email == "") {
            requiredFields = requiredFields + ",#txtEmail";
        }
        var message = $("#txtMessage").val();
        if (message == "") {
            requiredFields = requiredFields + ",#txtMessage";
        }
        requiredFields = requiredFields.replace(/^\,+|\,+$/g, "");
        $("input,textarea").css("border", "");
        $("input,textarea").css("box-shadow", "");

        // Checking for blank fields.
        if (requiredFields != "") {
            $(requiredFields).css("border", "2px solid red");
            $(requiredFields).css("box-shadow", "0 0 3px red");
            UIkit.notification("Please fill required fields.", { status: 'danger' });
        }
        else {
            var data = {
                name: name,
                email: email,
                message: message
            };
            $.ajax({
                url: '/api/SiteMessage/CreateSiteMessage',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function (data) {
                    var result = JSON.stringify(data);
                    if (data.result == "") {
                        UIkit.modal.alert('We received your message, comment and/or inquiry. We have assigned it to a senior manager at inThrall and will contact you in a manner of hours!').then(function () {
                            $("input,textarea").val("");
                        });
                    }
                    else {
                        UIkit.modal.alert(data.result).then(function () {
                        });
                    }
                },
                error: function (err) {
                    var errorMsg = "";
                    switch (err.status) {
                        case 500:
                            // Display error message
                            errorMsg = err.responseJSON.message;
                            break;
                        default:
                            console.log(err);
                            break;
                    }

                    if (errorMsg != "") {
                        UIkit.notification(errorMsg, { status: 'danger' })
                    }

                }
            });
        }
    });

    loadUserInfo();

    //apply code
    var array = ['enterCode_Pay', 'enterCode_start', 'enterCode_Professional', 'enterCode_Advanced']

    //save baseCost
    var baseCost={
        'enterCode_Pay':$('.kind_type1 .price .value').text(),
        'enterCode_start':$('.kind_type2 .price .value').text(),
        'enterCode_Professional':$('.kind_type3 .price .value').text(),
        'enterCode_Advanced':$('.kind_type4 .price .value').text()
    }
   
   
    $.each(array, function (index, el) {
        
        $('.' + el).on('click', function (e) {
            var type = $(`.kind_type${index + 1} .name`).text();
            var ele = $(`.kind_type${index + 1} .price .value`)
            var basePrice = baseCost[el]
            var i=index
            var code = $(`.kind_type${index + 1} .codeInput input`).val()
            if (code) {
                ajaxInCode(type, code, basePrice, ele,i)

            } else {
                UIkit.notification("Please enter your promo code", { status: 'warning',pos:'top-left'});
                return false
            }
        })
       $(`.kind_type${index + 1} .codeInput input`).on('input', function (e) {
           var code = $(e.target).val();
          
            if(code ==''){
              $(`.kind_type${index + 1} .price .value`).text( baseCost[el])

            }
        })


    })

    $('#startBtn').on('click',function(e){
        e.preventDefault()
        var num =$(e.target).attr('data-num')
        if(num>0){
            //
         
            var freeType="PayAsYouGo"
            var freePrice='0.00'
            var freeCode="HarryFree"
            if (localStorage["UserInfo"] == null) {
                window.location = "admin/login_page.html?from=buynow&type=login&product=" + freeType + "&amount=" + freePrice + "&promocode=" +freeCode;
            } 
        }
    })
});