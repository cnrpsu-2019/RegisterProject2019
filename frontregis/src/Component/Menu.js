import React, { Component } from "react"
class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: this.props.name,
      faculty: this.props.faculty
    }
  }

  render() {
    return (
      <div className="card">
        <div className="card-image"></div>

        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img
                  src="https://bulma.io/images/placeholders/96x96.png"
                  alt="Placeholder image"
                />
              </figure>
            </div>

            <div className="media-content">
              <p className="title is-4">{this.state.name}</p>
              <p className="subtitle is-6">{this.state.faculty}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Menu
