//function d'héritage du prototype
function _extends(dst, src) {
    dst = dst.prototype;
    src = src.prototype;
    var i;
    for (i in src) {
        if (src.hasOwnProperty(i)) {
            dst[i] = src[i];
        }
    }
}

function findOffset(obj) {
    var curX = 0, curY = 0;
    if (obj.offsetParent) {
        do {
            curX += obj.offsetLeft + obj.clientLeft;
            curY += obj.offsetTop + obj.clientTop;
        } while (obj === obj.offsetParent);
    }
    return {x : curX, y : curY};
}

function Clone(o) {
    var i;
    for (i in o) {
        if (o.hasOwnProperty(i)) {
            this[i] = o[i];
        }
    }
}

function Graphics(canvas) {
    this._graphics = [];
    this._graphicDrag = undefined;
    this._mouseX = undefined;
    this._mouseY = undefined;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._pos = findOffset(canvas);
    var _instance = this;
    canvas.onmousemove = function (e) { _instance.onMove(e); };
    canvas.onmousedown = function (e) { _instance.onDown(e); };
    canvas.onmouseup = function (e) { _instance.onUp(e); };
}

Graphics.prototype.getPos = function () {
    return this._pos;
};
Graphics.prototype.setPos = function (pos) {
    this._pos = pos;
};

Graphics.prototype.getCtx = function () {
    return this._ctx;
};
Graphics.prototype.setCtx = function (ctx) {
    this._ctx = ctx;
};

Graphics.prototype.getCanvas = function () {
    return this._canvas;
};
Graphics.prototype.setCanvas = function (canvas) {
    this._canvas = canvas;
};

Graphics.prototype.getMouseX = function () {
    return this._mouseX;
};
Graphics.prototype.setMouseX = function (mouseX) {
    this._mouseX = mouseX;
};

Graphics.prototype.getMouseY = function () {
    return this._mouseY;
};
Graphics.prototype.setMouseY = function (mouseY) {
    this._mouseY = mouseY;
};

Graphics.prototype.getGraphicDrag = function () {
    return this._graphicDrag;
};
Graphics.prototype.setGraphicDrag = function (graphicDrag) {
    this._graphicDrag = graphicDrag;
};

Graphics.prototype.getGraphics = function (i) {
    if (i === undefined || i === null) {
        return this._graphics;
    }
    return this._graphics[i];
};

Graphics.prototype.pushGraphic = function (graphic) {
    if (this.getGraphics() === undefined) {
        this._graphics = [];
    }
    this.getGraphics().push(graphic);
};

Graphics.prototype.popGraphic = function (i) {
    if (this.getGraphics() === undefined) {
        return;
    }
    if (i === undefined || i === null) {
        return this.getGraphics().pop();
    }
    var index = this.getGraphics().indexOf(i);
    if (index !== -1) {
        this.getGraphics().slice(index, 1);
    }
};

Graphics.prototype.fireDraw = function () {
    this.draw();
};

Graphics.prototype.draw = function () {
    this.getCtx().fillStyle = "#ffffff";
    this.getCtx().clearRect(0, 0, this.getCanvas().width, this.getCanvas().height);
    var length = this.getGraphics().length, i, graphic;
    for (i = 0; i < length; i = i + 1) {
        graphic = this.getGraphics(i);
        if (graphic.draw !== undefined) {
            graphic.draw();
        }
    }
};

Graphics.prototype.onMove = function (e) {
    var x, y, newX, newY, length, i, graphic;
    length = this.getGraphics().length;
    x = e.pageX - this.getPos().x;
    y = e.pageY - this.getPos().y;
    if (this.getGraphicDrag() !== undefined && (this.getMouseX() !== x || this.getMouseY() !== y)) {
        newX = this.getGraphicDrag().getX() - (this.getMouseX() - x);
        newY = this.getGraphicDrag().getY() - (this.getMouseY() - y);
        this.getGraphicDrag().moveTo(newX, newY);
    }
    this.setMouseX(x);
    this.setMouseY(y);
    for (i = 0; i < length; i = i + 1) {
        graphic = this.getGraphics(i);
        if (graphic.isDraggable() && graphic.isInPath !== undefined && graphic.isInPath(x, y)) {
            this.getCanvas().style.cursor = "pointer";
            return;
        }
    }
    this.getCanvas().style.cursor = "default";
};

Graphics.prototype.onDown = function (e) {
    var length, x, y, graphic, i;
    length = this.getGraphics().length;
    x = e.pageX - this.getPos().x;
    y = e.pageY - this.getPos().y;
    for (i = 0; i < length; i = i + 1) {
        graphic = this.getGraphics(i);
        if (graphic.isDraggable() && graphic.isInPath !== undefined && graphic.isInPath(x, y)) {
            graphic.drag();
            this.setGraphicDrag(graphic);
            logger.info("startDrag");
            return;
        }
    }
};

Graphics.prototype.onUp = function (e) {
    if (this.getGraphicDrag() !== undefined) {
        this.getGraphicDrag().drop(e);
    }
    this.setGraphicDrag(undefined);
    logger.info("stop Drag");
};

// Classes des functions graphiques
function Graphic(graphics, x, y) {
    this._graphics = graphics;
    this._x = x;
    this._y = y;
    this._color = undefined;
    this._borderWidth = undefined;
    this._borderColor = undefined;
    this._draggable = false;
    this._state = [];
}

