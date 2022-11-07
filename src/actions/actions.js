import * as types from './actionTypes';
import routes from 'services/routes.jsx';


export function getSequence(urs, taxid) {
  return function(dispatch) {
    fetch(routes.getSequence(urs, taxid))
    .then(function(response) {
      if (response.ok) { return response.json() }
      else { throw response }
    })
    .then(data => {
      dispatch({type: types.SEQUENCE, sequence: data.sequence});
    })
    .catch(error => console.log(error));
  }
}

export function getRfamHits(urs, taxid) {
  let rfamHits = [];

  return function(dispatch) {
    fetch(routes.rfamHits(urs, taxid))
    .then(function(response) {
      if (response.ok) { return response.json() }
      else { throw response }
    })
    .then(data => {
      rfamHits = data.results.map((result, index) => (
        {
          "accession": "rfam-" + index,
          "start": result.sequence_start,
          "end": result.sequence_stop,
          "color": "#d28068",
          "details": {
            "id": result.rfam_model.rfam_model_id,
            "name": result.rfam_model.long_name
          }
        }
      ));
      dispatch({ type: types.RFAM_TRACK, rfamHits: rfamHits });
    })
    .catch(error => console.log(error));
  }
}

export function getSequenceFeatures(urs, taxid) {
  let anticodon = [];
  let conservedRnaStructure = [];
  let cpatOrf = [];
  let matureProduct = [];

  return function(dispatch) {
    fetch(routes.seqFeatures(urs, taxid))
    .then(function(response) {
      if (response.ok) { return response.json() }
      else { throw response }
    })
    .then(data => {
      data.results.map((result, index) => {
       if (result.feature_name==="anticodon"){
         anticodon = [
           ...anticodon,
           {
             "accession": result.feature_name + index,
             "start": result.start,
             "end": result.stop,
             "color": "#EF36F1FF",
             "details": {
               "isotype": result.metadata.isotype,
               "sequence": result.metadata.sequence
             }
           }
         ]
       } else if (result.feature_name==="conserved_rna_structure"){
         conservedRnaStructure = [
           ...conservedRnaStructure,
           {
             "accession": result.feature_name + index,
             "start": result.start,
             "end": result.stop,
             "color": "#365569",
             "details": {
               "crs_id": result.metadata.crs_id,
             }
           }
         ]
       } else if (result.feature_name==="cpat_orf"){
         cpatOrf = [
           ...cpatOrf,
           {
             "accession": result.feature_name + index,
             "start": result.start,
             "end": result.stop,
             "color": "#E0C653",
             "details": {
               "cutoff": result.metadata.cutoff,
               "coding_probability": result.metadata.coding_probability
             }
           }
         ]
       } else if (result.feature_name==="mature_product"){
         matureProduct = [
           ...matureProduct,
           {
             "accession": result.feature_name + index,
             "start": result.start,
             "end": result.stop,
             "color": "#660099",
             "details": {
               "related": result.metadata.related,
             }
           }
         ]
       }
      })
      dispatch({
          type: types.SEQUENCE_FEATURES,
          anticodon: anticodon,
          conservedRnaStructure: conservedRnaStructure,
          cpatOrf: cpatOrf,
          matureProduct: matureProduct
      });
    })
    .catch(error => console.log(error));
  }
}

export function onMouseMovement(e, track) {
  if (e.target.classList.length > 0){
    // the mouse is over a region that has a track
    return {type: types.TOOLTIP, tooltipX: e.pageX, tooltipY: e.pageY, tooltipTrack: track};
  } else {
    return {type: types.TOOLTIP, tooltipX: "", tooltipY: "", tooltipTrack: ""};
  }
}