$(document).ready(function(){

    $('.toggle').click(function(){
        $('.toggle').toggleClass('active')
    })



    $('.owl-carousel').owlCarousel({
        loop:true,
        margin:10,
        lazyLoad:true,
        dots:false,
        autoplay:true,
        autoplayTime:2000,
        responsive:{
            0:{
                items:3,
            },
            767:{
                items:6,
            },
            1200:{
                items:9
            }
        }
    })

});
