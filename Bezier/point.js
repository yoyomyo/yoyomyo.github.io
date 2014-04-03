//point class

POINT_RADIUS = 8;
TOLERANCE = 5;

function Point(x,y){
    this.x = x;
    this.y = y;
    this.active = false;

}

Point.prototype.draw = function(ctx){
    ctx.lineWidth=5;
    ctx.strokeStyle='black';
    ctx.beginPath();
    ctx.arc(this.x,this.y,POINT_RADIUS,0,2*Math.PI);
    ctx.stroke();

    if(this.active){
        ctx.fillStyle = 'black';  
    }else{
        ctx.fillStyle = 'white';
    }
    ctx.fill();
}

Point.prototype.equal = function(pt){
    return Math.abs(this.x - pt.x) < POINT_RADIUS + TOLERANCE && Math.abs(this.y - pt.y) < POINT_RADIUS + TOLERANCE;
}