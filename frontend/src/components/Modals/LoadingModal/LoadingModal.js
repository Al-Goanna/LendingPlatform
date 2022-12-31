import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import {SHOW_LOADING_MODAL} from 'Root/services/constants/ActionTypes';

import {Background} from './LoadingModalElements';

import ClipLoader from 'react-spinners/ClipLoader';

const LoadingModal = ({loadingModal}) => {
  if (!loadingModal) {
    return null;
  }

  return (
    <>
      { loadingModal.type === SHOW_LOADING_MODAL &&
        <Background>
          <ClipLoader size={200} color="#df57eb" />
        </Background>
      }
    </>
  );
};

const mapStateToProps = (state) => ({
  loadingModal: state.loadingModal,
});

const mapDispatchToProps = (_dispatch) => ({});

LoadingModal.propTypes = {
  loadingModal: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingModal);
