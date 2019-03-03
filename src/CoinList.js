import React from 'react'
import styled, {css} from 'styled-components';
import { subtleBoxShadow , redBoxShadow , lightBlueBackground , greenBoxShadow} from './styles'


export const CoinGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr  ;
    ${props => props.count && css`
    grid-template-columns: repeat(${props.count > 5 ? props.count : 5}, 1fr)
    `};
    grid-gap: 20px;
    margin-top: 40px;
`
export const CoinTile = styled.div `
    ${subtleBoxShadow}
    ${lightBlueBackground}
    font-size: 23px;
    padding: 15px;
    &: hover {
        cursor: pointer;
        ${greenBoxShadow};
    }
    ${item => item.favorite && css`
        background-color: #38027c;
        &:hover {
            cursor:pointer;
            ${redBoxShadow}
        }
    `}

    ${item => item.dashboardFavorite && css`
        background-color: #38027c;
        &:hover {
            pointer-events:none;
            ${greenBoxShadow}
        }
    `}
    
    ${ item => item.chosen && !item.favorite && css `
        pointer-events: none;
        opacity: 0.4;
    `}
`
export const CoinHeaderGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr ;
    margin-bottom: 10px;
`
export const CoinSymbol = styled.div`
    justify-self: right;
`

export const DeleteIcon = styled.div`
    justify-self: right;
    display: none;
    ${CoinTile}:hover &{
        display: block;
    }
`

export default function(favorites= false){
    let coinKeys = favorites ? this.state.favorites : ((this.state.filteredCoins && Object.keys(this.state.filteredCoins)) || Object.keys(this.state.coinList).slice(0, 50));
    return <CoinGrid count={favorites && this.state.favorites.length}>
        {coinKeys.map ( (coinKey, id )=> 
            <CoinTile chosen ={this.isInFavorites(coinKey)} key={id} favorite={favorites} onClick={ favorites ? ()=>{this.removeCoinFromFavorites(coinKey,id)} : ()=>{this.addCoinToFavorites(coinKey, id)}}>
                <CoinHeaderGrid>
                    <div>{this.state.coinList[coinKey].CoinName}</div>
                    { favorites ? 
                        <DeleteIcon> X </DeleteIcon> :
                    <CoinSymbol>{this.state.coinList[coinKey].Symbol}</CoinSymbol> }
                </CoinHeaderGrid>
                <img style={{height: '50px'}} alt={coinKey} src ={`http://cryptocompare.com/${this.state.coinList[coinKey].ImageUrl}`}/>
            </CoinTile>
        )}
    </CoinGrid>
}