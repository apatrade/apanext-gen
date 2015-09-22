import { Map } from 'immutable';

import {
    SERVER_DATA_AUTHORIZE,
} from '../_constants/ActionTypes';

const initialState = new Map();

export default (state = initialState, action) => {
    switch (action.type) {
        case SERVER_DATA_AUTHORIZE: {
            const { currency, balance, loginid, fullname } = action.serverResponse.data;

            return new Map({
                balance: {
                    currency,
                    amount: +balance,
                },
                loginid,
                fullname,
            });
        }
        default:
            return state;
    }
};
