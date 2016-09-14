/**
 * Created by raul on 9/14/16.
 */

import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

class AlertMessage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.visible ?
                <Alert bsStyle={this.props.type}>
                    {this.props.message}
                </Alert> : null
        );
    }
}

export default AlertMessage;

ReactDOM.render(<AlertMessage />, document.getElementById('root'));