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
      rfamHits = data.results.map(result => (
        {
          "accession": "rfam",
          "start": result.sequence_start,
          "end": result.sequence_stop,
          "color": "#d28068",
          "tooltipContent": "Rfam"
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
      data.results.map(result => {
       if (result.feature_name==="anticodon"){
         anticodon = [
           ...anticodon,
           {"accession": result.feature_name, "start": result.start, "end": result.stop, "color": "#EF36F1FF"}
         ]
       } else if (result.feature_name==="conserved_rna_structure"){
         conservedRnaStructure = [
           ...conservedRnaStructure,
           {"accession": result.feature_name, "start": result.start, "end": result.stop, "color": "#365569"}
         ]
       } else if (result.feature_name==="cpat_orf"){
         cpatOrf = [
           ...cpatOrf,
           {"accession": result.feature_name, "start": result.start, "end": result.stop, "color": "#E0C653"}
         ]
       } else if (result.feature_name==="mature_product"){
         matureProduct = [
           ...matureProduct,
           {"accession": result.feature_name, "start": result.start, "end": result.stop, "color": "#660099"}
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