Graphic.prototype.moveTo = function (newX, newY) {
    this.setX(newX);
    this.setY(newY);
    this.getGraphics().fireDraw();
};

Graphic.prototype.drag = function () {
    var copy = new Clone(this);
    this.pushState(copy);
};

Graphic.prototype.drop = function (e, graphics) {
    var copy = this.popState();
    this.setX(copy._x);
    this.setY(copy._y);
    this.getGraphics().fireDraw(); 
};

Graphic.prototype.getState = function () {
    return this._state;
};
Graphic.prototype.pushState = function (state) {
    if (this._state === undefined) {
        this._state = [];
    }
    this._state.push(state);
};
Graphic.prototype.popState = function (i) {
    if (this.getState() === undefined) {
        return;
    }
    if (i === undefined || i === null) {
        return this.getState().pop();
    }
    var index = this.getState().indexOf(i);
    if (index !== -1) {
        this.getState().slice(index, 1);
    }
};

Graphic.prototype.getGraphics = function () {
    return this._graphics;
};
Graphic.prototype.setGraphics = function (graphics) {
    this._graphics = graphics;
};

Graphic.prototype.getColor = function () {
    return this._color;
};
Graphic.prototype.setColor = function (color) {
    this._color = color;
};

Graphic.prototype.getX = function () {
    return this._x;
};
Graphic.prototype.setX = function (x) {
    this._x = x;
};

Graphic.prototype.getY = function () {
    return this._y;
};
Graphic.prototype.setY = function (y) {
    this._y = y;
};

Graphic.prototype.getBorderColor = function () {
    return this._borderColor;
};
Graphic.prototype.setBorderColor = function (borderColor) {
    this._borderColor = borderColor;
};

Graphic.prototype.getBorderWidth = function () {
    return this._borderWidth;
};
Graphic.prototype.setBorderWidth = function (borderWidth) {
    this._borderWidth = borderWidth;
};

Graphic.prototype.isDraggable = function () {
    return this._draggable;
};
Graphic.prototype.setDraggable = function (draggable) {
    this._draggable = draggable;
};

Graphic.prototype.initDraw = function () {
    if (this.getColor() !== undefined && this.getColor() !== null) {
        this.getGraphics().getCtx().fillStyle = this.getColor();
    } else {
        this.getGraphics().getCtx().fillStyle = Graphic.defaultColor;
    }
    if (this.getBorderColor() !== undefined && this.getBorderColor() !== null) {
        this.getGraphics().getCtx().strokeStyle = this.getBorderColor();
    } else {
        this.getGraphics().getCtx().strokeStyle = Graphic.defaultBorderColor;
    }
    if (this.getBorderWidth() !== undefined && this.getBorderWidth() !== null) {
        this.getGraphics().getCtx().lineWidth = this.getBorderWidth();
    } else {
        this.getGraphics().getCtx().lineWidth = Graphic.defaultBorderWidth;
    }
};

Graphic.prototype.isInPath = function () {
    return false;
};

Graphic.defaultBorderWidth = 1;
Graphic.defaultBorderColor = "#000000";
Graphic.defaultColor = "#ffffff";

function Rectangle(graphics, x, y, width, height) {
    Graphic.call(this, graphics, x, y);
    this._height = height;
    this._width = width;
}
_extends(Rectangle, Graphic);

Rectangle.prototype.getWidth = function () {
    return this._width;
};
Rectangle.prototype.setWidth = function (width) {
    this._width = width;
};

Rectangle.prototype.getHeight = function () {
    return this._height;
};
Rectangle.prototype.setHeight = function (height) {
    this._height = height;
};

Rectangle.prototype.draw = function () {
    if (this.getGraphics().getCtx() === undefined || this.getGraphics().getCtx() === null) {
        return;
    }
    this.initDraw();
    logger.trace("Rectangle.draw");
    this.getGraphics().getCtx().fillRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    this.getGraphics().getCtx().strokeRect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
};

Rectangle.prototype.isInPath = function (x, y) {
    if (x >= this.getX() && x <= this.getX() + this.getWidth() && y >= this.getY() && y <= this.getY() + this.getHeight()) {
        return true;
    }
    return false;
};

Rectangle.prototype.drop = function () {
    this.popState();
};

function Circle(graphics, x, y, width) {
    Graphic.call(this, graphics, x, y);
    this._width = width;
}
_extends(Circle, Graphic);

Circle.prototype.getWidth = function () {
    return this._width;
};
Circle.prototype.setWidth = function (width) {
    this._width = width;
};

Circle.prototype.draw = function () {
    if (this.getGraphics().getCtx() === undefined || this.getGraphics().getCtx() === null) {
        return;
    }
    this.initDraw();
    logger.trace("Circle.draw");
    this.getGraphics().getCtx().beginPath();
    this.getGraphics().getCtx().arc(this.getX(), this.getY(), this.getWidth(), 0, 2 * Math.PI);
    this.getGraphics().getCtx().fill();
    this.getGraphics().getCtx().stroke();
};

Circle.prototype.isInPath = function (x, y) {
    if (x >= this.getX() - this.getWidth() && x <= this.getX() + this.getWidth() && y >= this.getY() - this.getWidth() && y <= this.getY() + this.getWidth()) {
        return true;
    }
    return false;
};
