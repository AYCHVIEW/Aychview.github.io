import React, { Component } from 'react';
import './App.css';
import _ from 'lodash';
import fuzzy from 'fuzzy';
import moment from 'moment'
import styled from 'styled-components';
import { greenBoxShadow, fontSize1 } from './styles'

import AppBar from './AppBar'
import Search from './Search'
import CoinList from './CoinList'
import Dashboard from './Dashboard'
const cc = require('cryptocompare');



const AppLayout = styled.div `
 padding:40px
`
const Content = styled.div``

export const CenterDiv = styled.div`
  display: grid;
  justify-content: center;
  
`
const ConfirmButton = styled.div`
    margin: 20px;
    color: #1163c9;
    ${fontSize1}
    color: #42ff3a;
    padding: 5px;
    &:hover {
      ${greenBoxShadow}
      cursor: pointer;
    }
`

const checkFirstVisit = ()=> {
  let CryptoStatData = JSON.parse(localStorage.getItem('cryptoStat'));
  if(! CryptoStatData) {
    return {
      firstVisit: true,
      page: 'Settings'
    }
  }
  let { favorites , currentFavorite} = CryptoStatData;
  return {
    favorites,
    currentFavorite
  };
}

const MAX_FAVORITES = 9;
const TIME_UNITS = 10;

class App extends Component {

  state={
    page: 'Dashboard',
    favorites: ['BTC', 'ETH'],
    ...checkFirstVisit()
  }



  displayingDashboard = () => this.state.page === 'Dashboard';
  displayingSettings = () => this.state.page === 'Settings'

  firstVisitMessage =() =>{
    if(this.state.firstVisit) {
      return <div> Welcome to CryptoStat, please select your favorite coins to begin.</div>
    }
  }

  confirmFavorites=()=>{
    let currentFavorite = this.state.favorites[0];
    this.setState({
      firstVisit : false,
      page: 'Dashboard',
      prices: null,
      currentFavorite,
      historical: null
    }, ()=> {
      this.fetchPrices();
      this.fetchHistorical();
    });

    localStorage.setItem('cryptoStat', JSON.stringify({
      favorites: this.state.favorites,
      currentFavorite
    }));

  }
  settingsContent= ()=>{
    return <div>
    {this.firstVisitMessage()}
    <div>
      {CoinList.call(this,true)}
      <CenterDiv>
        <ConfirmButton onClick={this.confirmFavorites}>Confirm favorites</ConfirmButton>
      </CenterDiv>
      {Search.call(this)}
      {CoinList.call(this)}
    </div>
    </div>
  }

  loadingContent =()=> {
    if(!this.state.coinList) {
      return <div> Loading Coins </div>
    }
    if(!this.state.prices){
      return<div> Loading Prices</div>
    }
  }
  componentDidMount=()=> {
    this.fetchHistorical();
    this.fetchCoins();
    this.fetchPrices();
    
  }

  fetchHistorical = async () => {
    if(this.state.currentFavorite) {
      let results = await this.historical();
      let historical =[{
        name: this.state.currentFavorite,
        data: results.map((ticker, index)=>[ moment().subtract({months: TIME_UNITS - index}).valueOf(), ticker.USD])
      }];
      this.setState({historical})
    }
  }
  historical=()=> {
    let promises =[];
    for(let units = TIME_UNITS; units > 0; units--) {
      promises.push(cc.priceHistorical(this.state.currentFavorite, ['USD'], moment().subtract({months:units}).toDate()))
    }
    return Promise.all(promises);
  }

  fetchPrices = async ()=> {
    let prices;
     try {
       prices= await this.prices();
    } catch (e) {
      this.setState({ error: true})
    }
    this.setState({prices});
  }

  prices = () => {
    let promises = [];
    this.state.favorites.forEach(sym => {
      promises.push(cc.priceFull(sym, 'USD'));
    });
    return Promise.all(promises);
  }


  fetchCoins = async ()=> {
    let coinList = (await cc.coinList()).Data;
    this.setState({ coinList});
  } 

  addCoinToFavorites=(item , id)=> {
    let favorites = [...this.state.favorites]
    if(favorites.length < MAX_FAVORITES) {
      favorites.push(item);
     this.setState({ favorites }) 
    }
  }

  removeCoinFromFavorites=(item, id)=> {
    let favorites = [...this.state.favorites];
      if (favorites.length === 1 ? null : this.setState({favorites: _.pull(favorites,item)}));
  }

  isInFavorites = (key)=> {
    return _.includes(this.state.favorites, key);
  }

  handleFilter= _.debounce((inputValue)=> {
    //get all the coin symbols
    let coinSymbols = Object.keys(this.state.coinList);
    //get all the coin Names
    let coinNames = coinSymbols.map(coin => this.state.coinList[coin].CoinName);
    // String that users will search
    let allStringsToSearch = coinSymbols.concat(coinNames);
    //making the search 
    let fuzzyResults = fuzzy.filter(inputValue, allStringsToSearch).map(result => result.string);
    
    let filteredCoins = _.pickBy(this.state.coinList, (result , symKey )=> {
      let coinName = result.CoinName;
      // if fuzzy search contains this symbol OR the coinName,
      return _.includes(fuzzyResults, symKey) || _.includes(fuzzyResults, coinName)
    })
    this.setState({filteredCoins});
  }, 500)
  
  filterCoins=(e)=>{
    let inputValue = _.get(e, 'target.value')
    if(!inputValue) {
      this.setState({
        filteredCoins: null,
        coinList: this.state.coinList
      })
      return;
    }
    this.handleFilter(inputValue);
  }

  render() {
    return (
      <AppLayout>
        {AppBar.call(this)}
        {this.loadingContent() || <Content>
          {this.displayingSettings() && this.settingsContent()}
          {this.displayingDashboard() && Dashboard.call(this)}
        </Content>}
      </AppLayout>
     
    );
  }
}

export default App;
