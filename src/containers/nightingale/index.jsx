import React from 'react';
import {connect} from "react-redux";
import * as actionCreators from 'actions/actions';
import {store} from "app.jsx";
import ProtVistaNavigation from "protvista-navigation/src/protvista-navigation";
import ProtVistaSequence from "protvista-sequence/src/protvista-sequence";
import ProtVistaManager from "protvista-manager/src/protvista-manager";
import ProtVistaTrack from "protvista-track/src/protvista-track";


class Nightingale extends React.Component {
  constructor(props) {
    super(props);
    // get URS and taxid from attribute
    let urs = this.props.data.urs
    let taxid = this.props.data.taxid

    // get sequence and sequence features from RNAcentral API
    store.dispatch(actionCreators.getSequence(urs, taxid))
    store.dispatch(actionCreators.getRfamHits(urs, taxid))
    store.dispatch(actionCreators.getSequenceFeatures(urs, taxid))

    // create Refs for integration with third-party DOM libraries
    this.manager = React.createRef();
    this.sequence = React.createRef();
    this.anticodon = React.createRef();
    this.conservedRnaStructure = React.createRef();
    this.cpatOrf = React.createRef();
    this.matureProduct = React.createRef();
    this.rfamHits = React.createRef();

    // add custom elements
    if (!window.customElements.get('protvista-manager')) {
      window.customElements.define('protvista-manager', ProtVistaManager);
    }
    if (!window.customElements.get('protvista-navigation')) {
      window.customElements.define('protvista-navigation', ProtVistaNavigation);
    }
    if (!window.customElements.get('protvista-sequence')) {
      window.customElements.define('protvista-sequence', ProtVistaSequence);
    }
    if (!window.customElements.get('protvista-track')) {
      window.customElements.define('protvista-track', ProtVistaTrack);
    }
  }

  componentDidMount() {
    // add sequence value
    customElements.whenDefined('protvista-sequence').then(
      () => { setTimeout(() => {
          this.sequence.current.data = this.props.sequence;
        }, 500);
      }
    );

    // add track values
    customElements.whenDefined('protvista-track').then(
      () => { setTimeout(() => {
          if (this.props.anticodon.length !== 0){
            this.anticodon.current.data = this.props.anticodon;
          }
          if (this.props.conservedRnaStructure.length !== 0){
            this.conservedRnaStructure.current.data = this.props.conservedRnaStructure;
          }
          if (this.props.cpatOrf.length !== 0){
            this.cpatOrf.current.data = this.props.cpatOrf;
          }
          if (this.props.matureProduct.length !== 0){
            this.matureProduct.current.data = this.props.matureProduct;
          }
          if (this.props.rfamHits.length !== 0){
            this.rfamHits.current.data = this.props.rfamHits;
          }
        }, 500);
      }
    )
  }

  render() {
    const seqLength = this.props.sequence.length ? this.props.sequence.length : 100;
    return (
      <div className="rna">
        <protvista-manager length={seqLength} displaystart={1} displayend={seqLength} ref={this.manager}>
          <div className="row">
            <div className="col-2"></div>
            <div className="col-10">
              <protvista-navigation length={seqLength}></protvista-navigation>
            </div>
          </div>
          <div className="row">
            <div className="col-2 div-track">Sequence</div>
            <div className="col-10">
              <protvista-sequence length={seqLength} ref={this.sequence}></protvista-sequence>
            </div>
          </div>
          { this.props.rfamHits.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#d28068"}}></span> Rfam families
            </div>
            <div className="col-10">
              <protvista-track length={seqLength} layout="non-overlapping" ref={this.rfamHits}></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.anticodon.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#EF36F1FF"}}></span> Anticodon
            </div>
            <div className="col-10">
              <protvista-track length={seqLength} layout="non-overlapping" ref={this.anticodon}></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.cpatOrf.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#E0C653"}}></span> CPAT ORF
            </div>
            <div className="col-10">
              <protvista-track length={seqLength} layout="non-overlapping" ref={this.cpatOrf}></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.matureProduct.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#660099"}}></span> Mature miRNA
            </div>
            <div className="col-10">
              <protvista-track length={seqLength} layout="non-overlapping" ref={this.matureProduct}></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.conservedRnaStructure.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#365569"}}></span> Conserved features
            </div>
            <div className="col-10">
              <protvista-track length={seqLength} layout="non-overlapping" ref={this.conservedRnaStructure}></protvista-track>
            </div>
          </div> : ""
          }
        </protvista-manager>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    sequence: state.sequence,
    anticodon: state.anticodon,
    conservedRnaStructure: state.conservedRnaStructure,
    cpatOrf: state.cpatOrf,
    matureProduct: state.matureProduct,
    rfamHits: state.rfamHits,
  };
}

export default connect(
  mapStateToProps,
)(Nightingale);
