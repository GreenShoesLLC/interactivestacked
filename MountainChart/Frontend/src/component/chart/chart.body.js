import React, { useState, useEffect, useRef, createRef } from 'react';
import moment from 'moment';

const ChartBody = (props) => {

  const [unit, setUnit] = useState({
      markWidth: 0,
      contentStart: 0,
      contentEnd: 0,
      dataHeight: 0,
      max: 0
  });

  const [projectData, setProjectData] = useState({});
  const [displayData, setDisplayData] = useState([]);
  const [capacityData, setCapacityData] = useState([]);
  const [label, setLabel] = useState({});
  const [loading, setLoading] = useState(props.loading);
  const [capindex, setCapIndex] = useState({});

  const dataRef = useRef([]);
  const markRef = useRef(null); 
  const xAxisRef = useRef([]);
  const yAxisRef = useRef(null);
  const bodyRef = useRef(null);
  const labelRef = useRef(null);

  const { chartId, stateChange } = props;
  let { AxisXMax, AxisXMin, AxisYMax, AxisYInterval } = props.datasource;
  let oldX, oldY, moveUpDown, mouseDown, selectedID, selectedIndex, selectedTag, selectedClass, method, state, lineDown, ctrlKey; 
  let timer;

  useEffect(() => {
    const { AxisXLabel, AxisYLabel, chartdata, filter } = props.datasource;
    if(chartdata) {
      const { cap, project, portfolio } = chartdata;
      setDisplayData(portfolio[filter.resource]);
      setCapacityData(cap[filter.resource]['BaselineCapacity']);
      setCapIndex(cap[filter.resource]['Id']);
      setProjectData(project);
      setLabel({X:AxisXLabel, Y:AxisYLabel});
      setLoading(props.loading);
    }
  }, [props]);
  
  useEffect(()=> {
    drawYaxis();
  }, [projectData, capacityData]);

  useEffect(() => {
    draw();
    drawCapacityLine();
  }, [unit]);

  if(dataRef.current.length !== (AxisXMax - AxisXMin + 1) * 10) {
    dataRef.current = Array( (AxisXMax - AxisXMin + 1) * 10 )
      .fill()
      .map((_, i) => dataRef.current[i] || createRef());
    xAxisRef.current = Array( (AxisXMax - AxisXMin + 1) * 10 )
      .fill()
      .map((_, i) => xAxisRef.current[i] || createRef());
  }

  //init functions
  const draw = () => {
    if(displayData) {
      displayData.map((pro, i) => {
        const { start, strokecolor, color } = projectData[pro.name];
        const [year, month] = start.split('.');
        const startAt = (parseInt(year) - AxisXMin) * 10 + parseInt(month);
        pro.data.map((item, index) => {
          if(!dataRef.current[ startAt + index - 1]) { return false; }
          const box = dataRef.current[ startAt + index - 1];
          const node = document.createElement('span');
          node.innerText = `${pro.name}(${Math.round(item)})`;
          node.id = `${chartId}-${i}-${index}`;
          node.className = 'con';
          node.style.cssText = 
            `background:${color};border: 1px solid ${strokecolor};
            border-top: 1px solid ${strokecolor};height:${item*unit.itemHeightUnit}px`;
          box.current.appendChild(node);
          return true;
        })
        return true;
      });
    }
  }
  
  const drawCapacityLine = () => {
    if(capacityData) {
      capacityData.map((item, i) => {
        if(!dataRef.current[i]) { return false; }
        const box = dataRef.current[i];
        const node = document.createElement('div');
        node.classList.add('capacityLine');
        node.id = `${chartId}-${i}`;
        node.style.cssText = 
          `width: ${unit.markWidth}px;top:${unit.dataHeight - item * unit.itemHeightUnit}px`;
        box.current.appendChild(node);
        return true;
      });
    }
  }

  const drawYaxis = ()  => {
    if(!AxisYMax && displayData) {
      let max = 0;
      displayData.map((item) => {
        max += Math.max(...item.data);
        return true;
      });
      AxisYMax = max/3;
    }

    const bodyPadding = parseInt(getComputedStyle(bodyRef.current).paddingLeft || 0);

    let tmpUnit = {
      markWidth: markRef.current.offsetWidth,
      contentStart: xAxisRef.current[0].current.offsetLeft + bodyPadding,
      contentEnd: xAxisRef.current[xAxisRef.current.length-1].current.offsetLeft,
      dataHeight: xAxisRef.current[0].current.offsetHeight - markRef.current.offsetHeight,
      max: (parseInt(AxisXMax) - parseInt(AxisXMin) + 1) * 10
    };

    const box = yAxisRef.current;

    while(box.firstChild) {
      box.removeChild(box.lastChild);
    }

    box.style.height = `${tmpUnit.dataHeight}px`;
    const max = parseInt(AxisYMax);
    const interval = parseInt(AxisYInterval);
    const height = parseInt(tmpUnit.dataHeight)/(max/interval);
    tmpUnit.itemHeightUnit = height/interval;
    
    setUnit(tmpUnit);

    let m = [];
    while( m.length < Math.ceil(max/interval) ) {
      m.push( (m.length + 1) * interval );
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
    const start = parseInt(AxisXMin);
    const end = parseInt(AxisXMax);
    let x = [];
    for(let i = 0; i <= (end - start); i++){
      for(let j = 0; j < 10; j++){
        x.push({
          year: i + start,
          month: j,
        });
      }
    }

    return x.map((item, index) => (
      <div className='xAxis' key = {index} ref = {xAxisRef.current[index]}>
        <div id='mark' style = {{background: index%10 === 0 ? 'white' : 'rgb(217, 217, 217)'}} ref = {markRef}>
          { index%10 === 0 ? item.year : index%10 + 1 }
        </div>
        <div className = 'data' id={'t' + index} ref = {dataRef.current[index]}>
        </div>
      </div>
    ));
  };

  const onDemandChange = () => {
    if(stateChange) {
      if(method === 1) {
        stateChange({state: 'resize', newData: displayData[selectedIndex]});
      } 
      if(method === 0) {
        let tmpData = [];
        Object.keys(projectData).map((key) => {
          let { Id, priority, start } = projectData[key];
          tmpData.push({
            Id: Id,
            BaselinePriority: priority,
            BaselineStartDate: moment(`${start}.01`).format('Y-MM-DD')
          });
        });
        stateChange({state: 'drag', newData: tmpData});
      }
    }
  }

  const onCapacityChange = () => {
    if(stateChange) {
      stateChange({state: 'capacity', newData: {data: capacityData, index: capindex}});
    }
  }

  //draggle Functions
  const draggleMethod = (e) => {
    oldX = e.pageX;
    oldY = e.pageY;
    selectedID = e.target.id;
    selectedTag = e.target.tagName;
    selectedClass = e.target.className;

    mouseDown = true;
    if(selectedTag === 'SPAN') {
      if(e.offsetY <= 6) {
        method = 1;
      } else {
        method = 0;
      }
      changeInnerText();
    }

    if(selectedClass === 'capacityLine') {
      lineDown = true;
      capacityColor(true);
    }
  }

  const capacityColor = (state) => {
    const i = selectedID.split('-')[1];
    for(let j = ctrlKey ? 0 : i; j < capacityData.length; j++) {
      let element = document.getElementById(`${chartId}-${j}`);
      if(!element) continue;
      element.style.border = state ? '1px solid #0000cc' : '1px dashed #cc0000';
    }
  }

  const drag = (e) => {
    if(method === 1 || lineDown) {
      reSize(e);
    }
    if(method === 0) {
      addChild(e);
    }
  }

  const changeInnerText = () => {
    const i = selectedID.split('-').slice(1)[0];
    const length =  displayData[parseInt(i)].data.length;

    for(let index = 0; index < length; index++) {
      const id  = `${chartId}-${parseInt(i)}-${index}`;
      let span = document.getElementById(id);
      
      if(!span) continue;
      if(mouseDown && (method === 0)) {
        span.innerText = `${span.innerText.split('(')[0]}-${index+1}`;
        span.style.borderWidth = '2px';
      }
      if(!mouseDown && (method === 0)) {
        span.innerText = `${span.innerText.split('-')[0]}(${Math.round(displayData[i].data[index])})`;
        span.style.borderWidth = '1px';
      } 
    }
  }

  const addChild = (e) => {
    if(method === 0 && state && selectedID) {
      const scrollX = document.getElementById(`content${chartId}`).scrollLeft;
      const relx = e.pageX + scrollX - unit.contentStart - 1;
      const at = Math.ceil(relx/(parseInt(unit.markWidth) + 2));
      const [i, j] = selectedID.split('-').slice(1);
      const [year, month] = projectData[displayData[i].name].start.split('.');
      const start = (parseInt(year) - AxisXMin) * 10 + parseInt(month) - 1;
      const step = at - start - parseInt(j);
      const length = displayData[parseInt(i)].data.length;

      if(isBoundary(start + step, start + (length -1) + step) && (parseInt(year) >= AxisXMin)) { return false; }

      if((step-1) !== 0) {
        const color = projectData[displayData[i].name].color;
        const strokecolor = projectData[displayData[i].name].strokecolor;

        for(let index = length-1; index >=0; index--) {
          const id  = `${chartId}-${parseInt(i)}-${index}`;
          let select = document.getElementById(id);
          if(!select) {
            const item = displayData[i].data[index];
            select = document.createElement('span');
            select.innerText = `${displayData[i].name}-${index+1}`;
            select.id = id;
            select.className = 'con';
            select.style.cssText = 
              `background:${color};border: 1px solid ${strokecolor};
              border-top: 1px solid ${strokecolor};height:${item*unit.itemHeightUnit}px`;
          }
          if(!dataRef.current[start + index + step - 1]) continue;
          let embed = dataRef.current[start + index + step - 1].current;
          embed.insertBefore(select, embed.children[0]);
        }
        state = false;

        const y = Math.floor( (start + step)/10 ) + AxisXMin
        const m = (start + step) % 10 === 0 ? 10 : (start + step) % 10;
        projectData[displayData[i].name].start = `${y}.${m}`;
      }
      else {
        if( moveUpDown && (e.pageY > oldY) ) {
          for(let index = 0 ; index < length ; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);

            if(!select) continue;
            let embed = select.parentNode;
            if(select.nextSibling) {
              embed.insertBefore(select.nextSibling, select);
            }
          }    
        }
        if( moveUpDown && (e.pageY < oldY) ) {
          for(let index = 0; index < length; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);
            if(!select) continue;
            let embed = select.parentNode;
            if(select.previousSibling) {
              embed.insertBefore(select, select.previousSibling);
            }
              
          } 
        }  
        oldY = e.pageY;
        moveUpDown = false;
      }
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
      selectedIndex = i;
      timer = setTimeout(() => {
        let step = oldY-e.pageY;
        let height =  displayData[i].data[j] + step/unit.itemHeightUnit;
        let totalHeight = element.parentElement.offsetHeight + step;
        if(height <= 1 || unit.dataHeight <= totalHeight) 
          return;
        oldY = e.pageY;
        displayData[i].data[j] = height;
        element.style.height = height * unit.itemHeightUnit + 'px';
        element.innerText = `${element.innerText.split('(')[0]}(${Math.round(height)})`;
      }, 0);
    }

    if(selectedClass === 'capacityLine') {
      clearTimeout(timer);
      let i = selectedID.split('-')[1];
      timer = setTimeout(() => {
        let step = oldY - e.pageY;
        for(let j = ctrlKey ? 0 : i ; j < capacityData.length ; j++){
          let element = document.getElementById(`${chartId}-${j}`);
          if(!element)
            continue;
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
          if(method === 0) state = true;
          drag(e);
        }
        break;
      case 'mouseup':
        mouseDown = false;
        if(selectedTag === 'SPAN'){
          changeInnerText();
          onDemandChange(method);
        }
        method = null;
        if(lineDown) {
          onCapacityChange();
        }
        lineDown = false;
        state = false;
        moveUpDown = false;
        capacityColor(false);
        break;
      case 'mouseout':
        if((e.target.id === selectedID) && mouseDown) {
          moveUpDown = true;
        }
        break;
      default:
        break;
    }
  }

  const changeCursor = (e) => {
    
    if((e.target.tagName === 'SPAN')){
      let element = document.getElementById(e.target.id);
      if((e.offsetY < 6) && (method !== 0) && (!moveUpDown)){
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
      <div className="body" ref={bodyRef}>
        <div className="label label-y" ref={labelRef}>
          { 
            label.Y?<nav>{label.Y}</nav>:''
          }
        </div>
        <div>{label.x}</div>
        <div id="yaxis" ref={yAxisRef}></div>
        <div className="content"
          id={`content${chartId}`} 
          onMouseMove={handle} 
          onMouseUp={handle} 
          onMouseOut={handle}
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
      {
          label.X?<div className="label label-x"><nav>{label.X}</nav></div>:''
      }
      
    </>
  )
}

export default ChartBody;