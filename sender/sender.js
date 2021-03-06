const applicationID = '32BA06D5';
const namespace = 'urn:x-cast:com.herokuapp.dougflip';

const initCast = require('./lib/initialize-cast');

var session = null;

/**
 * Call initialization for Cast
 */
if (!chrome.cast || !chrome.cast.isAvailable) {
    setTimeout(initCast.bind(null, applicationID, sessionListener, receiverListener, onInitSuccess, onError), 1000);
}

/**
 * initialization success callback
 */
function onInitSuccess() {
    appendMessage("onInitSuccess");
}

/**
 * initialization error callback
 */
function onError(message) {
    appendMessage("onError: " + JSON.stringify(message));
}

/**
 * generic success callback
 */
function onSuccess(message) {
    appendMessage("onSuccess: " + message);
}

/**
 * callback on success for stopping app
 */
function onStopAppSuccess() {
    appendMessage('onStopAppSuccess');
}

/**
 * session listener during initialization
 */
function sessionListener(e) {
    appendMessage('New session ID:' + e.sessionId);
    session = e;
    session.addUpdateListener(sessionUpdateListener);
    session.addMessageListener(namespace, receiverMessage);
}

/**
 * listener for session updates
 */
function sessionUpdateListener(isAlive) {
    var message = isAlive ? 'Session Updated' : 'Session Removed';
    message += ': ' + session.sessionId;
    appendMessage(message);
    if (!isAlive) {
        session = null;
    }
};

/**
 * utility function to log messages from the receiver
 * @param {string} namespace The namespace of the message
 * @param {string} message A message string
 */
function receiverMessage(namespace, message) {
    appendMessage("receiverMessage: " + namespace + ", " + message);
};

/**
 * receiver listener during initialization
 */
function receiverListener(e) {
    if (e === 'available') {
        appendMessage("receiver found");
    } else {
        appendMessage("receiver list empty");
    }
}

/**
 * stop app/session
 */
function stopApp() {
    session.stop(onStopAppSuccess, onError);
}

/**
 * send a message to the receiver using the custom namespace
 * receiver CastMessageBus message handler will be invoked
 * @param {string} message A message string
 */
function sendMessage(message) {
    if (session != null) {
        session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
    } else {
        chrome.cast.requestSession(function(e) {
            session = e;
            session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
        }, onError);
    }
}

/**
 * utility function to handle text typed in by user in the input field
 */
function update() {
    sendMessage(document.getElementById("input").value);
}

/**
 * handler for the transcribed text from the speech input
 * @param {string} words A transcibed speech string
 */
function transcribe(words) {
    sendMessage(words);
}

const appendMessage = msg => console.log(`------- ${msg} -------`);

/*
*
**/
var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);

document.getElementById('sendMessage').addEventListener('click', ws.send.bind(ws, { data:'something' }));
