import styled from 'styled-components';
import {FaTimes} from 'react-icons/fa';

export const Background = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  background: rgba(0,0,0,0.6);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  left:0;
`;

export const ModalWrapper = styled.div`
  width: 100%;
  max-width:440px;
  padding:40px 25px;
  background: #141414;
  color: #fff;
  position: relative;
  z-index: 10;
  border-radius: 0.75rem;
  margin: 0 30px 0 30px;
  border: none;

  @media screen and (max-width: 480px) {
    margin: 0 15px 0 15px;
  }
`;

export const CloseModalButton = styled(FaTimes)`
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 20px;
  z-index: 10;
  color: #dddddd;

  &:hover {
    color: #fff;
  }
`;

export const ConnectButtonWrapper = styled.div`
  p {
    text-align: center;
    cursor: pointer;
    margin: 10px 0;

    &:hover {
      color: #ddd;
    }
  }
`;

export const ConnectButton = styled.button`
  @media screen and (min-width: 576px) {
    width: 110px;
  }
  padding:0;
  margin:0 auto;
  display:block;
  border:none;
  background:none;
  border-radius:0.75rem;
  over-flow:hidden;
  opacity:0.80;
  transition:all ease-in-out 0.3s;
  &:hover{opacity:1;}
  img{
    border-radius:0.75rem;
  }
`;

export const ButtonLogo = styled.img`

`;

export const ModalHeader = styled.h1`
  padding:0;
  margin:0 0 20px;
  font-size: 22px;
  text-align:center;
  color:rgba(255,255,255,0.85);
  text-shadow:1px 1px 0 rgba(0,0,0,1);
  font-weight:300;
`;
