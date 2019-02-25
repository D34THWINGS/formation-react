import React from 'react';
import PropTypes from 'prop-types';

import './HousesList.css';
import houses from '../data/houses';
import StudentsList from './StudentsList';

import gryffindor from '../images/gryffindor.png';
import slytherin from '../images/slytherin.png';
import hufflepuff from '../images/hufflepuff.png';

const images = { gryffindor, slytherin, hufflepuff };

const HousesList = ({ students }) => (
  <div className="housesList">
    {houses.map(house => (
      <div className="housesList__house" key={house.id}>
        <img className="house__picture" src={images[house.picture]} alt={house.name} />
        <p className="house__name">{house.name}</p>
        <StudentsList students={students.filter(student => student.house === house.id)} />
      </div>
    ))}
  </div>
);

HousesList.propTypes = {
  students: PropTypes.arrayOf(PropTypes.shape({
    house: PropTypes.number.isRequired,
  })).isRequired,
};

export default HousesList;
