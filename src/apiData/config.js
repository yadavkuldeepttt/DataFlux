export default {
  jo: "",
  objDetails: {
    name: "Sachtak.com",
    logo: "/logo.png",
    title: "",
    email: "support@sachtak.com",
    api: "https://a.sachtak.com",
    basePath: "http://localhost:3006", // Update the base path to your mock API server
    baseUrl:"http://localhost:4000",
    cfx: "a",
    address: "Vrundavan Residency Motera 380005",
    city: "Motera, Ahmedabad",
    mapId: "https://maps.app.goo.gl/9Y5m2HS5PASjD1RK8",
    coOrdinates: [
      {
        yCoordinate: "23.099819120460275",
        xCoordinate: "72.60359050995487",
      },
    ],
    aboutUs: [],
    contact: "+916355467525",
  },
  branches: [
    {
      jo: "",
      name: "",
      address: "",
      contact: "",
      email: "",
    },
  ],

  menu: [
    {
      name: "Home",
      icon: "bx bxs-home",
      link: "/",
      color: "text-primary",
    },
    {
      name: "About Us",
      icon: "bx bx-world",
      link: "/aboutUs",
      color: "text-warning",
    },

    {
      name: "Internship",
      icon: "bx bxs-dashboard",
      link: "",
      color: "text-danger",
      submenu: [
        {
          name: "Internships",
          icon: "bx bxs-castle",
          link: "/internships",
          color: "text-success",
        },
        {
          name: "Apply",
          icon: "bx bxs-detail",
          link: "/internshipDetails/1/apply",
          color: "text-info",
        },
      ],
    },
    {
      name: "Companies",
      icon: "bx bx-world",
      link: "",
      color: "text-secondary",
      submenu: [
        {
          name: "Hire",
          icon: "bx bxs-castle",
          link: "/companies/hire",
          color: "text-danger",
        },
      ],
    },
    {
      name: "Contest",
      icon: "bx bx-world",
      link: "/contest",
      color: "text-danger",
    },
    {
      name: "Contact Us",
      icon: "bx bx-world",
      link: "/contactUs",
      color: "text-info",
    },
    {
      name: "Case",
      icon: "bx bxs-detail",
      link: "/case",
      color: "text-warning",
    },
    {
      name: "Videos",
      icon: "bx bxs-tv",
      link: "/videos",
      color: "text-secondary",
    },
    {
      name: "Message",
      icon: "bx bxs-detail",
      link: "/message",
      color: "text-primary",
    },
    {
      name: "Preferences",
      icon: "bx bxs-detail",
      link: "/preferences",
      color: "text-warning",
    },
    {
      name: "Courses",
      icon: "bx bxs-dashboard",
      link: "/courses",
      color: "text-danger",
    },
    {
      name: "Contest",
      icon: "bx bx-world",
      link: "/contest",
      color: "text-warning",
    },

    {
      name: "Coworking-space",
      icon: "bx bx-collection",
      link: "/coworkingSpace",
      color: "text-success",
    },
    {
      name: "Weather",
      icon: "bx bxs-cloud-lightning",
      link: "/weather",
      color: "text-info",
    },
    {
      name: "No olympics",
      icon: "bx bx-world",
      link: "/noOlympics",
      color: "text-danger",
    },
    {
      name: "Environment",
      icon: "bx bxs-cloud-lightning",
      link: "/environment",
      color: "text-warning",
    },
    {
      name: "No Food Adulteration",
      icon: "bx bxs-detail",
      link: "/noFoodAdulteration",
      color: "text-primary",
    },
  ],
  liveVideo: [
    {
      id: "1",
      link: "https://www.youtube.com/embed/l5BgMKfOV7Y?si=Q1bqgOpEGDyCwG-U",
    },
  ],
  // description : [
  //   { name: 'News', link: '/aboutUs' },
  //   { name: 'Market', link: '/detail' },
  //   { name: 'Petrol', link: '/gold' },
  //   { name: 'Elections', link: '/detail' },
  //   { name: 'Gold/Silver', link: '/src/components/svelte' },
  //   { name: 'Sport', link: '/detail' },
  //   { name: 'Weather', link: '/src/components/homepagedata/weather.svelte' },
  // ]
};
