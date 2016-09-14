/**
 * Created by raul on 9/14/16.
 */

import React, { Component } from 'react';
import { Pagination } from 'react-bootstrap';

class PaginationAdvanced extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                items={this.props.items}
                maxButtons={5}
                activePage={this.props.activePage}
                onSelect={this.props.onSelect}
            />
        );
    }
}

export default PaginationAdvanced;

ReactDOM.render(<PaginationAdvanced />, document.getElementById('root'));