import React from 'react'
import styled, {css} from 'styled-components';


const Logo = styled.div `
  font-size: 2.0em;
`
const ControlButton = styled.div`
   cursor: pointer;
   font-size: 20px;
  ${props => props.active && css `
    text-shadow: 0px 0px 60px #03ff03;
  `}
`
const Bar = styled.div`
  display: grid;
  margin-bottom: 40px;
  grid-template-columns: 180px auto  130px 100px;
`


export default function () {
    return (
        <Bar>
          <Logo>
            CryptoStat
          </Logo>
          <div></div>
          {!this.state.firstVisit &&
            (<ControlButton onClick={()=> this.setState({ page: 'Dashboard'})} active={this.displayingDashboard()}>
              Dashboard
            </ControlButton>)}
          <ControlButton onClick={()=> this.setState({ page: 'Settings'})} active={this.displayingSettings()}>
            Settings
          </ControlButton>
          </Bar>
    )
}