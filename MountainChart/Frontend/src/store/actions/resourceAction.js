import axios from 'axios';

export const getPortfolio = async (portfolioId) => {
  try {
    const res = await axios.get(`/api/projectportfoliodemand/${portfolioId}`);
    return {
      tmpProject: { ...res.data.project },
      tmpDemand: { ...res.data.portfolio} 
    }
  } catch (err) {

  }
};

export const getCapacity = async(filter) => {
  try{
    const res = await axios.post('/api/resourceportfoliocapacity', filter);
    return res.data.data;
  } catch(err) {

  }
}