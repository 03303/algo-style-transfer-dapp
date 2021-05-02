import axios from 'axios';

const SERVICES_ENDPOINT = process.env.REACT_APP_SERVICES_ENDPOINT
const JWT_SECRET = process.env.REACT_APP_JWT_SECRET

async function GetStyleTransferResponse(content, style) {
    const body = {
        content: content,
        style: style,
    }
    const result = await axios.post(`${SERVICES_ENDPOINT}/style-transfer`, body, {
        headers: {
            'Authorization': JWT_SECRET
        },
    });
    return result;
}

export {
    GetStyleTransferResponse,
};
