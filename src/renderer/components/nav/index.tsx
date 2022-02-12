/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-15 01:11:44
 * @LastEditTime : 2022-01-15 02:16:00
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \MintForge\src\mintin-alo\renderer\components\nav\index.tsx
 * @Description  : 
 */
import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export interface GroupChild {
  name: string,
  to: string,
}

export interface Group {
  name: string,
  children: GroupChild[]
}

export interface NavProps {
  groups: Group[]
}

const MyNav = styled.div`
  padding: 32px 24px;
  .group {
    margin: 32px 0;
    .group-name {
      color: #888;
      padding: 0 20px;
      margin: 8px 0;
      font-size: .9rem;
    }
    .group-child {
      color: #f1f1f1;
      padding: 4px 20px;
      margin: 4px 0;
      text-align: left;
      cursor: pointer;
      border-radius: 4px;
      font-size: 1.1rem;
      &:hover {
        background-color: #1ece9b;
      }
    }
  }
`;

const Nav: React.FC<NavProps> = (props) => {
  const { groups } = props;
  const navigate = useNavigate();

  const renderGroupChild = (c: GroupChild) => {
    return (
      <div className={`group-child`} key={c.name} onClick={e => navigate(c.to)}>
        { c.name }
      </div>
    )
  }

  const renderGroup = (g: Group) => {
    return (
      <div className={`group group-${g.name}`} key={g.name}>
        <div className='group-name'>
          <span>{ g.name }</span>
        </div>
        { g.children.map(renderGroupChild) }
      </div>
    )
  }

  return (
    <MyNav className='component-nav'>
      { groups.map(renderGroup) }
    </MyNav>
  )
}

export default Nav;