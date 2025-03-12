import React, { Component } from 'react'


class RenderIf extends Component {

    conditionalRendering(condition) {
        if (condition) {
            return this.props.children
        }
        else {
            return this.props.else || null
        }
    }

    render() {
        return (
            this.conditionalRendering(this.props.condition)
        )
    }
}

export default RenderIf