<!-- ContestPage.svelte -->
<script>
const svgSize=20
  </script>
  
<div class="main-container  sm:p-5 sm:ml-20">
    <!-- wether  -->
     <div class="weatherall center-div px-3 py-4 ">

    <!-- TOP -->
    <div class="title  mb-2">
        <div class="wtr_ttl_hdr flex flex-col sm:flex-row justify-between">
            <div class="wtr_ttl_lhs mb-2" >
                <h1 class="text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">Delhi Weather Today <span class="underline underline-offset-3 decoration-2 decoration-blue-400 dark:decoration-blue-600">(Friday, May 24, 2024)</span></h1> 
            </div>
            <div class="wtr_search mb-2 ">
              
         
<form class="flex items-center max-w-sm mx-auto">   
    <label for="simple-search" class="sr-only">Search</label>
    <div class="relative w-full">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          
        </div>
        <input type="text" id="simple-search" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="FInd Your City." requiyellow />
    </div>
    <button type="submit" class="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span class="sr-only"></span>
    </button>
</form>

    
            </div>
        </div>
    </div>

    <!-- custom img -->
<div class=" flex justify-center items-center mb-2" > 
   <div class="con ">
    <div class="grid lg:grid-cols-2 gap-0   ">
        <div class="bg-yellow-300  ">
            <div class="grid grid-cols-2 gap-4 border-1 ">
            <div>
                <div class="font-bold p-2 text-red-900	 ">FRI, MAY 24 07:54 PM IST</div>
                 <div class="	 p-2 gap-0 grid grid-flow-col">
                    <div class=" w-1/2 mx-auto"><img src="https://www.pngfind.com/pngs/m/4-47548_glowing-red-dot-png-circle-transparent-png.png" class="h-10 w-10" alt="img"></div>
                    <div class="text-lg font-bold">Clear</div>
                </div>
    
            </div>
            <div class="p-2 text-6xl font-bold">40°C</div>
          </div></div>
    
          <!--  -->
        <div class="p-1 border-1 bg-gradient-to-l from-indigo-900 to-blue-800">
           <div class="grid grid-rows-2 gap-0">
            <div class="grid  grid-cols-2">
                <div class="bg-gray">  
                    <div class="	 p-2 gap-0 grid grid-flow-col">
                        <div class=" mx-auto"><i class="text-white fa-solid fa-temperature-low"></div>                        <div class="text-lg  text-white">Min <span  class="font-semibold text-yellow-300">&nbsp;34°</span></div>
                </div></div>
                <div class="bg-gray">  <div class="	 p-2 gap-0 grid grid-flow-col">
                    <div class=" mx-auto"><i class="text-white fa-solid fa-temperature-high"></div>
                    <div class="text-lg  text-white">Max <span  class="font-semibold text-yellow-300">&nbsp;34°</span></div>
                </div></div>
    
            </div>
            <div class="grid  grid-cols-2">
                <div class="bg-gray">  <div class="	 p-2 gap-0 grid grid-flow-col">
                    <div class=" mx-auto"><i class="text-white fa-solid fa-sun"></i></div>
                    <div class="text-lg  text-white">Rise <span  class="font-semibold text-yellow-300">&nbsp;&nbsp;5:25&nbsp;AM</span></div>
                </div></div>
                <div class="bg-gray">  <div class="	 p-2 gap-0 grid grid-flow-col">
                    <div class=" mx-auto"><i class="text-white fa-solid fa-sun"></i></div>
                    <div class="text-lg  text-white">Set <span  class="font-semibold text-yellow-300">&nbsp;&nbsp;7:30&nbsp;PM</span></div>
                </div></div>
    
            </div>
           </div>
           
        </div>
      </div>

        <div class="  bg-[url('https://images.pexels.com/photos/96622/pexels-photo-96622.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
            

                <div class=""> 
                <div class="p-2 grid grid-cols-2 md:grid-cols-4  gap-0 border-1 ">
                    <div>
                       
                         <div class=" p-2 gap-0 grid grid-flow-col">
                            <div class=" w-1/2 mx-auto"><i class="fa-solid fa-droplet text-4xl "></i></div>
            
                            <div class="text-lg font-bold text-white">22<div class="text-sm text-yellow-300">Humidity</div></div>
                        </div>
            
                    </div>
                    <div>
                       
                        <div class=" p-2 gap-0 grid grid-flow-col">
                            <div class=" w-1/2 mx-auto"><i class="fa-solid fa-compress text-4xl "></i></div>
           
                           <div class="text-lg font-bold text-white">1001<div class="text-sm text-yellow-300">Pressure</div></div>
                       </div>
           
                   </div>
                   <div>
                       
                    <div class=" p-2 gap-0 grid grid-flow-col">
                        <div class=" w-1/2 mx-auto"><i class="fa-solid fa-up-long text-4xl "></i></div>
       
                       <div class="text-lg font-bold text-white">77.1<div class="text-sm text-yellow-300">Lon</div></div>
                   </div>
       
               </div><div>
                       
                <div class="p-2 gap-0 grid grid-flow-col">
                   <div class=" w-1/2 mx-auto"><i class="fa-solid fa-down-long text-4xl "></i></div>
    
                   <div class="text-lg font-bold text-white">28.7<div class="text-sm text-yellow-300">Lat</div></div>
               </div>
    
           </div>            
             
            </div>
            
            
             
            
            </div>
              <div class="">
                <div class="grid  gap-0  "> 
                <div class="p-2 grid grid-cols-3 md:grid-cols-3  gap-0 border-1 ">
                    <div>
                       
                         <div class=" p-2 gap-0 grid grid-flow-col">
                            <div class=" w-1/2 mx-auto"><i class="fa-solid fa-tachometer text-4xl "></i></div>
            
                            <div class="text-lg font-bold text-white">4.12<div class="text-sm text-yellow-300">Speed</div></div>
                        </div>
            
                    </div>
                    <div>
                       
                        <div class=" p-2 gap-0 grid grid-flow-col">
                            <div class=" w-1/2 mx-auto"><i class="fa-solid fa-arrows-rotate text-4xl "></i></div>
           
                           <div class="text-lg font-bold text-white">148<div class="text-sm text-yellow-300">Deg</div></div>
                       </div>
           
                   </div>
                   <div>
                       
                    <div class=" p-2 gap-0 grid grid-flow-col">
                        <div class=" w-1/2 mx-auto"><i class="fa-solid fa-wind text-4xl "></i></div>
       
                       <div class="text-lg font-bold text-white">7.42<div class=" text-yellow-300 text-sm ">Guest</div></div>
                   </div>
       
               </div><div>
               
    
           </div>            
              </div>
            </div>
            <div class="grid  gap-0  "> 
                <div class="p-3 grid grid-cols-4  sm:grid-cols-7 md:grid-cols-7  gap-0 border-1 ">
                    <div>
                       
                         <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
                            <div class="text-lg font-bold text-white">FRI<div class="text-sm text-yellow-300">24/05/24</div></div>
                            <div class=" "><i class="text-yellow-300 fa-regular fa-sun text-4xl "></i></div>
                            <div class="text-lg font-bold text-white">34°</div>
                          
                        </div>
            
                    </div>
                    <div>
                       
                        <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
                            <div class="text-lg font-bold text-white">SAT<div class="text-sm text-yellow-300">25/05/24</div></div>
                            <div class=" "><i class="text-yellow-300 fa-regular fa-sun text-4xl "></i></div>
                            <div class="text-lg font-bold text-white">34°</div>
                          
                        </div>
           
                   </div> <div class="">
                       
                    <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
                        <div class="text-lg font-bold text-white">SUN<div class="text-sm text-yellow-300">26/05/24</div></div>
                        <div class=" "><i class="text-yellow-300 fa-regular fa-sun text-4xl "></i></div>
                        <div class="text-lg font-bold text-white">34°</div>
                      
                    </div>
       
               </div> <div>
                       
                <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
                    <div class="text-lg font-bold text-white">MON<div class="text-sm text-yellow-300">27/05/24</div></div>
                    <div class=" "><i class="text-yellow-300 fa-regular fa-sun text-4xl "></i></div>
                    <div class="text-lg font-bold text-white">34°</div>
                  
                </div>
   
           </div> <div>
                       
            <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
                <div class="text-lg font-bold text-white">TUE<div class="text-sm text-yellow-300">28/05/24</div></div>
                <div class=" "><i class="text-blue-900 fa-solid fa-cloud-sun-rain text-4xl "></i></div>
                <div class="text-lg font-bold text-white">34°</div>
              
            </div>

       </div> <div>
                       
        <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
            <div class="text-lg font-bold text-white">WED<div class="text-sm">29/05/24</div></div>
            <div class=" "><i class="text-blue-900 fa-solid fa-cloud-rain text-4xl "></i></div>
            <div class="text-lg font-bold text-white">34°</div>
          
        </div>

   </div> <div>
                       
    <div class=" w-1/2 mx-auto text-center p-2 gap-0 grid grid-flow-row">
        <div class="text-lg font-bold text-white">THU<div class="text-sm text-yellow-300">30/05/24</div></div>
        <div class=" "><i class="text-yellow-300 fa-regular fa-sun text-4xl "></i></div>
        <div class="text-lg font-bold text-white">34°</div>
      
    </div>

