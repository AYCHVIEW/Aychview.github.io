import React from 'react'
import {CoinGrid, CoinTile, CoinHeaderGrid , CoinSymbol } from './CoinList';
import styled, {css} from 'styled-components';
import {fontSizeBig, fontSize3, subtleBoxShadow, lightBlueBackground} from './styles'
import HighchartsConfig from './HighchartsConfig';
import theme from './HighchartsTheme'



const ReactHighCharts = require('react-highcharts');

ReactHighCharts.Highcharts.setOptions(theme);


const numberFormat =(number) => {
    return +(number +'').slice(0,6);
}

const ChangePct = styled.div`
    color: green;
    ${props => props.red && css`
        color: red;
    `}
`
const TickerPrice = styled.div`
  ${fontSizeBig}
`
const CoinTileCompact = styled.div`
    ${fontSize3}
    display: grid;
    grid-gap: 5px;
    justify-items: right;
    grid-template-columns: repeat(3,1fr);
`
const PaddingBlue = styled.div`
    ${subtleBoxShadow}
    ${lightBlueBackground}
    padding: 5px;
`
const ChartGrid = styled.div`
    display: grid;
    margin-top: 20px;
    grid-gap: 15px;
    grid-template-columns: 1fr 3fr;
`

export default function () {
    return [<CoinGrid> {this.state.prices.map((price, index) => {
        let sym = Object.keys(price)[0];
        let data = price[sym]['USD'];
        let tileProps = {
           // dashboardFavorite: sym === this.state.currentFavorite,
            onClick: ()=> {
                this.setState({ currentFavorite: sym, historical: null}, this.fetchHistorical)
                localStorage.setItem('cryptoStat', JSON.stringify({
                    ...JSON.parse(localStorage.getItem('cryptoStat')),
                    currentFavorite: sym,
                  }));
                  
            }
        }
    return index < 5 ? <CoinTile {...tileProps}>
            <CoinHeaderGrid>
                    <div>{sym}</div>
                    <CoinSymbol><ChangePct red={data.CHANGEPCT24HOUR < 0}>{numberFormat(data.CHANGEPCT24HOUR)} % </ChangePct></CoinSymbol> 
                </CoinHeaderGrid>
                <TickerPrice>${numberFormat(data.PRICE)}</TickerPrice>
        </CoinTile> :
        <CoinTile>
            <CoinTileCompact {...tileProps}>
                <div style={{justifySelf: 'left'}}>{sym}</div>
                <CoinSymbol {...tileProps}>
                    <ChangePct red={data.CHANGEPCT24HOUR < 0}>{numberFormat(data.CHANGEPCT24HOUR)} % </ChangePct>
                </CoinSymbol>
                <div>${numberFormat(data.PRICE)}</div>
            </CoinTileCompact>
        </CoinTile>
    })}
    </CoinGrid>,
    <ChartGrid>
        <PaddingBlue>
            <h2 style={{textAlign: 'center'}}>{this.state.coinList[this.state.currentFavorite].CoinName}</h2>
            <img style={{height: '200px', display:'block', margin:'auto'}} alt={this.state.currentFavorite} src ={`http://cryptocompare.com/${this.state.coinList[this.state.currentFavorite].ImageUrl}`}/>
        </PaddingBlue>
        <PaddingBlue>
            { this.state.historical ? <ReactHighCharts config={HighchartsConfig.call(this)}/> : <div> Loading historical data</div>}
        </PaddingBlue>
    </ChartGrid>
    
    ]
}