let server = 'https://rnacentral.org';
// let server = 'http://127.0.0.1:8001';


module.exports = {
  getSequence: (urs, taxid) => `${server}/api/v1/rna/${urs}/${taxid}`,
  rfamHits:    (urs, taxid) => `${server}/api/v1/rna/${urs}/rfam-hits/${taxid}`,
  seqFeatures: (urs, taxid) => `${server}/api/v1/rna/${urs}/sequence-features/${taxid}`,
};
