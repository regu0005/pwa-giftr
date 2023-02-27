import CACHE from './cache.js';

const APP = {
  currentPage: 'home',
  personSelected: '',
  personFile: '',
  personContent: {},
  giftiID: '',
  giftSelected: '',
  giftFile: '',
  giftContent: {},
  peopleSort: {},
  cachename: CACHE.init(),
  init() {
    //page has loaded
    APP.addListeners();
    APP.listPeople();
    APP.navigate('home');
  },
  navigate(page) {
    //navigate to a new page
    document.body.className = page;
    APP.currentPage = page;
    switch(page){
        case 'home':
          console.log('Page: home');
          break;
        case 'newuser':
          document.getElementById("name").focus();
          console.log('Page: new user');
          break;
        case 'gifts':
          console.log('Page: person gifts');
          break;
        case 'newgift':
          document.getElementById("gift_idea").focus();
          console.log('Page: person gifts add');
          break;
        default:
          // do something
    }
  },
  // SET PRINCIPAL LISTENERS
  addListeners() {

    // Button Back
    document.querySelector('.back').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.listPeople();
      APP.navigate('home');
    });

    // Button Add
    document.querySelector('.add').addEventListener('click', (ev)=>{
      ev.preventDefault();
      
      // Clean values
      APP.personFile = '';
      APP.personContent = {};
      APP.personSelected = '';
      
      document.getElementById('name').value = "";
      document.getElementById('dob').value = "";

      APP.navigate('newuser');
    });

    // Button Add Gift
    document.querySelector('.add_gift').addEventListener('click', (ev)=>{
      ev.preventDefault();
      APP.cleanPersonGift();
      APP.navigate('newgift');
    });

    // Person form buttons
    document.getElementById('btnSave').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.savePerson();
    });

    document.getElementById('btnDelete').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.deletePerson();
    });
    
    document.getElementById('btnCancel').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.listPeople();
      APP.navigate('home');
    });

    // Person Gift form buttons
    document.getElementById('btnGiftSave').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.savePersonGift();
    });

    document.getElementById('btnGiftCancel').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.navigate('page_gifts');
    });

    // call only one time
    APP.updateListeners();

  },
  // UPDATE LISTENERS OF THE BUTTONS IN THE MAIN SCREEN
  updateListeners(){
    let fileList = document.getElementById('file_list');

    fileList.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI'){
        
      }
      if (e.target.tagName === 'BUTTON'){
        let mID = e.target.id;

        // PERSON BUTTONS
        if(mID.indexOf("edit_")!=-1)
        {
          mID = mID.replace("edit_","");
          
          APP.personFile = `/${mID}`;
          
          APP.updatePerson();
          APP.navigate('newuser');
        }
        if(mID.indexOf("gift_")!=-1)
        {
          mID = mID.replace("gift_","");
          
          APP.personFile = `/${mID}`;

          // GET THE CONTENT FROM MEMORY
          let content = "";

          CACHE.openCache(APP.personFile)
          .then((obj) => {
              content = JSON.parse(obj);

              APP.personSelected = content.name;
              
              APP.personContent = {
                person_id : content.person_id,
                name  : content.name,
                dob   : content.dob,
                gifts : content.gifts, 
              }

              APP.listPersonGifts();
              APP.navigate('page_gifts');
          });
        }
        
      }
    });


    let giftList = document.getElementById('gift_list');

    giftList.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI'){
        
      }
      if (e.target.tagName === 'BUTTON'){
        let gID = e.target.id;
        
        if(gID.indexOf("gedit_")!=-1)
        {
          
          gID = gID.replace("gedit_","");
            
            APP.giftFile = `${gID}`;

            // GET THE CONTENT FROM MEMORY
            let content = "";

            CACHE.openCache(APP.personFile)
            .then((obj) => {
                content = JSON.parse(obj);

                // GET PERSON CONTENT
                APP.personSelected = content.name;
                
                APP.personContent = {
                  person_id : content.person_id,
                  name  : content.name,
                  dob   : content.dob,
                  gifts : content.gifts, 
                }

                // GET GIFT CONTENTS
                let currentGifts = content.gifts;
                
                currentGifts.map((gift)=>{
                  
                  if(gift.id==gID)
                  {
                    APP.giftSelected = gift.idea;
                    APP.giftiID      = gift.id
                    APP.giftFile      = gift.id
                    APP.giftContent  = {
                      id: gift.id,
                      idea: gift.idea,
                      store: gift.store,
                      url: gift.url
                    } 

                    // SET VALUES IN GIFT FORM
                    let giftIdea = document.getElementById('gift_idea');
                    let giftStore = document.getElementById('gift_store');
                    let giftUrl = document.getElementById('gift_url');

                    giftIdea.value = gift.idea;
                    giftStore.value = gift.store;
                    giftUrl.value = gift.url;
                  }
                  
                });

            });

            APP.navigate('newgift');
        }
        if(gID.indexOf("gdelete_")!=-1)
        {
            gID = gID.replace("gdelete_","");
            APP.giftFile = `${gID}`;
            APP.deletePersonGift();
        }
        
      }
    });
  },

  // -------- PEOPLE SECTION -------- 
  // LOAD THE LIST OF PEOPLE REGISTERED
  listPeople() {

    let fileList = document.getElementById('file_list');

    fileList.innerHTML = "";

    CACHE.listKeys()
    .then((listOfRequests)=>{
        listOfRequests.forEach((request) => {
          let url = new URL(request.url);

          let requestDisplay = request.url;
          let mFile = url.pathname;
          mFile = mFile.replace("/","");

          let content = "";

          CACHE.openCache(requestDisplay)
          .then((obj) => {
            content = JSON.parse(obj);

            fileList.innerHTML += `<li id="${url.pathname}" class="home__items">
                                    <div class="home__subitems">
                                      <div class="home__subitem_main">
                                        <div class="home__subitem_1">
                                        ${content.name} 
                                        </div>
                                        <div class="home__subitem_2">
                                        ${content.dob} 
                                        </div>
                                      </div>
                                      <div class="home__subitem_edit">
                                        <span id="e1_${mFile}" class="material-symbols-outlined">
                                          Edit
                                        </span>
                                        <button id="edit_${mFile}" class="btn btnHome">Edit</button>
                                      </div>
                                      <div class="home__subitem_gift">
                                        <span id="d1_${mFile}" class="material-symbols-outlined">
                                          redeem
                                        </span>
                                        <button id="gift_${mFile}" class="btn btnHome">Gifts</button>
                                      </div>
                                    </div>
                                  </li>`;
          });
   
        });
    });

  },
  // SAVE THE FORM OF THE PERSON: NAME AND DATE OF BIRTH
  savePerson(){
    
    if(APP.personFile!='')
    {
        let fileName = APP.personFile;
        let content = APP.personContent;

        let mName = document.getElementById('name').value;
        let mDob = document.getElementById('dob').value;

        const mData = {
          person_id : content.person_id,
          name  : mName,
          dob   : mDob,
          gifts : content.gifts, 
        }

        // Format the itemList into a JSON format
        let itemListJSON = JSON.stringify(mData);

        // Prepare the file as application/json
        let fileJson = new File([itemListJSON], fileName, { type: 'application/json' });

        CACHE.put(fileName,fileJson)
          .then((res) => {
            // Clean values
            APP.personFile = '';
            APP.personContent = {};
            APP.personSelected = '';
            
            document.getElementById('name').value = "";
            document.getElementById('dob').value = "";

            APP.listPeople();
            APP.navigate('home');
          })
          .catch( (err) => {
            console.log('Error',err);
          });
    }
    else
    {
        // Generate the file name to be stored
        let fileName = Date.now();
        fileName = fileName + ".json";
        
        // Get name and dob from form
          let mName = document.getElementById('name').value;
          let mDob = document.getElementById('dob').value;

        // Save in Cache
        if(mName && mDob)
        {
          let mPersonId = crypto.randomUUID();
          let fileName = `./${mName}-person-${mPersonId}.json`;
          const mData = {
            person_id: mPersonId,
            name:      mName,
            dob:       mDob,
            gifts:     [],
          }

          // Format the itemList into a JSON format
          let itemListJSON = JSON.stringify(mData);

          // Prepare the file as application/json
          let fileJson = new File([itemListJSON], fileName, { type: 'application/json' });

          CACHE.put(fileName,fileJson)
            .then((res) => {
              APP.listPeople();
              APP.navigate('home');
            })
            .catch( (err) => {
              console.log('Error',err);
            });
        }
        else{
          document.getElementById("name").focus();
          console.log('Review Name and Date of Birth');
          
          let alertPerson = document.getElementById('alert_person');
          alertPerson.innerHTML = `<web-alert action="goodbye">
                                      <span slot="alert_title">Review Name and Date of Birth</span>
                                      <span slot="alert_done">Ok</span>
                                   </web-alert>`;
        }
    }
    
  },
  // UPDATE THE NAME AND DATE OF BIRTH OF THE PERSON SELECTED
  updatePerson(){
  
          let content = "";

          CACHE.openCache(APP.personFile)
          .then((obj) => {
              content = JSON.parse(obj);

              document.getElementById('name').value = content.name;
              document.getElementById('dob').value = content.dob;

              APP.personSelected = content.name;
              
              APP.personContent = {
                person_id : content.person_id,
                name  : content.name,
                dob   : content.dob,
                gifts : content.gifts, 
              }
          });
  },
  // DELETE THE PERSON SELECTED
  deletePerson(){
      CACHE.deleteCache(APP.personFile)
      .then((res) => {
        // Clean values
        APP.personFile = '';
        APP.personContent = {};
        APP.personSelected = '';
        
        document.getElementById('name').value = "";
        document.getElementById('dob').value = "";

        APP.listPeople();
        APP.navigate('home');

      })
      .catch( (err) => {
        console.log('Error',err);
      });
  },

  // ------- GIFTS SECTION -------- 
  // DISPLAY THE LIST OF GIFTS OF THE PERSON SELECTED
  listPersonGifts(){

    APP.cleanPersonGift();

    let nameUpper = APP.personSelected;
    nameUpper = nameUpper.toUpperCase();

    document.getElementById('gift_title').innerHTML = `Gift Ideas for ${nameUpper}`;
    
    // LIST THE GIFTS REGISTERED 
    let giftList = document.getElementById('gift_list');

    giftList.innerHTML = "";

    let content = "";

    CACHE.openCache(APP.personFile)
          .then((obj) => {
                content = JSON.parse(obj);

                let currentGifts = content.gifts;
                
                currentGifts.map((gift)=>{

                  giftList.innerHTML += `
                              <li class="gifts__items">
                                <div class="gifts__subitems">
                                  <div class="gifts__subitem_main">
                                    <div class="gifts__subitem_1">
                                      ${gift.idea}
                                    </div>
                                    <div class="gifts__subitem_2">
                                      ${gift.store}<br>${gift.url}
                                    </div>
                                  </div>
                                  <div class="gifts__subitem_edit">
                                    <span class="material-symbols-outlined">
                                      Edit
                                    </span>
                                    <button id="gedit_${gift.id}" class="btn btnGift">Edit</button>
                                  </div>
                                  <div class="gifts__subitem_gift">
                                    <span class="material-symbols-outlined">
                                      delete
                                    </span>
                                    <button id="gdelete_${gift.id}" class="btn btnGift">Delete</button>
                                  </div>
                                </div>
                              </li>
                            `;
                });
          });
  },
  // SAVE THE FORM OF THE GIFT 
  savePersonGift(){
    console.log("1 GIFT SAVE: ",APP.personFile); 
    if(APP.personFile!='')
    {

        let giftsList = [];
        let fileName = APP.personFile;
        let content  = APP.personContent;

        let mGiftID = "";

        if(APP.giftFile!='')  // CAME FROM EDIT GIFT
        {
          mGiftID    = APP.giftFile;
        }
        else                  // IS IS A NEW GIFT
        {
          mGiftID    = crypto.randomUUID();
        }
        
        let mGiftIdea  = document.getElementById('gift_idea').value;
        let mGiftStore = document.getElementById('gift_store').value;
        let mGiftUrl   = document.getElementById('gift_url').value;

        if(mGiftIdea && mGiftStore && mGiftUrl)
        {
          const mGiftNew = {
            id:    mGiftID,
            idea:  mGiftIdea,
            store: mGiftStore,
            url:   mGiftUrl
          };
  
          CACHE.openCache(APP.personFile)
            .then((obj) => {
                  content = JSON.parse(obj);
  
                  let currentGifts = content.gifts;
                  
                  currentGifts.map((gift)=>{
                    
                    if(gift.id!=mGiftID)
                    {
                      giftsList.push(gift);
                    }
                    else{
                      giftsList.push(mGiftNew);
                    }
  
                  });
  
                  if(APP.giftFile=='')
                  {
                      giftsList.push(mGiftNew);
                  }
  
                  let mData = {
                    person_id : content.person_id,
                    name  : content.name,
                    dob   : content.dob,
                    gifts : giftsList,
                  };
                  
                  // Format the itemList into a JSON format
                  let itemListJSON = JSON.stringify(mData);
  
                  // Prepare the file as application/json
                  let fileJson = new File([itemListJSON], fileName, { type: 'application/json' });
  
                  CACHE.put(fileName,fileJson)
                    .then((res) => {
                      APP.cleanPersonGift();
                      APP.listPersonGifts();
                      APP.navigate('page_gifts');
                    })
                    .catch( (err) => {
                      console.log('Error',err);
                    });
            });
        }
        else{
          document.getElementById("gift_idea").focus();
          let alertPerson = document.getElementById('alert_gift');
          alertPerson.innerHTML = `<web-alert action="goodbye">
                                      <span slot="alert_title">Review Idea, Store, and  URL please</span>
                                      <span slot="alert_done">Ok</span>
                                   </web-alert>`;
        }
        
    }
  },
  deletePersonGift(){
    
    if(APP.personFile!='')
    {
        let giftsList = [];
        let fileName = APP.personFile;
        let content  = APP.personContent;
    
        CACHE.openCache(APP.personFile)
          .then((obj) => {
                content = JSON.parse(obj);

                let mGiftID = "";

                mGiftID    = APP.giftFile;

                let currentGifts = content.gifts;
                
                currentGifts.map((gift)=>{
                    if(gift.id!=mGiftID)
                    {
                      giftsList.push(gift);
                    }
                })

                  const mData = {
                    person_id : content.person_id,
                    name  : content.name,
                    dob   : content.dob,
                    gifts : giftsList,
                  };
                  
                  // Format the itemList into a JSON format
                  let itemListJSONGifts = JSON.stringify(mData);
  
                  // Prepare the file as application/json
                  let fileJson = new File([itemListJSONGifts], fileName, { type: 'application/json' });
  
                  CACHE.put(fileName,fileJson)
                    .then((res) => {
                      APP.cleanPersonGift();
                    })
                    .then((res)=>{
                      APP.listPersonGifts();
                    })
                    .then((res)=>{
                      APP.navigate('page_gifts');
                    })
                    .catch( (err) => {
                      console.log('Error',err);
                    });
          });
    }
  },
  cleanPersonGift(){
    // Clean form
    document.getElementById('gift_idea').value = "";
    document.getElementById('gift_store').value = "";
    document.getElementById('gift_url').value = "";

    // CLEAN GIFT VALUES
    if(APP.giftFile!='')  // CAME FROM EDIT GIFT
    {
      APP.giftiID = "";
      APP.giftSelected = "";
      APP.giftFile = "";
      APP.giftContent = {};
    }
  }
};

document.addEventListener('DOMContentLoaded', APP.init);