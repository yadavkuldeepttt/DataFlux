

 const eventDetails = [
  {
    id: 1,
    objDetails: {
      name: "Dj mixer Isolated as Gradient in Neon",
      location: "Gurgaon, Haryana India",
      type: "Stand Up Comedy",
      ticketsRemain: "130",
      totalSpeaker: "14",
      time: "March 22, 2023 at 8 P.M",
      duration: "2hrs",
    },
    speakerName: [
      {
        name: "Harish",
        image: "https://placehold.co/100x100",
      },
      {
        name: "Sunny",
        image: "https://placehold.co/100x100",
      },
    ],
    transportDetails: [
      {
        name: "Abc",
        type: "Bus",
        contact: "3843993893",
        address: "Gurgaon sector 12",
        map: "28.47330159585543, 77.02112969759816",
      },
    ],
    images: [
      {
        type: "banner",
        label: "Banner Image",
        src: "https://placehold.co/1325x519",
      },
      {
        type: "gallery",
        label: "Image 1",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 2",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 3",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 4",
        src: "https://placehold.co/400x320",
      },
      {
        type: "icon",
        label: "Icon 1",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 2",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 3",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 4",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 5",
        src: "https://placehold.co/100x100",
      },
    ],

    rateRules: [
      {
        id: "lg2dg10vnpuddt",
        name: "student",
        rules: [
          {
            id: "lg2dg10vnw",
            name: "age",
            op: "lte",
            value: 18,
          },
        ],

        amount: 120,
      },
      {
        id: "lg2dg10vnpudsdt",
        name: "adult",
        rules: [
          {
            id: "lg2dg10vnq",
            name: "age",
            op: "gt",
            value: 18,
          },
        ],

        amount: 150,
      },
      {
        id: "lg2dg10vnd2dsdt",
        name: "default",
        amount: 140,
      },
    ],
  },
  {
    id: 2,
    objDetails: {
      name: "Festival Event",
      location: "Gurgaon, Haryana India",
      type: "Stand Up Comedy",
      ticketsRemain: "130",
      totalSpeaker: "14",
      time: "March 22, 2023 at 8 P.M",
      duration: "2hrs",
    },
    speakerName: [
      {
        name: "Harish",
        image: "https://placehold.co/100x100",
      },
      {
        name: "Sunny",
        image: "https://placehold.co/100x100",
      },
    ],
    transportDetails: [
      {
        name: "Abc",
        type: "Bus",
        contact: "3843993893",
        address: "Gurgaon sector 12",
        map: [
          {
            latitude: "28.47330159585543",
            longitude: "77.02112969759816",
          },
        ],
      },
    ],
    images: [
      {
        type: "banner",
        label: "Banner Image",
        src: "https://placehold.co/1325x519",
      },
      {
        type: "gallery",
        label: "Image 1",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 2",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 3",
        src: "https://placehold.co/400x320",
      },
      {
        type: "gallery",
        label: "Image 4",
        src: "https://placehold.co/400x320",
      },
      {
        type: "icon",
        label: "Icon 1",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 2",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 3",
        src: "https://placehold.co/100x100",
      },
      {
        type: "icon",
        label: "Icon 4",
        src: "https://placehold.co/100x100",
      },
    ],

    rate: [
      {
        name: "student",
        rate: "₹ 200",
      },
      {
        name: "others",
        rate: "₹ 750 onwards",
      },
    ],
  },
];

export function findId(id) {
  const detail = eventDetails.find((event) => 
  {  
    console.log(event.id, "id", id,"sa");
    console.log(event.id == id,"event.id==id");
    return event.id == id
    } 
  );
  return detail;
}