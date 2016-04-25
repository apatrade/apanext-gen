import React, { PropTypes, Component } from 'react';
import windowResizeEvent from 'binary-utils/lib/windowResizeEvent';
import FullTradeCard from '../fulltrade/FullTradeCard';

export default class TradesLayouts extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        assetsIsOpen: PropTypes.object.isRequired,
        currency: PropTypes.string.isRequired,
        ticksForAllSymbols: PropTypes.object.isRequired,
        trades: PropTypes.array.isRequired,
        tradesCount: PropTypes.number.isRequired,
        layoutN: PropTypes.number.isRequired,
        contracts: PropTypes.object.isRequired,
    };

    componentWillMount() {
        const { actions, layoutN, tradesCount } = this.props;
        actions.changeActiveLayout(tradesCount, layoutN);
    }

    componentDidUpdate() {
        windowResizeEvent();
    }

    render() {
        const { actions, assetsIsOpen, currency, layoutN, trades, ticksForAllSymbols, contracts } = this.props;

        return (
            <div className={`trades layout-${trades.length}-${layoutN}`}>
                {trades.map((trade, index) =>
                    <FullTradeCard
                        key={index}
                        index={index}
                        currency={currency}
                        actions={actions}
                        marketIsOpen={assetsIsOpen[trade.symbol] && assetsIsOpen[trade.symbol].isOpen}
                        trade={trade}
                        ticks={ticksForAllSymbols[trade.symbol]}
                        contract={contracts[trade.symbol]}
                        onClick={() => actions.changeActiveTrade(index)}
                    />
                )}
            </div>
        );
    }
}