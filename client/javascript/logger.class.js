

function Logger()
{
    if (arguments.callee.instance)
        return arguments.callee.instance;
    arguments.callee.instance = this;
    this.level = undefined;
    var test=2;
}

Logger.prototype.set_level = function(_level){
    this.level = _level;
}
Logger.prototype.get_level = function(){
    return this.level;
}

Logger.prototype.log = function(message, priority){
    if(priority >= this.get_level()){
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
