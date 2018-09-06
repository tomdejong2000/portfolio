// Checks browser and adds class to body 
$(document).ready(function() {
     if((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1 ) 
        {
            $('body').addClass('opera');
        }
        else if(navigator.userAgent.indexOf("Chrome") != -1 )
        {
            $('body').addClass('chrome');
        }
        else if(navigator.userAgent.indexOf("Safari") != -1)
        {
            $('body').addClass('safari');
        }
        else if(navigator.userAgent.indexOf("Firefox") != -1 ) 
        {
            $('body').addClass('firefox');
        }
        else if((navigator.userAgent.indexOf("MSIE") != -1 ) || (document.documentMode === true )) //IF IE > 10
        {
            $('body').addClass('ie10Up');
        }  
        else if((navigator.userAgent.indexOf("Trident/7.0") != -1 ) || (document.documentMode === true )) //IF IE < 10
        {
            $('body').addClass('ie9Down');
        }  
        else 
        {
            $('body').addClass('unknown');
        }
});