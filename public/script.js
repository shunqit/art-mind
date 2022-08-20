/*
    To run this script first start the nodeJs server (node server) and go to:
    http://localhost:3000/
    use ctrl+C to stop it
 */


/*-------------------------------------------------------- 
    header
-------------------------------------------------------- */
//relevance button and value
const DEV_MODE = true;
var titles_expand=document.querySelectorAll('.section-text');
var btn=document.getElementById('btn');
var regularbtn=document.getElementById('regular');
var weirdbtn=document.getElementById('weird');
var relevant=1;
var dict= {};
const openCollectionButtons=document.querySelector('.collect');
const popupWindow=document.querySelector('.collection-pop');
const overlay=document.getElementById('overlay');


function regular(){
    btn.style.left='0'
    regularbtn.style.color='white';
    weirdbtn.style.color='#A19481';
    relevant=1;
}

function weird(){
    btn.style.left='116px';
    weirdbtn.style.color='white';
    regularbtn.style.color='#A19481';
    relevant=0;
}
//collection slide-in

//home logo

/* -------------------------------------------------------- 
    content
-------------------------------------------------------- */
//section onClick
let words=['flowers','animals','portraits','landscape','patterns'];
var popimagesCollection =document.querySelectorAll('.pop_img');
var popimagesSection0 =document.querySelectorAll('.pop_img0');
var popimagesSection1 =document.querySelectorAll('.pop_img1');
var popimagesSection2 =document.querySelectorAll('.pop_img2');
var popimagesSection3 =document.querySelectorAll('.pop_img3');
var popimagesSection4 =document.querySelectorAll('.pop_img4');


const homeimages =document.querySelectorAll('.preview');
var sections=document.querySelectorAll('.section');
for (var i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", function() {
        //event.preventDefault();
        if (! this.hasAttribute('data-active') || this.dataset.active=='inactive'){
            var key=this.title;
            var section=this.id;
            for (var j = 0; j < sections.length; j++) {
                sections[j].dataset.active = "inactive";
                }
                //console.log(this);
                if (this.dataset.active == "inactive") {
                this.dataset.active = "active";
                    if(dict.hasOwnProperty(key)){
                        console.log('show loaded images '+dict);
                    }else{
                        moreImages(key,section);
                    }
                }
                //popimages[i].src= url;
    
        }
        }
        )
  }

//section close
function closeSection(){
    for (var j = 0; j < sections.length; j++) {
        sections[j].removeAttribute('data-active');
    }
}
//type in keyword
var input=document.getElementById('userInput');
document.getElementById('searchButton').onclick=function(){
    passvalues();
}
// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("searchButton").click();
    }
  });

/*-------------------------------------------------------- 
    back-end
-------------------------------------------------------- */


//collect imageUrls for the collected usersets

//display the images


/*-------------------------------------------------------- 
    APIs
-------------------------------------------------------- */   
let related=[];
let sursprising=[];
//search the most relevant image on wikimedia commons
async function imaggaInput(item){
    let wikiapi= await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + item+' rijksmuseum jpeg'+'&origin=*')
    let json= await wikiapi.json();
    if(json.query.search[0]!==undefined){
        let data=json.query.search[0]['title'].slice(5);
        let title=data.replace(/ /g,'_');
        var hash = md5(title);
        //let title=data.split(" ")[-1];
        let url='https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash.charAt(0)+'/'+hash.substring(0,2)+'/'+title+'/500px-'+title;
        //console.log(url);
        getTagsFromNodeJs(url);
    }
}

//connect to Imagga
async function getTagsFromNodeJs(imageUrl) {
    // This will make a API call to our NodeJs server
    // the "./" in the url indicates that we want to use the same url as this webpage.
    const respons = await fetch("./api", {
        method: "POST", // We want to use the POST method because that is what NodeJs is waiting for.
        headers: {
            'Content-Type': 'application/json' // Tell Nodejs that we will be sending JSON data
        },
        body: JSON.stringify({ // In here will be the data accessible to NodeJS
            image: imageUrl //
        })
    })

    // Now we must get the data from the response
    const data = await respons.json()

    // log the data
    let tagsData=data.result.tags;
    let tags=[];
    for (var i=0; i<tagsData.length; i++){
        if(!tagsData[i].tag.en.includes(' ')){
            console.log(tagsData[i].tag.en);
            tags.push(tagsData[i].tag.en);
        }
    }
    console.log(tags);

    // for(i=0;i<tags.length;i++){
    //     arrName[i]=newArr[i];
    // }
    sursprising=tags.slice(-10);
    related=tags.slice(0,10);
    moreImages(sursprising[0]);
    // write data on webpage
    //document.getElementById("data").innerText = JSON.stringify(data)
}

// Add the click event to our button once the page has loaded.
// (() => {
//     document.getElementById("testButton").addEventListener("click", () => {
//         getTagsFromNodeJs()
//     })
// })()

function changeHomeimg(i,url){
    homeimages[i].src= url;
}


