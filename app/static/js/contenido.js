var mobile='<div class="parlex2-back"><div class="w-container"><div class="wrap"><div class="separador"></div><div class="separador"></div><div class="separador"></div><div class="separador"></div><div class="process"><h1 class="our-process-heading" id="usuariostitu"></h1></div><div class="separador"></div><div class="process-text contenedor5"><div class="separaicon" id="link1"><div class="w-row"><div class="w-col w-col-2"><a id="linkusuario1" href="#link1"><h4 class="usuarios-titu titulosclientes" id="tipousuario1"></h4></a></div></div><div class="w-row" ><div id="contenidousuario1"></div></div></div><div id="link2" class="separaicon"><div class="w-row"><div class="w-col w-col-2"><a href="#link2" id="linkusuario2"><h4 class="usuarios-titu titulosclientes" id="tipousuario2"></h4></a></div></div><div class="w-row"><div id="contenidousuario2"></div></div></div><div id="link3" class="separaicon"><div class="w-row"><div class="w-col w-col-2"><a href="#link3" id="linkusuario3"><h4 class="usuarios-titu titulosclientes" id="tipousuario3"></h4></a></div></div><div class="w-row"><div id="contenidousuario3"></div></div></div><div id="link4" class="separaicon"><div class="w-row"><div class="w-col w-col-2"><a href="#link4" id="linkusuario4"><h4 class="usuarios-titu titulosclientes" id="tipousuario4"></h4></a></div></div><div class="w-row"><div id="contenidousuario4"></div></div></div><div id="link5" class="separaicon"><div class="w-row"><div class="w-col w-col-2"><a href="#link5" id="linkusuario5"><h4 class="usuarios-titu titulosclientes" id="tipousuario5"></h4></a></div></div><div  class="w-row"><div id="contenidousuario5"></div></div></div><div id="link6" class="separaicon"><div class="w-row"><div class="w-col w-col-2"><a href="#link6" id="linkusuario6"><h4 class="usuarios-titu titulosclientes" id="tipousuario6"></h4></a></div></div><div class="w-row"><div id="contenidousuario6"></div></div></div></div><div class="separador"></div><div class="separador"></div><div class="separador"></div></div></div></div></div>';
    
var compu='<div class="parlex2-back"><div class="w-container"><div class="wrap"><div class="separador"></div><div class="separador"></div><div class="separador"></div><div class="process"><h1 class="our-process-heading" id="usuariostitu"></h1></div><div class="separador"></div><div class="process-text contenedor5"><div class="w-row"><div class="w-col w-col-2"><a href="#users" id="linkusuario1"><h4 class="usuarios-titu titulosclientes" id="tipousuario1"></h4></a></div><div class="w-col w-col-2"><a href="#users" id="linkusuario2"><h4 class="usuarios-titu titulosclientes" id="tipousuario2"></h4></a></div><div class="w-col w-col-2"><a href="#users" id="linkusuario3"><h4 class="usuarios-titu titulosclientes" id="tipousuario3"></h4></a></div><div class="w-col w-col-2"><a href="#users" id="linkusuario4"><h4 class="usuarios-titu titulosclientes" id="tipousuario4"></h4></a></div><div class="w-col w-col-2"><a href="#users" id="linkusuario5"><h4 class="usuarios-titu titulosclientes" id="tipousuario5"></h4></a></div><div class="w-col w-col-2"><a href="#users" id="linkusuario6"><h4 class="usuarios-titu titulosclientes" id="tipousuario6"></h4></a></div></div><div class="w-row" id="tipocontenido"><div id="contenidousuario1"></div><div id="contenidousuario2"></div><div id="contenidousuario3"></div><div id="contenidousuario4"></div><div id="contenidousuario5"></div><div id="contenidousuario6"></div></div></div></div></div></div>';

var lang = 'espanol';

$(function() {
    
    if($( window ).width()<798){
        $("#users").html(mobile);
    }else{
        $("#users").html(compu);
    }
    
    
    var idiomauser = window.navigator.userLanguage || window.navigator.language;
    if(idiomauser.match("es")){
       lang = 'espanol';       
    }
    else{
       lang = 'english';
    }
    idioma(lang);
    
    
    
    activareventos();
    
}); 


