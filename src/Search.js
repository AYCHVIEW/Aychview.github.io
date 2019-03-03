import React from 'react'

import styled from 'styled-components';
import { backgroundColor2} from './styles'



const SearchContainer = styled.div`
 margin-top: 40px;
 display: grid;
 grid-template-columns: 200px 1fr;
 grid-gap: 20px;
`
const SearchInput = styled.input`
    ${backgroundColor2}
    color: #1163c9;
    border: 1px solid;
    font-size: 20px;
    padding: 5px;
    margin: 5px;
    height: 25px;
    place-self: center left;
` 
const SearchText= styled.div`
    text-align: center;
    font-size: 2.0em;
`


export default function(){
    return <SearchContainer>
        <SearchText> Search coins </SearchText>
        <SearchInput onKeyUp={this.filterCoins}/>
    </SearchContainer>
}