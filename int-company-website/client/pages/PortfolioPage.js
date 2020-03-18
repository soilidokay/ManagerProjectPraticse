import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import className from 'classnames'
import Fade from 'react-reveal/Fade'
import everyone from '../hocs/everyone'

const PROJECT = [
  {
    title: 'Final Score Math',
    description:
      'E-learning platform for children to learn math faster and more effectively with a cool app connecting sport and math.',
    imgURL: '/static/img/project/final-score-math.jpg'
  },
  {
    title: 'WeCheck',
    description:
      "WeCheck is the easiest way to increase your productivity and happiness both in life and work. \n\nWhether you're building a daily habit, doing an important task or verifying a high quality work, WeCheck is here to help you tick off all your personal and professional checklists.",
    imgURL: '/static/img/project/wecheck.jpg'
  }
]

class PortfolioPage extends Component {
  render () {
    return (
      <div className='container portfolio-page' id='portfolio-page'>
        <div className='row my-5'>
          <div className='col-lg-12 text-center'>
            <h2 className='section-heading text-uppercase'>
              Our Projects
              <hr />
            </h2>
            <div className='section-subheading text-muted mb-5'>
              Made with ♥ by DayOne Teams
            </div>
          </div>
        </div>

        {PROJECT.map(({ title, description, imgURL }, index) => (
          <div className='row project' key={index}>
            <Fade left={index % 2 === 0} right={index % 2 !== 0}>
              <div
                className={className(
                  'col-md-6 d-md-flex align-items-center mb-3',
                  { 'order-md-2': index % 2 !== 0 }
                )}
              >
                <div>
                  <div className='project__name'>{title}</div>
                  <div className='project__content'>{description}</div>
                </div>
              </div>
            </Fade>
            <Fade right={index % 2 === 0} left={index % 2 !== 0}>
              <div
                className={className('col-md-6', {
                  'order-md-1': index % 2 !== 0
                })}
              >
                <img className='w-100' src={imgURL} />
              </div>
            </Fade>
          </div>
        ))}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.user
})

export default compose(
  everyone,
  connect(mapStateToProps)
)(PortfolioPage)
