<script>
  import logo from "../../../assets/event/logo.png";
</script>

<!-- main nav start -->
<header class="header-style-1">
  <div class="navbar-area">
    <div class="main-responsive-nav">
      <div class="container">
        <div class="main-responsive-menu">
          <div class="logo">
            <a href="index.html">
              <img src={logo} alt="images" />
            </a>
          </div>
          <!--/.logo-->
        </div>
      </div>
    </div>
    <div class="main-navbar">
      <div class="container">
        <nav class="navbar navbar-expand-md navbar-light">
          <a class="navbar-brand" href="index.html">
            <img src={logo} alt="images" />
          </a>
          <div
            class="collapse navbar-collapse mean-menu"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav mx-auto">
              <li class="nav-item">
                <a href="/" class="nav-link active">
                  Home <i class="fa-solid fa-chevron-down" />
                </a>
                <ul class="dropdown-menu">
                  <li class="nav-item">
                    <a href="/" class="nav-link active">Home Demo - 1</a>
                  </li>
                  <li class="nav-item">
                    <a href="index-2.html" class="nav-link">Home Demo - 2</a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  Event <i class="fa-solid fa-chevron-down" />
                </a>
                <ul class="dropdown-menu">
                  <li class="nav-item">
                    <a href="/event" class="nav-link">Event</a>
                  </li>
                  <li class="nav-item">
                    <a href="/event/details/1" class="nav-link">Event Details</a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="/event/map" class="nav-link">Event Map</a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  Pages <i class="fa-solid fa-chevron-down" />
                </a>
                <ul class="dropdown-menu">
                  <li class="nav-item">
                    <a href="/speaker" class="nav-link">Speaker</a>
                  </li>
                  <li class="nav-item">
                    <a href="/speaker/details" class="nav-link"
                      >Speaker Details</a
                    >
                  </li>
                  <li class="nav-item">
                    <a href="/event" class="nav-link">Participants</a>
                  </li>
                  <!-- <li class="nav-item">
                                            <a href="pricing.html" class="nav-link ">Pricing</a>
                                        </li> -->
                </ul>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  Blog <i class="fa-solid fa-chevron-down" />
                </a>
                <ul class="dropdown-menu">
                  <li class="nav-item">
                    <a href="/blog" class="nav-link">Blog</a>
                  </li>
                  <li class="nav-item">
                    <a href="/blog/details/1" class="nav-link">Blog Details</a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a href="/contact" class="nav-link">Contact</a>
              </li>
            </ul>
            <!--/.navbar-nav -->
            <div class="others-options d-flex align-items-center">
              <div class="option-item">
                <a class="opt" href="#search"
                  ><i class="fa-solid fa-search" /></a
                >
              </div>
              <div class="option-item d-none d-xl-inline-block">
                <a href="/event/eventsList" class="btn btn1">Participate</a>
              </div>
            </div>
            <!--/.others-options-->
          </div>
        </nav>
        <!--/.navbar-->
      </div>
    </div>
  </div>
</header>

