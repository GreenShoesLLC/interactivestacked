import axios from 'axios';
import toastr from 'toastr';

export const getPortfolio = (portfolioId) => {
  return new Promise((reslove, reject) => {
    axios.get(`${process.env.REACT_APP_PROXY}/api/projectportfoliodemand/${portfolioId}`)
      .then((res) => {
        reslove({
          tmpProject: {...res.data.project},
          tmpDemand: {...res.data.portfolio} 
        });
      })
      .catch(() => {
        toastr.error('Server is not working.', 'Server Error');
      })
  });
} 

export const getCapacity = (filter) => {
  return new Promise((reslove, reject) => {
    axios.post(`${process.env.REACT_APP_PROXY}/api/resourceportfoliocapacity`, filter)
      .then((res) => {
        reslove(res.data.data);
      })
      .catch(() => {
        toastr.error('Server is not working.', 'Server Error');
      })
  });
}