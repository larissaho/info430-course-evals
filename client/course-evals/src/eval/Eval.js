import React, {Component} from 'react';
import { Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';

class Eval extends Component {
    render() {
        return (
            <Card style={{margin: "1%"}}>
                <CardContent>
                    <p>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                </p>
                </CardContent>
            </Card>
        )
    }
}

export default Eval;