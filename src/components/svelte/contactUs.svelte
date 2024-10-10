<script>
  import { fade } from "svelte/transition";
  import * as C from "../../apiData/config";
</script>

<div class="main-container">
  <div class="center-div px-2 py-1 mb-5" transition:fade>
    <div class="container">
      <div class="contact__wrapper shadow-lg mt-4">
        <div class="row no-gutters">
          <div
            class="col-lg-5 contact-info__wrapper
             gradient-brand-color p-5 order-lg-2"
          >
            <h3 class="color--white mb-5">Get in Touch</h3>

            <ul
              class="contact-info__list list-style--none position-relative z-index-101"
            >
              <li class="mb-4 pl-4">
                <span class="position-absolute"
                  ><i class="fas fa-envelope"></i></span
                >
                {C.default.objDetails.email}
              </li>
              <li class="mb-4 pl-4">
                <span class="position-absolute"
                  ><i class="fas fa-phone"></i></span
                >
                {C.default.objDetails.contact}
              </li>
              <li class="mb-4 pl-4">
                <span class="position-absolute"
                  ><i class="fas fa-map-marker-alt"></i></span
                >
                {C.default.objDetails.address}
                <br />
                {C.default.objDetails.city}

                <div class="mt-3">
                  <a
                                                   href={C.default.objDetails.mapId}
                          target="_blank "
                        class="text-link link--right-icon text-white"
                        >Get directions <i class="link__icon fa fa-directions"
                        ></i></a
                  >
                </div>
              </li>
            </ul>

            <figure
              class="figure position-absolute m-0 opacity-06 z-index-100"
              style="bottom:45%; right: 122px"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="444px"
                height="626px"
              >
                <defs>
                  <linearGradient
                    id="PSgrad_1"
                    x1="0%"
                    x2="81.915%"
                    y1="57.358%"
                    y2="0%"
                  >
                    <stop offset="0%" stop-color="orangered" stop-opacity="1"
                    ></stop>
                    <stop
                      offset="100%"
                      stop-color="var(--bs-danger)"
                      stop-opacity="0"
                    ></stop>
                  </linearGradient>
                </defs>
                <path
                  fill-rule="evenodd"
                  opacity="0.302"
                  fill="rgb(72, 155, 248)"
                  d="M816.210,-41.714 L968.999,111.158 L-197.210,1277.998 L-349.998,1125.127 L816.210,-41.714 Z"
                ></path>
                <path
                  fill="url(#PSgrad_1)"
                  d="M816.210,-41.714 L968.999,111.158 L-197.210,1277.998 L-349.998,1125.127 L816.210,-41.714 Z"
                ></path>
              </svg>
            </figure>
          </div>

          <div class="col-lg-7 contact-form__wrapper p-5 order-lg-1">
            <form
              action="#"
              class="contact-form form-validate"
              novalidate="novalidate"
            >
              <div class="row">
                <div class="col-sm-6 mb-3">
                  <div class="form-group">
                    <label class="required-field" for="firstName"
                      >First Name</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="firstName"
                      name="firstName"
                      placeholder="Wendy"
                    />
                  </div>
                </div>

                <div class="col-sm-6 mb-3">
                  <div class="form-group">
                    <label for="lastName">Last Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      name="lastName"
                      placeholder="Appleseed"
                    />
                  </div>
                </div>

                <div class="col-sm-6 mb-3">
                  <div class="form-group">
                    <label class="required-field" for="email">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      id="email"
                      name="email"
                      placeholder="wendy.apple@seed.com"
                    />
                  </div>
                </div>

                <div class="col-sm-6 mb-3">
                  <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      name="phone"
                      placeholder="(021)-454-545"
                    />
                  </div>
                </div>

                <div class="col-sm-12 mb-3">
                  <div class="form-group">
                    <label class="required-field" for="message"
                      >How can we help?</label
                    >
                    <textarea
                      class="form-control"
                      id="message"
                      name="message"
                      rows="4"
                      placeholder="Hi there, I would like to....."
                    ></textarea>
                  </div>
                </div>

                <div class="col-sm-12 mb-3">
                  <button
                    type="submit"
                    name="submit"
                    class="btn btn-white"
                    style="background-color: var(--bs-danger);color:#fff;"
                    >Submit</button
                  >
                </div>
              </div>
            </form>
          </div>
          <!-- End Contact Form Wrapper -->
        </div>
      </div>
    </div>
    <div class="row my-4">
      <div class="col-lg-12">
        <div class="contact-map">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3669.9312644918814!2d${C.default.objDetails.coOrdinates[0].xCoordinate}!3d${C.default.objDetails.coOrdinates[0].yCoordinate}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e830161e15d39%3A0xdce0115c3937d916!2sVrundavan%20residency!5e0!3m2!1sen!2sin!4v1713428903198!5m2!1sen!2sin`}
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            style="width: 100%; height: 360px;"
          ></iframe>
        </div>
      </div>
      <!-- end col -->
    </div>
  </div>
</div>

<style>
  .gradient-brand-color {
    background: -webkit-linear-gradient(
      0deg,
      #e67d37 0%,
      var(--bs-danger) 100%
    ) !important;
    /* background: -ms-linear-gradient(0deg, #376be6 0%, #6470ef 100%) !important; */
    color: #fff;
  }
  .contact-info__wrapper {
    overflow: hidden;
    border-radius: 0.625rem 0.625rem 0 0;
  }

  @media (min-width: 1024px) {
    .contact-info__wrapper {
      border-radius: 0 0.625rem 0.625rem 0;
      padding: 5rem !important;
    }
  }
  .contact-info__list span.position-absolute {
    left: 0;
  }
  .z-index-101 {
    z-index: 101;
  }
  .list-style--none {
    list-style: none;
  }
  .contact__wrapper {
    background-color: var(--bs-BgColor);
    border-radius: 0 0 0.625rem 0.625rem;
  }

  @media (min-width: 1024px) {
    .contact__wrapper {
      border-radius: 0.625rem 0 0.625rem 0.625rem;
    }
  }
  @media (min-width: 1024px) {
    .contact-form__wrapper {
      padding: 5rem !important;
    }
  }
  .shadow-lg,
  .shadow-lg--on-hover:hover {
    box-shadow: 0 1rem 3rem rgba(132, 138, 163, 0.1) !important;
  }
  input:focus,
  textarea:focus,
  button:focus {
    box-shadow: none;
  }
</style>
