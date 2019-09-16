exports.requestJoinOptions = function (i) {
    return { requestNumber: i };
}

exports.onJoin = function () {
    console.log(this.sessionId, "joined.");
}

exports.onMessage = function (message) {
    console.log(this.sessionId, "received:", message);
}

exports.onLeave = function () {
    console.log(this.sessionId, "left.");
}

exports.onError = function (err) {
    console.log(this.sessionId, "!! ERROR !!", err.message);
}

exports.onStateChange = function (state) {
    console.log(this.sessionId, "new state:", state);
}