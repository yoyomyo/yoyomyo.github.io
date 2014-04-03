function Curve(){

	//a bunch of control points
	this.cPoints = [];
	this.lPoints = [];
	this.curveType = Curve.types.STRAIGHT_LINE; //default to staight line
	this.activePointIndex = -1;
}

Curve.types = {
    STRAIGHT_LINE : 0,
    BEZIER : 1,
    B_SPLINE : 2
}

Curve.prototype.updateActivePoint = function(pos){
	for(var i in curve.cPoints){
        if(curve.cPoints[i].equal(pos)){
            curve.cPoints[i].active = true;
            //selected = curve.cPoints[i];
            this.activePointIndex = i;
        }else{
            curve.cPoints[i].active = false;
        }
    }
    return curve.cPoints[this.activePointIndex]; //return the active point as pointer for future updates
}

Curve.prototype.draw = function(ctx, levelOfDetails){
    if (this.cPoints.length > 0) {
        this.connectTheDots(ctx);
    }
}

Curve.prototype.connectTheDots = function(ctx){
    ctx.lineWidth=3;
    
    if(this instanceof Bezier){
        ctx.strokeStyle='#eee';
    }else{
        ctx.strokeStyle='#000';
    }
    
	for(var i = 0; i<this.cPoints.length-1; i++){
		ctx.beginPath();
      	ctx.moveTo(this.cPoints[i].x, this.cPoints[i].y);
      	ctx.lineTo(this.cPoints[i+1].x, this.cPoints[i+1].y);
      	ctx.stroke();
	}
	for(var i in this.cPoints){
        this.cPoints[i].draw(ctx);
    }
}

Curve.prototype.drawLine = function(ctx, pt1, pt2){
	ctx.beginPath();
  	ctx.moveTo(pt1.x, pt1.y);
  	ctx.lineTo(pt2.x, pt2.y);
  	ctx.stroke();
}

Curve.prototype.drawNormals = function(){

}



//BEZIER
function Bezier(){
	Curve.call(this);
	this.curveType = Curve.types.BEZIER
}
Bezier.prototype = Object.create(Curve.prototype);


Bezier.prototype.draw = function(ctx, levelOfDetail){
	
	if(this.cPoints.length > 1)
    {
        this.lPoints=[];
        //this.normals.clear();
        for(var j = 0; j <= levelOfDetail; j++)
        {
            t = j/(levelOfDetail+0.0);
            p = this.deCasteljau(t, this.cPoints);
            this.lPoints.push(p);
        }

        for(var i=0; i<this.lPoints.length-1; i++)
        {
            this.drawLine(ctx, this.lPoints[i], this.lPoints[i+1]);
        }
        //this.drawNormals();
    }
    this.connectTheDots(ctx);
}

Bezier.prototype.deCasteljau = function(u, points){
	n = points.length-1;

	//initialize an matrix to store the state of computation
	var ps = [];
	for(var i = 0; i<n+1; i++){
		ps[i] = [];
		for(var j =0; j<n+1; j++){
			ps[i][j] = 0;
		}
	}
    for(var level= n; level>=0; level--)
    {
        if(level==n)
        {
            for(var i=0; i<=n; i++){
                ps[level][i] = points[i];
            }
            continue;
        }
        for(var i =0 ; i <= level; i++)
        {
            var a = (1-u)*ps[level+1][i].x + u*ps[level+1][i+1].x;
            var b = (1-u)*ps[level+1][i].y + u*ps[level+1][i+1].y;

            ps[level][i] = new Point(a,b);
        }
    }
    return ps[0][0];
}

