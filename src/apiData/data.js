const colors = ["tomato", "gold", "lime green"];

export const visits = {
  title: "Unique visitors",
  type: "line",
  backgroundColor: colors[0],
  labels: ["January", "February", "March", "April", "May", "June"],
  data: [275, 254, 261, 279, 262, 268]
};

export const pages = {
  title: "Top pages",
  type: "bar",
  backgroundColor: colors[0],
  labels: ["/gallery", "/blog", "/about", "/pricing", "/contact"],
  data: [220, 176, 132, 88, 44]
};

export const referrers = {
  title: "Top referrers",
  type: "bar",
  backgroundColor: colors[0],
  labels: ["google", "twitter", "facebook", "linkedin", "dev.to"],
  data: [23, 14, 6, 5, 2]
};

export const os = {
  title: "OS usage",
  type: "doughnut",
  backgroundColor: colors,
  labels: ["Win", "MacOS", "Linux"],
  data: [400, 100, 200]
};

export const browsers = {
  title: "Browser usage",
  type: "doughnut",
  backgroundColor: colors,
  labels: ["Chrome", "Firefox", "Safari"],
  data: [240, 100, 60]
};

export const devices = {
  title: "Device usage",
  type: "doughnut",
  backgroundColor: colors,
  labels: ["Phone", "Desktop"],
  data: [220, 260]
};




export const videoList = [
  {
    id:'1',
    name: 'video1',
    youtubeId:'UQwAne6kvOE',
    link: 'https://www.youtube.com/embed/UQwAne6kvOE?si=414pifFEF5ZeCpKn',
    thumbnail:'https://img.youtube.com/vi/UQwAne6kvOE/0.jpg',
  },
  {
    id:'2',
    name: "video2",
    youtubeId:'mnHqdg9xWYQ',
    link: 'https://www.youtube.com/embed/mnHqdg9xWYQ?si=z7AQH8pX1szLIqih',   
    thumbnail:'https://img.youtube.com/vi/mnHqdg9xWYQ/0.jpg',
  },
  
  {
    id:'3',
    name: 'video3',
    link: '',
    thumbnail:'https://c.sachtak.com/images/web/3.jpg',
  },
  
]

export const jobs = [
  {
      id: 1,
      logo: "https://placehold.co/80x80",
      jobPost: "Software Engineer",
      companyName: "ABC Company",
      location: "New York, USA",
      jobType: "Full Time",
      salary: "$123-$456",
      date: "01 Jan, 2045",
    },
  {
      id: 2,
      logo: "https://placehold.co/80x80",
      companyName: "ABC Company",
      jobPost: "Marketing Engineer",
      location: "New York, USA",
      jobType: "Full Time",
      salary: "$123-$456",
      date: "01 Jan, 2045",
    },
  {
      id: 3,
      logo: "https://placehold.co/80x80",
      companyName: "ABC Company",
      jobPost: "SQl Developer",
      location: "New York, USA",
      jobType: "Part Time",
      salary: "$123-$456",
      date: "01 Jan, 2045",
    },
  {
      id: 4,
      logo: "https://placehold.co/80x80",
      jobPost: "Full Stack Engineer",
      companyName: "ABC Company",
      location: "New York, USA",
      jobType: "Full Time",
      salary: "$123-$456",
      date: "01 Jan, 2045",
    },
];
