import axios from 'axios';


const axiosInstant = axios.create({
    baseURL: `http://localhost:3000`
})

const useAxios = () => {
    return axiosInstant;
};

export default useAxios;