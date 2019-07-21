import * as React from 'react'
import styled from 'styled-components'

const Icon = styled.span<{ active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  background-color: ${props => (props.active ? props.theme.primary : "transparent")};
  &:hover {
    background-color: ${props => props.theme};
  }
  &:focus {
    border: 0 none;
  }
`;

export default Icon