function activareventos(){
    var a1=0,a2=0,a3=0,a4=0,a5=0,a6=0;


    $( "#tipousuario1" ).click(function() {
        deshabilitar();
        $("#linkusuario1").toggleClass( "activo" );
        desactivarclase(1);        
        if(a1==0){
            $("#contenidousuario1").css({display:'inherit'});
            resetnumeros();
            a1=1;
            return;
        }
        else{
            resetnumeros();
        }
    });
    $( "#tipousuario2" ).click(function() {
        deshabilitar();
        $("#linkusuario2").toggleClass( "activo" );
        desactivarclase(2);
        if(a2==0){
            $("#contenidousuario2").css({display:'inherit'});
            resetnumeros();
            a2=1;
            return;
        }
        else{
            resetnumeros();
        }
    });
    $( "#tipousuario3" ).click(function() {
        deshabilitar();
        $("#linkusuario3").toggleClass( "activo" );
        desactivarclase(3);
        if(a3==0){
            $("#contenidousuario3").css({display:'inherit'});
            resetnumeros();
            a3=1;
            return;
        }
        else{
            resetnumeros();
        }
    });
    $( "#tipousuario4" ).click(function() {
        deshabilitar();
        $("#linkusuario4").toggleClass( "activo" );
        desactivarclase(4);
        if(a4==0){
            $("#contenidousuario4").css({display:'inherit'});
            resetnumeros();
            a4=1;
            return;
        }
        else{
            resetnumeros();
        }
    });
    $( "#tipousuario5" ).click(function() {
        deshabilitar();
        $("#linkusuario5").toggleClass( "activo" );
        desactivarclase(5);
        if(a5==0){
            $("#contenidousuario5").css({display:'inherit'});
            resetnumeros();
            a5=1;
            return;
        }
        else{
            resetnumeros();
        }
    });
    $( "#tipousuario6" ).click(function() {
        deshabilitar();
        $("#linkusuario6").toggleClass( "activo" );
        desactivarclase(6);
        if(a6==0){
            $("#contenidousuario6").css({display:'inherit'});
            
            resetnumeros();
            a6=1;
            return;
        }
        else{
            a6=0;
        }
    });

    function desactivarclase(numero){
        switch(numero){
                case 1:
                $("#linkusuario2").removeClass( "activo" );
                $("#linkusuario3").removeClass( "activo" );
                $("#linkusuario4").removeClass( "activo" );
                $("#linkusuario5").removeClass( "activo" );
                $("#linkusuario6").removeClass( "activo" );
                break;
                case 2:
                $("#linkusuario1").removeClass( "activo" );
                $("#linkusuario3").removeClass( "activo" );
                $("#linkusuario4").removeClass( "activo" );
                $("#linkusuario5").removeClass( "activo" );
                $("#linkusuario6").removeClass( "activo" );
                break;
                case 3:
                $("#linkusuario1").removeClass( "activo" );
                $("#linkusuario2").removeClass( "activo" );
                $("#linkusuario4").removeClass( "activo" );
                $("#linkusuario5").removeClass( "activo" );
                $("#linkusuario6").removeClass( "activo" );
                break;
                case 4:
                $("#linkusuario1").removeClass( "activo" );
                $("#linkusuario2").removeClass( "activo" );
                $("#linkusuario3").removeClass( "activo" );
                $("#linkusuario5").removeClass( "activo" );
                $("#linkusuario6").removeClass( "activo" );
                break;
                case 5:
                $("#linkusuario1").removeClass( "activo" );
                $("#linkusuario2").removeClass( "activo" );
                $("#linkusuario3").removeClass( "activo" );
                $("#linkusuario4").removeClass( "activo" );
                $("#linkusuario6").removeClass( "activo" );
                break;
                case 6:
                $("#linkusuario1").removeClass( "activo" );
                $("#linkusuario2").removeClass( "activo" );
                $("#linkusuario3").removeClass( "activo" );
                $("#linkusuario4").removeClass( "activo" );
                $("#linkusuario5").removeClass( "activo" );
                break;
                
        }
    }
    function deshabilitar(){
        $( "a#contenidousuario6" )
        $("#contenidousuario1").css({display:'none'});
        $("#contenidousuario2").css({display:'none'});
        $("#contenidousuario3").css({display:'none'});
        $("#contenidousuario4").css({display:'none'});
        $("#contenidousuario5").css({display:'none'});
        $("#contenidousuario6").css({display:'none'});
    }
    function resetnumeros(){
        a1=a2=a3=a4=a5=a6=0;           
    }
}



var flag2 =0;
var esmovil=0;

window.onresize = function(event) {
    
    if($( window ).width()<798){
        esmovil=1;
    }
    else{
        esmovil=0;
    }
    
    if(esmovil!=flag2){
        
        flag2=esmovil;
    
        if($( window ).width()<798){
            $("#users").html(mobile);
        }
        else{
            $("#users").html(compu);
        }

        idioma(lang);

        activareventos();
    }
    
}
var contacerca="";


function idioma(language) {
    $.ajax({
        url: 'xml/languages.xml',
        success: function(xml) {
            $(xml).find('translation').each(function(){
                var id = $(this).attr('id');
                var text = $(this).find(language).html();
                
                if(id=="acercacontenido"){
                    contacerca=text;
                    text=corteacerca(language,contacerca,0);
                }
                
                $("#" + id).html(text);
                
            });
        }
    });
};


function corteacerca(language,text,controlaccion){
    if(controlaccion==0){
        if(language="espanol"){
            text=contacerca.substr(0, 651);
        }else{
            text=contacerca.substr(0, 500);
        }
    }
    else{
        if(language="espanol"){
            text=contacerca;
        }else{
            text=contacerca;
        }
    }
    return text;
    
}







var flag = 0;

$(function(){
    var stickyNavTop = 70;
    var stickyNav = function(){
        var scrollTop = $(window).scrollTop();
        if (scrollTop > stickyNavTop) {
            
            if(flag==0){
                flag=1;
                $("#logo").css("display","inherit");
                $(".fixed-header").css("position","fixed");
                $(".fixed-header").css("top","-41px");
                $(".fixed-header").animate({top:'0px'});
                $(".fixed-header").css({background:'rgba(62, 101, 114, 0.95)'});

            }

        } else {
            if(flag==1){
                flag=0;
                $("#logo").css("display","none");
                $(".fixed-header").css("position","absolute");
                $(".fixed-header").css({background:'rgba(62, 101, 114, 0.1)'});
                
            }
        }

        
    };
    stickyNav();
            
    $(window).scroll(function() {
        stickyNav();
    });

});


banderamas=0;

$( "#masabout" ).click(function() {
    if(banderamas==0){
        $("#acercacontenido").html(corteacerca(lang,contacerca,1));
        
        $("#imagenmasmenos").attr("src", "images/less.png")
        banderamas=1;
        return;
    }
    else{
        banderamas=0;
        $("#acercacontenido").html(corteacerca(lang,contacerca,0));
        $("#imagenmasmenos").attr("src", "images/more.png")
    }   
    
    if(esmovil==1){
        window.location.href = "#linkcorreo";
    }
    else{
        window.location.href = "#iniciotext";
    }
    
});
        