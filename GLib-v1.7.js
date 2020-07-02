/**
  * GLIB Version 1.7
  * Created by Gqtour
  * Copyright 2020.
*/

/**
  * Changelog for Version 1.7:
  *   - Added parseHTML() to allow you to parse html strings into a DOCUMENT
  *   - Added CustomError to allow adding of Custom Errors (Errors with a custom name)
  *   - Added ASSERT(<operation>) to make sure the provided operation is TRUE else throw Error!
  *   - Added dbg() as a simple debug function to print out stuff with "DEBUG: " before it...
  *   - Added RandomID to generate custom/random id's (strings). Arguments: RandomID(options: { length: Number: 1, filter: Array: [] });
  *   - Added Object.toMap() to convert the object into a Map.
  *   - Fixed Spelling mistake in getRandomNumber.
  *   - Fixed Error Message in prototypeOf & made it cleaner.
  *   - Made print() & log() & dbg() return when used.
  *   - Cleaned up String.toArray()
  *   - Switched Back to Error using CustomError
  *   - Switched from JSON.__proto__ to Object.prototype
  *   - Condensed Code as much as possible without making it look bad
  *
  * Changelog for Version 1.6:
  *   - Added JSON [reverse()] // Reverses the Keys of the JSON therefor '{name:"john"}' will turn into '{john:"name"}'
  *   - Redid random_rgb_color and renamed it to RandomColor
  *
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
  Helpers
*/

function CustomError(name, value) {
    let err = new Error(value);
    err.name = name;
    return err;
}

function ASSERT(m) {
    let b = Boolean(m);
    if (!b) return new CustomError("Assertion Failed", b);;
}

/*
  Printing
*/
function log(text) {
    return console.log(text);
}

function print(text) {
    return console.log(text);
}

function dbg(...text) {
    return console.warn("Debug:", ...text);
}

/*
  Elements
*/
function prototypeOf(a) {
    if (!a) return new CustomError("prototypeOf", `No type provided, please provide a type. Example: [ prototypeOf(JSON) ]`);
    return ((a.prototype !== undefined) ? a.prototype : a.__proto__);
}

function parseHTML(str) {
    if (!str) str = `<!DOCTYPE html><html><head></head><body></body></html>`;
    return new DOMParser().parseFromString(str, "text/html");
}

/*
  Colors
*/
function RandomColor() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return { rgb: { r, g, b }, hex }
}

// STRINGS
String.prototype.toArray = function () {
    return [String(this)];
};

// NUMBERS
function RandomID(options = { length: 5, filter: [] }) {
	if (!options.filter)
		options.filter = [];
	if (!options.length)
		options.length = 5;
	let final_id = [];
	let letters = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890\`~!@#$%^&*()_+-=[]{}|;:,.<>/?\\`;
	let length = options.length - 1;
	let filter = options.filter;
	let hasFilter = (filter.length >= 1);
	if (length > letters.length) 
		return new CustomError("RandomID", "Maximum length allowed is " + letters.length + ".");
	for (var i = 0; i < letters.length; ++i) {
		if (final_id.length > length)
			return final_id.join("");
		let r = Math.floor(Math.random() * letters.length);
		if (hasFilter) {
			if (filter.includes(letters[r])) 
				continue;
		}
		final_id[i] = letters[r];
	}
	return final_id.join("");
}

// MAPS 
Map.prototype.toJSON = function () {
    let json = {};
    this.forEach((val, key) => {
        json[key] = val;
    });
    return json;
}

// JSON
Object.prototype.set = function (a, b) {
    if (!a) return new CustomError("Object", `No value selected, please select what to set! Example: [ myjson.set("bob", true); ]`);
    if (!b) return new CustomError("Object", `No value selected, please select what to set! Example: [ myjson.set("bob", true); ]`);
    return this[a] = b;
}

Object.prototype.get = function (a) {
    if (!a) return new CustomError("Object", `No value selected, please select what to set! Example: [ myjson.get("bob"); - Returns the value of myjson["bob"] ]`);
    return this[a];
}

Object.prototype.toString = function () {
    return JSON.stringify(this);
}

Object.prototype.reverse = function () {
    let keys = Object.keys(this);
    let new_json = {};
    keys.forEach(key => {
        new_json[this[key]] = key;
    });
    return new_json;
}

Object.prototype.toMap = function () {
    let keys = Object.keys(this);
    let new_map = new Map();
    for (i = 0; i < keys.length; ++i) {
        final_map.set(keys[i], this[keys[i]]);
    }
    return new_map;
}

// ARRAY
Array.prototype.remove = function (thing) {
    if (!thing) return new CustomError("TypeError", "missing argument 0 when calling function Array.prototype.remove");
    for (var i = 0; i < this.length; i++) if (this[i] === thing) if (this.indexOf(thing) >= 0) this.splice(this.indexOf(thing), 1);
    return this;
}

Array.prototype.first = function () {
    return this[0];
}

Array.prototype.last = function () {
    return this[this.length - 1];
}

// MATH
Math.__proto__.getRandomNumber = function (b) {
    if (!b) return new CustomError("Math", "Missing number value to supply randomness.");
    if (typeof b !== "number") return new CustomError("Math", "Please provide a number! Example: [ Math.randomNumber(323) - Returns random number between 0-323. ]");
    return Math.floor(Math.random() * b);
}

// FILEREADER / INPUT TYPE=FILE
function FileInputManager(files) {
    let callbackRes = () => { };
    const promise = new Promise(function (res, rej) {
        callbackRes = res;
    });
    // Make sure we were provided file_input.files
    if (!files || typeof files !== "object")
        return new Error("FileInputManager: Missing file_input_element.files, please provide it so I can run!");
    let reader = new FileReader();
    let file = files[0];
    let types = file.type.split("/");
    let full_type = types[0] === "" ? "empty" : types.join("/");
    // Make sure we have a file
    if (!file)
        return new CustomError("FileInputManager", "No file selected, maybe something went wrong?");
    // Determine How To Read The File By Testing The Mime-Type
    let determine_read_type = function () {
        switch (types[0]) {
            case "image": return reader.readAsDataURL(file);
            case "text": return reader.readAsText(file);
            case "application": return reader.readAsText(file);
            default: 
                console.warn(`FileInputManager: File reading has been aborted, file type [type: ${full_type}] unsupported.`);
                break;
        }
    }
    determine_read_type();
    reader.onload = function () {
        callbackRes(reader.result);
    };
    this.getResult = function () {
        switch (types[1]) {
            case "octet-stream":
                return new CustomError("FileInputManager", `Unable to provide result, file type [type: ${full_type}] not allowed.`);
            default:
                return promise;
        }
    }
    this.getFileName = function () {
        if (!file.name)
            return new CustomError("FileInputManager", "The file doesn't have a name.");
        return file.name;
    }
    this.getFileSize = function () {
        if (!file.size)
            return new CustomError("FileInputManager", "The file doesn't have a size, something must have went wrong...");
        return file.size;
    }
    this.getFileLastModified = function () {
        if (!file.lastModified)
            return new CustomError("FileInputManager", "The file doesn't contain a lastModified date...");
        return new Date(file.lastModified);
    }
    this.getFileMimeType = function () {
        if (types.length <= 0)
            return new CustomError("FileInputManager", "Mime-Type is missing, something must have went wrong...");
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
        if (!this.listeners.get(name)) this.listeners.set(name, []);
        this.listeners.get(name).push(callback);
        return;
    }
    removeEventListener(name) {
        if (!this.listeners.get(name)) return new CustomError("CustomEventListener", `No event with name '${name}' to remove.`);
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
