import React from 'react'
import {Spinner} from "react-bootstrap";

export const Loader = () => {
    return(
        <Spinner animation="border" role="status" style={{position: 'sticky', left: '50%'}}>
            <span className="sr-only"></span>
        </Spinner>

    )
}