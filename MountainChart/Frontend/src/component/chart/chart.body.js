import React, { useState, useEffect, useRef, createRef, useContext } from 'react';

import Data from 'Database/data.json';
import { getPortfolio, getCapacity } from 'store/actions/resourceAction';

const ChartBody = ({chartId, filter}) => {

  const [unit, setUnit] = useState({
      markWidth: 0,
      contentStart: 0,
      contentEnd: 0,
      dataHeight: 0,
      max: 0
  });
  const [projectData, setProjectData] = useState({});
  const [portfolioData, setPortfolioData] = useState({});
  const [displayData, setDisplayData] = useState([]);
  const [capacityData, setCapacityData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dataRef = useRef([]), markRef = useRef(null), xAxisRef = useRef([]), yAxisRef = useRef(null);

  const { Axis } = Data;
  const { axisX, axisY } = Axis;
  let oldX, oldY, mouseDown, selectedID, selectedTag, selectedClass, is_draggle, method, state, lineDown, ctrlKey; 
  let timer;
  
  useEffect(() => {
    drawYaxis();
  }, []);

  useEffect(() => {
    setLoading(true);
    getPortfolio(filter.portfolio)
      .then(({tmpProject, tmpDemand}) => {
        setPortfolioData(tmpDemand);
        setDisplayData(tmpDemand[filter.resource]);
        setProjectData(tmpProject);
        setLoading(false);
      })
  }, [filter.portfolio]);

  useEffect(() => {
    console.log(filter);
    getCapacity(filter)
      .then((res) => {
        setCapacityData(res);
      })
  }, [filter.resource])

  useEffect(()=> {
    draw();
    drawCapacityLine();
  }, [portfolioData]);

  if(dataRef.current.length !== 50){
    dataRef.current = Array(50)
      .fill()
      .map((_, i) => dataRef.current[i] || createRef());
    xAxisRef.current = Array(50)
      .fill()
      .map((_, i) => xAxisRef.current[i] || createRef());
  }

  //init functions
  const draw = () => {
    if(displayData){
      displayData.map((pro, i) => {
        const { start, strokecolor, color } = projectData[pro.name];
        pro.data.map((item, index) => {
          const box = dataRef.current[parseInt(start) + index - 1];
          const node = document.createElement('span');
          node.innerText = pro.name + (index + 1);
          node.id = `${chartId}-${i}-${index}`;
          node.className = 'con';
          node.style.cssText = `background:${color};border: 1px solid ${strokecolor};border-top: 1px solid ${strokecolor};height:` + item*unit.itemHeightUnit + `px`;
          box.current.appendChild(node);
          return true;
        })
        return true;
      });
    }
    

  }

  const drawCapacityLine = () => {
    if(capacityData){
      capacityData.map((item, i) => {
        const box = dataRef.current[i];
        const node = document.createElement('div');
        node.classList.add('capacityLine');
        node.id = `${chartId}-${i}`;
        node.style.cssText = `width: ${unit.markWidth}px;top:${unit.dataHeight - item * unit.itemHeightUnit}px`;
        box.current.appendChild(node);
        return true;
      });
    }
  }

  const drawYaxis = ()  => {
    let tmpUnit = {
      markWidth: markRef.current.offsetWidth,
      contentStart: xAxisRef.current[0].current.offsetLeft,
      contentEnd: xAxisRef.current[xAxisRef.current.length-1].current.offsetLeft,
      dataHeight: xAxisRef.current[0].current.offsetHeight - markRef.current.offsetHeight,
      max: (parseInt(axisX.max) - parseInt(axisX.min) + 1)*10
    };

    const box = yAxisRef.current;

    box.style.height = tmpUnit.dataHeight + 'px';
    const max = parseInt(axisY.max), interval = parseInt(axisY.interval), height = parseInt(tmpUnit.dataHeight)/(max/interval);
    tmpUnit.itemHeightUnit = height/interval;
    
    setUnit(tmpUnit);

    let m = [];
    while(m.length < max/interval){
      m.push((m.length+1)*interval);
    };

    m.map((item) => {
      const node = document.createElement('div');
      node.innerText = item;
      node.style.cssText = `height:${height}px`;
      box.appendChild(node);
      return true;
    });
  
  }

  const XItem = () => {
    let start = parseInt(axisX.min), end = parseInt(axisX.max);
    let x = [];
    for(let i=0; i<=(end-start);i++){
      for(let j=0; j<10;j++){
        x.push({
          year: i + start,
          month: j,
        });
      }
    }

    return x.map((item, index) => (
      <div className='xAxis' key = {index} ref={xAxisRef.current[index]}>
        <div id='mark' style={{background: index%10 === 0 ? 'white' : 'rgb(217, 217, 217)'}} ref = {markRef}>
          { index%10 === 0 ? item.year : index%10 + 1 }
        </div>
        <div className = 'data' id={'t' + index} ref={dataRef.current[index]}>
        </div>
      </div>
    ));
  };

  //draggle Functions
  const draggleMethod = (e) => {
    oldX = e.pageX;
    oldY = e.pageY;
    selectedID = e.target.id;
    selectedTag = e.target.tagName;
    selectedClass = e.target.className;

    mouseDown = true;
    if(selectedTag === 'SPAN'){
      if(e.offsetY <= 6){
        method = 1;
      }
      else{
        method = 0;
        is_draggle = true;
      }
    }

    if(selectedClass === 'capacityLine'){
      lineDown = true;
      capacityColor(true);
    }
  }

  const capacityColor = (state) => {
    let i = selectedID.split('-')[1];
    for(let j = ctrlKey ? 0 : i ; j < capacityData.length ; j++){
      let element = document.getElementById(`${chartId}-${j}`);
      element.style.border = state? '1px solid #0000cc' : '1px dashed #cc0000';
    }
  }
  // set span's position attribute absolute.
  const setAbsolute = (ID) => {
    let element = document.getElementById(ID);
    let scrollX = document.getElementById(`content${chartId}`).scrollLeft;
    element.style.zIndex = '1';
    element.style.width = unit.dataWidth;
    element.style.top = element.offsetTop + 'px';
    element.style.left = element.offsetLeft - scrollX + 'px';
    element.style.position = 'absolute';
  }

  // set span's position attribute relative.
  const setRelative = (ID) => {
    let element = document.getElementById(ID);
    element.style.position = 'relative';
    element.style.width = unit.dataWidth;
    element.style.top = '0px';
    element.style.left = '0px';
    element.style.zIndex = '0';
  }

  const drag = (e) => {
    if(method === 1 || lineDown){
      reSize(e);
    }
    if(method === 0){
      addChild(e);
    }
  }

  const addChild = (e) => {
    if(method === 0 && state && selectedID){
      let scrollX = document.getElementById(`content${chartId}`).scrollLeft;
      let relx = e.pageX + scrollX - unit.contentStart - 1;
      let at = Math.ceil(relx/(parseInt(unit.markWidth) + 2));
      let [i, j] = selectedID.split('-').slice(1);
      let start = parseInt(projectData[displayData[i].name].start)-1;
      let step = at - start - parseInt(j);
      let length = displayData[parseInt(i)].data.length;

      if(isBoundary(start + step, start + (length -1) + step))
        return false;
        
      for(let index = 0 ; index < length ; index++){
        let id  = `${chartId}-${parseInt(i)}-${index}`;
        setRelative(id);
        let select = document.getElementById(id);
        let embed = dataRef.current[start + index + step - 1].current;
        embed.insertBefore(select, embed.children[0]);
      }
      state = false;
      projectData[displayData[i].name].start = start + step;
    }
  }

  const isBoundary = (firstID, lastID) => {
    return firstID < 1 || lastID > unit.max;
  }

  const reSize = (e) => {
    if(selectedTag === 'SPAN' && !state) {
      let element = document.getElementById(selectedID);
      clearTimeout(timer);
      let [i, j] = selectedID.split('-').slice(1);
      timer = setTimeout(() => {
        let step = oldY-e.pageY;
        let height =  displayData[i].data[j] + step/unit.itemHeightUnit;
        let totalHeight = element.parentElement.offsetHeight + step;
        if(height <= 1 || unit.dataHeight <= totalHeight) 
          return;
        oldY = e.pageY;
        displayData[i].data[j] = height;
        element.style.height = height * unit.itemHeightUnit + 'px';
      }, 0);
    }

    if(selectedClass === 'capacityLine') {
      clearTimeout(timer);
      let i = selectedID.split('-')[1];
      timer = setTimeout(() => {
        let step = oldY - e.pageY;
        for(let j = ctrlKey ? 0 : i ; j < capacityData.length ; j++){
          let element = document.getElementById(`${chartId}-${j}`);
          let top = capacityData[j] + step/unit.itemHeightUnit;
          element.style.top = unit.dataHeight - top*unit.itemHeightUnit + 'px';
          capacityData[j] = top;
        }
        oldY = e.pageY;
      }, 0);
  
    }
  }

  //mouse event handle function 
  const handle = (e) => {
    e = e.nativeEvent;
    switch(e.type){
      case 'mousedown':
        draggleMethod(e);
        break;
      case 'mousemove':
        changeCursor(e);
        if(mouseDown){
          if(is_draggle && method === 0){
            let i = selectedID.split('-')[1];
            let length = displayData[parseInt(i)].data.length;
            for(let index=0; index<length;index++){
              let id  = `${chartId}-${parseInt(i)}-${index}`;
              setAbsolute(id);
            }
  
          }
          if(method === 0) state = true;
          is_draggle = false;
          drag(e);
        }
        break;
      case 'mouseup':
        mouseDown = false;
        method = null;
        lineDown = false;
        state = false;
        capacityColor(false);
        break;
      default:
        break;
    }
  }

  const changeCursor = (e) => {
    
    if(e.target.tagName === 'SPAN'){
      let element = document.getElementById(e.target.id);
      if(e.offsetY < 6){
        element.style.cursor = 'ns-resize';
      } 
      else {
        element.style.cursor = 'pointer';
      }
    }
  }

  //key event handle function
  const keyhandle = (e) => {
    ctrlKey = e.ctrlKey;
  };

  document.addEventListener('keydown', keyhandle, false);
  document.addEventListener('keyup', keyhandle, false);

  return (
    <>
      <div className="body">
        <div id="yaxis" ref={yAxisRef}></div>
        <div className="content"
          id={`content${chartId}`} 
          onMouseMove={handle} 
          onMouseUp={handle} 
          onMouseDown={handle}>
          {
            loading?(
              <div className="spinner"></div>
            ) : (
              <XItem />
            )
          }
        </div>
      </div>
    </>
  )
}

export default ChartBody;