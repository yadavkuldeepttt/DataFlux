/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        "bs-danger": "#dc3545",
        "hover-danger": "#d91427",
        "checked-color": "#ff0000",
        "checked-green": "#008000",
        "checked-violet":"rgb(124, 58, 237)",
        "orange-7": "#c9571b",
        "orange-1":"#fdede4"
      },
       screens: {
        sm: { 'max': '600px' },
         md: { 'max': '1020px' },
         lg: { 'min':'1021px', 'max': '1290px' },
         xl: { 'max':'1500px'},
        
      },
    },
  },
  plugins: [
    // require("flowbite/plugin"),
     require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          ".adds": {
            "background-color": "white !important",
            color: "black !important",
          },
          ".problem-box": {
            "background-color": "#fff !important",
          },

          ".bg-danger": {
            "background-color": "red !important",
          },
          ".bottom": {
            "background-color": "white !important",
          },
          ".btn_theme": {
            "background-color": "#1d4ed8",
          },
          ".btnsubscribe": {
            "background-color": "#FFE9DF !important",
            color: "black",
          },
          ".buttons": {
            "background-color": "#F3F3F4 !important",
            border: "1px solid #754737",
            "border-radius": "10px",
            color: "black !important",
          },
          ".carouselcard": {
            "background-color": "white !important",
            "border-bottom": "4px solid #3F83F8 !important",
          },
          ".carouselcardcontent": {
            color: "black !important",
            fill: "black !important",
          },
          ".carouselcardcontenp": {
            color: "black !important",
          },
          ".carouselresponsive a": {
            "background-color": "white !important",
            color: "black !important",
          },
          ".footerpart": {
            "background-color": "#FFE9DF !important",
          },
          ".hamburger": {
            color: "black",
          },
          ".hed-panel-common h2": {
            color: "black",
          },
          ".hm-stoy-left-body h2": {
            color: "black",
          },
          ".jobs table, th, td": {
            border: "1px solid gray",
            color: "black",
          },
          ".logos": {
            "background-color": "white !important",
          },
          ".mid-nav": {
            "background-color": "white !important",
          },
          ".player-slider-rr li": {
            "background-color": "#ebf8ff !important",
          },
          ".rightnav i, p": {
            color: "black",
            fill: "black",
          },
          ".sidebar-close-btn": {
            "background-color": "white !important",
          },
          ".sidebar-content": {
            "background-color": "white !important",
          },
          ".sidebar-content a, div": {
            color: "black",
          },
          ".sidebar-top": {
            "background-color": "white !important",
          },
          ".signin": {
            "background-color": "red !important",
            color: "white",
          },
          ".sub": {
            "background-color": "red !important",
            color: "white !important",
          },
          ".tab0": {
            "background-color": "#F05252 !important",
            border: "1px solid #E1E5E8 !important",
          },
          ".tab1": {
            border: "1px solid #E1E5E8 !important",
          },
          ".theme": {
            "background-color": "#fafafa!important",
            color: "#333",
          },
          ".verticleccarousel": {
            "background-color": "white !important",
            "--scrollbar-color": "#FF0000 !important",
          },
          ".verticleccarousel a": {
            "background-color": "white !important",
            color: "black !important",
          },
          ".verticleccarousel svg, time": {
            fill: "blue !important",
            color: "#0F172A !important",
          },
        },
        retro: {
          ...require("daisyui/src/theming/themes")["retro"],
          ".adds": {
            "background-color": "#E4D8B4 !important",
            color: "white !important",
          },

          ".problem-box": {
            "background-color": "#ECE6C2 !important",
            color: "#333!important",
          },
          ".avtar": {
            border: "5px solid #edbaa7 !important",
          },
          ".bg-danger": {
            "background-color": "#754737 !important",
          },
          ".bg-gray-50": {
            "background-color": "#ECE6C2",
            color: "#333",
          },
          ".bg-gray-100": {
            "background-color": "#ECE6C2",
          },
          ".bg-slate-100": {
            "background-color": "#6F5643",
            color: "#fff",
          },
          ".bottom": {
            "background-color": "#E4D8B4 !important",
          },
          ".btn_theme": {
            "background-color": "#CC6B49",
          },
          ".btnsubscribe": {
            "background-color": "#244856 !important",
            color: "white !important",
          },
          ".buttons": {
            "background-color": "#EF7E54 !important",
            border: "1px solid #754737",
            "border-radius": "10px",
            color: "white !important",
          },
          ".carouselcard": {
            "background-color": "#E4D8B4 !important",
            "border-bottom": "4px solid brown !important",
          },
          ".carouselcardcontent": {
            color: "#6B7283 !important",
            fill: "#6B7283 !important",
          },
          ".carouselcardcontenp": {
            color: "#754737 !important",
          },
          ".carouselresponsive a": {
            "background-color": "#EF7E54 !important",
            color: "white !important",
          },
          ".footerpart": {
            "background-color": "#E4D8B4 !important",
          },
          ".hamburger": {
            color: "#754737",
          },
          ".hed-panel-common h2": {
            color: "black",
          },
          ".hm-stoy-left-body h2": {
            color: "black",
          },
          ".jobs table, th, td": {
            border: "1px solid #EF7E54",
            color: "black",
          },
          ".logos": {
            "background-color": "#E4D8B4 !important",
          },
          ".menu_button": {
            "background-color": "#ECE6C2",
          },
          ".message_icons .text-gray-600": {
            color: "#fff",
          },
          ".mid-nav": {
            "background-color": "#ECE6C2 !important",
          },
          ".parent": {
            "background-color": "#ECE6C2 !important",
          },
          ".player-sec svg": {
            fill: "#754737",
          },
          ".player-slider-rr li": {
            "background-color": "#E4D8B4 !important",
          },
          ".rightnav i, p": {
            color: "black",
            fill: "black",
          },
          ".sidebar-close-btn": {
            "background-color": "#ECE6C2 !important",
          },
          ".sidebar-content": {
            "background-color": "#ECE6C2 !important",
          },
          ".sidebar-content a, div": {
            color: "black",
          },
          ".sidebar-multi": {
            "background-color": "#ECE6C2",
          },
          ".sidebar-top": {
            "background-color": "#ECE6C2 !important",
          },
          ".signin": {
            "background-color": "#EF7E54 !important",
          },
          ".sub": {
            "background-color": "#244856 !important",
            color: "white !important",
          },
          ".tab0": {
            "background-color": "#EF7E54 !important",
            border: "1px solid #754737 !important",
          },
          ".tab1": {
            border: "1px solid #754737 !important",
          },
          ".verticleccarousel": {
            "background-color": "#E4D8B4 !important",
            "--scrollbar-color": "#A52A2A !important",
          },
          ".verticleccarousel a": {
            "background-color": "#EF7E54 !important",
            color: "white !important",
          },
          ".verticleccarousel svg, time": {
            fill: "#754737 !important",
            color: "#754737 !important",
          },
        },
        aqua: {
          ...require("daisyui/src/theming/themes")["retro"],
          ".bg-gray-50": {
            "background-color": "#ECE6C2",
            color: "#333",
          },
          ".bg-gray-100": {
            "background-color": "#ECE6C2",
          },
          ".bg-slate-100": {
            "background-color": "#6F5643",
            color: "#fff",
          },

          ".btn_theme": {
            "background-color": "#CC6B49",
          },
          ".carouselcardcontent": {
            color: "#6B7283 !important",
            fill: "#6B7283 !important",
          },
          ".message_icons .text-gray-600": {
            color: "#fff",
          },
          ".menu_button": {
            "background-color": "#ECE6C2",
          },
          ".navbar_theme": {
            "background-color": "#ECE6C2",
          },
          ".sidebar-multi": {
            "background-color": "#ECE6C2",
          },
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          ".adds": {
            "background-color": "#0F172A !important",
          },

          ".problem-box": {
            "background-color": "rgb(30 41 59)",
            color: "#fff!important",
          },
          ".problem-list .bg-slate-100": {
            "background-color": "rgb(51 65 85)",
            color: "#fff!important",
          },
          ".bg-danger": {
            "background-color": "black !important",
          },
          ".bottom": {
            "background-color": "#0F172A !important",
          },
          ".btn_theme": {
            "background-color": "#1d4ed8",
          },
          ".btnsubscribe": {
            "background-color": "#FFDF00 !important",
            color: "#0F172A !important",
          },
          ".buttons": {
            "background-color": "#03DAC6 !important",
            border: "1px solid #754737",
            "border-radius": "10px",
            color: "white !important",
          },
          ".carouselcard": {
            "background-color": "#73BDA8 !important",
            "border-bottom": "4px solid #0F172A !important",
          },
          ".carouselcardcontent": {
            color: "white !important",
            fill: "white !important",
          },
          ".carouselresponsive a": {
            "background-color": "#03DAC6 !important",
            color: "white !important",
          },
          ".footerpart": {
            "background-color": "#73BDA8 !important",
          },
          ".hamburger": {
            color: "white",
          },
          ".hed-panel-common h2": {
            color: "white",
          },
          ".hm-stoy-left-body h2": {
            color: "white",
          },
          ".jobs table, th, td": {
            border: "1px solid white",
            color: "white",
          },
          ".logos,.top-nav": {
            "background-color": "#73BDA8 !important",
          },
          ".mid-nav": {
            "background-color": "rgb(15 23 42) !important",
          },
          ".navbar_theme": {
            "background-color": "#ECE6C2",
          },
          ".player-slider-rr li": {
            "background-color": "#0F172A !important",
          },
          ".rightnav i, p": {
            color: "white",
            fill: "white",
          },
          ".sidebar-close-btn": {
            "background-color": "#0F172A !important",
          },
          ".sidebar-content": {
            "background-color": "rgb(15 23 42) !important",
          },
          ".sidebar-content a, div": {
            color: "white",
          },
          ".sidebar-multi": {
            "background-color": "#ECE6C2",
          },
          ".sidebar-top": {
            "background-color": "rgb(15 23 42) !important",
          },
          ".signin": {
            "background-color": "#03DAC6 !important",
            color: "white",
          },
          ".sub": {
            "background-color": "#FFDF00 !important",
            color: "#0F172A !important",
          },
          ".tab0": {
            "background-color": "#03DAC6 !important",
            border: "1px solid white !important",
          },
          ".tab1": {
            border: "1px solid #fafafa !important",
          },
          ".verticleccarousel": {
            "background-color": "#73BDA8 !important",
            "--scrollbar-color": "white !important",
          },
          ".verticleccarousel a": {
            "background-color": "#03DAC6 !important",
            color: "black !important",
          },
          ".verticleccarousel svg, time": {
            fill: "#0F172A !important",
            color: "#0F172A !important",
          },
          ".bg-slate-100": {
            "background-color": "rgb(30 41 59)",
          },
          ".bg-gray-50,.bg-slate-50": {
            "background-color": "rgb(15 23 42)",
            color: "#fff",
          },
          ".bg-gray-200,.bg-gray-100,.bg-slate-200": {
            "background-color": "rgb(51 65 85)",
            color: "#fff",
          },
          ".bg-green-100": {
            "background-color": "rgb(224 242 254);",
          },
          ".bg-green-200": {
            "background-color": "rgb(186 230 253)",
          },
          ".bg-green-600": {
            "background-color": "rgb(2 132 199)",
          },

          ".text-gray-900,.bg-slate-100, .text-gray-600": {
            color: "#fff",
          },

          ".border-gray-200": {
            border: "0px solid rgb(15 23 42)!important",
          },
        },
      },
    ],
  },
};
