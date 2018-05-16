import axios from 'axios';
import { getIdToken } from './auth-service';
const EventEmitter = require('wolfy87-eventemitter');

const BASE_URL = 'https://6sr3hujmcl.execute-api.eu-west-1.amazonaws.com/dev';

const PROGRESS_ENDPOINT = 'progress';
export const PROGRESSCHANGED = 'progress-changed';

export class KidsgameApi extends EventEmitter {

    getProgress() {
        let idToken = getIdToken();
        const url = `${BASE_URL}/${PROGRESS_ENDPOINT}/${idToken.payload.sub}`;
        var config = {
            //withCredentials: true,
            headers: { 'Authorization': 'Bearer ' + idToken.jwtToken }
        }

        return axios.get(
            url,
            config
        )
            .then((response) => {
                this.emitEvent(PROGRESSCHANGED, [response.data.data.points]);
                return response.data;
            }
            );
    }

    addProgress = (points) => {
        let idToken = getIdToken();
        const url = `${BASE_URL}/${PROGRESS_ENDPOINT}/${idToken.payload.sub}`;
        var config = {
            //withCredentials: true,
            headers: { 'Authorization': 'Bearer ' + idToken.jwtToken }
        }

        return axios.post(
            url,
            {
                "points": points
            },
            config
        )
            .then((response) => {
                console.log(response);
                this.emitEvent(PROGRESSCHANGED, [response.data.points]);
                return response.data;
            })
            .catch((error) =>{
                this.emitEvent(PROGRESSCHANGED, ["huhu"]);
                console.log('error', error);
            });
    }

}
