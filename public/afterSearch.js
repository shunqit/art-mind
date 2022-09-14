/* pass the img url from previous page*/
//    http://localhost:3000/
var dict= {};
var dictObj={};
const DEV_MODE = true;

var main=document.getElementById('main');
var titles=document.querySelectorAll('.word');
var titles_hover=document.querySelectorAll('.word-hover');
var titles_div=document.querySelectorAll('.section');
var shuffle_btn=document.querySelectorAll('.fa-refresh');
var title_to_search=document.querySelectorAll('.title-to-search');
//
let related=[];//top 10
let surprising=[]; //last 10
let previewObjnum=[]; //for 5 sections

let undo_word='';
//
let words=[];
var popimagesCollection =document.querySelectorAll('.pop_img');
var popimagesSection0 =document.querySelectorAll('.pop_img0');
var popimagesSection1 =document.querySelectorAll('.pop_img1');
var popimagesSection2 =document.querySelectorAll('.pop_img2');
var popimagesSection3 =document.querySelectorAll('.pop_img3');
var popimagesSection4 =document.querySelectorAll('.pop_img4');
//const popimages =document.querySelectorAll('.pop_img');
var main_imgs=document.querySelectorAll('.main-preview');
var preview0 =document.querySelectorAll('.preview-img0');
var preview1 =document.querySelectorAll('.preview-img1');
var preview2 =document.querySelectorAll('.preview-img2');
var preview3 =document.querySelectorAll('.preview-img3');
var preview4 =document.querySelectorAll('.preview-img4');
var titles_expand=document.querySelectorAll('.section-text');
var sections=document.querySelectorAll('.section');
//
const openCollectionButtons=document.querySelector('.collect');
const popupWindow=document.querySelector('.collection-pop');
const overlay=document.getElementById('overlay');

function getTitle(){
    var a=window.location.href.split('#')[1].split('&'),
    id=a[0].split('=')[1],
    relevance=a[1].split('=')[1];
    //document.getElementById("main-title").innerHTML=id;
    main.title=id;
    relevant=relevance;
    if(relevant==0){
        btn.style.left='197px';
        weirdbtn.style.color='white';
        regularbtn.style.color='#A19481';
    }else{
        btn.style.left='0'
        regularbtn.style.color='white';
        weirdbtn.style.color='#A19481';
    }
    rijksstudioMatch(id);
    //moreImagesPreview(preview0,id);
    document.getElementById("userInput").placeholder=id;
}

/*-------------------------------------------------------- 
    header
-------------------------------------------------------- */
//relevance button and value
var btn=document.getElementById('btn');
var regularbtn=document.getElementById('regular');
var weirdbtn=document.getElementById('weird');
var relevant=1;

function regular(){
    btn.style.left='0'
    regularbtn.style.color='white';
    weirdbtn.style.color='#A19481';
    relevant=1;
    previewObjnum.length=0;
    var section_words=[main.title].concat(related.slice(0,4));
    console.log(section_words);
    changeSections(section_words);
}

function weird(){
    btn.style.left='197px';
    weirdbtn.style.color='white';
    regularbtn.style.color='#A19481';
    relevant=0;
    previewObjnum.length=0;
    var section_words=[main.title].concat(surprising.slice(0,4));
    console.log("weird words: "+section_words);
    changeSections(section_words);
}

//shuffle button
// for (var i = 0; i < shuffle_btn.length; i++) {
//     shuffle_btn[i].addEventListener('click', function() {
//         event.preventDefault();
//         //undo_word=
//         //console.log(titles_div[i].title);
function shuffle(a){
    if (relevant==1){
        changeOneSection(a.id,related.pop());
    }else{
        changeOneSection(a.id,surprising.pop());
    }
}


   
//collection slide-in

//home logo

/* -------------------------------------------------------- 
    content
-------------------------------------------------------- */
//section onClick

for (var i = 0; i < sections.length; i++) {
    sections[i].addEventListener("click", function() {
        //event.preventDefault();

        if (! this.hasAttribute('data-active') || this.dataset.active=='inactive'){
            var key=this.title;
            var section=this.id;
            if(section=='main'){
                section=0;
            }


            for (var j = 0; j < sections.length; j++) {
                sections[j].dataset.active = "inactive";
                }
                //console.log(this);
                if (this.dataset.active == "inactive") {
                    this.dataset.active = "active";
                    if(dict[key].length>6){
                        displayImglist('popimagesSection'+section, dict[key], dictObj[key]);
                        console.log('show loaded images: ');

                    }else{
                        moreImages(key,section);
                    }
                }
                //popimages[i].src= url;
        }
        }
        )
  }

