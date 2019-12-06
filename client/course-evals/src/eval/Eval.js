import React, { Component } from 'react';
import { Card, CardContent} from '@material-ui/core';

class Eval extends Component {
    render() {
        const style = {
            display: 'flex'
        };

        return (
            <Card style={{ margin: "1%", fontFamily: "Lato"}}>
                <CardContent>
                    <div style={style}>
                        <div style={{width: "30%"}}>
                            <p>Rating</p>
                            <p>{`${this.props.rating} / 5`}</p>
                        </div>

                        <p>
                            {this.props.comment}
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default Eval;