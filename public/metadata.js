/* pass the img url from previous page*/
var main_img=document.querySelector(".main_img");
var similarImgs=document.querySelectorAll('.similar_img');
const DEV_MODE = true;
var relevant=1; //1=relevant;0=weird
const openCollectionButtons=document.querySelector('.collect');
const popupWindow=document.querySelector('.collection-pop');
const overlay=document.getElementById('overlay');
var popimagesCollection =document.querySelectorAll('.pop_img');
var regularbtn=document.getElementById('regular');
var weirdbtn=document.getElementById('weird');
var btn=document.getElementById('btn');



function passImg(){
    var a=window.location.href.split('#')[1].split('&'),
    id=a[0].split('=')[1],
    src=a[1].split('=')[1],
    img=document.images[0];
    main_img.id=id;
    main_img.src=src;
    matchSimilar(id);
   }


//detect if the image is in portrait or landscape
main_img.addEventListener("load", function() {
    if (this.naturalHeight > this.naturalWidth) {
        this.classList.add("portrait")
    } else {
        this.classList.add("landscape")
    }
})  

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
//collect the usersets which contains the objnum

async function matchSimilar(objnum){
    console.log('objnum is '+objnum);
    const response = await fetch('csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrRow=[]; //array of the row

    for (var i=0; i<setTable.length; i++){
        const items=setTable[i].replace('\r', "").split(',');
        items.forEach(item=>{
            if(item==objnum){
                arrRow.push(i);
                }
            })
    }
    collectObjnum(objnum,arrRow);
}

function passvalues(){
    var keyword=document.getElementById('userInput').value.toLowerCase();
    window.location.href='afterSearch.html#id='+keyword+'&relevance='+relevant;
    getTitle();
}

//collect n similar objectnums


//display the images, send url to html
function changeSimilarImg(i, url, objNum) {
    // Get the html element
    const element = similarImgs[i]

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

async function collectObjnum(objnum,rowArr){
    //console.log(rowArr);
    const response = await fetch('csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrArt=[];
    const n=60;
    while(arrArt.length<n){
        const row=rowArr[Math.floor(Math.random()*rowArr.length)];
        const items=setTable[Number(row)-2].replace('\r', "").split(',');
        items.forEach(function(item){
            if(!arrArt.includes(item) && item!=objnum &&arrArt.length<n){   
                arrArt.push(item);
            }
        })
    }
    if(arrArt.length==n){
        var promises=[];
        for (let i=0; i<n;i++){
            promises.push(getImage(arrArt[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            let i=0;
            //let n=0;
            while (i<n){
                //n++;
                changeSimilarImg(i,results[i],arrArt[i]);
                i++;
            }    
        })
    }   
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

function md5(inputString) {
    var hc="0123456789abcdef";
    function rh(n) {var j,s="";for(j=0;j<=3;j++) s+=hc.charAt((n>>(j*8+4))&0x0F)+hc.charAt((n>>(j*8))&0x0F);return s;}
    function ad(x,y) {var l=(x&0xFFFF)+(y&0xFFFF);var m=(x>>16)+(y>>16)+(l>>16);return (m<<16)|(l&0xFFFF);}
    function rl(n,c)            {return (n<<c)|(n>>>(32-c));}
    function cm(q,a,b,x,s,t)    {return ad(rl(ad(ad(a,q),ad(x,t)),s),b);}
    function ff(a,b,c,d,x,s,t)  {return cm((b&c)|((~b)&d),a,b,x,s,t);}
    function gg(a,b,c,d,x,s,t)  {return cm((b&d)|(c&(~d)),a,b,x,s,t);}
    function hh(a,b,c,d,x,s,t)  {return cm(b^c^d,a,b,x,s,t);}
    function ii(a,b,c,d,x,s,t)  {return cm(c^(b|(~d)),a,b,x,s,t);}
    function sb(x) {
        var i;var nblk=((x.length+8)>>6)+1;var blks=new Array(nblk*16);for(i=0;i<nblk*16;i++) blks[i]=0;
        for(i=0;i<x.length;i++) blks[i>>2]|=x.charCodeAt(i)<<((i%4)*8);
        blks[i>>2]|=0x80<<((i%4)*8);blks[nblk*16-2]=x.length*8;return blks;
    }
    var i,x=sb(inputString),a=1732584193,b=-271733879,c=-1732584194,d=271733878,olda,oldb,oldc,oldd;
    for(i=0;i<x.length;i+=16) {olda=a;oldb=b;oldc=c;oldd=d;
        a=ff(a,b,c,d,x[i+ 0], 7, -680876936);d=ff(d,a,b,c,x[i+ 1],12, -389564586);c=ff(c,d,a,b,x[i+ 2],17,  606105819);
        b=ff(b,c,d,a,x[i+ 3],22,-1044525330);a=ff(a,b,c,d,x[i+ 4], 7, -176418897);d=ff(d,a,b,c,x[i+ 5],12, 1200080426);
        c=ff(c,d,a,b,x[i+ 6],17,-1473231341);b=ff(b,c,d,a,x[i+ 7],22,  -45705983);a=ff(a,b,c,d,x[i+ 8], 7, 1770035416);
        d=ff(d,a,b,c,x[i+ 9],12,-1958414417);c=ff(c,d,a,b,x[i+10],17,     -42063);b=ff(b,c,d,a,x[i+11],22,-1990404162);
        a=ff(a,b,c,d,x[i+12], 7, 1804603682);d=ff(d,a,b,c,x[i+13],12,  -40341101);c=ff(c,d,a,b,x[i+14],17,-1502002290);
        b=ff(b,c,d,a,x[i+15],22, 1236535329);a=gg(a,b,c,d,x[i+ 1], 5, -165796510);d=gg(d,a,b,c,x[i+ 6], 9,-1069501632);
        c=gg(c,d,a,b,x[i+11],14,  643717713);b=gg(b,c,d,a,x[i+ 0],20, -373897302);a=gg(a,b,c,d,x[i+ 5], 5, -701558691);
        d=gg(d,a,b,c,x[i+10], 9,   38016083);c=gg(c,d,a,b,x[i+15],14, -660478335);b=gg(b,c,d,a,x[i+ 4],20, -405537848);
        a=gg(a,b,c,d,x[i+ 9], 5,  568446438);d=gg(d,a,b,c,x[i+14], 9,-1019803690);c=gg(c,d,a,b,x[i+ 3],14, -187363961);
        b=gg(b,c,d,a,x[i+ 8],20, 1163531501);a=gg(a,b,c,d,x[i+13], 5,-1444681467);d=gg(d,a,b,c,x[i+ 2], 9,  -51403784);
        c=gg(c,d,a,b,x[i+ 7],14, 1735328473);b=gg(b,c,d,a,x[i+12],20,-1926607734);a=hh(a,b,c,d,x[i+ 5], 4,    -378558);
        d=hh(d,a,b,c,x[i+ 8],11,-2022574463);c=hh(c,d,a,b,x[i+11],16, 1839030562);b=hh(b,c,d,a,x[i+14],23,  -35309556);
        a=hh(a,b,c,d,x[i+ 1], 4,-1530992060);d=hh(d,a,b,c,x[i+ 4],11, 1272893353);c=hh(c,d,a,b,x[i+ 7],16, -155497632);
        b=hh(b,c,d,a,x[i+10],23,-1094730640);a=hh(a,b,c,d,x[i+13], 4,  681279174);d=hh(d,a,b,c,x[i+ 0],11, -358537222);
        c=hh(c,d,a,b,x[i+ 3],16, -722521979);b=hh(b,c,d,a,x[i+ 6],23,   76029189);a=hh(a,b,c,d,x[i+ 9], 4, -640364487);
        d=hh(d,a,b,c,x[i+12],11, -421815835);c=hh(c,d,a,b,x[i+15],16,  530742520);b=hh(b,c,d,a,x[i+ 2],23, -995338651);
        a=ii(a,b,c,d,x[i+ 0], 6, -198630844);d=ii(d,a,b,c,x[i+ 7],10, 1126891415);c=ii(c,d,a,b,x[i+14],15,-1416354905);
        b=ii(b,c,d,a,x[i+ 5],21,  -57434055);a=ii(a,b,c,d,x[i+12], 6, 1700485571);d=ii(d,a,b,c,x[i+ 3],10,-1894986606);
        c=ii(c,d,a,b,x[i+10],15,   -1051523);b=ii(b,c,d,a,x[i+ 1],21,-2054922799);a=ii(a,b,c,d,x[i+ 8], 6, 1873313359);
        d=ii(d,a,b,c,x[i+15],10,  -30611744);c=ii(c,d,a,b,x[i+ 6],15,-1560198380);b=ii(b,c,d,a,x[i+13],21, 1309151649);
        a=ii(a,b,c,d,x[i+ 4], 6, -145523070);d=ii(d,a,b,c,x[i+11],10,-1120210379);c=ii(c,d,a,b,x[i+ 2],15,  718787259);
        b=ii(b,c,d,a,x[i+ 9],21, -343485551);a=ad(a,olda);b=ad(b,oldb);c=ad(c,oldc);d=ad(d,oldd);
    }
    return rh(a)+rh(b)+rh(c)+rh(d);
}

function changeImage(a) {
    document.getElementById("img").src=a.src;
}

// function zoomIn(){
//     if(main_img.classList.contains("landscape")){
//         var currWidth = main_img.clientWidth;
//         main_img.style.width = (currWidth + 40) + "px";
//     }else{
//         var currHeight = main_img.clientHeight;
//         main_img.style.height = (currHeight + 40) + "px";
//     }
// }
// function zoomOut(){
//     if(main_img.classList.contains("landscape")){
//         var currWidth = main_img.clientWidth;
//         main_img.style.width = (currWidth - 40) + "px";
//     }else{
//         var currHeight = main_img.clientHeight;
//         main_img.style.height = (currHeight - 40) + "px";
//     }
// }

function sending(a){
    //console.log('clicked',a.id,location.href.split('#')[0]);
    var str = location.search;
    if (new RegExp("[&?]"+name+"([=&].+)?$").test(str)) {
        str = str.replace(new RegExp("(?:[&?])"+name+"[^&]*", "g"), "")
    }
    str += name + "id=" + a.parentElement.id+'&src='+a.src;
    str = "#" + str.slice(1);
    // there is an official order for the query and the hash if you didn't know.
    location.assign(location.origin + location.pathname + str + location.hash);
    location.reload();
}

function collectThis(a) {
    var pin=a.parentElement;
    var objnum=pin.id;
    console.log(objnum);
    //window.localStorage.setItem('collection',objnum);
    a.src='images/icon/collected.png';
    a.style.display='inline-block';
    //
    var cart;
    if (localStorage.hasOwnProperty('collection')){
        cart = [localStorage.getItem('collection')];
        if (!cart.includes(objnum)){
            cart.push(objnum);  
        } 
        //console.log(cart);
        localStorage.setItem('collection', cart);
    }
    else{
        localStorage.setItem('collection',objnum);
    }          
}
function collectMain(a) {
    var objnum=main_img.id;
    //console.log(img.src);
    //window.localStorage.setItem('collection',objnum);
    a.src='images/icon/collected.png';
    a.style.display='inline-block';
    //
    var cart;
    if (localStorage.hasOwnProperty('collection')){
        cart = [localStorage.getItem('collection')];
        if (!cart.includes(objnum)){
            cart.push(objnum);   
        }
        //console.log(cart);
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

function closeCollection(){
    popupWindow.classList.toggle('active');
    overlay.classList.remove('active');
}

function fullMode(){
    console.log('test');
    const maximg=main_img.getAttribute('src').replace('500px','1000px');
    document.querySelector('.full-image img').src=maximg;
    document.querySelector('.full-image').style.display='block';
}

document.querySelector('.full-image span').onclick=()=>{
  document.querySelector('.full-image').style.display='none';
}

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
function passvalues(){
    var keyword=document.getElementById('userInput').value.toLowerCase();
    //console.log(relevant);
    //window.location.href='afterSearch.html#id='+keyword;
    window.location.href='afterSearch.html#id='+keyword+'&relevance='+relevant;

}

