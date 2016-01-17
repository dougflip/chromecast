module.exports = (appId, sessionListener, receiverListener, onInitSuccess, onError) => {
    const sessionRequest = new chrome.cast.SessionRequest(appId);
    const apiConfig = new chrome.cast.ApiConfig(
        sessionRequest,
        sessionListener,
        receiverListener
    );

    return chrome.cast.initialize(apiConfig, onInitSuccess, onError);
};