</div>
                   <div>
                       
                  
       
               </div><div>
               
    
           </div>            
              </div>
            </div>
            
            
             
            
            </div>
      
    
          <!--  -->
       
      </div>
   </div>
</div>
  
  
       
       
    <!-- desc -->
     <div class="wether_dec">
    <div class=" flex ">
        <span class="mr-2 ">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 55 55"
            style="enable-background:new 0 0 55 55;"
            xml:space="preserve"
            width={svgSize}
            height={svgSize}
          >
            <g>
              <g>
                <path
                  style="fill:#D91F26;"
                  d="M9.867,4h35.258c3.242,0,5.876,2.628,5.876,5.876v35.258c-0.011,2.373-1.452,4.508-3.644,5.406c-2.186,0.921-4.711,0.433-6.404-1.234L5.695,14.048c-1.67-1.687-2.158-4.218-1.234-6.404C5.359,5.446,7.494,4.012,9.867,4"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <h2 class="font-bold  text-xl">Weather In DelhiWeather In Delhi</h2>
        
      </div>
      <!-- desc of maincity -->
      <p class="mb-3 lg:text-xl text-gray-500 dark:text-gray-400">The minimum temperature in Delhi today is likely to hover around 34 degrees Celsius, while the maximum temperature might reach 44 degrees Celsius. The mercury level is expected to hover around 39 degrees Celsius throughout the day, with the wind speed around 4.12. The wind will move around 148 degrees with a gust speed of 7.42. The sunrise time is 05:26 AM, while it will set at 07:10 PM on Friday. As per the seven-day weather prediction, the temperature in Delhi is likely to reach 34 degrees Celsius on Friday, 36 degrees Celsius on Saturday, 36 degrees Celsius on Sunday, 36 degrees Celsius on Monday, 35 degrees Celsius on Tuesday, 35 degrees Celsius on Wednesday and 37 degrees Celsius on Thursday.</p>

     </div>

     <!-- other main city -->
    <div class="wether_dec">
      <div class=" flex  ">
        <span class="mr-2 mt-1">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 55 55"
            style="enable-background:new 0 0 55 55;"
            xml:space="preserve"
            width={svgSize}
            height={svgSize}
          >
            <g>
              <g>
                <path
                  style="fill:#D91F26;"
                  d="M9.867,4h35.258c3.242,0,5.876,2.628,5.876,5.876v35.258c-0.011,2.373-1.452,4.508-3.644,5.406c-2.186,0.921-4.711,0.433-6.404-1.234L5.695,14.048c-1.67-1.687-2.158-4.218-1.234-6.404C5.359,5.446,7.494,4.012,9.867,4"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <h2 class="font-bold  text-xl">Weather of Major Cities</h2>
        
      </div>
      <!-- name of other citys -->
     <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Delhi</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Lucknow</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Jaipur</span>

            </li>
            </a>
           
        </div>
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Indore</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Agra</span>

            </li>
            </a>
           
        </div>
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Pune</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Mumbai</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Ahmedabad</span>

            </li>
            </a>
           
        </div>
      
        <div class=" p-3 border-3 rounded 	hover:bg-yellow-200 hover:border-black">
            <a href="/weather/indore-weather-forecast-today" >
                <li class="flex items-center justify-between">
                    <span class="">
                        <img src="https://akm-img-a-in.tosshub.com/sites/weather/resources/image/indore.svg" alt="Weather in Indore" class="h-10 w-10 sm:h-14 sm:w-14 rounded-full">
                    </span>
                    <span class="wtr_cit_rhs font-black text-xs sm:text-xl">Hyderabad</span>

            </li>
            </a>
           
        </div>
      
        
        
      
      </div>
    </div>

 <!-- Related news -->

 <div class="relatednews mt-2">
    <div class=" flex  ">
        <span class="mr-2 mt-1">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 55 55"
            style="enable-background:new 0 0 55 55;"
            xml:space="preserve"
            width={svgSize}
            height={svgSize}
          >
            <g>
              <g>
                <path
                  style="fill:#D91F26;"
                  d="M9.867,4h35.258c3.242,0,5.876,2.628,5.876,5.876v35.258c-0.011,2.373-1.452,4.508-3.644,5.406c-2.186,0.921-4.711,0.433-6.404-1.234L5.695,14.048c-1.67-1.687-2.158-4.218-1.234-6.404C5.359,5.446,7.494,4.012,9.867,4"
                ></path>
              </g>
            </g>
          </svg>
        </span>
        <h2 class="font-bold  text-xl">Related News</h2>
        
      </div>
      <div class="desc_related">
        <section id="our-team" class="">
            <div class="container mx-auto ">
        
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>
        
                    <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>  <div class="bg-white   text-justify shadow-md  my-2">
                        <img src="https://ddnews.gov.in/wp-content/uploads/2024/05/Sensex.jpg" alt="Team Member 1" class="w-full  ">
                        <p class="  	p-1 text-gray-700">Loagnam et istlorwem5
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempore quos iste cum sed eos necessitatibus fugit nobis explicabo rerum, illo suscipit! Delectus rerum ratione molestias minus quod corporis quidem temporibus.
                            e.</p>
                    </div>
                </div>
            </div>
        </section></div>
 </div>
 

 
     
</div>
     </div>

  
  