<style>
  .header-style-1 {
    position: absolute;
    top: 25px;
    left: 0;
    width: 100%;
    z-index: 12;
  }
  .header-style-1 .navbar {
    background-color: rgba(0, 0, 0, 0.6);
    background: -o-linear-gradient(
      339.38deg,
      rgba(0, 0, 0, 0.6) 6.39%,
      rgba(0, 0, 0, 0.6) 53.34%
    );
    background: linear-gradient(
      110.62deg,
      rgba(0, 0, 0, 0.6) 6.39%,
      rgba(0, 0, 0, 0.6) 53.34%
    );
    mix-blend-mode: normal;
    -webkit-backdrop-filter: blur(7.38235px);
    backdrop-filter: blur(7.38235px);
    padding: 25px 30px;
    border-radius: 500px;
  }

  .main-responsive-nav {
    display: none;
  }

  .navbar-nav .nav-item {
    position: relative;
    margin-left: 15px;
    margin-right: 15px;
  }

  @media (min-width: 992px) {
    .navbar-nav .nav-item .dropdown-menu {
      border: none;
      top: 65px;
      left: 0;
      z-index: 1050;
      opacity: 0;
      width: 250px;
      display: inline-block;
      border-radius: 0;
      padding: 10px 0;
      position: absolute;
      visibility: hidden;
      -webkit-box-shadow: rgba(17, 17, 26, 0.1) 0 0 16px;
      box-shadow: rgba(17, 17, 26, 0.1) 0 0 16px;
      background-color: var(--clr-common-black-deep);
      -webkit-transition: all ease 0.8s;
      transition: all ease 0.8s;
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
      -webkit-transform: rotateX(-90deg);
      transform: rotateX(-90deg);
    }
    .navbar-nav .nav-item .dropdown-menu li:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      -webkit-transform: rotateX(0);
      transform: rotateX(0);
    }
    .navbar-nav .nav-item:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      -webkit-transform: rotateX(0);
      transform: rotateX(0);
    }
  }

  .main-navbar {
    position: relative;
    z-index: 1;
  }

  .navbar {
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .navbar-brand {
    margin: 0;
    padding: 0;
    max-height: 70px;
  }

  .navbar-brand img {
    max-height: 70px;
    display: block;
  }

  .navbar-expand-md .navbar-nav .nav-link {
    padding: 0;
    margin: 0;
    font-weight: 400;
    font-size: 16px;
    line-height: 21px;
    color: var(--clr-common-white);
  }
  .navbar-expand-md .navbar-nav .nav-link i {
    font-size: 12px;
    margin-left: 4px;
  }
  .navbar-expand-md .navbar-nav .nav-link.active {
    color: var(--clr-theme-secondary);
  }

  .navbar-nav .nav-item .dropdown-menu {
    top: 35px;
  }

  .navbar-nav .nav-item .dropdown-menu .nav-item {
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .navbar-expand-md .navbar-nav .nav-link:hover {
    color: var(--clr-theme-secondary);
  }
  .mean-container .mean-nav ul li a.active {
    color: var(--clr-theme-primary);
  }

  .others-options .btn i {
    vertical-align: middle;
    font-size: 21px;
    line-height: 21px;
  }

  .others-options {
    margin-left: 35px;
  }
  .others-options .option-item {
    margin-left: 20px;
  }

  .others-options .option-item .opt {
    display: inline-block;
    width: 56px;
    height: 56px;
    border: 0;
    border-radius: 5px;
    text-align: center;
    line-height: 56px;
    position: relative;
    background-color: var(--clr-theme-secondary);
    font-size: 20px;
    color: var(--clr-common-white);
    border-radius: 50%;
  }
  .others-options .option-item .btn {
    padding: 19px 37px;
    max-height: 56px;
  }

  @media (max-width: 1280px) {
    .others-options {
      margin-left: 10px;
    }
    .navbar-nav .nav-item {
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  @media only screen and (max-width: 991px) {
    .main-responsive-nav {
      display: block;
    }

    .header-style-1 {
      top: 5px;
    }
    .main-responsive-nav .main-responsive-menu {
      position: relative;
      background-color: rgba(0, 0, 0, 0.6);
      background: -o-linear-gradient(
        339.38deg,
        rgba(0, 0, 0, 0.6) 6.39%,
        rgba(0, 0, 0, 0.6) 53.34%
      );
      background: linear-gradient(
        110.62deg,
        rgba(0, 0, 0, 0.6) 6.39%,
        rgba(0, 0, 0, 0.6) 53.34%
      );
      mix-blend-mode: normal;
      -webkit-backdrop-filter: blur(7.38235px);
      backdrop-filter: blur(7.38235px);
      padding: 25px 0;
      border-radius: 500px;
    }
    .main-responsive-nav .logo {
      padding-left: 25px;
    }

    .main-navbar {
      display: none;
    }
    .main-responsive-nav .logo {
      position: relative;
      z-index: 999;
      max-width: 50%;
    }

    .others-options .option-item {
      margin-left: 0;
    }

    .main-responsive-nav .logo a {
      display: inline-block;
    }

    .main-responsive-nav .logo img {
      vertical-align: middle;
      max-height: 60px;
    }

    .navbar-nav .nav-item {
      margin: 0;
    }

    .mean-container .mean-nav ul li a i {
      display: none;
    }

    .navbar-nav .nav-item .dropdown-menu .nav-item {
      padding: 0;
    }

    .others-options .option-item .opt {
      height: 46px;
      font-size: 16px;
      width: 46px;
      line-height: 46px;
    }
    .others-options .option-item .btn {
      max-height: 46px;
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
  @media (max-width: 350px) {
    .main-responsive-nav .main-responsive-menu {
      padding: 0;
      background: transparent;
    }
    .others-options .option-item .opt {
      display: none;
    }
    .main-responsive-nav .logo {
      padding-left: 0;
    }

    .main-responsive-nav {
      padding-top: 20px;
    }
  }
</style>
