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
                            <p>Autumn 2018</p>
                        </div>

                        <p>
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }
}

export default Eval;