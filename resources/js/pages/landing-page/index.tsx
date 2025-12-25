import React, { useEffect, useState } from 'react';

export default function Landing() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // @ts-ignore
        window.WOW && new window.WOW().init();
        // @ts-ignore
        window.Splitting && window.Splitting();
    }, []);

    /* -------------------------------
     Helper to load CSS dynamically
  -------------------------------- */
    const loadCss = (href: string) => {
        if (document.querySelector(`link[href="${href}"]`)) return null;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
        return link;
    };

    /* -------------------------------
     Load THEME CSS (Landing only)
  -------------------------------- */
    useEffect(() => {
        const base = (window as any).baseUrl || '';

        const cssFiles = [
            `${base}/assets/css/bootstrap.min.css`,
            `${base}/assets/css/fontawesome-free.css`,
            `${base}/assets/css/fontawesome.css`,
            `${base}/assets/css/flaticon-business.css`,
            `${base}/assets/css/linear.css`,
            `${base}/assets/css/animate.css`,
            `${base}/assets/css/jquery.fancybox.min.css`,
            `${base}/assets/css/nice-select.css`,
            `${base}/assets/css/flatpickr.min.css`,
            `${base}/assets/css/slick.css`,
            `${base}/assets/css/slick-theme.css`,
            `${base}/assets/css/swiper.min.css`,
            `${base}/assets/css/tm-bs-mp.css`,
            `${base}/assets/css/tm-utility-classes.css`,
            `${base}/assets/css/style.css`,
        ];

        let loadedCount = 0;

        cssFiles.forEach((href) => {
            if (document.querySelector(`link[href="${href}"]`)) {
                loadedCount++;
                if (loadedCount === cssFiles.length) setIsLoading(false);
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;

            link.onload = () => {
                loadedCount++;
                if (loadedCount === cssFiles.length) {
                    setTimeout(() => setIsLoading(false), 500); // smooth exit
                }
            };

            document.head.appendChild(link);
        });
    }, []);

    // Load external scripts
    React.useEffect(() => {
        const base = (window as any).baseUrl;

        const scripts = [
            `${base}/assets/js/popper.min.js`,
            `${base}/assets/js/bootstrap.min.js`,

            `${base}/assets/js/wow.js`,
            `${base}/assets/js/jquery.fancybox.js`,
            `${base}/assets/js/nice-select.min.js`,
            `${base}/assets/js/flatpickr.js`,

            `${base}/assets/js/slick.min.js`,
            `${base}/assets/js/swiper.min.js`,

            `${base}/assets/js/gsap.min.js`,
            `${base}/assets/js/ScrollTrigger.min.js`,
            `${base}/assets/js/SplitText.min.js`,

            `${base}/assets/js/vanilla-tilt.js`,
            `${base}/assets/js/parallax.js`,
            `${base}/assets/js/mixitup.js`,
            `${base}/assets/js/knob.js`,

            `${base}/assets/js/script.js`, // MAIN THEME FILE
        ];

        const loadedScripts: HTMLScriptElement[] = [];

        scripts.forEach((src) => {
            if (!document.querySelector(`script[src="${src}"]`)) {
                const script = document.createElement('script');
                script.src = src;
                script.async = false;
                document.body.appendChild(script);
                loadedScripts.push(script);
            }
        });

        return () => {
            loadedScripts.forEach((script) => script.remove());
        };
    }, []);

    return (
        <>
        { isLoading && <div className="preloader"></div>}

        {!isLoading &&
          (
          <>
             {/* ENTIRE LANDING PAGE CONTENT */}
            <header className="main-header header-style-four">
              {/* <!-- Main box --> */}
              <div className="main-box">
                <div className="mobile-nav-toggler">
                  <i className="icon lnr-icon-bars"></i>Menu
                </div>
                <div className="logo-box">
                  <div className="logo">
                    <a href="/" title="">
                      <img src="assets/logos/vl_logo.svg" alt="" title="VL HRM" />
                    </a>
                  </div>
                </div>
                {/* <!--Nav Box--> */}
                <div className="nav-outer">
                  <nav className="nav main-menu">
                    <ul className="navigation onepage-nav">
                      <li>
                        <a href="#home">Home</a>
                      </li>
                      <li>
                        <a href="#about">About</a>
                      </li>
                      <li>
                        <a href="#service">Services</a>
                      </li>
                      <li>
                        <a href="#testimonial">Testimonial</a>
                      </li>
                      <li>
                        <a href="#news">FAQ</a>
                      </li>
                      <li>
                        <a href="#contacts">Contact</a>
                      </li>
                    </ul>{' '}
                  </nav>
                  {/* <!-- Main Menu End--> */}
                </div>
                <div className="outer-box">
                  <div className="info-box">
                    <div className="call-info">
                      <i className="fa-solid fa-phone ring__animation"></i>
                      <div>
                        <h6 className="title">Phone:</h6>
                        <a href="#">+61 406 817 182</a>
                      </div>
                    </div>
                     <a className="btn-one-rounded wow fadeInUp" style={{ marginRight: '10px' }} href={route('login')}>
                                        Login
                      </a>
                  </div>
                  {/* <!-- Mobile Nav toggler --> */}
                </div>
              </div>
              <div className="auto-container">
                {/* <!-- Mobile Menu  --> */}
                <div className="mobile-menu">
                  <div className="menu-backdrop"></div>
                  {/*Here Menu Will Come Automatically Via Javascript / Same Menu as in Header*/}
                  <nav className="menu-box">
                    <div className="upper-box">
                      <div className="nav-logo">
                        <a href="index-2.html">
                          <img src="assets/logos/vl_logo.svg" alt="" />
                        </a>
                      </div>
                      <div className="close-btn">
                        <i className="icon fa fa-times"></i>
                      </div>
                    </div>
                    <ul className="navigation clearfix">{/* <!--Keep This Empty / Menu will come through Javascript--> */}</ul>
                    <ul className="contact-list-one">
                      <li>
                        {/* <!-- Contact Info Box --> */}
                        <div className="contact-info-box">
                          <i className="icon lnr-icon-phone-handset"></i>
                          <span className="title">Call Now</span>
                          <a href="tel:+61 406 817 182">+61 406 817 182</a>
                        </div>
                      </li>
                      <li>
                        {/* <!-- Contact Info Box --> */}
                        <div className="contact-info-box">
                          <span className="icon lnr-icon-envelope1"></span>
                          <span className="title">Send Email</span>
                          <a href="mailto:hello@vedalogic.com.au">hello@vedalogic.com.au</a>
                        </div>
                      </li>
                      <li>
                        {/* <!-- Contact Info Box --> */}
                        <div className="contact-info-box">
                          <span className="icon lnr-icon-clock"></span>
                          <span className="title">Send Email</span>
                          Mon - Sat 8:00 - 6:30, Sunday - CLOSED
                        </div>
                      </li>
                    </ul>
                    <ul className="social-links">
                      <li>
                        <a href="#">
                          <i className="fab fa-x-twitter"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-pinterest"></i>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fab fa-instagram"></i>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                {/* <!-- End Mobile Menu --> */}
                {/* <!-- Header Search --> */}
                <div className="search-popup">
                  <span className="search-back-drop"></span>
                  <button className="close-search">
                    <span className="fa fa-times"></span>
                  </button>
                  <div className="search-inner">
                    <form action="https://php.kodesolution.com/2025/consultez-php/includes/sendmail.php" method="post">
                      <div className="form-group">
                        <input type="search" name="search-field" value="" placeholder="Search..." />
                        <button type="submit">
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                {/* <!-- End Header Search --> */}

                {/* <!-- Sticky Header  --> */}
                <div className="sticky-header">
                  <div className="auto-container">
                    <div className="inner-container">
                      {/* <!--Logo--> */}
                      <div className="logo">
                        <a href="/" title="">
                          <img src="assets/logos/VL - dark.svg" alt="" title="VL HRM" />
                        </a>
                      </div>
                      {/* <!--Right Col--> */}
                      <div className="nav-outer">
                        {/* <!-- Main Menu --> */}
                        <nav className="main-menu">
                          <div className="navbar-collapse show clearfix collapse">
                            <ul className="navigation clearfix">
                              {/* <!--Keep This Empty / Menu will come through Javascript--> */}
                            </ul>
                          </div>
                        </nav>
                        {/* Main Menu End*/}
                        {/*Mobile Navigation Toggler*/}
                        <div className="mobile-nav-toggler">
                          <span className="icon lnr-icon-bars"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* End Sticky Menu */}
              </div>
            </header>
            <section id="home" className="banner-section-four">
              <div className="sec-shape">
                <img src="assets/images/banner/banner-four-shape.png" alt="Image" />
              </div>
              <div className="bg-shape">
                <img src="assets/images/banner/banner-four-bg-shape.png" alt="Image" />
              </div>
              <div className="container">
                <div className="content-box">
                  <h5 className="title wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                    {' '}
                    All-in-One HRM Solution for a<br />
                    <span>Productive Workforce</span>
                  </h5>
                  <p className="text wow fadeInUp" data-wow-delay="500ms" data-wow-duration="1500ms">
                    Streamline HR operations, automate payroll, track attendance, and manage employees effortlessly from a single platform.
                  </p>
                  <div className="btn-wrp">
                    <a className="btn-one-rounded wow fadeInUp" data-wow-delay="600ms" data-wow-duration="1500ms" href={route('register')}>
                      Get Started
                    </a>
                    <h6 className="btn-title wow fadeInUp" data-wow-delay="700ms" data-wow-duration="1500ms">
                      <a href="https://www.youtube.com/watch?v=Lplq8RjQ0zU" data-fancybox="gallery" data-caption="" className="video-btn">
                        <i className="fa-sharp fa-solid fa-play"></i>
                      </a>
                      Watch Video
                    </h6>
                  </div>
                </div>
              </div>
            </section>
            <div className="banner-hero-four">
              <div className="container">
                <div className="image-box">
                  <div className="swiper banner-slider-four wow fadeInDown" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <figure className="image">
                          <img src="assets/images/banner/HRM Img 2.png" alt="Image" />
                        </figure>
                      </div>
                      <div className="swiper-slide">
                        <figure className="image">
                          <img src="assets/images/banner/HRM Img 3.png" alt="Image" />
                        </figure>
                      </div>
                      <div className="swiper-slide">
                        <figure className="image">
                          <img src="assets/images/banner/banner-four-image2.jpg" alt="Image" />
                        </figure>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="arry-btn banner-slider-four-prev">
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <button className="arry-btn banner-slider-four-next">
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="brand-section-two pt-60">
              <div className="container">
                <div className="outer-box">
                  <div className="swiper brand-slider">
                    <div className="swiper-wrapper">
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image1.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image2.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image3.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image4.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image5.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image1.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image2.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image3.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image4.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                      <div className="swiper-slide">
                        <div className="brand-block">
                          <a href="#">
                            <img src="assets/images/brand/brand-two-image5.png" alt="Image" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section id="about" className="about-section-four paralax__animation pt-120 pb-120">
              <div className="container">
                <div className="row g-5">
                  <div className="col-xl-6 image-column mb-xl-0 mb-5">
                    <div className="inner-column">
                      <div data-depth="0.01" className="image1 overlay-anim">
                        <img src="assets/images/about/about-four-image1.jpg" alt="Image" />
                      </div>
                      <div data-depth="0.03" className="image2 overlay-anim">
                        <img src="assets/images/about/about-four-image2.jpg" alt="Image" />
                      </div>
                      <div className="info" data-tilt data-tilt-max="3">
                        <h2 className="title">
                          5
                          <span>
                            <span>+ </span> Years Experience
                          </span>
                        </h2>
                        <div className="users">
                          <img src="assets/images/about/about-four-users.png" alt="Image" />
                          <span>
                            5k+ Customer
                            <svg width="112" height="3" viewBox="0 0 112 3" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                d="M0.202677 2.53384C37.227 1.53203 74.0387 1.3728 111.037 2.99826C112.33 3.05797 112.312 1.5652 111.037 1.49222C74.2779 -0.57775 36.8815 -0.637461 0.202677 2.22202C-0.0631112 2.24192 -0.0719708 2.54047 0.202677 2.53384Z"
                                fill="#C6D936"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 content-column">
                    <div className="inner-column">
                      <div className="sec-title mb-30">
                        <h6 className="sub-title wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                          ABOUT US
                        </h6>
                        <h2 className="title wow splt-txt" data-splitting>
                          VL HRM Solution: Transforming Workforce Management
                        </h2>
                        <p className="text wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                          We are dedicated to helping businesses streamline HR operations and empower employees with smart HR software
                          that makes a difference.
                        </p>
                      </div>
                      <div className="content-box" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                        <div className="item wow fadeInLeft" data-wow-delay="00ms" data-wow-duration="1500ms">
                          <h4 className="sub-title mb-2">
                            <i className="fa-solid fa-check" style={{ color: '#1A4137', marginRight: '8px' }}></i>Our Mission
                          </h4>
                          <p className="text">
                            Redefine HR management by providing simple, scalable, and intelligent solutions that save time and boost
                            productivity.
                          </p>
                        </div>
                        <div className="item wow fadeInLeft" data-wow-delay="100ms" data-wow-duration="1500ms">
                          <h4 className="sub-title mb-2" style={{ marginTop: '15px' }}>
                            <i className="fa-solid fa-check" style={{ color: '#1A4137', marginRight: '8px' }}></i>Our Values
                          </h4>
                          <p className="text">
                            Innovation, integrity, and inclusivity ensure businesses and employees thrive together.
                          </p>
                        </div>
                        <div className="item wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                          <h4 className="sub-title mb-2" style={{ marginTop: '15px' }}>
                            <i className="fa-solid fa-check" style={{ color: '#1A4137', marginRight: '8px' }}></i>Our Commitment
                          </h4>
                          <p className="text">
                            Deliver secure, scalable, and user-friendly HR solutions with outstanding customer support.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="service" className="service-section-four pt-120 pb-120">
              <div className="sec-shape">
                <img src="assets/images/shape/service-four-shape.png" alt="Image" />
              </div>
              <div className="container">
                <div className="row g-5">
                  <div className="col-lg-6 content-column">
                    <div className="inner-column">
                      <div className="sec-title mb-30">
                        <h6 className="sub-title wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                          Terms of Service
                        </h6>
                        <h2 className="title wow splt-txt" data-splitting>
                          VL HRM Platform Terms & Conditions
                        </h2>
                        <p className="text wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                          Please read these terms carefully before using our VL HRM platform. By accessing or using our services, you
                          agree to these terms.
                        </p>
                      </div>
                      <div className="info">
                        <ul className="wow fadeInDown" data-wow-delay="00ms" data-wow-duration="1500ms">
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <h5 className="title">Employee Records & Profile Management</h5>
                          </li>
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <h5 className="title">Attendance & Leave Tracking</h5>
                          </li>
                        </ul>
                        <ul className="wow fadeInDown" data-wow-delay="100ms" data-wow-duration="1500ms">
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <h5 className="title">Payroll & Compensation Management</h5>
                          </li>
                          <li>
                            <i className="fa-solid fa-check"></i>
                            <h5 className="title">Performance Evaluation Tools</h5>
                          </li>
                        </ul>
                      </div>

                      {/* <!-- <a className="btn-one-rounded wow fadeInDown mt-40" data-wow-delay="200ms" data-wow-duration="1500ms" href="page-services.html">Read Full Terms <i className="fa-regular fa-angle-right"></i></a> --> */}
                    </div>
                  </div>
                  <div className="col-lg-6 wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                    <div className="service-block-four">
                      <div className="acc" id="customAccordion">
                        {/* <!-- First item (open) --> */}
                        <div className="acc-item active">
                          <h2 className="acc-header">
                            <button className="acc-btn" type="button">
                              <span className="content-box">
                                <span className="icon">
                                  <img src="assets/icons/person-setting-icon.svg" alt="icon" />
                                </span>
                                <span className="title">Acceptance of Terms</span>
                              </span>
                              <span className="number">01</span>
                            </button>
                          </h2>
                          <div className="acc-collapse show">
                            <div className="acc-body">
                              <p className="text">
                                By creating an account or using our VL HRM product, you confirm that you have read, understood,
                                and agree to be bound by these Terms of Service. If you do not agree, you may not use the
                                platform.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Second item (closed) --> */}
                        <div className="acc-item">
                          <h2 className="acc-header">
                            <button className="acc-btn" type="button">
                              <span className="content-box">
                                <span className="icon">
                                  <img src="assets/icons/note-icon.svg" alt="icon" />
                                </span>
                                <span className="title">Service Description</span>
                              </span>
                              <span className="number">02</span>
                            </button>
                          </h2>
                          <div className="acc-collapse" style={{ display: 'none' }}>
                            <div className="acc-body">
                              <p className="text">
                                Our platform provides businesses with Human Resource Management solutions, including but not
                                limited to employee records, attendance tracking, payroll management, performance evaluations, and
                                comprehensive analytics.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Third item (closed) --> */}
                        <div className="acc-item">
                          <h2 className="acc-header">
                            <button className="acc-btn" type="button">
                              <span className="content-box">
                                <span className="icon">
                                  <img src="assets/icons/mic-icon.svg" alt="icon" />
                                </span>
                                <span className="title">User Responsibilities</span>
                              </span>
                              <span className="number">03</span>
                            </button>
                          </h2>
                          <div className="acc-collapse" style={{ display: 'none' }}>
                            <div className="acc-body">
                              <p className="text">
                                You agree to provide accurate information, maintain login confidentiality, ensure uploaded content
                                complies with applicable laws, and use the platform only for lawful HR management purposes.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* <!-- Fourth item (closed) --> */}
                        <div className="acc-item">
                          <h2 className="acc-header">
                            <button className="acc-btn" type="button">
                              <span className="content-box">
                                <span className="icon">
                                  <img src="assets/icons/monitor-icon.svg" alt="icon" />
                                </span>
                                <span className="title">Data & Privacy</span>
                              </span>
                              <span className="number">04</span>
                            </button>
                          </h2>
                          <div className="acc-collapse" style={{ display: 'none' }}>
                            <div className="acc-body">
                              <p className="text">
                                Your data is handled according to our Privacy Policy. You are responsible for safeguarding your
                                account access.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="funfact-section-four">
              <div className="container">
                <div className="row g-5 align-items-center">
                  <div className="col-xl-4">
                    <div className="sec-title">
                      <h2 className="title wow splt-txt" data-splitting>
                        We Help real People do more Business Plan
                      </h2>
                    </div>
                  </div>
                  <div className="col-xl-8">
                    <div className="row g-4">
                      <div className="col-sm-4">
                        <div className="funfact-block-four border-0">
                          <img src="assets/images/shape/funface-four-shape.png" alt="Image" />
                          <h2 className="title">90%</h2>
                          <h5 className="sub-title">Clients Satisfactions</h5>
                        </div>
                      </div>

                      <div className="col-sm-4">
                        <div className="funfact-block-four">
                          <img src="assets/images/shape/funface-four-shape.png" alt="Image" />
                          <h2 className="title">40%</h2>
                          <h5 className="sub-title">Decrease Expense</h5>
                        </div>
                      </div>

                      <div className="col-sm-4">
                        <div className="funfact-block-four">
                          <img src="assets/images/shape/funface-four-shape.png" alt="Image" />
                          <h2 className="title">7k</h2>
                          <h5 className="sub-title">Money Flow Users</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="testimonial" className="testimonial-section-four paralax__animation pt-40">
              <div className="map">
                <img src="assets/images/shape/testimonial-four-map.png" alt="Image" />
              </div>
              <div className="hero-image">
                <img data-depth="0.01" src="assets/images/testimonial/testimonial-four-hero.png" alt="Image" />
              </div>
              <div className="container">
                <div className="outer-box">
                  <div className="testimonial-block-four">
                    <div className="swiper testimonial-slider-four">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <figure className="icon">
                            <img src="assets/images/icon/testimonial-four-icon.png" alt="Icon" />
                          </figure>
                          <p className="text">
                            Ascend the mountain not to plant your flag, but to embrace the challenge, savour the journey, and marvel
                            at the view. Climb to experience the world, not for the world to notice you. This is why they stand out
                            with exceptional
                          </p>
                        </div>
                        <div className="swiper-slide">
                          <figure className="icon">
                            <img src="assets/images/icon/testimonial-four-icon.png" alt="Icon" />
                          </figure>
                          <p className="text">
                            Ascend the mountain not to plant your flag, but to embrace the challenge, savour the journey, and marvel
                            at the view. Climb to experience the world, not for the world to notice you. This is why they stand out
                            with exceptional
                          </p>
                        </div>
                        <div className="swiper-slide">
                          <figure className="icon">
                            <img src="assets/images/icon/testimonial-four-icon.png" alt="Icon" />
                          </figure>
                          <p className="text">
                            Ascend the mountain not to plant your flag, but to embrace the challenge, savour the journey, and marvel
                            at the view. Climb to experience the world, not for the world to notice you. This is why they stand out
                            with exceptional
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="swiper testimonial-slider-thumb-four">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
                          <div className="info">
                            <h4 className="title">Leslie Alexander</h4>
                            <p className="sub-title">Business Owner</p>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="info">
                            <h4 className="title">Robert J. Hare</h4>
                            <p className="sub-title">Sr. Product Manager</p>
                          </div>
                        </div>
                        <div className="swiper-slide">
                          <div className="info">
                            <h4 className="title">Ralph Edwards</h4>
                            <p className="sub-title">CEO & Founder</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section id="news" className="blog-section-four have-padding pt-40">
              <div className="sec-shape">
                <img src="assets/images/shape/blog-four-shape.png" alt="Image" />
              </div>
              <div className="container">
                <div className="sec-title mb-50">
                  <h6 className="sub-title wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                    FAQ
                  </h6>
                  <div className="flex-content">
                    <h2 className="title wow splt-txt" data-splitting>
                      Frequently Asked Questions
                    </h2>
                    <p className="text wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                      Get quick answers to the most common queries about using our VL HRM platform.
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="accordion" id="faqAccordion">
                      <div className="accordion-item wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                            <strong>What is VL HRM?</strong>
                          </button>
                        </h2>
                        <div id="faq1" className="accordion-collapse show collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Our VL HRM is an all-in-one platform designed to manage your employees, payroll, attendance, performance,
                            and leave. It simplifies HR operations and helps businesses run efficiently with comprehensive tools for
                            managing all aspects of human resources.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item wow fadeInUp" data-wow-delay="100ms" data-wow-duration="1500ms">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                            <strong>How do I get started with the platform?</strong>
                          </button>
                        </h2>
                        <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            <p>Follow these simple steps to set up your account:</p>
                            <ul className="faq-list">
                              <li>
                                <i className="fa-solid fa-check"></i> Sign up for an VL HRM account
                              </li>
                              <li>
                                <i className="fa-solid fa-check"></i> Set up your company profile and departments
                              </li>
                              <li>
                                <i className="fa-solid fa-check"></i> Add employees and assign roles
                              </li>
                              <li>
                                <i className="fa-solid fa-check"></i> Configure payroll, attendance, and leave policies
                              </li>
                              <li>
                                <i className="fa-solid fa-check"></i> Start managing HR processes efficiently
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                            <strong>Which plans are available?</strong>
                          </button>
                        </h2>
                        <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            We offer multiple subscription plans including Basic, Professional, and Enterprise options. Each plan is
                            tailored for businesses of all sizes with features designed to meet different organizational needs and
                            growth stages.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item wow fadeInUp" data-wow-delay="300ms" data-wow-duration="1500ms">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                            <strong>Can I customize HR workflows?</strong>
                          </button>
                        </h2>
                        <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Absolutely! You can customize workflows for attendance tracking, leave approvals, performance reviews, and
                            payroll according to your company policies. Our platform is flexible and adapts to your unique business
                            requirements.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item wow fadeInUp" data-wow-delay="400ms" data-wow-duration="1500ms">
                        <h2 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq5">
                            <strong>How can I monitor HR metrics and analytics?</strong>
                          </button>
                        </h2>
                        <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                          <div className="accordion-body">
                            Our analytics dashboard provides real-time insights on employee attendance, payroll reports, performance
                            trends, and leave balances. These comprehensive metrics help you make informed HR decisions and optimize
                            your workforce management strategies.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-50">
                  <div className="col-lg-12 text-center">
                    <p className="text wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                      Still have questions?{' '}
                      <a href="page-contact.html" className="link-color">
                        Contact our support team
                      </a>{' '}
                      for additional assistance.
                    </p>
                  </div>
                </div>
              </div>
            </section>
            <section id="contacts" className="contact-section-four">
              <div className="container">
                <div className="outer-box">
                  <div className="sec-title center mb-50">
                    <h6 className="sub-title wow fadeInUp" data-wow-delay="00ms" data-wow-duration="1500ms">
                      Get in touch
                    </h6>
                    <h2 className="title wow splt-txt" data-splitting>
                      Book A Demo
                    </h2>
                    <p className="text wow fadeInUp" data-wow-delay="200ms" data-wow-duration="1500ms">
                      By submitting this form you are agrecing to our Privacy Policy, <br /> We guarantee not to disclose your information.
                    </p>
                  </div>
                  <div className="contact-block-four">
                    <form
                      id="contact_form"
                      name="contact_form"
                      action="https://php.kodesolution.com/2025/consultez-php/includes/sendmail.php"
                      method="post"
                    >
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="input-feild">
                            <input name="form_name" type="text" placeholder="Your Name" />
                            <div className="icon">
                              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M0.554688 19.25C0.554688 15.384 4.00514 12.25 8.26148 12.25C12.5179 12.25 15.9683 15.384 15.9683 19.25H14.0416C14.0416 16.3505 11.4537 14 8.26148 14C5.06922 14 2.48139 16.3505 2.48139 19.25H0.554688ZM8.26148 11.375C5.06798 11.375 2.48139 9.02563 2.48139 6.125C2.48139 3.22438 5.06798 0.875 8.26148 0.875C11.455 0.875 14.0416 3.22438 14.0416 6.125C14.0416 9.02563 11.455 11.375 8.26148 11.375ZM8.26148 9.625C10.3905 9.625 12.1149 8.05875 12.1149 6.125C12.1149 4.19125 10.3905 2.625 8.26148 2.625C6.13248 2.625 4.40809 4.19125 4.40809 6.125C4.40809 8.05875 6.13248 9.625 8.26148 9.625ZM16.2416 12.865C18.9204 13.9616 20.785 16.408 20.785 19.25H18.8583C18.8583 17.1185 17.4598 15.2837 15.4508 14.4612L16.2416 12.865ZM15.5793 2.98656C17.5042 3.7074 18.8583 5.42816 18.8583 7.4375C18.8583 9.94893 16.743 12.0096 14.0416 12.2304V10.469C15.6761 10.2569 16.9316 8.981 16.9316 7.4375C16.9316 6.22943 16.1625 5.18528 15.0444 4.68681L15.5793 2.98656Z"
                                  fill="#092D3C"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-feild">
                            <input name="form_email" type="text" placeholder="Email Address" />
                            <div className="icon">
                              <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M22.4031 0.875C22.9859 0.875 23.4582 1.30406 23.4582 1.83333V17.173C23.4582 17.6987 22.9778 18.125 22.4118 18.125H3.40273C2.8248 18.125 2.35629 17.6986 2.35629 17.173V16.2083H21.348V4.99583L12.9073 11.8958L2.35629 3.27083V1.83333C2.35629 1.30406 2.82868 0.875 3.41139 0.875H22.4031ZM8.68687 12.375V14.2917H0.246094V12.375H8.68687ZM5.52158 7.58333V9.5H0.246094V7.58333H5.52158ZM20.89 2.79167H4.92454L12.9073 9.31725L20.89 2.79167Z"
                                  fill="#092D3C"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-feild">
                            <input type="text" placeholder="mm/dd/yy" />
                            <div className="icon">
                              <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M6.98874 0.832031V2.4987H12.4936V0.832031H14.3285V2.4987H17.9984C18.5052 2.4987 18.9159 2.8718 18.9159 3.33203V16.6654C18.9159 17.1256 18.5052 17.4987 17.9984 17.4987H1.48388C0.977179 17.4987 0.566406 17.1256 0.566406 16.6654V3.33203C0.566406 2.8718 0.977179 2.4987 1.48388 2.4987H5.15379V0.832031H6.98874ZM17.081 9.16536H2.40136V15.832H17.081V9.16536ZM5.15379 4.16536H2.40136V7.4987H17.081V4.16536H14.3285V5.83203H12.4936V4.16536H6.98874V5.83203H5.15379V4.16536Z"
                                  fill="#092D3C"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="input-feild">
                            <select name="#" id="subject">
                              <option value="0">Select Services</option>
                              <option value="2">UI/UX Design</option>
                              <option value="3">Web Developer</option>
                              <option value="4">Marketing Manager</option>
                              <option value="6">Web Designer</option>
                              <option value="7">Financial Advice</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="input-feild textarea-feild">
                            <textarea name="form_message" placeholder="Write Message"></textarea>
                            <div className="icon">
                              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                  d="M4.20621 14.8885L15.3724 4.7464L13.8154 3.33218L2.64921 13.4743V14.8885H4.20621ZM5.11829 16.8885H0.447266V12.6458L13.0369 1.21086C13.4669 0.820339 14.1639 0.820339 14.5939 1.21086L17.708 4.03929C18.1379 4.42981 18.1379 5.06298 17.708 5.4535L5.11829 16.8885ZM0.447266 18.8885H20.2647V20.8885H0.447266V18.8885Z"
                                  fill="#092D3C"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="text-center">
                            <button className="btn-one mx-auto mt-4" data-animation="fadeInUp" data-delay=".8s">
                              free consultation <i className="fa-solid fa-angle-right ms-2"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="google-map">
                <iframe src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1%20Grafton%20Street,%20Dublin,%20Ireland+(My%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
              </div>
            </section>
            <footer className="main-footer footer-style-four">
              <div className="container">
                <div className="widgets-section">
                  <div className="row g-5 justify-content-between">
                    <div className="col-sm-12 col-lg-5 col-xl-6">
                      <div className="footer-widget about-widget">
                        <h4 className="widget-title wow splt-txt" data-splitting>
                          Subscribe Newsletter
                        </h4>
                        <p className="text wow fadeInUp">
                          We understand that every challenge is an opportunity. We're here to seize it with a team of dedicated
                          professionals and a culture
                        </p>
                        <div className="input-feild">
                          <i className="fa-sharp fa-light fa-envelope"></i>
                          <input type="text" placeholder="Email Address" />
                          <a className="btn-one-rounded" href="#0">
                            Sign Up <i className="fa-regular fa-angle-right"></i>
                          </a>
                        </div>
                        <h5 className="privacy">
                          By subscribing, you’re accept <a href="page-policy.html">Privacy Policy</a>
                        </h5>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-3 col-xl-2">
                      <div className="footer-widget links-widget">
                        <h4 className="widget-title">Quick Links</h4>
                        <div className="widget-content">
                          <ul className="user-links">
                            <li>
                              <a href="#home">Home</a>
                            </li>
                            <li>
                              <a href="#about">About us</a>
                            </li>
                            <li>
                              <a href="#service">Terms of Service</a>
                            </li>
                            <li>
                              <a href="#testimonial">Refund Policy</a>
                            </li>
                            <li>
                              <a href="#news">FAQ</a>
                            </li>
                            <li>
                              <a href="#contacts">Contact Us</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-lg-4 col-xl-3">
                      <div className="footer-widget contact-widget">
                        <h4 className="widget-title">Locations</h4>
                        <div className="widget-content">
                          <h5 className="text">L2 , 700 Swanston St. Carlton, VIC 3053</h5>
                        </div>
                        <h4 className="widget-title mt-30">Contact</h4>
                        <div className="widget-content">
                          <a href="mailto:hello@vedalogic.com.au">hello@vedalogic.com.au</a>
                          <h4 className="nuber">
                            <a href="tel:+61 406817182">+61 406817182</a>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="footer-bottom">
                  <div className="logo">
                    <a href="/">
                      <img src="assets/logos/vl_logo.svg" alt="Logo" />
                    </a>
                  </div>
                  <div className="language">
                    <select name="#" id="language">
                      <option value="1">English (US)</option>
                      <option value="2">English (UK)</option>
                      <option value="3">Bangla (BD)</option>
                    </select>
                  </div>
                  <p className="copyright-text">
                    © 2025 <a href="#0">VL HRM</a> - IT Services. All rights reserved.
                  </p>
                </div>
              </div>

              <div className="sec-shape">
                <img className="animation__rotate" src="images/shape/globe-left.png" alt="Image" />
              </div>
            </footer>
          </>
          )}
        </>
    );
}
