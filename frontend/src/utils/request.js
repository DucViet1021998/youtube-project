import axios from 'axios'

const request = axios.create({
    baseURL: 'https://youtube-project-sable.vercel.app/'
})

export default request;