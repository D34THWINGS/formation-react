import React from 'react';
import styled from '@emotion/styled';

const StyledMenu = styled.header`
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4rem;
  padding: 0 1rem;
  background: #333;
  text-align: left;
`;

const MenuTitle = styled.h1`
  margin: 0;
  color: white;
`;

const Menu = () => (
  <StyledMenu>
    <MenuTitle>Choixpeau</MenuTitle>
  </StyledMenu>
);

export default Menu;
