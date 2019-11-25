import * as importTest from './import-test';

const es6Test = "Babel is functioning.";



$(() => {
  console.log(es6Test);
  importTest.importTest();
  console.log('This is an object import: ',importTest.testObject.key);
});


$(document).ready(function() {
	$('#multiscroll').multiscroll({
    anchors: ['header', 'aboutme', 'projects', 'contact' , 'footer'],

   
    afterLoad: function(anchorLink, index){
        


			//using anchorLink
			if(anchorLink !== 'header'){
				$('.navul').children().addClass('smaller')
			}else{
        $('.navul').children().removeClass('smaller')
      }

      if(anchorLink == 'aboutme'){
        $('.aboutmelink').addClass('active')
        $('ul, img, .typewriter, .headerme').addClass('entermove')
      }else{
        $('.aboutmelink').removeClass('active')
        $('ul, img, .typewriter, .headerme').removeClass('entermove')
      }

      if(anchorLink == 'projects'){
        $('.animatewrapperpr, .headerpr').addClass('entermove')
        $('.projectslink').addClass('active')
        
      }else{
        $('.projectslink').removeClass('active')
        $('.animatewrapperpr, .headerpr').removeClass('entermove')
      }

      if(anchorLink == 'contact'){
        $('.contactlink').addClass('active')
        $('.animatewrapper, .headercontact').addClass('entermove')
        $('.animatewrapper2').addClass('entermove2')
      }else{
        $('.contactlink').removeClass('active')
        $('.animatewrapper, .headercontact').removeClass('entermove')
        $('.animatewrapper2').removeClass('entermove2')
      }

      if(anchorLink == 'footer'){
        $('.footerlink').addClass('active')
      }else{
        $('.footerlink').removeClass('active')
      }

      
		}
  });
});


$(document).ready(function(){
  $('.projectslides').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: false,
    nextArrow: false,
    fade: true,
    cssEase: 'cubic-bezier(.300, -0.280, 0.735, 0.045)',
    
    infinite: true
    
    });
})


// $(document).ready(function(){
//   function checkclass(){
//   if(!$('body').hasClass('ms-viewing-header')){
//     $('.navul').children().addClass('smaller')
//   }else{
//     $('.navul').children().removeClass('smaller')
//   }

//   if($("body").hasClass("ms-viewing-aboutme")){
//     $('.aboutmelink').addClass('active');
    
//   }else{
//     $('.aboutmelink').removeClass('active');
//   }
  
// }

// })



// $(document).ready(function(){
 

//   $(".burger3").click(function(){
//     $(".burger3").toggleClass("open");
//     $('#nav').toggleClass('show');
//     $('.links').toggleClass('show');
//   })
  
// })

$(document).ready(function(){
  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
    }

    setTimeout(function() {
    that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid black}";
    document.body.appendChild(css);
};
})





