import Data from './data.json' assert { type: 'json' };

let { Portfolio, Resources, Axis, Project} = Data;

let xaxis, yaxis;
let P_Data, R_Data;

let resType = {
  'Developer': 'Dev',
  'QA': 'QA',
  'Business Analyst': 'BA'
}

let ongoing = [0,1,2,3], ready = [4,5], selectedID, selectedTag, selectedClass, ctrlKey = false;

let mouseDown, lineDown = false, is_draggle = false, state = false;
let oldX, oldY;
let timer, method, displayRes = 'Developer';

let unit = {};

function drawXaxis() {
  let axis = '';
  let content = document.getElementById('content');
  let start = parseInt(xaxis.min), end = parseInt(xaxis.max);
  for(let i=start; i<=end; i++){
    for(let j=0;j<10;j++){
      let id = j + 1 + (i-start) * 10;
      axis += j == 0 ? `<div class="axis" id="s`+ id +`"><div id="mark" style="background: white">`+ i+`</div><div class="data" id="t`+ id +`"></div></div>` : `<div class="axis" id="s`+ id +`"><div id="mark">`+ (j+1)+`</div><div class="data" id="t`+ id +`"></div></div>`;
    }
  }
  content.innerHTML = axis;
}

function drawYaxis() {
  let m = document.getElementById('yaxis');
  m.style.height = unit.dataHeight + 'px';
  let max = parseInt(yaxis.max), interval = parseInt(yaxis.interval);
  let axis = '';
  let height = parseInt(unit.dataHeight)/(max/interval);
  for(let i=0; i< max;){
    i+=interval;
    axis += `<div style="height:`+ height + `px">` + i +`</div>`;
  }
  m.innerHTML = axis;
  unit.itemHeightUnit = height/interval;
}


function draw() {
  P_Data.map((pro, i) => {
    if(ongoing.filter((item) => (item == i)).length == 0)
      return false;
    let {start, strokecolor, color} = Project[pro.name];
    pro.data.map((item, index) => {
      let num = parseInt(start) + index;
      let id = 't' + num;
      let box = document.getElementById(id);
      let height = item * unit.itemHeightUnit;
      let task = 
      `<span class="container" id="`+ i + '-' + index +`" 
        style="border-left:5px solid `+strokecolor +`;border-top:2px solid `+ strokecolor +`;background:`+ color + `;height:`+ height+'px'+`">
        `+ pro.name + (index + 1) + `
      </span>`;
      box.innerHTML +=(task);
    })
  });

}

function redraw(type) {
  let span = document.getElementsByTagName('span');
  while(span.length){
    span[0].remove();
  }

  let capacity = document.getElementsByClassName('capacityLine');
  while(capacity.length){
    capacity[0].remove();
  }

  P_Data = Portfolio[resType[type]], R_Data = Resources[resType[type]];
  draw();
  drawCapacityLine();
}

function drawMenu() {
  let box1 = document.getElementById('ready');
  ready.map((item) => {
    let button = document.createElement('Button');
    button.style.cssText = 'margin:2px; display: inline-block;';
    button.id = P_Data[item].name + '-' + item;
    button.innerText =  P_Data[item].name + '+';
    box1.appendChild(button);
  });

  let box2 = document.getElementById('ongoing');
  ongoing.map((item) => {
    let button = document.createElement('button');
    button.style.cssText = 'margin:2px; display: inline-block;';
    button.id = P_Data[item].name + '-' + item;
    button.innerText =  P_Data[item].name + '-';
    box2.appendChild(button);
  });
}

function drawCapacityLine() {
  R_Data.map((item, i) => {
    const para = document.createElement("div");
    para.classList.add('capacityLine');
    para.id = 'c' + '-' + i;
    para.style.width = unit.markWidth + 'px';
    para.style.top = unit.dataHeight - item*unit.itemHeightUnit + 'px';
    document.getElementById('s'+(i+1)).appendChild(para);;
  });
}

function resize(e) {
  if(selectedTag == 'SPAN') {
    let element = document.getElementById(selectedID);
    clearTimeout(timer);
    let [i, j] = selectedID.split('-');
    let start = Project[P_Data[i].name].start;
    let dataID = parseInt(start) + parseInt(j);
    timer = setTimeout(() => {
      let step = oldY-e.pageY;
      let height =  P_Data[i].data[j] + step/unit.itemHeightUnit;
      let totalHeight = document.getElementById('t' + dataID).offsetHeight + step;
      if(height <= 1 || unit.dataHeight <= totalHeight) 
        return;
      oldY = e.pageY;
      P_Data[i].data[j] = height;
      element.style.height = height * unit.itemHeightUnit + 'px';
    }, 0);
  }
  if(selectedClass == 'capacityLine') {
    clearTimeout(timer);
    let i = selectedID.split('-')[1];
    timer = setTimeout(() => {
      let step = oldY - e.pageY;
      for(let j = ctrlKey ? 0 : i ; j < R_Data.length ; j++){
        let element = document.getElementById('c-' + j);
        let top = R_Data[j] + step/unit.itemHeightUnit;
        element.style.top = unit.dataHeight - top*unit.itemHeightUnit + 'px';
        R_Data[j] = top;
      }
      oldY = e.pageY;
    }, 0);

  }
}

function capacityColor(state) {
  let i = selectedID.split('-')[1];
  for(let j = ctrlKey ? 0 : i ; j < R_Data.length ; j++){
    let element = document.getElementById('c-' + j);
    element.style.border = state? '1px solid blue' : '1px dashed red';
  }
}

