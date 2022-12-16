import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SET_DISPLAY_RESOURCE, SET_DISPLAY_PORTFOLIO } from 'store/type';

//let projectDidStart = [0,1,2,3,6,7,8,9,10,19,20,4,5,11,12,13,14], projectWillStart = [15,16,17,18];
let resource = {
  'Developer':'Dev',
  'QA':'QA',
  'Business Analyst': 'BA'
};

const ChartHeader = ({Id, Name, stateChange}) => {

  const [nowDisplayResource, setNowDisplayResource] = useState('Dev');
  const [nowPortfolio, setNowPortfolio] = useState('Portfolio1');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({type: SET_DISPLAY_RESOURCE, payload: nowDisplayResource, id: Id});
  }, [nowDisplayResource, dispatch]);

  useEffect(() => {
    dispatch({type: SET_DISPLAY_PORTFOLIO, payload: nowPortfolio, id: Id});
  }, [nowPortfolio, dispatch]);

  const handleRes = (e) => {
    stateChange({ 'resource': resource[e.target.innerText]});
    setNowDisplayResource(resource[e.target.innerText]);
  }
  const handlePort = (e) => {
    setNowPortfolio(e.target.innerText);
    stateChange({ 'portfolio': e.target.innerText})
  }

  return (
    <>
      <div className="header">
        <ul id = "menu">
					<li className="title">
            <label>{Name}</label>
          </li> 
					<li className="resource">
						<label>Resources</label>
						<div className="menu res-menu">
              {
                Object.keys(resource).map((key) => (
                  <nav onClick={handleRes} key={`${Id}-${key}`}>{key}</nav>
                ))
              }
						</div>
					</li>
					<li className="project">
						<label>{nowPortfolio}</label>
						<div className="menu pro-menu">
              <nav onClick = {handlePort}>{'Portfolio1'}</nav>
              <nav onClick = {handlePort}>{'Portfolio2'}</nav>
						</div>
					</li>
				</ul>
      </div>
    </>
  ) 
}

export default ChartHeader;