import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Formik } from 'formik'
import everyone from '../hocs/everyone'
import { clientService } from '../services'
import { Link } from '../../common/routes'

const CLIENTS = [
  {
    name: 'WeCheck',
    imgUrl: '/static/img/clients/client1.png',
  },
  {
    name: 'HERENOW',
    imgUrl: '/static/img/clients/client2.png',

  },
  {
    name: 'KOOICOOI',
    imgUrl: '/static/img/clients/client3.png',
  }
]

const SERVICES = [
  {
    title: 'Product Design',
    imgUrl: '/static/img/services/sv1.png',
    description:
      'We use design sprints and user research to build products that are user-centered, beautiful and easy to use.',
    tools: ['Sketch', 'Abobe Illustrator', 'Zeplin', 'InVision', 'Marvel App']
  },
  {
    title: 'Web Development',
    imgUrl: '/static/img/services/sv2.png',
    description:
      'Secure, scalable and intuitive web applications with modern technologies deployed on proven scalable platforms.',
    tools: [
      'NodeJS',
      'ReactJS',
      'GraphQL',
      'AWS',
      'Google Cloud',
      'Heroku',
      'Docker'
    ]
  },
  {
    title: 'App Development',
    imgUrl: '/static/img/services/sv3.png',
    icon: 'fa-mobile-alt',
    description:
      'We deliver outstanding mobile applications using both native or cross-platform approach based on your product demand.',
    tools: ['React Native', 'Java', 'Swift / Objective-C', 'Firebase', 'Fabric']
  },
  {
    title: 'Dedicated teams',
    imgUrl: '/static/img/services/sv4.png',
    description:
      'Energized, reliable and scalable dedicated software development teams with vast experience on latest technologies.',
    tools: ['Product Mindset', 'Experienced', 'Energized']
  },
  {
    title: 'Architecture clinic',
    imgUrl: '/static/img/services/sv5.png',
    description:
      'Quickly, effectively, and correctly create high-quality system architectures, through comprehensive hands-on approaches',
    tools: [
      'Domain Driven Design',
      'Clean Architecture',
      'Modular Monolith',
      'Micro-Services',
      'Scaling',
      'Security',
      'Industry Best Practices'
    ]
  },
  {
    title: 'System Modernization',
    imgUrl: '/static/img/services/sv6.png',
    description:
      'Transform legacy applications to state of art technologies and modern architecture to stay relevant and deliver greatest business value',
    tools: ['Single-page Web App', 'Real-time', 'High performance']
  }
]

