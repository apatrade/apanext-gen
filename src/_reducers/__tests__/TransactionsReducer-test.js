import { fromJS } from 'immutable';
import expect from 'expect';
import Transactions from '../TransactionsReducer';
import {
    SERVER_DATA_STATEMENT,
    REMOVE_PERSONAL_DATA,
} from '../../_constants/ActionTypes';

describe('TransactionsReducer',()=>{
    it('should be able to update statement data',()=>{
        const action = {
            type: SERVER_DATA_STATEMENT,
            serverResponse: {
                statement: {
                    transactions: {
                        deposit: 100,
                    },
                },
            },
        };
        const beforeState = fromJS({});
        const actualState = Transactions(beforeState,action);
        const expectedState = fromJS({deposit: 100});
        expect(actualState).toEqual(expectedState);
    });

    it('should be able to clear transactional data',()=>{
        const action = {
            type: REMOVE_PERSONAL_DATA,
        };
        const beforeState = fromJS([]);
        const actualState = Transactions(beforeState,action);
        expect(actualState).toEqual(beforeState);
    });

    it('should return transaction unchaned when action type is not provided',()=>{
        const action = {
            serverResponse: {
                statement: {
                    transactions: {
                        deposit: 100,
                    },
                },
            },
        } ;
        const beforeState = fromJS({});
        const actualState = Transactions(beforeState,action);
        expect(actualState).toEqual(beforeState);
    });
});