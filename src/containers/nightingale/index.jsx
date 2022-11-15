import React from 'react';
import {connect} from "react-redux";
import * as actionCreators from 'actions/actions';
import {store} from "app.jsx";
import ProtVistaNavigation from "protvista-navigation/src/protvista-navigation";
import ProtVistaSequence from "protvista-sequence/src/protvista-sequence";
import ProtVistaManager from "protvista-manager/src/protvista-manager";
import ProtVistaTooltip from "protvista-tooltip/src/protvista-tooltip";
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
    if (!window.customElements.get('protvista-tooltip')) {
      window.customElements.define('protvista-tooltip', ProtVistaTooltip);
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

  getDetails(tooltipTrack){
    // a single protvista-track can display multiple tracks, we need to
    // find out which track the user selected to show the correct details
    const tags = document.getElementsByTagName('rnacentral-sequence-features');
    const selectedElement = tags[0].shadowRoot.elementFromPoint(this.props.tooltipX, this.props.tooltipY);
    const parentElementId = selectedElement.parentNode.parentNode.parentNode.id.replace("g_", "");
    let results = ""

    if(tooltipTrack==="Rfam families"){
      this.props.rfamHits.map(item => {
        if (item.accession===parentElementId){
          results = item.details.id + ": " + item.details.name
        }
      })
    } else if(tooltipTrack==="Anticodon"){
      this.props.anticodon.map(item => {
        if (item.accession===parentElementId){
          results = "Isotype: " + item.details.isotype + ", Sequence: " + item.details.sequence
        }
      })
    } else if(tooltipTrack==="CPAT ORF"){
      this.props.cpatOrf.map(item => {
        if (item.accession===parentElementId){
          results = "Coding probability: " +
              item.details.coding_probability.toFixed(3) +
              ", Min cutoff: " +
              item.details.cutoff.toFixed(3)
        }
      })
    } else if(tooltipTrack==="Mature miRNA"){
      this.props.matureProduct.map(item => {
        if (item.accession===parentElementId){
          results = item.details.related.replace("MIRBASE:", "")
        }
      })
    } else if(tooltipTrack==="Conserved features"){
      this.props.conservedRnaStructure.map(item => {
        if (item.accession===parentElementId){
          results = item.details.crs_id
        }
      })
    }

    return results
  }

  render() {
    const seqLength = this.props.sequence.length ? this.props.sequence.length : 100;
    const tooltipTrack = this.props.tooltipTrack;
    const tooltipX = this.props.tooltipX;
    const tooltipY = this.props.tooltipY;
    const detail = tooltipTrack && tooltipX && tooltipY && this.getDetails(tooltipTrack);
    // TODO: fix layout when there are more than two families
    const rfamFamilies = [...new Set(this.props.rfamHits.map(item => item.details.id))];

    return (
      <div className="rna">
        {
          tooltipTrack && detail ? <protvista-tooltip title={tooltipTrack} x={tooltipX} y={tooltipY} visible>
            { detail }
          </protvista-tooltip> : ""
        }
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
              <span className="span-track" style={{backgroundColor: "#d28068"}}></span> Rfam family
              { rfamFamilies.map((item, index) => (
                <span key={index} style={{marginLeft: "5px"}}>
                  <a href={`http://rfam.org/family/${item}`} target="_blank">{item}</a>
                </span>
              ))}
            </div>
            <div className="col-10">
              <protvista-track
                  length={seqLength}
                  layout="non-overlapping"
                  ref={this.rfamHits}
                  onMouseOver={(e) => this.props.onMouseMovement(e, "Rfam families")}
                  onMouseLeave={(e) => this.props.onMouseMovement(e, "")}
              ></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.anticodon.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#EF36F1FF"}}></span> Anticodon
            </div>
            <div className="col-10">
              <protvista-track
                  length={seqLength}
                  layout="non-overlapping"
                  ref={this.anticodon}
                  onMouseOver={(e) => this.props.onMouseMovement(e, "Anticodon")}
                  onMouseLeave={(e) => this.props.onMouseMovement(e, "")}
              ></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.cpatOrf.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#E0C653"}}></span> CPAT ORF
            </div>
            <div className="col-10">
              <protvista-track
                  length={seqLength}
                  layout="non-overlapping"
                  ref={this.cpatOrf}
                  onMouseOver={(e) => this.props.onMouseMovement(e, "CPAT ORF")}
                  onMouseLeave={(e) => this.props.onMouseMovement(e, "")}
              ></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.matureProduct.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#660099"}}></span> Mature miRNA
            </div>
            <div className="col-10">
              <protvista-track
                  length={seqLength}
                  layout="non-overlapping"
                  ref={this.matureProduct}
                  onMouseOver={(e) => this.props.onMouseMovement(e, "Mature miRNA")}
                  onMouseLeave={(e) => this.props.onMouseMovement(e, "")}
              ></protvista-track>
            </div>
          </div> : ""
          }
          { this.props.conservedRnaStructure.length !== 0 ? <div className="row">
            <div className="col-2 div-track">
              <span className="span-track" style={{backgroundColor: "#365569"}}></span> Conserved features
            </div>
            <div className="col-10">
              <protvista-track
                  length={seqLength}
                  layout="non-overlapping"
                  ref={this.conservedRnaStructure}
                  onMouseOver={(e) => this.props.onMouseMovement(e, "Conserved features")}
                  onMouseLeave={(e) => this.props.onMouseMovement(e, "")}
              ></protvista-track>
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
    tooltipX: state.tooltipX,
    tooltipY: state.tooltipY,
    tooltipTrack: state.tooltipTrack,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onMouseMovement: (e, track) => dispatch(actionCreators.onMouseMovement(e, track)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nightingale);
