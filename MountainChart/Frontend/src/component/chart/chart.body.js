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
  const [capStartAt, setCapStartAt] = useState('');
  const [timeInterval, SetTimeInterval] = useState('');

  const dataRef = useRef([]);
  const markRef = useRef(null);
  const xAxisRef = useRef([]);
  const yAxisRef = useRef(null);
  const bodyRef = useRef(null);
  const labelRef = useRef(null);

  const { chartId, stateChange } = props;
  let { 
    AxisXMax, 
    AxisXMin, 
    AxisYMax, 
    AxisYInterval
  } = props.datasource;
  let oldX, oldY, moveUpDown, mouseDown, selectedID, selectedIndex, selectedTag, selectedClass, method, state, lineDown, ctrlKey; 
  let timer;

  useEffect(() => {
    const { AxisXLabel, AxisYLabel, chartdata,} = props.datasource;
    if(chartdata) {
      const { Capacity, Project, Demand, TimeInterval, AnchorDate } = chartdata;
      SetTimeInterval(TimeInterval || 'Monthly');
      setDisplayData(Demand);
      setCapacityData(Capacity['AdjustedCapacity']);
      setCapStartAt(AnchorDate);
      setCapIndex(Capacity['Id']);
      setProjectData(Project);
      setLabel({X:AxisXLabel, Y:AxisYLabel});
      setLoading(props.loading);
    }
  }, [props]);
  
  useEffect(()=> {
    if(timeInterval!=='')
    drawYaxis();
  }, [projectData, capacityData]);

  useEffect(() => {
    draw();
    drawCapacityLine();
  }, [unit]);

  //init functions
  const draw = () => {
    if(displayData) {
      displayData.map((pro, i) => {
        const { start, strokecolor, color, priority } = projectData[pro.name];
        let startAt;

        switch(timeInterval) {
          case 'Monthly':
            let [year, month] = start.split('.');
            let star = new Date(AxisXMin);
            startAt = (parseInt(year) - star.getFullYear()) * 12 + parseInt(month);
            break;
          case 'Yearly':
            break;
          case 'Daily':
            break;
        }

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
          
          const children = box.current.children;

          let s = true;
          for(let j = 0; j < children.length; j++) {
            const index = children[j].id.split('-')[1];
            let slibingPriority = projectData[displayData[index].name].priority;
            if(priority < slibingPriority) {
              box.current.insertBefore(node, children[j]);
              s = false;
              break;
            }
          }
          if(s) {
            box.current.appendChild(node);
          }
          return true;
        })
        return true;
      });
    }
  }
  
  const drawCapacityLine = () => {
    if(capacityData) {
      let startAt;

      switch(timeInterval) {
        case 'Monthly':
          const [year, month] = capStartAt.split('.');
          let start = new Date(AxisXMin);
          startAt = (parseInt(year) - start.getFullYear()) * 12 + parseInt(month);
          break;
        case 'Yearly':
          break;
        case 'Daily':
          break;
      }
      
      capacityData.map((item, i) => {
        if(!dataRef.current[startAt + i - 1]) { return false; }
        const box = dataRef.current[startAt + i - 1];
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

    const bodyPadding = parseInt(getComputedStyle(bodyRef.current).paddingLeft || 0);

    var timeMax;
    var end = moment(new Date(AxisXMax));
    var start = moment(new Date(AxisXMin));

    switch(timeInterval) {
      case 'Monthly':
        timeMax = end.diff(start, 'months');
        break;
      case 'Yearly':
        timeMax = end.diff(start, 'years') >= 20 ? end.diff(start, 'years') : 20 ;
        break;
    }

    let tmpUnit = {
      markWidth: markRef.current.offsetWidth,
      contentStart: xAxisRef.current[0].current.offsetLeft + bodyPadding,
      contentEnd: xAxisRef.current[xAxisRef.current.length-1].current.offsetLeft,
      dataHeight: xAxisRef.current[0].current.offsetHeight - markRef.current.offsetHeight,
      max: timeMax
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

  const declareXItem = () => {
    var Max;
    var end = moment(new Date(AxisXMax));
    var start = moment(new Date(AxisXMin));

    switch(timeInterval) {
      case 'Monthly':
        Max = end.diff(start, 'months');
        break;
      case 'Yearly':
        Max = end.diff(start, 'years') >= 20 ? end.diff(start, 'years') : 20 ;
        break;
      case 'Daily':
        Max = end.diff(start, 'days');
    }

    if(dataRef.current.length !== Max) {
      dataRef.current = Array( Max )
        .fill()
        .map((_, i) => dataRef.current[i] || createRef());
      xAxisRef.current = Array( Max )
        .fill()
        .map((_, i) => xAxisRef.current[i] || createRef());
    }

    return Max;
  }

  const XItem = () => {
    if(timeInterval!==''){
      let Max = declareXItem();

      if(!AxisYMax && displayData) {
        let max = 0;
        displayData.map((item) => {
          max += Math.max(...item.data);
          return true;
        });
        AxisYMax = max/3;
      }

      let x = [];
      let now = new Date;

      switch(timeInterval) {
        case 'Monthly': {
          let start  = new Date(AxisXMin);
          let i = 0;
          do{
            x.push({
              year: start.getFullYear(),
              month: start.getMonth(),
              now: (now.getMonth() === start.getMonth()) && (start.getFullYear() === now.getFullYear()) ? true : false
            })
            start.setMonth(start.getMonth() + 1);
            i++;
          }while(i < Max);
          break;
        }
        case 'Yearly': {
          let [start] = AxisXMin.split('.');
          for (let i = 0; i < Max; i++) {
            x.push({
              year: i + parseInt(start),
              now: now.getFullYear() === (i + parseInt(start)) ? true : false
            })
          }
          break;
        }
        case 'Daily': {
          let start = new Date(AxisXMin);
          let i = 0;
          do{
            x.push({
              year: start.getFullYear(),
              month: start.getMonth(),
              day: start.getDate(),
              now: moment(start).format('YYYY.MM.DD') === moment(now).format('YYYY.MM.DD')
            })
            start.setDate(start.getDate() + 1);
            i++;
          }while(i<Max);
          break; 
        }
      }

      return x.map((item, index) => {
        let background;
        switch(timeInterval) {
          case 'Monthly':
            background = index%12 === 0 ? 'white' : 'rgb(217, 217, 217)';
            break;
          case 'Yearly':
            background = 'white';
            break;
          case 'Daily':
            background = item.day === 1 ? 'white' : 'rgb(217, 217, 217)';
        }

        if(item.now) 
          background = '#e65c00';

        return (
          <div
            className='xAxis' 
            key = {index} 
            ref = {xAxisRef.current[index]} 
            style={{background: item.now ? '#ffe0cc' : '', border: item.now ? '1px solid #ffc299' : '1px solid #d4d4a7'}}
            >
            <div 
              id='mark' 
              ref = {markRef}
              style = {{background: background, color: item.now ? 'white' : 'black'}} 
              >
              { timeInterval === 'Monthly' ? 
                  (item.month === 0 ? item.year : item.month + 1) 
                  : timeInterval === 'Yearly' ? item.year 
                    : item.day === 1 ? `${item.month + 1}.${item.day}` : item.day }
            </div>
            <div 
              className = 'data' 
              id={'t' + index} 
              ref = {dataRef.current[index]}>
            </div>
          </div>
        )
      });
    } else{
      return '';
    }
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
            AdjustedPriority: priority,
            AdjustedStartDate: moment(new Date(start)).format('YYYY-MM-DD')
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
    if(selectedID && capacityData) {
      const i = selectedID.split('-')[1];
      for(let j = ctrlKey ? 0 : i; j < capacityData.length; j++) {
        let element = document.getElementById(`${chartId}-${j}`);
        if(!element) continue;
        element.style.border = state ? '1px solid #0000cc' : '1px dashed #cc0000';
      }
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
      const at = Math.ceil(relx/(parseInt(unit.markWidth) + 2))
      const [i, j] = selectedID.split('-').slice(1);
      const [year, month] = projectData[displayData[i].name].start.split('.');
      let start;
      let xMin = new Date(AxisXMin);

      switch(timeInterval) {
        case 'Monthly':
          start = (parseInt(year) - xMin.getFullYear()) * 12 + parseInt(month) - 1;
          break;
        case 'Yearly':
          break;
        case 'Daily':
          break;
      }

      const step = at - start - parseInt(j);
      const length = displayData[parseInt(i)].data.length;

      if(isBoundary(start + step, start + (length -1) + step) && (parseInt(year) >= xMin.getFullYear())) { return false; }

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
          if(!dataRef.current[start + index + step - 1]) {
            select.remove();
            continue;
          }

          let embed = dataRef.current[start + index + step - 1].current;
          let childCount = embed.children.length;
          let s = true;
          for(let j = 0; j < childCount; j++) {
            const num = embed.children[j].id.split('-')[1];
            if(embed.children[j].tagName === 'SPAN' && displayData[i].name !== displayData[num]) {
              if(projectData[displayData[i].name].priority < projectData[displayData[num].name].priority) {
                embed.insertBefore(select, embed.children[j]);
                s = false;
                break;
              }
            }
          }
          if(s) {
            embed.appendChild(select);
          }
        }
        state = false;
        let xMin = new Date(AxisXMin);
        const y = Math.floor( (start + step)/12 ) + xMin.getFullYear();
        const m = (start + step) % 12 === 0 ? 12 : (start + step) % 12;
        if(m < 0) {
          projectData[displayData[i].name].start = `${y}.${12+m}`;
        }
        else {
          projectData[displayData[i].name].start = `${y}.${m}`;
        }
      }
      else {
        if( moveUpDown && (e.pageY > oldY) ) {
          let start = 0, count = 0, priority = 1000000, project = null;
          for(let index = 0; index < length; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);
            if(!select) continue;
            if(select.nextSibling && select.nextSibling.tagName === 'SPAN') {
              const num = select.nextSibling.id.split('-')[1];
              if(priority > projectData[displayData[num].name].priority) {
                priority = projectData[displayData[num].name].priority;
                start = index;
                count = 0;
                project = displayData[num].name;
              }
              if(priority === projectData[displayData[num].name].priority) {
                count++;
              }
            }
          }

          if(!project) return;
          let tmp = projectData[displayData[i].name].priority;
          projectData[displayData[i].name].priority = priority;
          projectData[project].priority = tmp;

          for(let index = start; index < start + count; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);
            if(!select) continue;
            let embed = select.parentNode;
            if(select.nextSibling && select.nextSibling.tagName === 'SPAN') {
              embed.insertBefore(select.nextSibling, select);
            }
          } 
        }
        if( moveUpDown && (e.pageY < oldY) ) {
          let start = 0, count = 0, priority = -1, project = null;
          for(let index = 0; index < length; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);
            if(!select) continue;
            if(select.previousSibling && select.previousSibling.tagName === 'SPAN') {
              const num = select.previousSibling.id.split('-')[1];
              if(priority < projectData[displayData[num].name].priority) {
                priority = projectData[displayData[num].name].priority;
                start = index;
                count = 0;
                project = displayData[num].name;
              }
              if(priority === projectData[displayData[num].name].priority) {
                count++;
              }
            }
          }

          if(!project) return;
          let tmp = projectData[displayData[i].name].priority;
          projectData[displayData[i].name].priority = priority;
          projectData[project].priority = tmp;

          for(let index = start; index < start + count; index++) {
            const id  = `${chartId}-${parseInt(i)}-${index}`;
            let select = document.getElementById(id);
            if(!select) continue;
            let embed = select.parentNode;
            if(select.previousSibling && select.previousSibling.tagName === 'SPAN') {
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