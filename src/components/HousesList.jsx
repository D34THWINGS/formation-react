import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

import StudentsList from './StudentsList';

import gryffindor from '../images/gryffindor.png';
import slytherin from '../images/slytherin.png';
import hufflepuff from '../images/hufflepuff.png';
import { useXHRCall } from '../hooks/useXHRCall';
import { FETCH_HOUSES } from '../actions';
import { withState } from './StateProvider';

const images = { gryffindor, slytherin, hufflepuff };

const StyledHousesList = styled.div`
  display: flex;
`;

const House = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 calc(33.33% - 0.33rem);
  padding: 0.5rem;
  background: #333;
  color: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  
  &:not(:last-child) {
    margin-right: 0.7rem;
  }
`;

const HousePicture = styled.img`
  display: block;
  width: 100%;
  border-radius: 5px;
`;

const HouseName = styled.p`
  border-bottom: solid 1px #AAA;
  width: 100%;
  padding-bottom: 1rem;
  text-align: center;
  font-weight: bold;
`;

const HousesList = ({ students, dispatch, state }) => {
  useXHRCall('http://localhost:5000/houses', {}, dispatch, FETCH_HOUSES);
  return (
    <StyledHousesList>
      {state.houses.data.map(house => (
        <House key={house.id}>
          <HousePicture className="house__picture" src={images[house.picture]} alt={house.name} />
          <HouseName className="house__name">{house.name}</HouseName>
          <StudentsList students={students.filter(student => student.house === house.id)} />
        </House>
      ))}
    </StyledHousesList>
  );
};

HousesList.propTypes = {
  dispatch: PropTypes.func.isRequired,
  state: PropTypes.shape({
    houses: PropTypes.shape({
      data: PropTypes.array,
    }).isRequired,
  }).isRequired,
  students: PropTypes.arrayOf(PropTypes.shape({
    house: PropTypes.number.isRequired,
  })).isRequired,
};

export default withState(HousesList);
