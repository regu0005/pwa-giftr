import CACHE from './cache.js';

const APP = {
  currentPage: 'home',
  personSelected: '',
  personFile: '',
  personContent: {},
  cachename: CACHE.init(),
  init() {
    //page has loaded
    APP.addListeners();
    APP.generalReview();
    APP.navigate('home');
  },
  addListeners() {
    document.querySelector('.back').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.generalReview();
      APP.navigate('home');
    });

    // Button Add
    document.querySelector('.add').addEventListener('click', (ev)=>{
      ev.preventDefault();
      
      // Clean values
      APP.personFile = '';
      APP.personContent = {};
      APP.personSelected = '';
      document.getElementById('fileSelected').innerHTML = "";
      document.getElementById('name').value = "";
      document.getElementById('dob').value = "";

      APP.navigate('newuser');
    });

    // Button Add Gift
    document.querySelector('.add_gift').addEventListener('click', (ev)=>{
      ev.preventDefault();
      // APP.navigate('newuser');
      APP.navigate('page_gifts_add');
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
      APP.generalReview();
      APP.navigate('home');
    });

    // Person Gift form buttons
    document.getElementById('btnGiftSave').addEventListener('click',(ev)=>{
      ev.preventDefault();
      APP.savePersonGift();
    });

    // call only one time
    APP.updateListeners();

  },
  back(ev){
    // Clicked the back button
    switch(APP.currentPage){
      case 'gorilla':
        break;
      case 'banana':
        APP.navigate('home');
        break
      case 'water':
        APP.navigate('banana');
        break;
      default:
        // do nothing
    }
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
          console.log('Page: new user');
          break;
        case 'gifts':
          console.log('Page: person gifts');
          break;
        case 'page_gifts_add':
          console.log('Page: person gifts add');
          break;
        default:
          // do something
    }
  },
  // SAVE THE FORM OF THE GIFT 
  savePersonGift(){
    if(APP.personFile!='')
    {
        let giftsList = [];
        let fileName = APP.personFile;
        let content  = APP.personContent;

        let mGiftID    = crypto.randomUUID();
        let mGiftIdea  = document.getElementById('gift_idea').value;
        let mGiftStore = document.getElementById('gift_store').value;
        let mGiftUrl   = document.getElementById('gift_url').value;

        const mGiftNew = {
          id:    mGiftID,
          idea:  mGiftIdea,
          store: mGiftStore,
          url:   mGiftUrl
        };

        let currentGifts = content.gifts;
        
        currentGifts.map((gift)=>{
          giftsList.push(gift);
        });
        
        giftsList.push(mGiftNew);

        const mData = {
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
            
            // Clean form
            document.getElementById('gift_idea').innerHTML = "";
            document.getElementById('gift_store').value = "";
            document.getElementById('gift_url').value = "";

            APP.personGifts();
            APP.navigate('page_gifts');
          })
          .catch( (err) => {
            console.log('Error',err);
          });
    }
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
            document.getElementById('fileSelected').innerHTML = "";
            document.getElementById('name').value = "";
            document.getElementById('dob').value = "";

            APP.generalReview();
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
              APP.generalReview();
              APP.navigate('home');
            })
            .catch( (err) => {
              console.log('Error',err);
            });
        }
        else{
          console.log('Review Name and Date of Birth');
        }
    }
    
  },
  // UPDATE LISTENERS OF THE BUTTONS IN THE MAIN SCREEN
  updateListeners(){
    let fileList = document.getElementById('file_list');

    fileList.addEventListener('click', function(e) {
      if (e.target.tagName === 'LI'){
        
      }
      if (e.target.tagName === 'BUTTON'){
        let mID = e.target.id;

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

              APP.personGifts();
              APP.navigate('page_gifts');
          });
        }
      }
    });
  },
  // DISPLAY THE LIST OF GIFTS OF THE PERSON SELECTED
  personGifts(){
    document.getElementById('fileSelected2').innerHTML = APP.personFile;

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
                                    <button id="ge_${gift.id}">Edit</button>
                                  </div>
                                  <div class="gifts__subitem_gift">
                                    <span class="material-symbols-outlined">
                                      redeem
                                    </span>
                                    <button id="gd_${gift.id}">Delete</button>
                                  </div>
                                </div>
                              </li>
                            `;
                    
                });
          });
  },
  // UPDATE THE NAME AND DATE OF BIRTH OF THE PERSON SELECTED
  updatePerson(){
  
    let titleFileSelected = document.getElementById('fileSelected');
    titleFileSelected.innerHTML = APP.personFile;

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
        document.getElementById('fileSelected').innerHTML = "";
        document.getElementById('name').value = "";
        document.getElementById('dob').value = "";

        APP.generalReview();
        APP.navigate('home');

      })
      .catch( (err) => {
        console.log('Error',err);
      });
  },
  // LOAD THE LIST OF PEOPLE REGISTERED
  generalReview() {

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
                                        <button id="edit_${mFile}">Edit</button>
                                      </div>
                                      <div class="home__subitem_gift">
                                        <span id="d1_${mFile}" class="material-symbols-outlined">
                                          redeem
                                        </span>
                                        <button id="gift_${mFile}">Gifts</button>
                                      </div>
                                    </div>
                                  </li>`;
          });
   
        });
    });

  },
};

document.addEventListener('DOMContentLoaded', APP.init);