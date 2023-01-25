import axios from "axios";
import { CATEGORY_LIST_REQUEST, CATEGORY_LIST_SUCCESS, CATEGORY_LIST_FAIL} from './../Constants/CategoryConstants';

export const listCategories = () => async (dispatch) => {
    try {
        // console.log('try list categories')
        dispatch({ type: CATEGORY_LIST_REQUEST });
        const { data } = await axios.get(`/api/categories/all`);
        dispatch({ type: CATEGORY_LIST_SUCCESS, payload: data });
    } catch (error) {
        console.log('error categories list')
        console.log(error)
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({
            type: CATEGORY_LIST_FAIL,
            payload: message,
        });
    }
};