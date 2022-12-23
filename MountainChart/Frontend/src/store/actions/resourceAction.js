import axios from 'axios';
import toastr from 'toastr';

export const getPortfolio = async (portfolioId) => {
  try {
    const res = await axios.get(`http://localhost:8080/api/projectportfoliodemand/${portfolioId}`);
    return {
      tmpProject: { ...res.data.project },
      tmpDemand: { ...res.data.portfolio} 
    }
  } catch (err) {

  }
};

export const getCapacity = async(filter) => {
  try{
    const res = await axios.post('http://localhost:8080/api/resourceportfoliocapacity', filter);
    return res.data.data;
  } catch(err) {
    toastr.error('Server Error', 'Server is not working.');
  }
}