// set span's position attribute absolute.
function setAbsolute(ID){
  let element = document.getElementById(ID);
  let scrollX = document.getElementById('content').scrollLeft;
  element.style.zIndex = '1';
  element.style.width = unit.dataWidth;
  element.style.top = element.offsetTop + 'px';
  element.style.left = element.offsetLeft - scrollX + 'px';
  element.style.position = 'absolute';
}

// set span's position attribute relative.
function setRelative(ID){
  let element = document.getElementById(ID);
  element.style.position = 'relative';
  element.style.width = unit.dataWidth;
  element.style.top = '0px';
  element.style.left = '0px';
  element.style.zIndex = '0';
}

function addChild(e){
  if(method == 0 && state){
    let scrollX = document.getElementById('content').scrollLeft;
    let relx = e.pageX + scrollX - unit.contentStart - 1;
    let at = Math.ceil(relx/(parseInt(unit.markWidth) + 2));
    let [i, j] = selectedID.split('-');
    let start = parseInt(Project[P_Data[i].name].start)-1;
    let step = at - start - parseInt(j);
    let length = P_Data[parseInt(i)].data.length;
    if(isBoundary('t' + (start + step), 't' + (start + (length -1) + step)))
      return false;
    for(let index = 0 ; index < length ; index++){
      let id  = parseInt(i) + '-' + index;
      setRelative(id);
      let select = document.getElementById(id);
      let embed = document.getElementById('t' + (start + index + step));
      embed.insertBefore(select, embed.children[0]);
    }
    Project[P_Data[i].name].start = start + step;
  }
}

function isBoundary(firstID, lastID) {
  let first = document.getElementById(firstID), last = document.getElementById(lastID);
  return (first == null) || (last == null);
}

function drag(e) {
  if(mouseDown){
    if(method == 1 || lineDown ){
      resize(e);
    }
    if(method == 0){
      addChild(e);
    }
  }
}

function changeCursor(e) {
  if(e.target.tagName == 'SPAN'){
    let element = document.getElementById(e.target.id);
    if(e.offsetY < 6){
      element.style.cursor = 'ns-resize';
    } 
    else {
      element.style.cursor = 'pointer';
    }
  }

}

function setUnit(a) {
  switch(a){
    case 0:
      let axis = document.getElementById('s1');
      let max = (parseInt(xaxis.max) - parseInt(xaxis.min) + 1)*10;
      let last = document.getElementById('s' + max);
      let mark = document.getElementById('mark');
      
      let content = document.getElementById('content');

      unit = {
        markWidth: mark.offsetWidth,
        contentStart: content.offsetLeft, 
        contentEnd: last.offsetLeft,
        dataHeight: axis.offsetHeight - mark.offsetHeight,
        max: max
      }
      break;
    case 1:
      let data = document.querySelector('span');
      unit.dataWidth = getComputedStyle(data).width;
      break;
  }
}

function changeProject(e){
  let parentId = e.target.parentElement.id;
  let target = document.getElementById( parentId == 'ready' ? 'ongoing' : 'ready');
  e.target.innerText = e.target.innerText.slice(0, -1) + (parentId == 'ready' ? '-':'+');
  target.appendChild(e.target);
  let taskId = e.target.id.split('-')[1];
  if(parentId == 'ready'){
    let index = ready.indexOf(parseInt(taskId));
    ongoing.push(ready.splice(index, 1)[0]);
  } 
  else {
    let index = ongoing.indexOf(parseInt(taskId));
    ready.push(ongoing.splice(index, 1)[0]);
  }
  redraw(displayRes);
}

function value_init() {
  P_Data = Portfolio[resType[displayRes]], R_Data = Resources[resType[displayRes]], xaxis = Axis.xaxis, yaxis = Axis.yaxis;
}

function setMethod(e) {
  oldX = e.pageX;
  oldY = e.pageY;
  selectedID = e.target.id;
  selectedTag = e.target.tagName;
  selectedClass = e.target.className;

  mouseDown = true;
  if(selectedTag == 'SPAN'){
    if(e.offsetY <= 6){
      method = 1;
    }
    else{
      method = 0;
      is_draggle = true;
    }
  }

  if(selectedClass == 'capacityLine'){
    lineDown = true;
    capacityColor(true);
  }
}

function main() {
  value_init();
  
  drawXaxis();
  setUnit(0);
  drawYaxis();
  draw();
  setUnit(1);
  drawCapacityLine();
  drawMenu();
}

window.onload = () => {

  main();

  jQuery("button").on({
    mousedown:(e) => {
      changeProject(e);
  }});

  jQuery("nav").on({
    mousedown: (e) => {
      displayRes = e.target.innerText;
      redraw(displayRes);
    }
  });

  jQuery("#content").on({
    mousedown: (e) => {
      setMethod(e);
    },
    mousemove: (e) => {
      changeCursor(e);
      if(mouseDown){
        if(is_draggle){
          let [i, j] = selectedID.split('-');
          let length = P_Data[parseInt(i)].data.length;
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
    mouseup: (e) => {
      if(mouseDown){
        addChild(e);
        method = null;
        mouseDown = false;
        state = false;
      }
      capacityColor(false);
    }
  });

  jQuery("body").on({
    keydown: (e) => {
      if(e.ctrlKey){
        ctrlKey = true;
      }
    },
    keyup: () => {
      ctrlKey = false;
    }
  });
  
}