// get more images of the section
async function moreImages(text,section){
    //console.log(text);
    var r=0;
    titles_expand[section].innerHTML=text;
    const setIndex=[];
    const response = await fetch('csv/keyword.csv');
    const data=await response.text();
    const keywordTable=data.split('\n');
    keywordTable.forEach(row =>{
        var name=row.replace(/(\r\n|\n|\r)/gm, "");
        if (text==name || name.split(" ").includes(text)){
            setIndex.push(r);
        }
        r+=1;
    })

    if (setIndex.length!=0){
        collectObjnum(text,setIndex,section);
        //console.log('index array is '+setIndex);
    }

}
async function collectObjnum(text,rowArr,section){
    const response = await fetch('csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrArt=[];
    const n=45;
    while(arrArt.length<n){
        const row=rowArr[Math.floor(Math.random()*rowArr.length)];
        const items=setTable[Number(row)-2].replace('\r', "").split(',');
        items.forEach(function(item){
            if(!arrArt.includes(item) && arrArt.length<n){   
                //console.log('items are '+item);            
                arrArt.push(item);
            }
        })
    }
    if(arrArt.length==n){
        //console.log('full list is '+arrArt);
        let promises=[];
        for (let i=0; i<n;i++){
            promises.push(getImage(arrArt[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            let i=0;
            //let n=0;
            while (i<n){
                //console.log(arrArt[i],results[i]);

                //n++;
                changePopimg('popimagesSection'+section,i,results[i],arrArt[i]);
                i++;
            }
            dict[text]=results;
            console.log(dict);    
        })
    }   
}

function changePopimg(section,i,url,objnum){
    //console.log(window[section]);
    const element = window[section][i];

    element.src=url;
    element.parentElement.id=objnum;
    // Check if we have a url for this element
    if (url === "error")
        return element.parentElement.style.display = "none"

    // Set the url to the element en display the element
    element.src = url;
    element.parentElement.style.display = "inline-block"
    element.id = objnum;

    // hide image if it is not there
    element.addEventListener("error", (e) => {
        element.parentElement.style.display = "none"
        if (DEV_MODE)
            console.log(`${e.target.src} could not be loaded and is therefore hidden.`)
    })
}

// Get the wiki-image-url of the art with the objnum
//reference: https://stackoverflow.com/questions/33689980/get-thumbnail-image-from-wikimedia-commons
async function getImage(objnum) {
    try {
        let wikiapi = await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + objnum + ' Rijksmuseum' + '&origin=*')
        let json = await wikiapi.json();
        if (json.query.search[0] !== undefined) {
            const data = json.query.search[0]['title'].slice(5);
            const title = data.replace(/ /g, '_');
            const hash = md5(title);
            //let title=data.split(" ")[-1];
            let url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/' + hash.charAt(0) + '/' + hash.substring(0, 2) + '/' + title + '/500px-' + title;
            return (url);
        } else {
            if (DEV_MODE)
                console.log(`Could not fetch the url for object ${objnum}`)
            return 'error';
        }
    } catch (e) {
        if (DEV_MODE)
            console.log(`Could not fetch the url for object ${objnum}`)
        return 'error'
    }
}

//send to the next page
function sending(a){
    //console.log(a);
    window.location.href='metadata.html#id='+a.parentElement.id+'&src='+a.src;
    // if (localStorage.hasOwnProperty('collection')){
    //     if(a.parentElement.id in localStorage.getItem('collection'){
    //         console.log()
    //     }
    // }    
}

function passvalues(){
    var keyword=document.getElementById('userInput').value.toLowerCase();
    //console.log(relevant);
    //window.location.href='afterSearch.html#id='+keyword;
    window.location.href='afterSearch.html#id='+keyword+'&relevance='+relevant;

}

// for (var i = 0; i < popimages.length; i++) {
//     popimages[i].addEventListener("click", function() {
//         event.preventDefault();
//         sending(popimages[i].src);
// })}


function collectThis(a) {
    var pin=a.parentElement;
    var objnum=pin.id;
    //window.localStorage.setItem('collection',objnum);
    a.src='images/icon/collected.png';
    a.style.display='block';
    //
    var cart;
    if (localStorage.hasOwnProperty('collection')){
        cart = [localStorage.getItem('collection')];
        if (!cart.includes(objnum)){
            cart.push(objnum);  
        }
        console.log('cart is: '+cart);
        localStorage.setItem('collection', cart);
    }
    else{
        localStorage.setItem('collection',objnum);
    }          
}

function getCollection(){
    popupWindow.classList.toggle('active');
    overlay.classList.add('active');
    console.log('collections are '+localStorage.getItem('collection'));
    var list=localStorage.getItem('collection').split(',');
    if(list.length!=0){
        let promises=[];
        for (let i=0; i<list.length;i++){
            promises.push(getImage(list[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            console.log(results);
            let i=0;
            //let n=0;
            while (i<list.length){
                //console.log(arrArt[i],results[i]);

                //n++;
                displayPopImg(i,results[i],list[i]);
                i++;
            } 
        })
    }   
}

function closeCollection(){
    popupWindow.classList.toggle('active');
    overlay.classList.remove('active');
}


//display the images, send url to html
function displayPopImg(i, url, objNum) {
    // Get the html element
    const element = popimagesCollection[i]

    // Check if we have a url for this element
    if (url === "error")
        return element.parentElement.style.display = "none"

    // Set the url to the element en display the element
    element.src = url;
    //element.parentElement.style.display = "inline-block"
    element.id = objNum;

    // hide image if it is not there
    element.addEventListener("error", (e) => {
        element.parentElement.style.display = "none"
        if (DEV_MODE)
            console.log(`${e.target.src} could not be loaded and is therefore hidden.`)
    })
}

function searchTitle(a){
    var title=a.children[0].innerHTML;
    window.location.href='afterSearch.html#id='+title+'&relevance='+relevant;
}