class IndexPage extends Component {
  render() {
    return (
      <div className='index-page'>
        <div className='masterhead'>
          <section id='nav'>
            <nav
              className='app-navbar navbar navbar-expand-md navbar-light'
              id='mainNav'
            >
              <div className='container'>
                <Link route='/'>
                  <a className='navbar-brand '>
                    <img className='' src='/static/img/logos/dayone-logo.png' height='36' />
                  </a>
                </Link>
                <button
                  className='navbar-toggler'
                  onClick={this.props.toggleMobileSideBar}
                  type='button'
                >
                  {/* <span className='navbar-toggler-icon' /> */}
                  <i class="navbar-toggler-icon fas fa-align-justify"></i>
                </button>
                <div className='collapse navbar-collapse'>
                  <ul className='navbar-nav ml-auto'>
                    <li className='nav-item align-self-center'>
                      <a href='#services' className='nav-link px-3'>
                        Services
                      </a>
                    </li>
                    <li className='nav-item align-self-center'>
                      <a href='#technologies' className='nav-link px-3'>
                        Technology
                      </a>
                    </li>
                    <li className='nav-item align-self-center'>
                      <Link route='/portfolio'>
                        <a className='nav-link px-3'> Portfolio</a>
                      </Link>
                    </li>
                    <li className='nav-item align-self-center'>
                      <a href='#technologies' className='nav-link px-3'>
                        Career
                      </a>
                    </li>
                    <li className='nav-item align-self-center'>
                      <a href='#contact' className='nav-link pl-3'>
                        <span className='btn nav-item-contact '>Let's talk</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <div className='intro-text'>
              <h1 className='intro-heading'>Let's Go!</h1>
              <div className='intro-lead-in'>
                Professional software development and technology consultancy that help your
                business moving forward
                    </div>
              <button className='btn btn-intro'>LET'S DISCUSS YOUR PROJECT</button>
            </div>

            <div className='intro-overlay'></div>
          </section>
        </div>




        <section id='services'>
          <h2 className='section-heading mb-2 text-center'>OUR SERVICES</h2>
          <p className='section-content text-center'>Zelo to One digital product development</p>
          <div className='container'>
            <div className='row'>
              {SERVICES.map(({ title, imgUrl, description, tools }, index) => (
                <div key={index} className='col-md-4 mb-5'>
                  <div className='card h-100 shadow border-light pb-3'>
                    <div className='bg-overlay'>
                      <img
                        key={index}
                        className='rounded mx-auto d-block'
                        src={imgUrl}
                        alt=''
                        height='50'
                      />
                      <h4 className='card-title text-center'>{title}</h4>
                    </div>
                    <div className='card-body'>
                      <p className='card-text text-center'>{description}</p>
                    </div>
                    <div className='text-center card-tools'>
                      {tools.map((tool, index) => (
                        <React.Fragment key={index}>
                          <span className='badge badge-outline ml-1 mr-1 font-weight-normal'>
                            {tool}
                          </span>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>





        {/* <section id='services'>
            <div className='container'>
              <div className='row'>
                <div className='col-lg-12 text-center'>
                  <h2 className='section-heading mb-5'>OUR SERVICES</h2>
                </div>
              </div>
              <div className='row'>
                {SERVICES.map(({ title, imgUrl, description, tools }, index) => (
                  <Fade bottom key={index} delay={100 * index}>
                    <div className='col-md-4 col-lg-4 mb-5'>
                      <div className='card h-100 shadow border-light pt-4 pb-3'>
                        <img
                          className='rounded mx-auto d-block'
                          src={imgUrl}
                          alt=''
                          height='60'
                        />
                        <div className='card-body'>
                          <h4 className='card-title text-center'>{title}</h4>
                          <p className='card-text text-center'>{description}</p>
                        </div>
                        <div className='text-center'>
                          {tools.map((tool, index) => (
                            <React.Fragment key={index}>
                              <span
                                className='badge badge-outline ml-1 mr-1 font-weight-normal'>
                                {tool}
                              </span>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </section> */}


        <section id='technologies' className='pt-5'>
          <h1 className='section-heading text-center font-weight-bold'>TECHNOLOGY STACK</h1>
          <div className='technologies-overlay'></div>
          <p>Build world - class modern systems with new and established technologies</p>
          <img src='/static/img/technology/snow.png' className='w-20 technologies-img' />
          <div className='row'>
            <div className='col-md-7 p-5'>
              <img
                src='/static/img/technology/tech/tech1.png'
                className='w-100'
                alt=''
              />
            </div>
            <div className='col-md-5 p-5'>
              <div className='technologies-content'>
                <div className='technologies-item'>
                  <img src='/static/img/technology/tech1.png' className='w-100' />
                </div>
                <div className='technologies-item' >
                  <img src='/static/img/technology/tech2.png' className='w-100' />
                </div>
                <div className='technologies-item '>
                  <img src='/static/img/technology/tech3.png' />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* TESTIMONIALS */}
        <section id='testimonials'>
          <h1 className='text-center'>TESTIMONIALS</h1>
          <img className='testimonials-line w-10' src='/static/img/feedback/line.png' />
          <img className='testimonials-snow w-10' src='/static/img/feedback/snow.png' />
          <img className='testimonials-ellipse w-10' src='/static/img/feedback/Ellipse.png' />
          <img className='testimonials-ellipse testimonials-ellipse--icon w-10' src='/static/img/feedback/Ellipse1.png' />
          <div id="carouselExampleIndicators" className="pt-4 carousel slide testimonials-carousel" data-ride="carousel">
            <ol className="carousel-indicators">
              <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
              <li data-target="#carouselExampleIndicators" data-slide-to={1} />
              <li data-target="#carouselExampleIndicators" data-slide-to={2} />
            </ol>
            <div className="carousel-inner">
              <div className="carousel-item active">

                <div className='row'>
                  <div className='col-md-7 col-12'>
                    <div className='testimonials-content'>
                      <h2><i class="fas fa-quote-left testimonials-icon mr-3"></i>GREAT WORKS</h2>
                      <p className='testimonials-text'>Lorem Ipsum is simply dummy text of the printing and
                         typesetting industry. Lorem Ipsum has been the industry's
                         standard dummy text ever since the 1500s, when an unknown printer
                          took a galley of type and scrambled it to make a type specimen book.
                          It has survived not only five centuries.
                        </p>
                      <div className='testimonials-client'>
                        <img src='/static/img/feedback/avatar.jpeg' />
                          <div className='testimonials-info'>
                            <h5>James Haris</h5>
                            <p>CEO, FixCo</p>
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className='testimonials-logo--clients col-md-5 col-12 d-flex justify-content-center align-items-center'>
                    <img className='w-50' src='/static/img/clients/client1.png' />
                  </div>
                </div>

              </div>
              <div className="carousel-item ">
                <div className='row'>
                  <div className='col-md-7 col-12'>
                    <div className='testimonials-content'>
                      <h2><i class="fas fa-quote-left testimonials-icon mr-3"></i>GREAT WORKS</h2>
                      <p className='testimonials-text'>Lorem Ipsum is simply dummy text of the printing and
                         typesetting industry. Lorem Ipsum has been the industry's
                         standard dummy text ever since the 1500s, when an unknown printer
                          took a galley of type and scrambled it to make a type specimen book.
                          It has survived not only five centuries.
                        </p>
                      <div className='testimonials-client'>
                        <img src='/static/img/feedback/avatar.jpeg' />
                        <div className='testimonials-info'>
                          <h5>James Haris</h5>
                          <p>CEO, FixCo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='testimonials-logo--clients col-md-5 col-12 d-flex justify-content-center align-items-center'>
                    <img className='w-50' src='/static/img/clients/client1.png' />
                  </div>
                </div>
              </div>
              <div className="carousel-item ">
                <div className='row'>
                  <div className='col-md-7 col-12'>
                    <div className='testimonials-content'>
                      <h2><i class="fas fa-quote-left testimonials-icon mr-3"></i>GREAT WORKS</h2>
                      <p className='testimonials-text'>Lorem Ipsum is simply dummy text of the printing and
                         typesetting industry. Lorem Ipsum has been the industry's
                         standard dummy text ever since the 1500s, when an unknown printer
                          took a galley of type and scrambled it to make a type specimen book.
                          It has survived not only five centuries.
                        </p>
                      <div className='testimonials-client'>
                        <img src='/static/img/feedback/avatar.jpeg' />
                        <div className='testimonials-info'>
                          <h5>James Haris</h5>
                          <p>CEO, FixCo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='testimonials-logo--clients col-md-5 col-12 d-flex justify-content-center align-items-center'>
                    <img className='w-50' src='/static/img/clients/client1.png' />
                  </div>
                </div>
              </div>
            </div>
            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true" />
              <i class="fas fa-angle-left carousel-control-prev-icon"></i>
              <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true" />
              <i class="fas fa-angle-right carousel-control-next-icon"></i>
              <span className="sr-only">Next</span>
            </a>
          </div>
        </section>


        {/* OUR CLIENTS */}
        <section id='clients'>
          <h1 className='text-center py-3'>OUR CLIENTS</h1>
          <div className='container'>
            <div className='row'>
              {CLIENTS.map((client, index) => (
                <div className='col-4'>
                  <img key={index} className='w-50' src={client.imgUrl} />

                </div>
              ))}
            </div>
          </div>
        </section>



        {/* feedback */}
        {/* <section className='feedback mt-5'>
         <div className='container-fluid'>
           <h1 className='text-center mb-3 font-weight-bold intro-tech'>
             Feed Back
           </h1>

           <div
             id='carouselExampleIndicators'
             className='carousel slide row justify-content-center'
             data-ride='carousel'
           >
             <div className='mx-auto d-block carousel-indicators2 text-center'>
               <img
                 className='rounded-circle active'
                 src='/static/img/feedback/avatar.jpeg'
                 alt=''
                 data-target='#carouselExampleIndicators'
                 data-slide-to='0'
               />
               <img
                 className='rounded-circle'
                 src='/static/img/feedback/avatar.jpeg'
                 alt=''
                 data-target='#carouselExampleIndicators'
                 data-slide-to='1'
               />
               <img
                 className='rounded-circle'
                 src='/static/img/feedback/avatar.jpeg'
                 alt=''
                 data-target='#carouselExampleIndicators'
                 data-slide-to='2'
               />
             </div>
             <ol className='carousel-indicators'>
               <li
                 data-target='#carouselExampleIndicators'
                 data-slide-to='0'
                 className='active'
               />
               <li
                 data-target='#carouselExampleIndicators'
                 data-slide-to='1'
               />
               <li
                 data-target='#carouselExampleIndicators'
                 data-slide-to='2'
               />
             </ol>
             <div className='carousel-inner col-6 d-block'>
               <div className='carousel-item active text-white text-center p-xl-5 p-0'>
                 <div className='text-carousel--fix'>
                   “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   Pellentesque sagittis urna morbi leo. Donec morbi felis
                   urna, nisl, viverra ultricies faucibus risus diam. Velit
                   enim porta integer facilisis ut mi nisl. Tincidunt dignissim
                   magna posuere volutpat turpis non in aliquet id. Risus ut
                   faucibus vitae aliquet lacus lacinia ultrices imperdiet
                   eget. Nisl ullamcorper in viverra sociis cras ac euismod non
                   malesuada. “
                 </div>
               </div>
               <div className='carousel-item text-white text-center p-xl-5 p-0'>
                 <div className='text-carousel--fix'>
                   “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   Pellentesque sagittis urna morbi leo. Donec morbi felis
                   urna, nisl, viverra ultricies faucibus risus diam. Velit
                   enim porta integer facilisis ut mi nisl. Tincidunt dignissim
                   magna posuere volutpat turpis non in aliquet id. Risus ut
                   faucibus vitae aliquet lacus lacinia ultrices imperdiet
                   eget. Nisl ullamcorper in viverra sociis cras ac euismod non
                   malesuada. “
                 </div>
               </div>
               <div className='carousel-item text-white text-center p-xl-5 p-0'>
                 <div className='text-carousel--fix'>
                   “Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                   Pellentesque sagittis urna morbi leo. Donec morbi felis
                   urna, nisl, viverra ultricies faucibus risus diam. Velit
                   enim porta integer facilisis ut mi nisl. Tincidunt dignissim
                   magna posuere volutpat turpis non in aliquet id. Risus ut
                   faucibus vitae aliquet lacus lacinia ultrices imperdiet
                   eget. Nisl ullamcorper in viverra sociis cras ac euismod non
                   malesuada. “
                 </div>
               </div>
             </div>
           </div>
         </div>
        </section> */}

        {/* Contact */}
        <section id='contact'
          className='row no-gutters justify-content-center'
        >
          {/* <div className='contact-bg--line'>
              <img className='line1 w-100' src='/static/img/contact/line1.png' />
              <img className='line2 w-100' src='/static/img/contact/line2.png' />
            </div> */}
          <div className=' contact-form p-5'>
            <div className='row'>
              <div className='col-lg-12 text-center'>
                <h2 className='section-heading'>Contact Us</h2>
                <div className='text-white mb-4 section-content'>
                  Fill the form or send to us at dayoneteamsinc@gmail.common
                    <br></br>(we tend to reply immediately).
                  </div>
              </div>
            </div>
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                message: ''
              }}
              onSubmit={async (values, actions) => {
                try {
                  actions.setSubmitting(true)
                  await clientService.submitContactForm(values)
                  alert(
                    'Thank you for contacting us. We will reply you very soon.'
                  )
                } catch (e) {
                  alert(e.message)
                }
                actions.setSubmitting(false)
                actions.resetForm()
              }}
            >
              {({ values, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div className='row justify-content-center'>
                    <div className='col-md-10'>
                      <div className='form-group'>
                        <input
                          className='form-control'
                          name='name'
                          value={values.name}
                          onChange={handleChange}
                          placeholder="What's your name?"
                        />
                        <p className='help-block text-danger' />
                      </div>
                      <div className='form-group'>
                        <input
                          className='form-control'
                          name='email'
                          type='email'
                          placeholder='Your email *'
                          value={values.email}
                          onChange={handleChange}
                        />
                        <p className='help-block text-danger' />
                      </div>
                      <div className='form-group'>
                        <input
                          className='form-control'
                          name='phone'
                          value={values.phone}
                          onChange={handleChange}
                          placeholder='Your phone number (optional)'
                        />
                        <p className='help-block text-danger' />
                      </div>
                      <div className='form-group'>
                        <textarea
                          className='form-control'
                          name='message'
                          value={values.message}
                          onChange={handleChange}
                          placeholder='Tell us about your project *'
                        />
                        <p className='help-block text-danger' />
                      </div>
                    </div>
                    <div className='col-lg-12 text-center'>
                      <button
                        className='btn btn-lg bg-white btn-contact text-primary'
                        type='submit'
                      >
                        {isSubmitting ? (
                          <div className='spinner-border text-primary' />
                        ) : (
                            'Contact us now'
                          )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </section>


        {/* <footer id='footer'>
            <div className='footer-navigation'>
              <div className='container pb-5'>
                <div className='row no-gutters'>
                  <div className='col-6 col-md-3 pr-3'>
                    <h5>Use Cases</h5>
                    <ul className='list-unstyled'>
                      <Link route=''>
                        <a className='text-white'>
                          <li className='py-2'>Data Mapping</li>
                        </a>
                      </Link>
                      <Link route='/#technologies'>
                        <a className='text-white'>
                          <li className='py-2'>Subject Requests</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Consent Management</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Access Control</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Impact Assessments</li>
                        </a>
                      </Link>
                    </ul>
                  </div>
                  <div className='col-6 col-md-3 pr-3'>
                    <h5>Developers</h5>
                    <ul className='list-unstyled'>
                      <Link route=''>
                        <a className='text-white'>
                          <li className='py-2'>Documentation</li>
                        </a>
                      </Link>
                      <Link route='/#technologies'>
                        <a className='text-white'>
                          <li className='py-2'>API Reference</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Regulations</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>CCPA</li>
                        </a>
                      </Link>

                    </ul>
                  </div>
                  <div className='col-6 col-md-3 pr-3'>
                    <h5>About Us</h5>
                    <ul className='list-unstyled'>
                      <Link route=''>
                        <a className='text-white'>
                          <li className='py-2'>Who We Are</li>
                        </a>
                      </Link>
                      <Link route='/#technologies'>
                        <a className='text-white'>
                          <li className='py-2'>Jobs</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Partner Program</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'> News 	&amp; Blog</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Privacy.dev</li>
                        </a>
                      </Link>
                    </ul>
                  </div>
                  <div className='col-6 col-md-3 pr-3'>
                    <h5>Resources</h5>
                    <ul className='list-unstyled'>
                      <Link route=''>
                        <a className='text-white'>
                          <li className='py-2'>Pricing</li>
                        </a>
                      </Link>
                      <Link route='/#technologies'>
                        <a className='text-white'>
                          <li className='py-2'>Support</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Contact Us</li>
                        </a>
                      </Link>
                      <Link route='/blog'>
                        <a className='text-white'>
                          <li className='py-2'>Privacy Policy</li>
                        </a>
                      </Link>
                    </ul>
                  </div>

                  

                </div>
              </div>
            </div>
            <div className='contact-info'>
              <div className='container'>
                <div className='row'>
                  <div className='col-md-6 col-12 '>
                    <span className='copyright'>
                      {`Copyright © ${new Date().getFullYear()}. All rights reserved. DayoneTeams.com`}
                    </span>
                  </div>
                  <div className='col-md-6 col-12 text-md-right text-center'>
                    <ul className='list-unstyled contact-info--list'>
                      <li className='pr-3'>
                        <a href=''>
                          <i class="fab fa-linkedin contact-linkedin" aria-hidden="true"></i>
                        </a>
                      </li>
                      <li className='pr-3'>
                        <a href=''>
                          <i class="fab fa-facebook-square contact-facebook"></i>
                        </a>
                      </li>
                      <li className='pr-3'>
                        <a href=''>
                          <i class="fab fa-twitter contact-twitter"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </footer> */}








        {/* <div className='col-6 pr-3'>
                  <h4>DayOne - Let's Go!</h4>
                  <div className='mb-5'>
                    DayOne is a full-service technology agency designing and
                    building state-of-the-art digital products from strategy,
                    design, and development
                  </div>
                  <span className='copyright'>
                    {`DayOne, LLC © ${new Date().getFullYear()} All rights reserved.`}
                  </span>
                </div> */}
        {/* <div className='col-6'>
                  <div className='row no-gutters'>
                    <div className='col-6'>
                      <h5>Portfolio</h5>
                      <ul className='list-unstyled'>
                        <Link route='/#services'>
                          <a className='text-white'>
                            <li className='p-2'>Our Services</li>
                          </a>
                        </Link>
                        <Link route='/#technologies'>
                          <a className='text-white'>
                            <li className='p-2'>Technology</li>
                          </a>
                        </Link>
                        <Link route='/blog'>
                          <a className='text-white'>
                            <li className='p-2'>Blog</li>
                          </a>
                        </Link>
                      </ul>
                    </div> */}


        {/* <div className='col-6'>
                      <h5>Company</h5>
                      <ul className='list-unstyled'>
                        <Link route='/#about'>
                          <a className='text-white'>
                            <li className='p-2'>About Us</li>
                          </a>
                        </Link>
                        <Link route='/privacy-policy'>
                          <a className='text-white'>
                            <li className='p-2'>Privacy Policy</li>
                          </a>
                        </Link>
                      </ul>
                    </div>
                  </div>
                </div> */}
      </div>

    )
  }
}


const mapStateToProps = state => ({
  currentUser: state.auth.user
})
export default everyone(connect(mapStateToProps)(IndexPage), {
  useDefaultNavBar: false
})
