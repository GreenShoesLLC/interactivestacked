
let portfolio = {
  "Developers": [
    {
      "name": "A",
      "bordercolor": "#990000",
      "color": "#cc0000",
      "prority": "1",
      "start": "1",
      "data": [2,2,3,4,10,1,2,3,4,5]
    },
    {
      "name": "B",
      "bordercolor": "#009900",
      "color": "#00cc00",
      "prority": "2",
      "start": "5",
      "data": [6,4,3,1,3,5,3]
    },
    {
      "name": "C",
      "bordercolor": "#003d99",
      "color": "#0052cc",
      "prority": "3",
      "start": "1",
      "data": [7,2,1,1,1,4,3]
    },
    {
      "name": "D",
      "bordercolor": "#990099",
      "color": "#cc00cc",
      "prority": "3",
      "start": "3",
      "data": [2,2,3,5,2,6,4,4,6,3,1]
    }
  ]
};

let date = [2022, 2025]; // start , end year
let { Developers } = portfolio;

let mouseDown;
let method = null; // 0: move, 1: resize
let oldX, oldY, selectedID;
let timer = null;
let is_draggle = false, state = false;

function buildAxis() {
  let axis = '';
  let content = document.getElementsByClassName("content");
  let [start, end] = date;
  for(let i=start; i<=end; i++){
    for(let j=0;j<10;j++){
      let id = j + 1 + (i-start) * 10;
      let mark = j==0 ? i + '.' + (j+1): (j+1);
      axis += `<div class="axis" id="s`+ id +`"><div id="mark">`+ mark +`</div><div class="data" id="t`+ id +`"></div></div>`;
    }
  }
  content[0].innerHTML = axis;
}

function setMethod(e) {
  oldX = e.pageX;
  oldY = e.pageY;
  selectedID = e.target.id;

  if(e.offsetY <= 6){
    method = 1;
  }
  else{
    method = 0;
    is_draggle = true;
  }
}

// set span's position attribute absolute.
function setAbsolute(ID){
  let element = document.getElementById(ID);
  let [i, j] = ID.split('-');
  let start = parseInt(Developers[parseInt(i)].start); 
  let parentId = 't' + (start + parseInt(j));
  let nodeList = document.getElementById(parentId).childNodes;
  let total = 0;
  element.style.position = 'absolute';
  for (let index = nodeList.length - 1; index >= 0; index--) {
    if(nodeList[index].id !== ID){
      total += parseInt(nodeList[index].style.height);
    }
    else{
      total += parseInt(nodeList[index].style.height);
      break;
    }
  }
  element.style.zIndex = '999';
  element.style.width = '55px';
  element.style.top = 780 - total + 'px';
  element.style.left = 10 + (parseInt(Developers[parseInt(i)].start) + parseInt(j)-1)*62 + 'px';
}

// set span's position attribute relative.
function setRelative(ID){
  let element = document.getElementById(ID);
  element.style.position = 'relative';
  element.style.width = '55px';
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.zIndex = '0';
}

function drag(e) {
  if(mouseDown){
    if(method == 1){
      resize(e);
    }
    if(method == 0){
      if(is_draggle){
        
      }
      move(e, selectedID);
    }
  }
}

function move(e, selectedID) {
  let [i, j] = selectedID.split('-');
  let length = Developers[parseInt(i)].data.length;
  clearTimeout(timer);
  timer = setTimeout(() => {
    let stepX = e.pageX-oldX, stepY=e.pageY-oldY;
    for(let index=0; index<length;index++){
      let id  = parseInt(i) + '-' + index;
      let element = document.getElementById(id);
      element.style.top = parseInt(element.style.top) + stepY + 'px';
      element.style.left = parseInt(element.style.left) + stepX + 'px';
    }
    oldX = e.pageX;
    oldY = e.pageY;
  }, 0);
}

function addChild(e){
  if(method == 0 && state){
    let relx = e.pageX - 10;
    let at = Math.ceil(relx/62);
    let [i, j] = selectedID.split('-');
    let start = parseInt(Developers[parseInt(i)].start)-1;
    let step = at - start - parseInt(j);
    let length = Developers[parseInt(i)].data.length;
    for(let index=0;index<length;index++){
      let id  = parseInt(i) + '-' + index;
      setRelative(id);
      let select = document.getElementById(id);
      let embed = document.getElementById('t' + (start + index + step));
      embed.insertBefore(select, embed.children[0]);
    }
    Developers[parseInt(i)].start = start + step;
  }
}

function resize(e) {
  let element = document.getElementById(selectedID);
  clearTimeout(timer);
  let select = selectedID.split('-')
  timer = setTimeout(() => {
    Developers[select[0]].data[select[1]] += (oldY-e.pageY)/30;
    if(Developers[select[0]].data[select[1]] <= 0.7)
      return;
    oldY = e.pageY;
    element.style.height = Developers[select[0]].data[select[1]] * 30 + 'px';
  }, 0);
}

function draw() {
  Developers.map((pro, i) => {
    pro.data.map((item, index) => {
      let num = parseInt(pro.start) + index;
      let id = 't' + num;
      let box = document.getElementById(id);
      let height = item * 20;
      let task = 
      `<span class="container" id="`+ i + '-' + index +`" 
        style="border-left:5px solid `+pro.bordercolor +`;border-top:2px solid `+pro.bordercolor +`;background:`+ pro.color + `;height:`+ height+'px'+`">
        `+ pro.name + (index + 1) + `
      </span>`;
      box.innerHTML +=(task);
    })
  });
}

window.onload = () => {
  buildAxis();
  draw();

  jQuery("span").on({
    mousedown: (e) => {
      mouseDown = true;
      setMethod(e);
    },
    mouseup: (e) => {
      mouseDown = false;
      addChild(e);
      is_draggle = false;
      state = false;
      method = null;
    },
  });

  jQuery(".content").on({
    mousemove: (e) => {
      if(mouseDown){
        if(is_draggle){
          let [i, j] = selectedID.split('-');
          let length = Developers[parseInt(i)].data.length;
          for(let index=0; index<length;index++){
            let id  = parseInt(i) + '-' + index;
            setAbsolute(id);
          }
          state = true;

        }
        is_draggle = false;
        drag(e);
      }
    },
    mouseup: () => {
      method = null;
      mouseDown = false;
      clearTimeout(timer);
    },
  });
}