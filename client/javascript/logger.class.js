

function Logger()
{
    if (arguments.callee._instance)
        return arguments.callee._instance;
    arguments.callee._instance = this;
    this._level = Enum.Logger.OFF;
}

Logger.prototype.setLevel = function(level){
    this._level = level;
}
Logger.prototype.getLevel = function(){
    return this._level;
}

Logger.prototype.log = function(message, priority){
    if(priority >= this.getLevel()){
        console.log(message);
    }
}
Logger.prototype.trace = function(message){
    this.log("TRACE :"+message, Enum.Logger.TRACE);
}
Logger.prototype.debug = function(message){
    this.log("DEBUG :"+message, Enum.Logger.DEBUG);
}
Logger.prototype.info = function(message){
    this.log("INFO :"+message, Enum.Logger.INFO);
}
Logger.prototype.warn = function(message){
    this.log("WARN :"+message, Enum.Logger.WARN);
}
Logger.prototype.error = function(message){
    this.log("ERROR :"+message, Enum.Logger.ERROR);
}
Logger.prototype.fatal = function(message){
    this.log("FATAL :"+message, Enum.Logger.FATAL);
}

var logger = new Logger();
