//自适应px转rem
$(function () {
    globalResize();
    $(window).resize(function () {
        globalResize();
    })
    function globalResize() {
        var width = $("body").width();

        var fontSize = 32 / 750 * width;
        //console.log(fontSize);
        $("html").css("font-size", fontSize.toString() + "px");
    }
})
