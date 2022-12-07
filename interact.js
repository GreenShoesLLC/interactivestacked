
let xaxis, yaxis;
let P_Data, R_Data;

let Portfolio, Resources;
let resType = {
  'Developer': 'Dev',
  'QA': 'QA',
  'Business Analyst': 'BA'
}

let ongoing = [0,1,2,3], ready = [4];

let mouseDown = null, is_draggle = false, state = false;
let oldX, oldY, lastAt;
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
    pro.data.map((item, index) => {
      let num = parseInt(pro.start) + index;
      let id = 't' + num;
      let box = document.getElementById(id);
      let height = item * unit.itemHeightUnit;
      let task = 
      `<span class="container" id="`+ i + '-' + index +`" 
        style="border-left:5px solid `+pro.strokecolor +`;border-top:2px solid `+pro.strokecolor +`;background:`+ pro.color + `;height:`+ height+'px'+`">
        `+ pro.name + (index + 1) + `
      </span>`;
      box.innerHTML +=(task);
    })
  });

  let data = document.querySelector('span');
  unit.dataWidth = getComputedStyle(data).width;
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
  let menu = `<li class="resource">
      <a href="javascript:void(0);">Resources</a>
      <div class="menu res-menu">
        <nav>Developer</nav>
        <nav>QA</nav>
        <nav>Business Analyst</nav>
      </div>
    </li>
    <li class="project">
      <a href="javascript:void(0);">Project +/-</a>
      <div class="menu pro-menu">
        Ready
        <div id="ready">
          <Button id="E-4">E+</Button>
        </div>
        OnGoing
        <div id="ongoing">
          <Button id="A-0">A-</Button>
          <Button id="B-1">B-</Button>
          <Button id="C-2">C-</Button>
          <Button id="D-3">D-</Button>
        </div>
      </div>
    </li>`;
    document.getElementById('menu').innerHTML += menu;
}

function drawCapacityLine() {
  R_Data.map((item, i) => {
    const para = document.createElement("div");
    const left = document.getElementById('t'+(i+1));
    para.className = 'capacityLine';
    para.style.width = unit.markWidth + 'px';
    para.style.top = unit.dataHeight - item*unit.itemHeightUnit + 'px';
    para.style.border = '1px solid red';
    para.style.position = 'absolute';
    document.getElementById('s'+(i+1)).appendChild(para);;
  });
}

function resize(e) {
  let element = document.getElementById(selectedID);
  clearTimeout(timer);
  let select = selectedID.split('-');
  let dataID = parseInt(P_Data[select[0]].start) + parseInt(select[1]);
  timer = setTimeout(() => {
    let step = oldY-e.pageY;
    let height =  P_Data[select[0]].data[select[1]] + step/unit.itemHeightUnit;
    let totalHeight = document.getElementById('t' + dataID).offsetHeight + step;
    if(height <= 1 || unit.dataHeight <= totalHeight) 
      return;
    oldY = e.pageY;
    P_Data[select[0]].data[select[1]] = height;
    element.style.height = height * unit.itemHeightUnit + 'px';
  }, 0);
}

// set span's position attribute absolute.
function setAbsolute(ID){
  let element = document.getElementById(ID);
  let scrollX = document.getElementById('content').scrollLeft;
  element.style.zIndex = '1';
  element.style.width = unit.dataWidth;
  let top = Math.abs(0 - element.offsetTop);
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

function addChild(e, at){
  if(method == 0 && state){
    let scrollX = document.getElementById('content').scrollLeft;
    let relx = e.pageX + scrollX - unit.contentStart - 1;
    let at = Math.ceil(relx/(parseInt(unit.markWidth) + 2));
    let [i, j] = selectedID.split('-');
    let start = parseInt(P_Data[parseInt(i)].start)-1;
    let step = at - start - parseInt(j);
    let length = P_Data[parseInt(i)].data.length;
    if(isBoundary('t' + (start + step), 't' + (start + (length -1) + step)))
      return false;
    for(let index=0;index<length;index++){
      let id  = parseInt(i) + '-' + index;
      setRelative(id);
      let select = document.getElementById(id);
      let embed = document.getElementById('t' + (start + index + step));
      embed.insertBefore(select, embed.children[0]);
    }
    P_Data[parseInt(i)].start = start + step;
  }
}

function isBoundary(firstID, lastID) {
  let first = document.getElementById(firstID), last = document.getElementById(lastID);
  return (first == null) || (last == null);
}

function drag(e) {
  if(mouseDown){
    if(method == 1){
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

function setUnit() {
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
}

class interActiveChart {
  constructor(port, Res, a) {
    Portfolio = port;
    Resources = Res;
    P_Data = Portfolio['Dev'], R_Data = Resources['Dev'], xaxis = a.xaxis, yaxis = a.yaxis;
    drawXaxis();
    setUnit();
    drawYaxis();
    draw();
    drawCapacityLine();
    drawMenu();
  }
}

window.onload = () => {

  jQuery("Button").on({
    mousedown:(e) => {
      let parentId = e.target.parentElement.id;
      let target = document.getElementById( parentId == 'ready' ? 'ongoing' : 'ready');
      e.target.innerText = e.target.innerText.slice(0, -1) + (parentId == 'ready' ? '-':'+');
      target.appendChild(e.target);
      let taskId = e.target.id.split('-')[1];
      if(parentId == 'ready'){
        let index = ready.filter((item, i) => { 
          if(item=== parseInt(taskId)){
            return i+1;
          }
            
        });
        delete ready[index[0]];
        ongoing.push(parseInt(taskId));
      } 
      else {
        let index = ongoing.filter((item, i) => { 
          if(item === parseInt(taskId)){
            return i+1;
          }
        });
        delete ongoing[index[0]];
        ready.push(parseInt(taskId));
      }
      redraw(displayRes);
  }});

  jQuery("nav").on({
    mousedown: (e) => {
      displayRes = e.target.innerText;
      redraw(displayRes);
    }
  });

  jQuery("#content").on({
    mousedown: (e) => {
      if(e.target.tagName == 'SPAN'){
        mouseDown = true;
        setMethod(e);
      }
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
    }
  });
  
}