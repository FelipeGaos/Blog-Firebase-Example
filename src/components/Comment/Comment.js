/**
 * Created by raul on 9/14/16.
 */

import React, { Component } from 'react';
import { Helpers } from '../../Helpers/helpers'

export class Comment extends Component {

    render() {
        return (
            <div className="comment-box">
                <p className="comment-author">
                    <b>{this.props.username}</b> - <span className="comment-date">{Helpers.convertDateToLongString(this.props.datetime)}</span>
                </p>
                <div>
                    <p className="comment-body">{this.props.content}</p>
                    {this.props.username === this.props.userEmail ?
                        <div className="actions-comment-box">
                            <a value={this.props.content} name={this.props.k} onClick={this.props.onClickEdit}>Edit</a>
                            <a value={this.props.k} onClick={this.props.onClickDelete}>Delete</a>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

ReactDOM.render(<Comment />, document.getElementById('root'));