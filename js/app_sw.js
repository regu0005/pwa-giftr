const APP = {
  isOnline: 'onLine' in navigator && navigator.onLine,
  init() {
    APP.registerWorker();
    APP.addListeners();
    // APP.getTopScores();
  },
  addListeners() {
    // Display a CURRENTLY OFFLINE message in the header span if the page is loaded offline
    const offlineContent = document.getElementById('offline');
    const currentTitle = document.title;

    // Listen for the online and offline events and update the message in the header span
    window.addEventListener('offline',(ev)=>{
        offlineContent.innerHTML = `
        <div id="root" class="footer__container footer">
          <span>Offline</span>
        </div>
        `;
        document.title = "Offline - " + currentTitle;
    });
    window.addEventListener('online',(ev)=>{
          offlineContent.innerHTML = "";
          document.title = currentTitle;
    });

    if(!APP.isOnline)
    {
      offlineContent.innerHTML = "Offline";
      document.title = "Offline " + currentTitle;
    }
  },
  registerWorker() {
    //Check if serviceworkers are supported
    if ('serviceWorker' in navigator) {
      // Supported! then Register the sw.js file
      navigator.serviceWorker.register('sw.js');
    }
  },
  handleError(err) {
      console.warn(err);
  },
};

document.addEventListener('DOMContentLoaded', APP.init);
