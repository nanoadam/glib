/**
  * GLIB Version 1.5
  * Created by Gqtour
  * Copyright 2020.
*/

/**
  * Changelog for Version 1.5:
  *   - Added Array [first(), last()]
  *
  * Changelog for Version 1.4:
  *   - Added Cacher
  *   - Reorganized Things
  *
  * Changelog for Version 1.3:
  *   - CustomEventListener now uses Map instead of a Array or JSON Object
  *   - Removed get_prototype_of for each custom function I made
  *   - Renamed get_prototype_of to prototypeOf
  *
*/

// Custom Functions

/*
  Printing
*/
function log(text) {
	if (!text)
		return console.error("Log: Improper use, please provide what to log.");
	console.log(text);
}

function print(text) {
	if (!text)
		return console.error("Print: Improper use, please provide what to log.");
	console.log(text);
}

/*
  Elements
*/
function prototypeOf(a) {
	if (!a) 
		return console.error(`No type provided, please provide a type. Example: [ get_prototype_of(JSON) ]`);
	if (a.prototype) 
		return a.prototype;
    return a.__proto__;
}

/*
  Colors
*/
function random_rgb_color() {
	return {
		r: Math.floor(Math.random() * 255),
		g: Math.floor(Math.random() * 255),
		b: Math.floor(Math.random() * 255)
	}
}

random_rgb_color.prototype.toHex = function() {
	return console.error("Random RGB Color: Unimplemented use of toHex.");
}


// STRINGS
String.prototype.toArray = function() {
	if (this === null) return console.error(`Uh oh! It looks like I'm null!`);
	var string = String(this);
	let arr = [];
	arr.push(string);
	return arr;
};

// MAPS 
Map.prototype.toJSON = function() {
    let json = {};
    this.forEach((val, key) => {
        json[key] = val;
    });
    return json;
}

// JSON
JSON.__proto__.set = function(a, b) {
	if (!a)
		return console.error(`No value selected, please select what to set! Example: [ myjson.set("bob", true); ]`);
	if (!b)
		return console.error(`No value selected, please select what to set! Example: [ myjson.set("bob", true); ]`);
	return this[a] = b;
}

JSON.__proto__.get = function(a) {
	if (!a) 
		return console.error(`No value selected, please select what to set! Example: [ myjson.get("bob"); - Returns the value of myjson["bob"] ]`);
	return this[a];
}

JSON.__proto__.toString = function() {
    return JSON.stringify(this);
}

// ARRAY
Array.prototype.remove = function(thing) {
    if (!thing)
        return console.error("TypeError: missing argument 0 when calling function Array.prototype.remove");
    for (var i = 0; i < this.length; i++) {
        if (this[i] === thing) {
            if (this.indexOf(thing) >= 0) {
                this.splice(this.indexOf(thing), 1);
            }
        }
    }
    return this;
}

Array.prototype.first = function() {
	return this[0];
}

Array.prototype.last = function() {
	return this[this.length - 1];
}

// MATH
Math.__proto__.getRandomNumber = function(b) {
	if (!b)
		return console.error("Math: Missing number value to suppy randomness.");
	if (typeof b !== "number") 
		return console.error("Math: Please provide a number! Example: [ Math.randomNumber(323) - Returns random number between 0-323. ]");
    return Math.floor(Math.random() * b);
}

// FILEREADER / INPUT TYPE=FILE
function FileInputManager(files) {
    let callbackRes = () => {};
    const promise = new Promise(function(res, rej) {
        callbackRes = res;
    });

    // Make sure we were provided file_input.files
    if (!files || typeof files !== "object")
        return console.error("FileInputManager: Missing file_input_element.files, please provide it so I can run!");

    let reader = new FileReader();
    let file = files[0];
    let types = file.type.split("/");
    let full_type = types[0] === "" ? "empty" : types.join("/");

    // Make sure we have a file
    if (!file)
        return console.error("FileInputManager: No file selected, maybe something went wrong?");

    // Determine How To Read The File By Testing The Mime-Type
    let determine_read_type = function() {
        switch (types[0]) {
            case "image":
                return reader.readAsDataURL(file);
            case "text":
                return reader.readAsText(file);
            case "application":
                return reader.readAsText(file);
            default:
                console.warn(`FileInputManager: File reading has been aborted, file type [type: ${full_type}] unsupported.`);
                break;
        }
    }

    determine_read_type();

    reader.onload = function() {
        callbackRes(reader.result);
    };

    this.getResult = function() {
        switch(types[1]) {
            case "octet-stream":
                return console.error(`FileInputManager: Unable to provide result, file type [type: ${full_type}] not allowed.`);
            default:
                return promise;
        }
    }

    this.getFileName = function() {
        if (!file.name)
            return console.error("FileInputManager: The file doesn't have a name.");
        return file.name;
    }

    this.getFileSize = function() {
        if (!file.size)
            return console.error("FileInputManager: The file doesn't have a size, something must have went wrong...");
        return file.size;
    }

    this.getFileLastModified = function() {
        if (!file.lastModified)
            return console.error("FileInputManager: The file doesn't contain a lastModified date...");
        return new Date(file.lastModified);
    }

    this.getFileMimeType = function() {
        if (types.length <= 0)
            return console.error("FileInputManager: Mime-Type is missing, something must have went wrong...");
        return String(types.join("/"));
    }

    return;
}

// Custom EVENTS LISTENER!!!
class CustomEventListener {
	constructor() {
		this.listeners = new Map();
	}

	addEventListener(name, callback) {
		if (!this.listeners.get(name)) {
			this.listeners.set(name, []);
		}
		this.listeners.get(name).push(callback);
		return;
	}

	removeEventListener(name) {
		if (!this.listeners.get(name)) {
			return console.error(`CustomEventListener: No event with name '${name}' to remove.`);
		}
		this.listeners.delete(name);
		return;
	}

	emit(name, ...args) {
		this.listeners.get(name).forEach(callback => {
			callback(...args);
		});
		return;
	}
}

// Cacher
class Cacher {
    constructor() {
        this.cache_storage = [];
		this.listener = new CustomEventListener();
    }
	
	addEventListener(name, callback) {
		this.listener.addEventListener(name, callback);
	}
	
	encode(data) { return (data ? btoa(JSON.stringify(data)) : null); }
	decode(data) { return (data ? atob(data) : null); }
	
    cache(data) { this.cache_storage.push(btoa(JSON.stringify(data))); this.listener.emit("cache", btoa(JSON.stringify(data))); }
	
	contains(data) { this.cache_storage.forEach(item => { if (atob(item) === data) { return true; } }); return false; }
	forEach(callback) { if (!callback) return; this.cache_storage.forEach(item => callback(item)); }
}