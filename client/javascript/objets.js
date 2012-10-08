//function d'héritage du prototype
function _extends(dst, src) {
    dst = dst.prototype;
    src = src.prototype; 
    for (var element in src) {
        dst[element] = src[element]; 
    } 
}

function findOffset(obj) {
    var curX = curY = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft + obj.clientLeft;
            curY += obj.offsetTop + obj.clientTop;
        } while (obj = obj.offsetParent);
	return {x:curX,y:curY};
    }
}

function Graphics(canvas){
    this._graphics = new Array();
    this._graphicDrag = undefined;
    Graphics.canvas = canvas;
    Graphics.ctx = Graphics.canvas.getContext('2d');
    Graphics.pos = findOffset(Graphics.canvas);
    var _instance = this;
    Graphics.canvas.onmousemove = function(e){
	_instance.onMove(e);
    }
    Graphics.canvas.onmousedown = function(e){
	_instance.onDown(e);
    }
    Graphics.canvas.onmouseup = function(e){
	_instance.onUp(e);
    }
} 

Graphics.prototype.getGraphicDrag = function(){
    return this._graphicDrag;
}
Graphics.prototype.setGraphicDrag = function(graphicDrag){
    this._graphicDrag = graphicDrag;
}

Graphics.prototype.getGraphics = function(){
    if(arguments == undefined || arguments.length == undefined || arguments.length == 0){
        return this._graphics;
    }
    else{
	return this._graphics[arguments[0]];
    }
}

Graphics.prototype.pushGraphic = function(graphic){
    if(this.getGraphics() == undefined){
	this._graphics = new Array();
    }
    this.getGraphics().push(graphic);
}

Graphics.prototype.popGraphic = function(graphic){
    if(this.getGraphics() == undefined){
	return;
    }
    this.getGraphics().pop(graphic);
}

Graphics.prototype.draw = function(){
    Graphics.ctx.fillStyle = "#ffffff";
    Graphics.ctx.clearRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
    var length = this.getGraphics().length;
    for( i=0; i<length; i++){
	var graphic = this.getGraphics(i);
	if(graphic.draw != undefined){
	    graphic.draw();
	}
    }
}

Graphics.prototype.onMove = function(e){
    var length = this.getGraphics().length;i
    var x = e.pageX - Graphics.pos.x;
    var y = e.pageY - Graphics.pos.y;
    if(this.getGraphicDrag() != undefined){
	this.getGraphicDrag().setX(x);
	this.getGraphicDrag().setY(y);
	this.draw();	
    }
    for( i=0; i<length; i++){
        var graphic = this.getGraphics(i);
        if(graphic.isDraggable() && graphic.isInPath != undefined && graphic.isInPath(x, y)){
            Graphics.canvas.style.cursor = "pointer";
	    return;
        }
    }
    Graphics.canvas.style.cursor = "default";
}

Graphics.prototype.onDown = function(e){
    var length = this.getGraphics().length;
    var x = e.pageX - Graphics.pos.x;
    var y = e.pageY - Graphics.pos.y;
    for( i=0; i<length; i++){
        var graphic = this.getGraphics(i);
        if(graphic.isDraggable() && graphic.isInPath != undefined && graphic.isInPath(x, y)){
	    this.setGraphicDrag(graphic);
	    logger.info("startDrag");
	    return;
        }
    }
}

Graphics.prototype.onUp = function(e){
    this.setGraphicDrag(undefined); 
    logger.info("stop Drag");
}

// Classes des functions graphiques
function Graphic(x, y){
    this._x = x;
    this._y = y;
    this._color = undefined;
    this._borderWidth = undefined;
    this._borderColor = undefined;
    this._hover = false;
    this._draggable = false;
}

Graphic.prototype.getColor = function(){
    return this._color;
}
Graphic.prototype.setColor = function(color){
    this._color = color;
}

Graphic.prototype.getX = function(){
    return this._x;
}
Graphic.prototype.setX = function(x){
    this._x = x;
}

Graphic.prototype.getY = function(){
    return this._y;
}
Graphic.prototype.setY = function(y){
    this._y = y;
}

Graphic.prototype.getBorderColor = function(){
    return this._borderColor;
}
Graphic.prototype.setBorderColor = function(borderColor){
    this._borderColor = borderColor;
}

Graphic.prototype.getBorderWidth = function(){
    return this._borderWidth;
}
Graphic.prototype.setBorderWidth = function(borderWidth){
    this._borderWidth = borderWidth;
}

Graphic.prototype.isHover = function(){
    return this._hover;
}
Graphic.prototype.setHover = function(hover){
    this._hover = hover;
}

Graphic.prototype.isDraggable = function(){
    return this._draggable;
}
Graphic.prototype.setDraggable = function(draggable){
    this._draggable = draggable;
}

Graphic.prototype.initDraw = function(){
    if(this.getColor() != undefined && this.getColor() != null){
        Graphics.ctx.fillStyle = this.getColor();
    }
    else{
	Graphics.ctx.fillStyle = Graphic.defaultColor;
    }
    if(this.getBorderColor() != undefined && this.getBorderColor() != null){
            Graphics.ctx.strokeStyle = this.getBorderColor();
    }
    else{
        Graphics.ctx.strokeStyle= Graphic.defaultBorderColor;
    }    
    if(this.getBorderWidth() != undefined && this.getBorderWidth() != null){
        Graphics.ctx.lineWidth = this.getBorderWidth();	 
    }
    else{
        Graphics.ctx.lineWidth = Graphic.defaultBorderWidth;
    }
}

Graphic.prototype.isInPath = function(e){
    return false;
}

Graphic.defaultBorderWidth = 1;
Graphic.defaultBorderColor = "#000000";
Graphic.defaultColor = "#ffffff";

function Rectangle(x, y, width, height){
    Graphic.call(this, x, y);
    this. _height = height;
    this._width = width;
}
_extends(Rectangle, Graphic);

Rectangle.prototype.getWidth = function(){
    return this._width;
}
Rectangle.prototype.setWidth = function(width){
    this._width = width;
}

Rectangle.prototype.getHeight = function(){
    return this._height;
}
Rectangle.prototype.setHeight = function(height){
    this._height = height;
}

Rectangle.prototype.draw = function(){
    if(Graphics.ctx == undefined || Graphics.ctx == null){
	return;
    }
    this.initDraw();
    logger.trace("Rectangle.draw");
    Graphics.ctx.fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    Graphics.ctx.strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
}

Rectangle.prototype.isInPath = function(x, y){
    if (x >= this.getX()  && x <= this.getX() +this.getWidth() 
	&& y >= this.getY() && y <= this.getY() + this.getHeight()){
	return true;
    }
    return false; 
i}

function Circle(x, y, width){
    Graphic.call(this, x, y);
    this._width = width;
}
_extends(Circle, Graphic);

Circle.prototype.getWidth = function(){
    return this._width;
}
Circle.prototype.setWidth = function(width){
    this._width = width;
}

Circle.prototype.draw = function(){
    if(Graphics.ctx == undefined || Graphics.ctx == null){
	return;
    }
    this.initDraw();
    logger.trace("Circle.draw");
    Graphics.ctx.beginPath();
    Graphics.ctx.arc(this.getX(), this.getY(), this.getWidth(), 0, 2*Math.PI);
    Graphics.ctx.fill();
    Graphics.ctx.stroke();
}
