const CACHE = {
  cacheVersion: 1,
  cacheName: null,      //this gets set in the init() method
  userName: 'regu0005', //replace this with your own username
  init() {
    CACHE.cacheName = `Giftr-People-${CACHE.userName}-${CACHE.cacheVersion}`;
  },
  put(name, filetype){
    return(caches
    .open(CACHE.cacheName)
    .then( (cache) => {
        
        let request = new Request(`${name}`);
        let response = new Response(filetype, {
            status: 200,
            statusText: 'ok'
        });
        // console.log("PUT: "+name + " file: " + filetype);
        // console.log("Response: "+response);
        cache.put(request,response);
    })
    .catch(console.warn));
  },
  listKeys(){
    return (
      caches
      .open(CACHE.cacheName)
      .then((cache) => {
          return cache.keys()
      }));
  },
  openCache(requestDisplay){
    let options = {
      ignoreSearch: true, //ignore the queryString
      ignoreMethod: true, //ignore the method - POST, GET, etc
      ignoreVary: false,  //ignore if the response has a VARY header
    };

    return (
      caches
      .open(CACHE.cacheName)
      .then(cache => {
        
          return(
            cache
            .match(requestDisplay, options)
            .then((response) => {
              // console.log("response text: ",response);
              return response.text();
            })
          )
      })
      .catch((err) => {
        console.log("Error: ",err)
      })
    );
  },
  deleteCache(deletefile){
    return (
      caches
      .open(CACHE.cacheName)
      .then((cache) => {
        return cache.delete(deletefile);
      })
    );
  },
};

export default CACHE;
