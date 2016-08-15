import { takeEvery } from 'redux-saga';
import { put, select } from 'redux-saga/effects';
import { updateMultipleTradeParams, updateTradingOptions, updateTradeUIState,
    updateFeedLicense, updateTradingOptionsErr, updateTradeError } from '../../_actions';
import { api } from '../../_data/LiveData';
import changeSymbol from '../updates/changeSymbol';
import { getForceRenderCount, contractOfSymbol, getTicksOfSymbol, isSymbolOpen } from './SagaSelectors';
import { subscribeProposal, unsubscribeProposal } from './ProposalSubscriptionSaga';


const CREATE_TRADE = 'CREATE_TRADE';
export const createTrade = (index, symbol) => ({
    type: CREATE_TRADE,
    index,
    symbol,
});

export function* tradeCreation(action) {
    const { index, symbol } = action;

    // unsubscribe and remove existing proposal
    yield put(unsubscribeProposal(index));

    const contractNeeded = yield select(contractOfSymbol(symbol));
    if (contractNeeded) {
        const isOpen = yield select(isSymbolOpen(symbol));
        const updatedParams = changeSymbol(symbol, contractNeeded, isOpen);
        yield put(updateMultipleTradeParams(index, updatedParams));
        const renderCount = yield select(getForceRenderCount(index));
        yield [
            put(updateTradeUIState(index, 'forceRenderCount', renderCount + 1)),
            put(subscribeProposal(index, updatedParams)),
        ];
    } else {
        try {
            const { contracts_for } = yield api.getContractsForSymbol(symbol);
            const ticks = yield select(getTicksOfSymbol(symbol));
            const license = contracts_for.feed_license;
            if (!ticks) {
                let tickHistoryParam;
                switch (license) {
                    case 'chartonly': break;
                    case 'realtime':
                        tickHistoryParam = { end: 'latest', count: 60, adjust_start_time: 1, subscribe: 1 };
                        break;
                    case 'delayed':
                    case 'daily':
                        tickHistoryParam = { end: 'latest', count: 60, adjust_start_time: 1 };
                        break;
                    default:console.warn(`Unknown license type: ${license}`);   // eslint-disable-line no-console
                }

                if (tickHistoryParam) {
                    try {
                        yield api.getTickHistory(symbol, tickHistoryParam);
                    } catch (err) {
                        if (err.error.error.code === 'MarketIsClosed') {
                            delete tickHistoryParam.subscribe;
                            api.getTickHistory(symbol, tickHistoryParam);
                        } else {
                            yield put(updateTradeError(index, 'serverError', err.error.error.message));
                        }
                    }
                }
            }
            yield [
                put(updateFeedLicense(symbol, license)),
                put(updateTradingOptions(symbol, contracts_for.available)),
                put(createTrade(index, symbol)),
            ];
        } catch (err) {
            yield put(updateTradingOptionsErr(symbol, err.error.error.message));
        }
    }
}

const DESTROY_TRADE = 'DESTROY_TRADE';
export const destroyTrade = index => ({
    type: DESTROY_TRADE,
    index,
});

export function* tradeDestruction(action) {
    const { index } = action;
    yield put(unsubscribeProposal(index));
}

export default function* lifeCycleWatch() {
    yield [
        takeEvery(CREATE_TRADE, tradeCreation),
        takeEvery(DESTROY_TRADE, tradeDestruction),
        ];
}
