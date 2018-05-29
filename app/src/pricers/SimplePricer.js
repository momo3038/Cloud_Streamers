import React from 'react';

function SimplePricer(props) {
    return (
        <div className="pricer">
            <h2>{props.pair}</h2>
            <p id="messages"></p>
        </div>
    );
}

export { SimplePricer}