async function moreImages(text,section){
//display text
titles_expand[section].innerHTML=text;
if (text=='wilderness'){
    text='wild';
}
collectObjnum(text,section);

// var r=0;
// const setIndex=[];
// const response = await fetch('csv/keyword.csv');
// const data=await response.text();
// const keywordTable=data.split('\n');
// keywordTable.forEach(row =>{
//     var name=row.replace(/(\r\n|\n|\r)/gm, "");
//     if (text==name || name.split(" ").includes(text)){
//         setIndex.push(r);
//     }
//     r+=1;
// })
// if (setIndex.length!=0){
//     collectObjnum(text,section);
// }
}

async function collectObjnum(text,section){
    const arr=[];
    const n=40;
    let j=0;
    let rijksstudio=await fetch('https://www.rijksmuseum.nl/api/en/collection?key=poaBzFoO&q='+text+'&s=relevance&ps='+n+'&imgonly=True');
    let json= await rijksstudio.json();
    if(json.artObjects[0]!==undefined){
        while (j<json.artObjects.length){
            let objnum=json.artObjects[j].objectNumber;
            j++;
            arr.push(objnum);
        }
        var promises=[];
        for (let i=0; i<n;i++){
            promises.push(getImage(arr[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            let i=0;
            //let n=0;
            while (i<n){
                changePopimg('popimagesSection'+section,i,results[i],arr[i]);
                i++;
            }
            const final=results; 
            dict[text]=final;
            //console.log(iteminArray,dict);  

    } )
    }
}

// async function collectObjnum(text,rowArr,section){
//     const response = await fetch('csv/userSets.csv');
//     const data=await response.text();
//     const setTable=data.split('\n').slice(1);
//     const arrArt=dictObj[text];
//     const n=45;
//     //var iteminArray = dict[text];

//     while(arrArt.length<n){
//         const row=rowArr[Math.floor(Math.random()*rowArr.length)];
//         const items=setTable[Number(row)-2].replace('\r', "").split(',');
//         items.forEach(function(item){
//             if(!arrArt.includes(item) && arrArt.length<n){   
//                 //console.log(text+' items are '+item);            
//                 arrArt.push(item);
//             }
//         })

//     }
//     if(arrArt.length==n){
//         var promises=[];
//         for (let i=0; i<n;i++){
//             promises.push(getImage(arrArt[i]));
//         }  
//         Promise.all(promises)
//         .then((results)=>{
//             //console.log(results);
//             let i=0;
//             //let n=0;
//             while (i<n){
//                 changePopimg('popimagesSection'+section,i,results[i],arrArt[i]);
//                 i++;
//             }
//             const final=results; 
//             dict[text]=final;
//             //console.log(iteminArray,dict);  

//     } )
// }
// }

function changePopimg(section,i,url,objnum){
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

//section close
// var close_btns=document.querySelectorAll('.fa-close');
// for (var i = 0; i < close_btns.length; i++) {
//     close_btns[i].addEventListener("click", function() {
//         event.stopPropagation();
//         for (var j = 0; j < sections.length; j++) {
//             sections[j].removeAttribute('data-active');
//         }
// })
// }
function closeSection(){
    for (var j = 0; j < sections.length; j++) {
        sections[j].removeAttribute('data-active');
    }
}


for (var i = 0; i < titles_expand.length; i++) {
    titles_expand[i].addEventListener("click", function() {
        event.stopPropagation();
        for (var j = 0; j < sections.length; j++) {
            sections[j].removeAttribute('data-active');
        }
})
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


/*-------------------------------------------------------- 
    APIs
-------------------------------------------------------- */   
//search the most relevant image on wikimedia commons
async function rijksstudioMatch(item){
    let rijksstudio=await fetch('https://www.rijksmuseum.nl/api/en/collection?key=poaBzFoO&q='+item+'&s=relevance&ps=1&imgonly=True&type=painting');
    let json= await rijksstudio.json();
    if(json.artObjects[0]!==undefined){
        let objnum=json.artObjects[0].id;
        imaggaInput(objnum);
    }
}
async function configureURL(section,SK,item){
    var element = window[section];
    if(SK.length<5){
        for(var j=0;j<SK.length;j++){
            let wikiapi= await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + SK[j]+' rijksmuseum jpeg'+'&origin=*')
            let json= await wikiapi.json();
            let data=json.query.search[0]['title'].slice(5);
            let objnumjpeg=data.split(' ');
            let objnum=objnumjpeg[objnumjpeg.length-1].split('.')[0]
            let title=data.replace(/ /g,'_');
            var hash = md5(title);
            //let title=data.split(" ")[-1];
            let url='https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash.charAt(0)+'/'+hash.substring(0,2)+'/'+title+'/500px-'+title;
            element[j].src=url;
            element[j].id=objnum;
            if (dict.hasOwnProperty(item)){
                var iteminArray=dict[item];
                const final=iteminArray.concat([url]); 
                dict[item]=final;
                //console.log('final is: '+final.length);
                //var newList=dict[item].push(url);
                //dict[item]=newList;
            }else{
                dict[item]=[url];
            }
        }
        console.log(item+' dict is: '+dict[item]);
    }else{
        for(var i=0;i<5;i++){
            let wikiapi= await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + SK[i]+' rijksmuseum jpeg'+'&origin=*')
            let json= await wikiapi.json();
            if(json.query.search[0]!==undefined){
                let data=json.query.search[0]['title'].slice(5);
                let objnumjpeg=data.split(' ');
                let objnum=objnumjpeg[objnumjpeg.length-1].split('.')[0]
                let title=data.replace(/ /g,'_');
                var hash = md5(title);
                //let title=data.split(" ")[-1];
                let url='https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash.charAt(0)+'/'+hash.substring(0,2)+'/'+title+'/500px-'+title;
                //console.log(objnum,url);
                if(url=="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Battle_of_Scheveningen_(Slag_bij_Ter_Heijde)(Jan_Abrahamsz._Beerstraten).jpg/500px-Battle_of_Scheveningen_(Slag_bij_Ter_Heijde)(Jan_Abrahamsz._Beerstraten).jpg"){
                    return element[i].style.display = "none";
                }
                element[i].src=url;
                element[i].id=objnum;
                if (dict.hasOwnProperty(item)){
                    var iteminArray=dict[item];
                    const final=iteminArray.concat([url]); 
                    dict[item]=final;
                    //var newList=dict[item].push(url);
                    //dict[item]=newList;
                }else{
                    dict[item]=[url];
                }
        }
        }
    }

    }

async function imaggaInput(SK){
    let wikiapi= await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + SK+' rijksmuseum jpeg'+'&origin=*')
    let json= await wikiapi.json();
    if(json.query.search[0]!==undefined){
        let data=json.query.search[0]['title'].slice(5);
        let objnumjpeg=data.split(' ');
        let objnum=objnumjpeg[objnumjpeg.length-1].split('.')[0]
        let title=data.replace(/ /g,'_');
        var hash = md5(title);
        //let title=data.split(" ")[-1];
        let url='https://upload.wikimedia.org/wikipedia/commons/thumb/'+hash.charAt(0)+'/'+hash.substring(0,2)+'/'+title+'/500px-'+title;
        getTagsFromNodeJs(url);

    }else{
        console.log('no ImaggaInput');
    }
}

async function rijksstudioMatch5(index,item){
    let rijksstudio=await fetch('https://www.rijksmuseum.nl/api/en/collection?key=poaBzFoO&q='+item+'&s=relevance&ps=5&imgonly=True');
    let json= await rijksstudio.json();
    var mostRelevant5=[];
    if(json.artObjects[0]!='null'){
        for(i=0;i<5;i++){
            if(json.artObjects[i]){
                var objnum=json.artObjects[i].objectNumber;
                mostRelevant5.push(objnum);
            }
        }
        dictObj[item]=mostRelevant5;
        console.log(item+' top5 are '+mostRelevant5); 
        configureURL('preview'+index,mostRelevant5,item);   
    }else{
        console.log(item+' nothing found in Rijksstudio database.')
    }        
}


// async function rijksstudioBackupMatch(list,item,section){
//     var mostRelevant5=list;
//     let rijksstudio=await fetch('https://www.rijksmuseum.nl/api/en/collection?key=poaBzFoO&q='+item+'&s=relevance&ps=5&imgonly=True&type=drawing');
//     let json= await rijksstudio.json();
//     while(mostRelevant5.length<5){
//         if(json.artObjects[i]){
//             var objnum=json.artObjects[i].objectNumber;
//             mostRelevant5.push(objnum);
//             i++;
//         }
//     }   
//     console.log(item+' top5 are '+mostRelevant5); 
//     //configureURL(section,mostRelevant5,item);

//     // if(json.artObjects[0]!==undefined){
//     //     const objnum=json.artObjects[index].objectNumber;
//     //     console.log(objnum);
//     //     return(objnum);
//     // }else{
//     //     console.log('still noting');
//     // }
// }

//connect to Imagga
async function getTagsFromNodeJs(imageUrl) {
    // This will make a API call to our NodeJs server
    // the "./" in the url indicates that we want to use the same url as this webpage.
    const respons = await fetch("./api", {
        method: "POST", // We want to use the POST method because that is what NodeJs is waiting for.
        headers: {
            'Content-Type': 'application/json' // Tell Nodejs that we will be collectThis JSON data
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
        if(!tagsData[i].tag.en.includes(' ') && tagsData[i].tag.en!=main.title){
            tags.push(tagsData[i].tag.en);
        }
    }


    // //test part
    // let tags=[];

    // var testtags=['religion', 'old', 'gold', 'antique', 'ancient', 'traditional', 'art', 'sculpture', 'culture', 'travel', 'religious', 'bottle', 'prayer', 'shell', 'temple', 'covering', 'statue', 'decoration', 'luxury', 'cowboy boot', 'tattoo', 'device', 'tourism', 'wine bottle', 'interior', 'couch', 'vintage', 'person', 'clothing', 'hat', 'golden', 'furniture', 'room', 'wood', 'fashion', 'market', 'metal', 'body', 'wooden', 'container', 'seated', 'sofa', 'spiritual', 'meditation', 'shop', 'sitting', 'portrait', 'adult', 'attractive', 'design', 'vessel', 'industrial', 'style', 'boot', 'man', 'brown', 'black', 'pray', 'worship', 'industry', 'sit', 'food', 'one', 'closeup', 'inside', 'colorful', 'face', 'steel', 'indoors'];
    
    // for (var i=0; i<testtags.length; i++){
    //     if(!testtags[i].includes(' ') && testtags[i]!=main.title){
    //         tags.push(testtags[i]);
    //     }
    // }

    surprising=tags.slice(-10);
    related=tags.slice(0,10);
    //console.log(tags);
    if (relevant==1){
        var section_words=[main.title].concat(related.slice(0,4));
        changeSections(section_words);
    }else{
        var section_words=[main.title].concat(surprising.slice(0,4));
        changeSections(section_words);
    }


    // write data on webpage
    //document.getElementById("data").innerText = JSON.stringify(data)
}
//5 words in an array
async function changeSections(array){
    //clearHomeimg(); //delete this?
    for (var i=0;i<array.length;i++){
        var word=array[i];
        titles[i].innerHTML=word;
        titles_hover[i].innerHTML=word;
        titles_div[i].title=word;
        rijksstudioMatch5(i,word);
    }
}

async function changeOneSection(i,word){
    //console.log(array[i]);
    titles[i].innerHTML=word;
    titles_hover[i].innerHTML=word;
    titles_div[i].title=word;
    rijksstudioMatch5(i,word);

}
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
        return 'error';
    }
}




// get more images of the section
// async function moreImages(i,text){
//     var r=0;
//     const setIndex=[];
//     const response = await fetch('csv/keyword.csv');
//     const data=await response.text();
//     const keywordTable=data.split('\n');
//     keywordTable.forEach(row =>{
//         if (text ==row){
//             setIndex.push(r);
//         }
//         r+=1;
//     })
//     if (setIndex.length!=0){
//         collectObjnum(i,setIndex);
//         //console.log('index array is '+setIndex);
//     }

// }


/* --------------------- */
//preview images for one section
async function moreImagesPreview(section,text){
    //console.log(section);
    var r=0;
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
        collectObjnumforPreview(section,setIndex);
        //console.log('index array is '+setIndex);
    }
    }
    








