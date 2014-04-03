var canvas=document.getElementById("canvas");
canvas.width = 640;
canvas.height = 480;
var ctx=canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();
canvas.addEventListener('click', onMouseClick);
canvas.addEventListener('mousedown', onMouseDown);
canvas.addEventListener('mouseup', onMouseUp);
canvas.addEventListener('mousemove', onMouseMove);

var selected = null;
var dragged = false;
var levelOfDetail = 20;


var curve = new Curve();

function getMousePos(e){
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    return new Point(x,y);
}
function onMouseClick(e){

    var p = getMousePos(e);
    var addPoint = true;
    for(var i in curve.cPoints){
        if(curve.cPoints[i].equal(p)){
            curve.cPoints[i].active = true;
            addPoint = false;
        }else{
            curve.cPoints[i].active = false;
        }
    }    
    if(addPoint){
        p.active = true; 
        curve.cPoints.push(p)
    };
    redraw();
    
}

function onMouseDown(e){
    dragged = true;
    var pos = getMousePos(e);
    selected = curve.updateActivePoint(pos);
}

function onMouseMove(e){
    if (!dragged) {
        return;
    }
    p = getMousePos(e);
    if(selected){
        selected.x = p.x;
        selected.y = p.y;       
    }
    redraw();    
}

function onMouseUp(e){
    dragged = false;
}

function redraw(){
    ctx.clear("#FFF");
    curve.draw(ctx,levelOfDetail);
}

ctx.clear = function(fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(0,0,rect.width, rect.height);
};

$('#curveType').change(function(){
    var type = +$('#curveType').find('input:checked').val();
    var cPoints = curve? curve.cPoints: [];
    if(type === Curve.types.STRAIGHT_LINE){
        curve = new Curve();
        curve.cPoints = cPoints;        
    }else if(type === Curve.types.BEZIER){
        curve = new Bezier();
        curve.cPoints = cPoints; 
    }else if(type === Curve.types.B_SPLINE){
        curve = new BSpline();
        curve.cPoints = cPoints;         
    }
    redraw();
})

$('#levelOfDetail').html(levelOfDetail);
$( "#slider" ).slider({
      range: "min",
      max: 100,
      value: levelOfDetail,
      slide: updateLevelOfDetail,
      change: updateLevelOfDetail    
});


function updateLevelOfDetail() {
    levelOfDetail = $( "#slider" ).slider( "value" );
    $('#levelOfDetail').html(levelOfDetail);
    redraw();
}
