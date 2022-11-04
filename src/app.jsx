import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import configureStore from 'store/configureStore.js';
import bootstrap from 'styles/bootstrap.css';
import Nightingale from 'containers/nightingale/index.jsx'

// Prepare data
export const store = configureStore();


class SequenceFeatures extends HTMLElement {
  constructor() {
    super();

    // prepare DOM and shadow DOM
    // workaround found at https://github.com/facebook/react/issues/9242 to avoid re-renders
    const shadowRoot = this.attachShadow({mode: 'open'});
    const mountPoint = document.createElement('html');
    shadowRoot.appendChild(mountPoint);
    Object.defineProperty(mountPoint, "ownerDocument", { value: shadowRoot });
    shadowRoot.createElement = (...args) => document.createElement(...args);
    shadowRoot.createElementNS = (...args) => document.createElementNS(...args);
    shadowRoot.createTextNode = (...args) => document.createTextNode(...args);

    // parse arguments
    const data = JSON.parse(this.attributes.data ? this.attributes.data.nodeValue : null);

    // render React
    ReactDOM.render([
      <style key={bootstrap} dangerouslySetInnerHTML={{__html: bootstrap}}/>,
      <body key='body'>
        <Provider key='provider' store={store}>
          <Nightingale data={data} />
        </Provider>
      </body>
      ],
      mountPoint
    );
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    let state = store.getState();
    if (state.statusTimeout) {
      clearTimeout(state.statusTimeout);
    }
  }
}

customElements.define('rnacentral-sequence-features', SequenceFeatures);