async function collectObjnumforPreview(section,rowArr){
    const response = await fetch('csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrArt=[];
    const n=5;
    while(arrArt.length<n){
        const row=rowArr[Math.floor(Math.random()*rowArr.length)];
        const items=setTable[Number(row)-2].replace('\r', "").split(',');
        items.forEach(function(item){
            if(!previewObjnum.includes(item) && !arrArt.includes(main_imgs[0].id) && arrArt.length<n){   
                arrArt.push(item);
                previewObjnum.push(item);

                // if(previewObjnum.length==15){
                //     //console.log(previewObjnum);
                //     collectFinal();
                // }
            }
        })
    }
    if(arrArt==n){
        let promises=[];
        for (let i=0; i<n;i++){
            //console.log(previewObjnum[n]);
            promises.push(getImage(previewObjnum[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            let j=0;
            while (j<n){
                //console.log('collectPreview: '+previewObjnum[n],results[n]);
                changePreviewImg(section,j,results[j],previewObjnum[j]);
                j++;
            }    
        })
    }
}
function changePreviewImg(section,i,url,objnum){
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


//change these two
function changeHomeimg(i,url,objnum){
    preview1[i].src= url;
    preview1[i].id= objnum;
}

/* --------------------- */




//send to the next page
function sending(a){
    //console.log(a);
    window.location.href='metadata.html#id='+a.parentElement.id+'&src='+a.src;
}

function passvalues(){
    var keyword=document.getElementById('userInput').value.toLowerCase();
    window.location.href='afterSearch.html#id='+keyword+'&relevance='+relevant;
    location.reload();
}


// for (var i = 0; i < popimages.length; i++) {
//     popimages[i].addEventListener("click", function() {
//         event.preventDefault();
//         sending(popimages[i].src);
// })}

function changeImage(a) {
    document.getElementById("img").src=a.src;
}

function collectThis(a) {
    var pin=a.parentElement;
    var objnum=pin.id;
    const img = pin.querySelector("img");
    //console.log(objnum);
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
        localStorage.setItem('collection', cart);
    }
    else{
        localStorage.setItem('collection',objnum);
    }          
}

function getCollection(){
    popupWindow.classList.toggle('active');
    overlay.classList.add('active');
    //console.log('collections are '+localStorage.getItem('collection'));
    var list=localStorage.getItem('collection').split(',');
    console.log('final collection is: '+list);
    if(list.length!=0){
        let promises=[];
        for (let i=0; i<list.length;i++){
            promises.push(getImage(list[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
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

function searchTitle(a){
    var title=a.children[0].innerHTML;
    //console.log('title is: '+title);
    //location.search = location.search.replace(location.href.split('#')[1],'id='+title+'&relevance='+relevant);
    var str = location.search;
    if (new RegExp("[&?]"+name+"([=&].+)?$").test(str)) {
        str = str.replace(new RegExp("(?:[&?])"+name+"[^&]*", "g"), "")
    }
    str += name + "id=" + title+'&relevance='+relevant;
    str = "#" + str.slice(1);
    // there is an official order for the query and the hash if you didn't know.
    location.assign(location.origin + location.pathname + str + location.hash);
    location.reload();
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
    element.parentElement.id = objNum;

    // hide image if it is not there
    element.addEventListener("error", (e) => {
        element.parentElement.style.display = "none"
        if (DEV_MODE)
            console.log(`${e.target.src} could not be loaded and is therefore hidden.`)
    })
}

function displayImglist(section, url, objNum) {
    // Get the html element
    const element = window[section];
    // Check if we have a url for this element
    for (var i=0; i<url.length;i++){
        if (url[i] === "error")
        return element[i].parentElement.style.display = "none";

        // Set the url to the element en display the element
        element[i].src = url[i];
        //element.parentElement.style.display = "inline-block"
        element[i].parentElement.id = objNum[i];

        // hide image if it is not there
        element[i].addEventListener("error", (e) => {
            element[i].parentElement.style.display = "none"
            if (DEV_MODE)
                console.log(`${e.target.src} could not be loaded and is therefore hidden.`)
        })
    }
   
}