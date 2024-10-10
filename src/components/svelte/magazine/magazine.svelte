<script>
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";

  
  let storyData=[]
  let storyData2=[]
  //  api call for getting the json data
  async function fetchData() {
  try {
    const response = await fetch("src/apiData/jsonServer/data.json"); // Adjust the path if necessary
    const data = await response.json();

    console.log(data,"api data loaded");

    // Extract info, item, and tasks from the JSON file
    storyData = data.storyData;
    storyData2 = data.storyData2;

    
    filterItems(); // Call your filter function after data is fetched
  } catch (error) {
    console.error("Error fetching data from JSON file:", error);
  }
}

// Mock API call replaced with fetching data from data.json
onMount(() => {
  fetchData();
});


  

</script>

<div class="container-fluid">
  <amp-story
    transition:fade
    standalone
    class=""
    title=""
    publisher="AMP tutorials"
    autoplay
    entity-logo-src="https://c.sachtak.com/images/web/AMP-Brand-White-Icon.svg"
    poster-portrait-src="https://c.sachtak.com/images/web/2.svg"
  >
    <amp-story-page id="cover" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <amp-img
          class="img-fluid"
          src="https://c.sachtak.com/images/web/2.svg"
          layout="responsive"
        />
      </amp-story-grid-layer>
    </amp-story-page>

    <amp-story-page id="page1" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div animate-in-duration="1s">
          <img
            src="https://c.sachtak.com/images/web/inr_1.png"
            class="object-fit"
            alt=""
            animate-in="zoom-out"
            style="width:100%!important;height:100%!important"
          />
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    {#each storyData as data (data.id)}
      <amp-story-page id={data.id} auto-advance-after="3s">
        <amp-story-grid-layer template="fill" />
        <amp-story-grid-layer template="vertical" class="p-0 mt-1 m-0">
          <div
            style="overflow-y: auto;overflow-x:none;background-color:#f7f7f7"
            class="layer-content"
          >
            <div
              style="height:19vh;"
              class="d-flex bg-image-top justify-content-between gap-3 align-items-center py-4 px-2"
            >
              <img src={data.qrCode} alt="" height="50" width="50" />
              <h1
                class="text-end"
                style="font-weight:600;font-size:27px;color:#fff"
              >
                {data.role}
              </h1>
            </div>

            {#each data.objDetails as details}
              <div class="d-flex align-items-start gap-3 mt-1 px-2">
                <div class="d-flex flex-column align-items-center">
                  <img
                    animate-in="fly-in-left"
                    animate-in-delay="0.2s"
                    height="65"
                    width="65"
                    class="object-fit avatar"
                    src={details.image}
                    style="border-radius: 50%;background-color:#333"
                  />
                  <div
                    class=""
                    animate-in="fly-in-left"
                    animate-in-delay="0.4s"
                  >
                    <span style="font-size: 9px;font-weight:600;color:#D15130"
                      >{details.name}</span
                    >
                  </div>
                </div>
                <div animate-in="fly-in-left" animate-in-delay="0.6s">
                  <div
                    style="color: #441112;font-size:16px;font-weight:700"
                    class="font600"
                  >
                    {details.heading}
                  </div>
                  <div class="font600" style="font-size: 10px;color:#441112">
                    {details.description}
                  </div>
                  <span style="font-size:11px;font-weight:600;color:#441112"
                    >{details.designation}</span
                  ><br />
                </div>
              </div>
            {/each}

            <div
              class="text-end button-bg ms-2"
              style="position: fixed;bottom:2%;right:3%"
            >
              <amp-call-tracking config="https://example.com/calltracking.json">
                <button
                  class="missed-call"
                  on="tap:myAction2"
                  style="font-size: 12px;"
                >
                  <a
                    href="tel:+918160811915"
                    style="text-decoration: none;font-size:12px"
                    class="front"
                  >
                    Missed Call <br /> +91 8160811915</a
                  >
                </button>
              </amp-call-tracking>
            </div>
          </div>
        </amp-story-grid-layer>
      </amp-story-page>
    {/each}

    <amp-story-page id="page7" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div animate-in-duration="1s">
          <img
            src="https://c.sachtak.com/images/web/tt_1.jpg"
            class="object-fit"
            alt=""
            animate-in="zoom-out"
            style="width:100%!important;height:100%!important"
          />
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page8" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">
              निर्दोषता के अनेकों प्रमाण जो अदालत में प्रमाणित होने पर भी
              नजरंदाज किये गये..
            </h5>
          </div>
          <div
            class="p-1 bg-white"
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.4s"
          >
            <h5 class="colorbrown font600 mt-2">मेडिकल रिपोर्ट</h5>
            <div class="textsmall font600 colorbrown">
              लड़की की मेडिकल रिपोर्ट बापू आशारामजी को आजीवन कारावास की सजा
              तथाकथित रेप और गैंगरेप में दी गयी है लेकिन लोकनायक अस्पताल, नई
              दिल्ली में आरोपकर्त्री की मेडिकल रिपोर्ट यह दर्शाती है कि रेप तो
              छोड़ो, किसी भी प्रकार की छेड़छाड़ तक नहीं हुई, रिपोर्ट पूर्णतः नॉर्मल
              पायी गयी ।
            </div>
            <div
              class="d-flex p-3 gap-1 page6bgimg"
              style="position: relative;"
            >
              <div>
                <h5 class="font600 colorbrown">
                  Quick Points from Medical Report
                </h5>
                <ul
                  class="textsmall font600 colorbrown text-decoration-underline"
                >
                  <li>No physical assault</li>
                  <li>No erythema</li>
                  <li>No bite marks</li>
                  <li>No swelling</li>
                  <li>No abrasion</li>
                  <li>No penetration</li>
                  <li>No loss of consciousness</li>
                  <li>Hymen intact</li>
                </ul>
              </div>
              <img
                src="https://c.sachtak.com/images/web/s1.png"
                alt=""
                width="200"
                height="200"
              />
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    {#each storyData2 as data (data.id)}
      <amp-story-page id={data.id} auto-advance-after="3s">
        <amp-story-grid-layer template="fill">
          <div
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.2s"
          >
            <div class="bg-image-top p-2 pt-5 bg-white">
              <h5 class="mt-2 font600">
                {data.mainHeadline}
              </h5>
            </div>
            <div class="p-1 bg-white">
              <div class="textsmall colorbrown font600">
                {data.description}
              </div>
              <div
                class=" p-1 page6bgimg"
                style="position: relative;"
                animate-in-duration="1s"
                animate-in="fly-in-left"
                animate-in-delay="0.4s"
              >
                <img src={data.image} alt="" width="350" height="270" /><br />
              </div>
            </div>
          </div>
          <div
            class="text-end button-bg ms-2"
            style="position: fixed;top:90%!important;right:3%!important"
          >
            <amp-call-tracking config="https://example.com/calltracking.json">
              <button
                class="missed-call"
                on="tap:myAction2"
                style="font-size: 12px;"
              >
                <a
                  href="tel:+918160811915"
                  style="text-decoration: none;font-size:12px"
                  class="front"
                >
                  Missed Call <br /> +91 8160811915</a
                >
              </button>
            </amp-call-tracking>
          </div>
        </amp-story-grid-layer>
        <amp-story-grid-layer template="vertical" />
      </amp-story-page>
    {/each}

    <amp-story-page id="page15" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">
              बिना कुटिया में गये लड़की ने कैसे दी अंदर की जानकारी..
            </h5>
          </div>
          <div
            class=" bg-white"
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.4s"
          >
            <div class="textsmall colorbrown font600 row px-1">
              <div class="col">
                <div class="font600" style="text-align: justify;font-size:10px">
                  लड़की ने तथाकथित घटनास्थल (कुटिया) के अंदर का वर्णन न तो FIR
                  में किया है न NGO के सामने हुए बयान में और न ही मैजिस्ट्रेट के
                  सामने हुए बयान में...! यह वर्णन सबसे पहले आता है पुलिस के
                  सामने हुए बयान में । अर्थात् लड़की को पुलिस को दिये गये बयान
                  से पहले कुटिया के अंदर की जानकारी नहीं थी । अब सवाल उठता है कि
                  उसे यह जानकारी कैसे मिली ? <br />
                  लड़की के पुलिस स्टेटमेंट होने से 1 दिन पहले इस केस के तत्कालीन
                  DCP अजय पाल लाम्बा अन्य पुलिसकर्मियों के साथ कुटिया पर गये थे और
                  उन्होंने अपने मोबाइल से कुटिया के अंदर व बाहर की विडियोग्राफी की
                  थी। यह तथ्य जोधपुर सूरसागर पुलिस थाने के रोजनामचे से प्रगट होता
                  है । <br />
                  बापूजी के वकीलों द्वारा यह रोजनामचा कोर्ट के सामने रखते हुए यह
                  दलील की गयी कि लड़की के पुलिस स्टेटमेंट होने से पहले पुलिस ने वहाँ
                  जाकर कुटिया को देखा है जिससे स्पष्ट है कि पुलिस ने ही लड़की को
                  कुटिया का विडियो दिखाया है और इसका प्रमाण है 22 अगस्त 2013 के दैनिक
                  भास्कर में फ्रंट पेज पर छपा हुआ पुलिस कर्मचारी का कुटिया के अंदर
                  का फोटो ।
                  <br />
                  लेकिन जोधपुर की विशेष अदालत ने जजमेंट में इस तथ्य पर अपना मत व्यक्त
                  करते हुए कहा कि, ‘बचाव पक्ष के तर्कों में कोई सार नहीं है । यह
                  सही है कि सूरसागर थाने का जाब्ता एवं थानाधिकारी मदन बेनीवाल मौके
                  पर गये थे लेकिन उन्होंने घटनास्थल की विडियोग्राफी की हो या घटनास्थल
                  का अवलोकन किया हो, ऐसा रोजनामचे से प्रकट नहीं होता है ।’
                </div>
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image.png"
                  alt=""
                  height="120"
                  width="160"
                />
                <div
                  class="mt-1 me-1 font600"
                  style="text-align: justify;font-size:10px"
                >
                  यह वही सबूत है जिसे सेशन कोर्ट ने "सबूत नहीं हैं" कहते हुए
                  जजमेंट में ठुकराया था । अब इस किताब से ये सबूत सामने आकर खड़ा
                  हो गया । <br /> इन सभी तथ्यों को देखते हुए जोधपुर हाईकोर्ट अजय
                  पाल लाम्बा को कोर्ट में उपस्थित होने हेतु सम्मन भेजती है । अजय
                  पाल लाम्बा बीमारी व अन्य कई कारण बताते हुए कोर्ट में कई
                  तारीखों पर उपस्थित नहीं होते और उसी दौरान अचानक हाईकोर्ट के
                  निर्णय के खिलाफ सरकार की ओर से सुप्रीम कोर्ट में अर्जी डाली
                  जाती है । <br />
                  सरकारी वकील सुप्रीम कोर्ट में यह दलील करता है कि इस किताब में डिस्क्लेमर
                  है और यह नाटकीय रूप से लिखी गयी है इसलिए इसे सबूत के तौर पर न लिया
                  जाए । सुप्रीम कोर्ट यह दलील मानकर हाईकोर्ट के निर्णय को ठुकरा देती
                  है । एक ही किताब को एक तरफ ठोस सबूतों का संकलन और दूसरी तरफ काल्पनिक
                  बताते हैं स्वयं इन्वेस्टिगेशन ऑफिसर अजय पाल लाम्बा और आश्चर्य !
                  उनके दोनों विपरीत बयान दोनों कोर्ट में मान्य किये जाते हैं !

                  <h6 style="color: #850000;" class=" font600 mt-1">
                    न्याय कहाँ मिलेगा ?
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page16" auto-advance-after="3s">
      <amp-story-grid-layer template="fill" class="bg-white">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-banner mt-3 p-2 pt-5 bg-white">
            <h5 class="mt-5 ms-4 font600">अहमदाबाद केस</h5>
          </div>
          <div class=" bg-white">
            <div class="py-2 px-2">
              <h6 class="colorbrown font600">कल्पित घटना</h6>
              <div
                style="font-size: 10px;"
                animate-in-duration="1s"
                animate-in="fly-in-left"
                animate-in-delay="0.2s"
                class="colorbrown font600"
              >
                जोधपुर में झूठी FIR दर्ज होने के मात्र दो महीने बाद अक्टूबर 2013
                में सूरत की दो बहनों ने आशारामजी बापू और उनके बेटे नारायण साँईं
                के खिलाफ 12 वर्ष पूर्व की कल्पित कहानी बताकर प्राथमिकी दर्ज कराई
                थी । बड़ी बहन ने बापूजी पर 2001 की और छोटी बहन ने नारायण साँईं पर
                2002 की तथाकथित घटना बताते हुये बलात्कार का आरोप लगाया है । इतने
                लम्बे अंतराल तक FIR दर्ज न कराने का कारण पूछने पर महिलाओं द्वारा
                कोई स्पष्ट एवं संतुष्टिकारक उत्तर नहीं दिया जाता लेकिन इस लंबे
                विलम्ब के बावजूद बिना किसी संयोगिक प्रमाण के केवल महिलाओं के
                विरोधाभासी बयानों के आधार पर आशारामजी बापू और नारायण साँईं को
                आजीवन कारावास की सजा सुना दी जाती है ।
              </div>
            </div>
            <div class="textsmall colorbrown font600 px-1 mt-1">
              <div class="d-flex justify-content-between gap-1">
                <div>
                  <h6 class="colorbrown font600">विचारणीय</h6>
                  <div class="colorbrown font600" style="font-size: 10px;">
                    बड़ी बहन FIR में लिखती है कि 2001 में मेरे साथ बापू ने
                    तथाकथित दुष्कर्म किया लेकिन छोटी बहन 2002 में नारायण साँईं
                    के आश्रम में रहने के लिए आ जाती है ।
                  </div>
                </div>
                <img
                  src="https://c.sachtak.com/images/web/image-copy-0.png"
                  alt=""
                  width="130"
                  height="100"
                />
              </div>
              <div class="d-flex justify-content-between gap-1 mt-1">
                <img
                  src="https://c.sachtak.com/images/web/image1.png"
                  alt=""
                  width="130"
                  height="100"
                />
                <div>
                  <div class="colorbrown font600" style="font-size: 10px;">
                    अगर किसी महिला के साथ दुष्कर्म होता है तो क्या वह अपनी सगी
                    बहन को बाद में आश्रम में रहने के लिए जाने दे सकती है ? छोटी
                    बहन 2005 और बड़ी बहन 2007 तक आश्रम में रही और 2010 में दोनों
                    बहनों ने शादी कर ली । शादी के बाद भी जनवरी 2013 तक छोटी बहन
                    अपने पति के साथ नारायण साँईं के सत्संग में आती थी जिसके फ़ोटो
                    भी कोर्ट के रिकॉर्ड पर हैं । बड़ी बहन भी आश्रम छोड़ने के कुछ
                    वर्षों बाद तक बापूजी के सत्संग में आती थी ।
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page17" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">आरोपों की कड़ियाँ कितनी कमजोर ...</h5>
          </div>
          <div class=" bg-white">
            <div class="textsmall colorbrown font600 p-1">
              <h6 class="colorbrown font600">अब सवाल उठता है कि :</h6>
              <div
                style="font-size: 12px;"
                animate-in-duration="1s"
                animate-in="fly-in-left"
                animate-in-delay="0.4s"
                class="colorbrown font600"
              >
                जब ये बहनें आश्रम में रहती थीं, उस समय बड़ी बहन सन 2000-2001 से
                वक्ता थी और देशभर में जगह-जगह पर सत्संग व प्रचार की सेवा में
                जाती थी । वह स्वयं प्रचार समूह की मुखिया थी और पूरे महीने में
                केवल 7 या 8 दिन के लिए ही अहमदाबाद महिला आश्रम में आती थी तो.. <br
                />
                1. अगर इसके साथ दुष्कर्म हुआ होता तो क्या सालों तक यह महिला आशारामजी
                बापू का महिमा मंडन करती रहती ? <br /> 2. जब यह महिला प्रचार की
                सेवा में देशभर में घूमती थी तब अगर इसके साथ तथाकथित दुष्कर्म
                होता था तो क्यों यह बार-बार वापस आश्रम आ जाती थी ?
                <br />
                3. तथाकथित दुष्कर्म के बाद भी क्यों ये बहनें सालों तक आश्रम में रहीं
                ? <br /> 4. आश्रम छोड़कर जाने के बाद भी क्यों ये दोनों बहनें
                आशारामजी बापू और नारायण साँईं के सत्संग में आती रहीं ?
                <br /> 5. क्यों इन बहनों द्वारा 12 साल तक FIR दर्ज नहीं करवायी गयी
                ? 2003 में महिला को टीबी होने पर वह अपने घर गयी थी, थोड़े समय तक घर
                पर रुकी, फिर वापस वह आश्रम क्यों आ गयी थी ? (यह तथ्य कोर्ट के रिकॉर्ड
                पर है )
              </div>
              <h6 class="colorbrowb font600 mt-1">महिला बयान बदलना चाहती थी</h6>
              <div class="d-flex page6bgimg ps-2">
                <div style="margin-right: -2rem;">
                  <img
                    src="https://c.sachtak.com/images/web/image-copy-1.png"
                    alt=""
                    height="150"
                    width="200"
                    class="img-fluid"
                  />
                </div>
                <img
                  src="https://c.sachtak.com/images/web/image-copy-0.png"
                  alt=""
                  height="110"
                  width="170"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page18" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">बयानों में विरोधाभास</h5>
          </div>
          <div class=" bg-white">
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <div style="text-align: justify;">
                  1.आरोपकर्त्री का कहना है कि वह आशारामजी बापू को पहली बार
                  जन्माष्टमी कार्यक्रम 1996 में सूरत आश्रम में मिली थी और उसी
                  समय से बापूजी तथा अन्य आरोपियों ने मिलकर एक षड्यन्त्र के तहत
                  उसको वक्ता बनाने की बात करके फँसाना चाहा था ।
                </div>
                <img
                  src="https://c.sachtak.com/images/web/image1-copy-1.png"
                  alt=""
                  height="130"
                  width="175"
                />
              </div>
              <div
                class="col"
                animate-in-duration="1s"
                animate-in="fly-in-left"
                animate-in-delay="0.4s"
              >
                <img
                  src="https://c.sachtak.com/images/web/image2.png"
                  alt=""
                  height="80"
                  width="175"
                />
                <img
                  src="https://c.sachtak.com/images/web/saanje 2.png"
                  alt=""
                  height="130"
                  width="175"
                />
              </div>
            </div>
            <div class=" colorbrown font600 px-1" style="font-size: 9px;">
              2. आरोपकर्त्री का कहना है कि 1997 में होली शिविर में आशारामजी बापू
              को वह सूरत आश्रम में मिली तो बापूजी ने कहा कि ‘तू वही लड़की है न
              जो मुझे मिली थी, जा जाकर अहमदाबाद में अनुष्ठान कर ।’ तब
              शिकायतकर्त्री महिला ने कहा था कि उसे दसवीं की परीक्षा देनी है ।
            </div>
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image4.png"
                  alt=""
                  height="110"
                  width="180"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image5.png"
                  alt=""
                  height="110"
                  width="175"
                />
              </div>
            </div>
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <div style="text-align: justify;">
                  3. आरोपकर्त्री ने अपने बयान में यह भी कहा कि “2007 में मैंने
                  निर्णय लिया कि मुझे अब आश्रम में रहना नहीं है तो मेरी जो मित्र
                  थी उस मित्र से मैंने बात करी और उस मित्र की मदद से मैं आश्रम
                  से भागकर सूरत में अपने माता-पिता के घर आ गयी ।”
                </div>
              </div>
              <div class="col ms-1">
                <img
                  src="https://c.sachtak.com/images/web/image6.png"
                  alt=""
                  height="100"
                  width="175"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page19" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">बयानों में विरोधाभास</h5>
          </div>
          <div class=" bg-white">
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <div style="text-align: justify;">
                  1.आरोपकर्त्री का कहना है कि वह आशारामजी बापू को पहली बार
                  जन्माष्टमी कार्यक्रम 1996 में सूरत आश्रम में मिली थी और उसी
                  समय से बापूजी तथा अन्य आरोपियों ने मिलकर एक षड्यन्त्र के तहत
                  उसको वक्ता बनाने की बात करके फँसाना चाहा था ।
                </div>
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/saanje 2.png"
                  alt=""
                  height="90"
                  width="175"
                />
              </div>
            </div>
            <div
              class="row"
              animate-in-duration="1s"
              animate-in="fly-in-left"
              animate-in-delay="0.4s"
            >
              <img
                src="https://c.sachtak.com/images/web/image4.png"
                alt=""
                height="90"
                width="350"
              />
            </div>
            <div class=" colorbrown font600 px-1" style="font-size: 9px;">
              2. आरोपकर्त्री का कहना है कि 1997 में होली शिविर में आशारामजी बापू
              को वह सूरत आश्रम में मिली तो बापूजी ने कहा कि ‘तू वही लड़की है न
              जो मुझे मिली थी, जा जाकर अहमदाबाद में अनुष्ठान कर ।’ तब
              शिकायतकर्त्री महिला ने कहा था कि उसे दसवीं की परीक्षा देनी है ।
            </div>
            <div
              animate-in-duration="1s"
              animate-in="fly-in-left"
              animate-in-delay="0.6s"
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image5.png"
                  alt=""
                  height="110"
                  width="180"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image6.png"
                  alt=""
                  height="110"
                  width="175"
                />
              </div>
            </div>
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 9px;"
            >
              <div class="col">
                <div style="text-align: justify;">
                  3. आरोपकर्त्री ने अपने बयान में यह भी कहा कि “2007 में मैंने
                  निर्णय लिया कि मुझे अब आश्रम में रहना नहीं है तो मेरी जो मित्र
                  थी उस मित्र से मैंने बात करी और उस मित्र की मदद से मैं आश्रम
                  से भागकर सूरत में अपने माता-पिता के घर आ गयी ।”
                </div>
              </div>
              <div class="col ms-1">
                <img
                  src="https://c.sachtak.com/images/web/image6.png"
                  alt=""
                  height="100"
                  width="175"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page20" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white">
            <h5 class="mt-2 font600">क्या यह न्याय है ?</h5>
          </div>
          <div
            class=" bg-white pt-1"
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.4s"
          >
            <div class="font600 px-1" style="font-size: 15px;color:#801111">
              ‘जिस केस में कोई भी प्रत्यक्ष साक्ष्य न हो उस केस में आरोपकर्त्री
              का बयान तभी सही माना जायेगा जब वह स्टर्लिंग विटनेस हो यानी उसके
              बयान में कहीं भी कोई विरोधाभास न हो ।’ <span
                class="font600"
                style="color:#BA1215"
                >~सुप्रीम कोर्ट
              </span>
            </div>
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 10px;"
            >
              <div class="col pt-1 colorbrown">
                <div
                  style="text-align: justify;font-size:12px"
                  class="colorbrown"
                >
                  लेकिन संत श्री आशारामजी बापू पर आरोप लगानेवाली महिलाओं के
                  बयानों में कितना विरोधाभास है, यह समाज के सामने है ।
                </div>
              </div>
              <div
                class="col"
                animate-in-duration="1s"
                animate-in="fly-in-left"
                animate-in-delay="0.4s"
              >
                <img
                  src="https://c.sachtak.com/images/web/image1-copy-2.png"
                  alt=""
                  height="90"
                  width="280"
                  class="img-fluid"
                />
              </div>
            </div>
            <div
              class=" colorbrown font600 p-1 d-flex justify-content-between"
              style="font-size: 10px;"
            >
              <div class="col pt-1 colorbrown">
                <div
                  style="text-align: justify;font-size:12px"
                  class="colorbrown"
                >
                  ऐसे विरोधाभासी बयानों के आधार पर बिना किसी सबूत के भारत के एक
                  संत, जिन्होंने अपना सम्पूर्ण जीवन सनातन संस्कृति की सेवा में
                  एवं देश-हित के कार्यों में समर्पित कर दिया, उनको आजीवन कारावास
                  की सजा देना.. <h6 class="font600" style="color:#BA1215">
                    क्या यह न्याय है ?
                  </h6>
                </div>
              </div>
              <div class="col d-flex gap-1 ms-1">
                <img
                  src="https://c.sachtak.com/images/web/image2-copy-0.png"
                  alt=""
                  height="100"
                  class="img-fluid"
                  width="90"
                />
                <img
                  src="https://c.sachtak.com/images/web/image3.png"
                  alt=""
                  height="110"
                  class="img-fluid"
                  width="110"
                />
              </div>
            </div>
            <div class="colorbrown mt-1 p-1 font600">
              <h6 class="font600">न्याय का दोहरा मापदंड ..</h6>
              <div>
                <div class="font600 textsmall" style="color: #BA1215;">
                  केरल के बिशप फ्रेंको मुलक्कल
                </div>
                <div style="font-size: 10px;">
                  आरोप : नन के साथ 13 बार रेप करने का आरोप <br />
                  बेल : 26 दिन तक जेल, उसके बाद बेल पर रहते हुए निर्दोष बरी
                </div>
              </div>
              <div>
                <div class="font600 textsmall" style="color: #BA1215;">
                  दीपक चौरसिया और अन्य पत्रकार
                </div>
                <div style="font-size: 10px;">
                  <span class="font600">आरोप :</span> आशारामजी बापू को बदनाम
                  करने के लिए नाबालिग बच्ची के विडियो को तोड़-मरोड़कर दिखाया,
                  POCSO के तहत मामला दर्ज, आज तक गिरफ्तारी नहीं <br />
                  <span class="font600 d-inline-block"> बेल :</span> 26 दिन तक जेल,
                  उसके बाद बेल पर रहते हुए निर्दोष बरी
                </div>
              </div>
              <div>
                <div class="font600 textsmall" style="color: #BA1215;">
                  तरुण तेजपाल
                </div>
                <div style="font-size: 10px;">
                  <span class="font600">आरोप :</span> आशारामजी बापू को बदनाम
                  करने के लिए नाबालिग बच्ची के विडियो को तोड़-मरोड़कर दिखाया,
                  POCSO के तहत मामला दर्ज, आज तक गिरफ्तारी नहीं <br />
                  <span class="font600 d-inline-block pb-2"> बेल :</span> 26 दिन
                  तक जेल, उसके बाद बेल पर रहते हुए निर्दोष बरी
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page21" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 20vh;">
            <h5 class="mt-2 font600">क्या संत-समाज सुरक्षित है ?</h5>
          </div>
          <div
            class=" bg-white pt-1 px-2"
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.4s"
          >
            <div class="d-flex justify-content-between">
              <img
                src="https://c.sachtak.com/images/web/image_172.png"
                alt=""
                height="75"
                width="150"
                style="border-radius: 10px;"
              />
              <div class="ms-4 ps-3">
                <h6 class="colorbrown font600">पालघर साधु</h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  महाराष्ट्र के पालघर में कथित स्थानीय अपराधियों द्वारा
                  पुलिसकर्मियों की मौजूदगी में साधुओं की नृशंस हत्या कर दी गयी ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between py-1">
              <img
                src="https://c.sachtak.com/images/web/image_173.png"
                alt=""
                height="75"
                width="130"
                style="border-radius: 10px;"
              />
              <div>
                <h6 class="colorbrown font600">जगद्गुरु कृपालुजी महाराज</h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  आरोप : उनकी एक शिष्या द्वारा बलात्कार का आरोप <br />
                  परिणाम : आरोप निराधार साबित हए
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between py-1">
              <img
                src="https://c.sachtak.com/images/web/image_174.png"
                alt=""
                height="75"
                width="130"
                style="border-radius: 10px;"
              />
              <div>
                <h6 class="colorbrown font600">जगद्गुरु कृपालुजी महाराज</h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  आरोप : उनकी एक शिष्या द्वारा बलात्कार का आरोप <br />
                  परिणाम : आरोप निराधार साबित हए
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between py-1">
              <img
                src="https://c.sachtak.com/images/web/image_176.png"
                alt=""
                height="75"
                width="130"
                style="border-radius: 10px;"
              />
              <div>
                <h6 class="colorbrown font600">जगद्गुरु कृपालुजी महाराज</h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  आरोप : उनकी एक शिष्या द्वारा बलात्कार का आरोप <br />
                  परिणाम : आरोप निराधार साबित हए
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between py-1">
              <img
                src="https://c.sachtak.com/images/web/image_177.png"
                alt=""
                height="75"
                width="130"
                style="border-radius: 10px;"
              />
              <div>
                <h6 class="colorbrown font600">
                  शंकराचार्य जयेन्द्र सरस्वतीजी
                </h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  आरोप : उनकी एक शिष्या द्वारा बलात्कार का आरोप <br />
                  परिणाम : आरोप निराधार साबित हए
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between py-1">
              <img
                src="https://c.sachtak.com/images/web/image_178.png"
                alt=""
                height="75"
                width="130"
                style="border-radius: 10px;"
              />
              <div>
                <h6 class="colorbrown font600">स्वामी असीमानंदजी</h6>
                <div style="font-size: 9px;" class="colorbrown font600">
                  आरोप : उनकी एक शिष्या द्वारा बलात्कार का आरोप <br />
                  परिणाम : आरोप निराधार साबित हए
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page22" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 20vh;">
            <h5 class="mt-2 font600">मानवाधिकारों का सतत अतिक्रमण</h5>
          </div>
          <div
            class=" bg-white pt-1 px-2"
            animate-in-duration="1s"
            animate-in="fly-in-left"
            animate-in-delay="0.4s"
          >
            <div class="colorbrown font600 my-2" style="font-size:10px;">
              पिछले 11.5 से अधिक वर्षों (जेल परिहारानुसार) से संत श्री आशारामजी
              बापू जेल में हैं । उनको न बेल दी जाती है न पैरोल न फरलो जबकि सजा
              का चौथाई हिस्सा पूरा करने के बाद कानून द्वारा पैरोल पर बाहर आने का
              प्रावधान है लेकिन यह प्रावधान बापूजी के लिए लागू नहीं किया जाता ।
              कोर्ट द्वारा हर बार 86 वर्षीय वयोवृद्ध संत की अर्जी को नामंजूर
              किया जाता है । 2013, जब से बापूजी जेल में हैं उनका स्वास्थ्य
              दिन-प्रतिदिन बिगड़ता चला जा रहा है ।
            </div>
            <div
              class="page22box colorbrown p-1"
              animate-in-duration="1s"
              animate-in="fly-in-left"
              animate-in-delay="0.6s"
            >
              <div class="font600 p-2" style="font-size: 10px;">
                2013 से - ट्राइजेमिनल न्यूराल्जिया <br /> 2015 से - प्रोस्टेटिक
                हाइपरप्लासिया, घुटने के आर्थ्राइटिस ग्रेड 4, सर्वाइकल
                स्पोंडिलोसिस, हाइपोथायरायडिज्म <br />
                2016 से - प्रोस्टेटाइटिस, कोरोनरी आर्टरी डिजीज, कार्पल टनल सिंड्रोम
                <br />
                2021 फरवरी - एक्यूट कोरोनरी सिंड्रोम, एनीमिया, सिस्टाइटिस, माइल्ड
                हेपेटिक स्टीटोसिस मई - COVID, आँतों से रक्तस्राव, AIIMS और MDM में
                एडमिट जून - हाइड्रोनेफ्रोसिस, हाइपोनेट्रिमिया नवम्बर - लिवर के एंजाइम
                का बढ़ना, पीलिया, किडनी की कार्यक्षमता में क्षति, पोस्ट COVID कोम्प्लीकेशन
                डिस्टेंडेड युरीनरी ब्लैडर, प्रोस्टेटोमेगाली, हेपटोमेगाली ।
                <br />
                2022 - AIIMS ने प्रोस्टेट की सर्जरी (prostatectomy) की सलाह दी ।
                <br /> 2023 - हार्ट अटैक, कोरोनरी आर्टरी डिसीज, उच्च रक्तचाप, खून
                की कमी आयरन और विटामिन बी 12 की कमी
              </div>

              <div class="d-flex justify-content-between gap-2 p-1">
                <div class="" style="font-size: 10px;text-align:justify">
                  <h6>जनवरी 2024</h6>
                  AIIMS में करायी गयी एंजियोग्राफी रिपोर्ट के अनुसार उनके हृदय में
                  3 गंभीर ( 99%, 90% और 85%) ब्लॉकेज हैं । Capsular Endoscopy रिपोर्ट
                  के अनुसार छोटी आँत में अल्सर है जिसके कारण काफी रक्तस्राव हुआ ।
                  लगातार रक्तस्राव के कारण 7 बोतल के ऊपर खून चढ़ा लेकिन हीमोग्लोबिन
                  का स्तर सामान्य नहीं हुआ । वर्ष 2021 में भी कोरोना के गंभीर दुष्परिणामों
                  से ICU में कई दिनों तक जूझने के बाद भी उन्हें बेल देने की अपेक्षा
                  जेल में वापस भेज दिया गया था जो जेल उस समय covid इन्फेक्शन का हॉटस्पॉट
                  बनी हुई थी ।
                </div>
                <div class="d-flex gap-1">
                  <img
                    src="https://c.sachtak.com/images/web/image_185.png"
                    alt=""
                    class="img-fluid"
                    height="100"
                    width="100"
                  />
                  <img
                    src="https://c.sachtak.com/images/web/image_214.png"
                    class="img-fluid"
                    alt=""
                    height="100"
                    width="120"
                  />
                </div>
              </div>
            </div>

            <div class="colorbrown font600" style="font-size:10px;">
              इतनी बीमारियाँ होने के बावजूद भी बापूजी द्वारा अपनी इच्छानुसार
              अपना इलाज कराने के लिए आज तक लगायी गयी सभी अर्जियाँ कोर्ट द्वारा
              खारिज कर दी गयी हैं । क्या ऐसी कोई न्यायनीति नहीं जो 11.5 से अधिक
              वर्षों (जेल परिहारानुसार) से कारागृह में बंद 86 वर्षीय निर्दोष संत
              श्री आशारामजी बापू को राहत दिला सके ?
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page23" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 22vh;">
            <h5 class="mt-2 font600">
              संत श्री आशारामजी बापू की प्रेरणा एवं मार्गदर्शन में संचालित
              विश्वहितकारी प्रकल्प
            </h5>
          </div>
          <div class=" bg-white pt-1 px-2">
            <div class="d-flex justify-content-between gap-2 p-1">
              <img
                src="https://c.sachtak.com/images/web/layer_25.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">
                  “वसुधैव कुटुम्बकम्” की भावना से ओतप्रोत हृदय
                </h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  पिछले 60 से अधिक वर्षों से सनातन वैदिक संस्कृति का शंखनाद करने
                  के साथ-साथ राष्ट्र निर्माण, व्यक्ति निर्माण व सामाजिक मूल्यों
                  द्वारा समाज-निर्माण में सेवारत रहे हैं संत श्री आशारामजी बापू
                  ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">विश्व धर्म संसद, शिकागो</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  हिन्दू संस्कृति का परचम लहराने पार्लियामेंट ऑफ वर्ल्ड रिलीजन्स
                  (विश्व धर्म संसद), शिकागो में भारत का नेतृत्व 11 सितम्बर 1893
                  को स्वामी विवेकानंदजी ने और ठीक उसके 100 साल बाद 4 सितम्बर
                  1993 को संत श्री आशारामजी बापू ने किया था ।
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/layer_26.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-2 p-1"
            >
              <img
                src="https://c.sachtak.com/images/web/layer_27.png"
                alt=""
                style="border-radius: 10px;"
                height="120"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">गौ रक्षण व संवर्धन</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  60 से अधिक छोटी एवं बड़ी गौशालाएँ, जहाँ 10, 000 से अधिक गायों
                  का रक्षण व पालन-पोषण होता है ।
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page24" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" bg-white pt-3 px-2">
            <div class="d-flex justify-content-between gap-2 p-1">
              <img
                src="https://c.sachtak.com/images/web/layer_25.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">
                  बाल संस्कार केंद्र, विद्यार्थी शिविर, योग व उच्च संस्कार
                  कार्यक्रम
                </h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  बापूजी की प्रेरणा से बच्चों में सुसंस्कार सिंचन हेतु देशभर में
                  हजारों बाल संस्कार केंद्र नि:शुल्क चलाये जाते हैं, साथ ही
                  विद्यार्थियों के उज्ज्वल भविष्य के लिए वर्षभर में सैंकड़ों
                  विद्यार्थी शिविरों एवं हजारों योग व उच्च संस्कार शिक्षा
                  कार्यक्रमों का आयोजन किया जाता है । इनमें हजारों-हजारों
                  विद्यार्थी हिस्सा लेकर उन्नत होते हैं ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">विश्व धर्म संसद, शिकागो</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  हिन्दू संस्कृति का परचम लहराने पार्लियामेंट ऑफ वर्ल्ड रिलीजन्स
                  (विश्व धर्म संसद), शिकागो में भारत का नेतृत्व 11 सितम्बर 1893
                  को स्वामी विवेकानंदजी ने और ठीक उसके 100 साल बाद 4 सितम्बर
                  1993 को संत श्री आशारामजी बापू ने किया था ।
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/layer_26.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-2 p-1"
            >
              <img
                src="https://c.sachtak.com/images/web/layer_27.png"
                alt=""
                style="border-radius: 10px;"
                height="120"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">गौ रक्षण व संवर्धन</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  60 से अधिक छोटी एवं बड़ी गौशालाएँ, जहाँ 10, 000 से अधिक गायों
                  का रक्षण व पालन-पोषण होता है ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">पर्यावरण सुरक्षा अभियान</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  पूज्य बापूजी कहते हैं : “अपने घरों, इलाकों में तुलसी, आँवला,
                  पीपल, नीम और बरगद के वृक्ष लगें ऐसा प्रयत्न सभीको करना चाहिए ।
                  इनमें पीपल, आँवला व तुलसी अति हितकारी हैं । पीपल लगाने की आप
                  वन विभाग को सलाह देना, उत्साह देना तो मैं समझूंगा आपने भगवान
                  की भी सेवा की, समाज की भी सेवा की और मेरे पर बड़ा एहसान किया
                  ।”
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/layer_26.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div></amp-story-grid-layer
      >
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page25" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" bg-white pt-3 px-2">
            <div class="d-flex justify-content-between gap-2 p-1">
              <img
                src="https://c.sachtak.com/images/web/layer_27.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">
                  बाल संस्कार केंद्र, विद्यार्थी शिविर, योग व उच्च संस्कार
                  कार्यक्रम
                </h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  बापूजी की प्रेरणा से बच्चों में सुसंस्कार सिंचन हेतु देशभर में
                  हजारों बाल संस्कार केंद्र नि:शुल्क चलाये जाते हैं, साथ ही
                  विद्यार्थियों के उज्ज्वल भविष्य के लिए वर्षभर में सैंकड़ों
                  विद्यार्थी शिविरों एवं हजारों योग व उच्च संस्कार शिक्षा
                  कार्यक्रमों का आयोजन किया जाता है । इनमें हजारों-हजारों
                  विद्यार्थी हिस्सा लेकर उन्नत होते हैं ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">विश्व धर्म संसद, शिकागो</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  हिन्दू संस्कृति का परचम लहराने पार्लियामेंट ऑफ वर्ल्ड रिलीजन्स
                  (विश्व धर्म संसद), शिकागो में भारत का नेतृत्व 11 सितम्बर 1893
                  को स्वामी विवेकानंदजी ने और ठीक उसके 100 साल बाद 4 सितम्बर
                  1993 को संत श्री आशारामजी बापू ने किया था ।
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/image_214.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
            <div
              class="d-flex justify-content-between align-items-center gap-2 p-1"
            >
              <img
                src="https://c.sachtak.com/images/web/image_214.png"
                alt=""
                style="border-radius: 10px;"
                height="120"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">गौ रक्षण व संवर्धन</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  60 से अधिक छोटी एवं बड़ी गौशालाएँ, जहाँ 10, 000 से अधिक गायों
                  का रक्षण व पालन-पोषण होता है ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">पर्यावरण सुरक्षा अभियान</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 9px;color:#441112;text-align:justify"
                >
                  पूज्य बापूजी कहते हैं : “अपने घरों, इलाकों में तुलसी, आँवला,
                  पीपल, नीम और बरगद के वृक्ष लगें ऐसा प्रयत्न सभीको करना चाहिए ।
                  इनमें पीपल, आँवला व तुलसी अति हितकारी हैं । पीपल लगाने की आप
                  वन विभाग को सलाह देना, उत्साह देना तो मैं समझूंगा आपने भगवान
                  की भी सेवा की, समाज की भी सेवा की और मेरे पर बड़ा एहसान किया
                  ।”
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/layer_27.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div></amp-story-grid-layer
      >
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page26" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" bg-white pt-3 px-2">
            <div class="d-flex justify-content-between gap-2 p-1">
              <img
                src="https://c.sachtak.com/images/web/image_185.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">
                  बाल संस्कार केंद्र, विद्यार्थी शिविर, योग व उच्च संस्कार
                  कार्यक्रम
                </h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 10px;color:#441112;text-align:justify"
                >
                  बापूजी की प्रेरणा से बच्चों में सुसंस्कार सिंचन हेतु देशभर में
                  हजारों बाल संस्कार केंद्र नि:शुल्क चलाये जाते हैं, साथ ही
                  विद्यार्थियों के उज्ज्वल भविष्य के लिए वर्षभर में सैंकड़ों
                  विद्यार्थी शिविरों एवं हजारों योग व उच्च संस्कार शिक्षा
                  कार्यक्रमों का आयोजन किया जाता है । इनमें हजारों-हजारों
                  विद्यार्थी हिस्सा लेकर उन्नत होते हैं ।
                </div>
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <div>
                <h6 class="colorbrown font600">विश्व धर्म संसद, शिकागो</h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 10px;color:#441112;text-align:justify"
                >
                  हिन्दू संस्कृति का परचम लहराने पार्लियामेंट ऑफ वर्ल्ड रिलीजन्स
                  (विश्व धर्म संसद), शिकागो में भारत का नेतृत्व 11 सितम्बर 1893
                  को स्वामी विवेकानंदजी ने और ठीक उसके 100 साल बाद 4 सितम्बर
                  1993 को संत श्री आशारामजी बापू ने किया था ।
                </div>
              </div>
              <img
                src="https://c.sachtak.com/images/web/image_185.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
            </div>
            <div class="d-flex justify-content-between gap-2 p-1">
              <img
                src="https://c.sachtak.com/images/web/image_214.png"
                alt=""
                style="border-radius: 10px;"
                height="150"
                width="150"
              />
              <div>
                <h6 class="colorbrown font600">
                  बाल संस्कार केंद्र, विद्यार्थी शिविर, योग व उच्च संस्कार
                  कार्यक्रम
                </h6>
                <div
                  class="colorbrown font600"
                  style="font-size: 10px;color:#441112;text-align:justify"
                >
                  बापूजी की प्रेरणा से बच्चों में सुसंस्कार सिंचन हेतु देशभर में
                  हजारों बाल संस्कार केंद्र नि:शुल्क चलाये जाते हैं, साथ ही
                  विद्यार्थियों के उज्ज्वल भविष्य के लिए वर्षभर में सैंकड़ों
                  विद्यार्थी शिविरों एवं हजारों योग व उच्च संस्कार शिक्षा
                  कार्यक्रमों का आयोजन किया जाता है । इनमें हजारों-हजारों
                  विद्यार्थी हिस्सा लेकर उन्नत होते हैं ।
                </div>
              </div>
            </div>
          </div>
          <div class="bg-image-down p-2 pt-5 bg-white" style="height: 22vh;">
            <div class="d-flex justify-content-between gap-2">
              <img
                src="https://c.sachtak.com/images/web/image_214.png"
                alt=""
                style="border-radius: 10px;"
                height="100"
                width="120"
              />
              <div class=" font600" style="font-size: 10px;text-align:justify">
                मैं पूज्य बापूजी का अभिनंदन करने आया हूँ... उनके आशीर्वचन सुनने
                आया हूँ । संत-महात्माओं के दर्शन तभी होते हैं, उनका सान्निध्य
                तभी मिलता है जब कोई पुण्य जागृत होता है । हमारी जो प्राचीन धरोहर
                थी और जिसे हम लगभग भूलने का पाप कर बैठे थे, बापूजी हमारी आँखों
                में ज्ञान का अंजन लगा के उसको फिर से हमारे सामने रख रहे हैं ।
                बापूजी का प्रवचन सुनकर बड़ा बल मिला, बड़ा आनंद आया । जीवन के
                व्यापार में से थोड़ा समय निकालकर सत्संग में आना चाहिए ।
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page27" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" bg-white pt-4 px-2">
            <div class="colorbrown font600 pt-3">
              <h5
                class="colorbrown font600 pb-1"
                style="border-bottom:4px solid #441112"
              >
                मातृ-पितृ पूजन दिवस
              </h5>
              <div style="font-size: 9px;">
                हमारी संस्कृति कहती है मातृदेवो भव । पितृदेवो भव । लेकिन देश में
                बढ़ते जा रहे वृद्धाश्रमों की संख्या को एवं वेलेंटाइन डे द्वारा
                देश-विदेश में युवाओं के चारित्रिक पतन की ओर बढ़ रहे कदमों को
                रोककर उन्हें उन्नति की ओर ले जानेवाले संयम-सदाचार, विकाररहित
                शुद्ध प्रेम के मार्ग पर ले जाने के लिए संत श्री आशारामजी बापू ने
                सन् 2007 में एक नये त्यौहार 14 फरवरी को मातृ-पितृ पूजन दिवस का
                शंखनाद किया, जिसकी गूंज से समूचा विश्व लाभान्वित हो रहा है ।
                बापूजी की इस क्रांतिकारी पहल को सभी धर्म-मत-पंथ-सम्प्रदायों ने
                सराहा और आदरसहित अपनाया ।
              </div>
            </div>
            <div class="row row-cols-1 row-cols-md-2 g-1 mt-2">
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image_160.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image_155.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image_157.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image_162.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/image_161.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
              <div class="col">
                <img
                  src="https://c.sachtak.com/images/web/images__1___11__1.png"
                  alt=""
                  class="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page28" class="bg-white" auto-advance-after="3s">
      <amp-story-grid-layer template="fill" class="bg-page28">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" pt-5 px-2">
            <div class="font600 pt-3">
              <h5
                class=" font600 pb-1"
                style="border-bottom:4px solid;color:#fff "
              >
                प्रशस्ति-पत्र
              </h5>
              <div class="font600" style="font-size: 11px;color:#fff">
                सम्पूर्ण विश्व मांगल्य की भावना से द्रवित बापूजी का नवनीत सम
                हृदय मानव-समाज के लिए वरदानरूप रहा है । बापूजी ने जो समाज के लिए
                किया, उसका ऋण समाज कभी चुका नहीं पायेगा । समस्त मानवजाति के
                कल्याणार्थ दिये गये अद्वितीय योगदान के कारण संत श्री आशारामजी
                आश्रम को कई गणमान्य हस्तियों द्वारा प्रशस्ति-पत्र देकर सम्मानित
                किया गया है ।
              </div>
            </div>
            <div class="d-flex flex-wrap gap-2 pt-5 pb-5 px-2">
              <img
                src="https://c.sachtak.com/images/web/1__4__1.png"
                alt=""
                height="100"
                class="img-fluid"
                width="100"
              />
              <img
                src="https://c.sachtak.com/images/web/1__4__2.png"
                alt=""
                height="140"
                width="110"
              />
              <img
                src="https://c.sachtak.com/images/web/1__4__3.png"
                alt=""
                height="140"
                width="110"
              />
              <img
                src="https://c.sachtak.com/images/web/abdul_kalam_letter_praising_ashram_activities_3.png"
                alt=""
                height="140"
                width="110"
              />
              <img
                src="https://c.sachtak.com/images/web/abdul_kalam_letter_praising_ashram_activities_1.png"
                alt=""
                height="140"
                width="110"
              />
              <img
                src="https://c.sachtak.com/images/web/abdul_kalam_letter_praising_ashram_activities_2.png"
                alt=""
                height="140"
                width="110"
              />
            </div>
            <h6 style="color:#fff">
              भलाई जो की बापूजी ने, कुप्रचारक कर सकेंगे क्या ?
            </h6>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page29" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class=" bg-white pt-4 px-2">
            <div class="colorbrown font600 pt-4">
              <h5
                class=" font600 pb-1"
                style="color:#441112 ;border-bottom:4px solid #441112"
              >
                संत आशारामजी बापू के साथ संत-मिलन
              </h5>
            </div>
            <div class="d-flex flex-wrap pt-4 pb-5">
              <img
                src="https://c.sachtak.com/images/web/b1.png"
                alt=""
                height="100"
                class="img-fluid"
                width="250"
                style="border-radius: 10px;"
              />
              <img
                src="https://c.sachtak.com/images/web/b2.png"
                alt=""
                height="140"
                width="110"
                style="border-radius: 10px;"
              />
              <img
                src="https://c.sachtak.com/images/web/b3.png"
                alt=""
                height="120"
                width="170"
                style="border-radius: 10px;"
              />
              <img
                src="https://c.sachtak.com/images/web/b4.png"
                alt=""
                height="120"
                width="180"
                style="border-radius: 10px;"
              />
              <img
                src="https://c.sachtak.com/images/web/b5.png"
                alt=""
                height="120"
                width="140"
                style="border-radius: 10px;"
              />
              <img
                src="https://c.sachtak.com/images/web/b6.png"
                alt=""
                height="120"
                width="200"
                style="border-radius: 10px;"
              />
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page30" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 22vh;">
            <h5 class="mt-2">क्या ऐसे पुलिस अधिकारी विश्वास योग्य हैं ?</h5>
          </div>
          <div class=" bg-white pt-1 px-2">
            <div class="colorbrown font600">
              <h6 class="colorbrown font600" style="color:#441112">
                इन्वेस्टिगेशन ऑफिसर चंचल मिश्रा
              </h6>
              <div class="font600" style="font-size: 9px;color:#441112">
                आशारामजी बापू के केस की जाँच अधिकारी चंचल मिश्रा थी । जिनकी
                कार्यशैली और जिस तरह से कोर्ट में कार्यवाही हुई उससे I.O. (चंचल
                मिश्रा) की भूमिका भी संदेहों के घेरे में आ जाती है । जैसे : <br
                />
                1. इस पूरे केस का एक मुख्य सबूत घटनास्थल की फोरेंसिक जाँच (लड़की
                की कुटिया में उपस्थिति होने या न होने का पुख्ता सबूत) था जो I.O.
                द्वारा नहीं करवायी गयी । <br />2. I.O. द्वारा लड़की से संबंधित
                (12 से 17 अगस्त 2013 अर्थात्  तथाकथित घटना के बीच के दिनों की )
                कॉल डिटेल्स को कोर्ट से छुपाया गया ।<br /> 3. लड़की की FIR लिखते
                समय की गयी विडियोग्राफी को मिटा दिया गया । <br /> 4. लड़की के बयान
                की विडियोग्राफी के सबूतों के साथ छेड़छाड़ की गयी । (विस्तृत जानकारी
                के लिए पेज नं 12-15 पढ़ें)
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2 mt-2">
              <img
                src="https://c.sachtak.com/images/web/chnchl_2.png"
                alt=""
                height="90"
                width="175"
                class="img-fluid"
              />
              <div class="colorbrown font600 textsmall">
                ए एस पी चंचल मिश्रा को राष्ट्रीय राजपूत करणी सेना ने एक अन्य केस
                से बर्खास्त करने की माँग की है ।
              </div>
            </div>
            <div class="d-flex justify-content-between gap-2">
              <img
                src="https://c.sachtak.com/images/web/chnchl_1.png"
                alt=""
                height="140"
                class="img-fluid"
                width="150"
              />
              <div class="colorbrown font600" style="font-size:12px">
                यह वही ऑफिसर है जिसके लिए (NDPS Act, Case No. - 44/2012) सीकर,
                राजस्थान न्यायालय का फैसला आया है कि “चंचल मिश्रा अकर्मण्य ऑफिसर
                है, यह ट्रुथफुल ऑफिसर नहीं है और ऐसे ऑफिसर के खिलाफ अनुशासनात्मक
                कार्यवाही की जाय ।”
                <br />
                <span style="font-size: 10px;" class="font600 text-dark">
                  ऐसे ऑफिसर की नियुक्ति की जाती है संत श्री आशारामजी बापू के केस
                  में और बापूजी को आजीवन कारावास की सजा होने के बाद इस ऑफिसर को
                  लेडी सिंघम की उपाधि दी जाती है ।
                </span>
              </div>
            </div>
            <div class="colorbrown font600 mt-3">
              <h6 class="colorbrown font600" style="color:#441112">
                इन्वेस्टिगेशन ऑफिसर अजय पाल लाम्बा
              </h6>
              <div class="font600" style="font-size: 9px;color:#441112">
                तत्कालीन DCP अजय पाल लाम्बा आशारामजी बापू एवं केस के संदर्भ में
                लिखी हुई अपनी किताब को दिल्ली हाईकोर्ट में चल रहे एक केस में
                सत्य घटनाओं का संकलन बताता है और सुप्रीम कोर्ट में चल रहे दूसरे
                केस में काल्पनिक (ड्रामेटिकल) बताता है और आश्चर्य ! ये दोनों
                कोर्ट्स उसके बयानों को कंसीडर करते हैं और आशारामजी बापू के पक्ष
                की अर्जी को खारिज कर देते हैं । इतना ही नहीं, ऐसे अविश्वनीय
                ऑफिसर को संत श्री आशारामजी बापू को सजा होने के बाद सरकार द्वारा
                पुरस्कार से सम्मानित किया जाता है । (विस्तृत जानकारी के लिए पेज
                नं 17 पढ़ें)
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page31" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 20vh;">
            <h5 class="mt-2 font600">क्या ये विश्वास करने योग्य है ?</h5>
          </div>
          <div class=" bg-white pt-1 px-2">
            <div class="colorbrown font600">
              <h6 class="colorbrown font600" style="color:#441112">
                मीडिया की भूमिका
              </h6>
              <div class="font600" style="font-size: 10px;color:#441112">
                आशारामजी बापू के केस में समाज को भ्रमित करने में मीडिया ने अहम
                भूमिका निभायी । 2013 में जब बापूजी पर अनर्गल आरोप लगे तब देश में
                चल रहे सभी महत्त्वपूर्ण मुद्दों से दरकिनार कर फॉरेन फंडेड मीडिया
                ने 24 घंटे डिबेट व मीडिया ट्रायल द्वारा बापूजी की छवि को धूमिल
                करने का भरसक प्रयास किया । <br />बापूजी को बदनाम करने के लिए
                मीडिया ने एक नाबालिग बच्ची को भी नहीं बक्शा । गुरुग्राम की एक
                बच्ची के विडियो को तोड़-मरोड़कर अश्लील तरीके से समाज के सामने
                परोसा । इस कारण दीपक चौरसिया, चित्रा त्रिपाठी, अजीत अंजुम समेत 8
                लोगों पर भारतीय दंड संहिता की धारा 120बी (आपराधिक साजिश), 469,
                471 (जालसाजी), सूचना एवं प्रौद्योगिकी अधिनियम की धारा 67बी
                (बच्चे को ऑनलाइन उत्पीड़ित करना) एवं 67 (इलेक्ट्रॉनिक रूप में
                अश्लील सामग्री को प्रकाशित या प्रसारित करना) और पॉक्सो एक्ट की
                धारा 23 (मीडिया द्वारा पीड़ित बच्चे की पहचान जाहिर करना) एवं
                13सी  (अश्लील प्रयोजनों के लिए बच्चों का उपयोग करने) के तहत
                मामला दर्ज किया गया है और वर्तमान में विभिन्न धाराओं के साथ
                पॉक्सो 14 (1) अश्लील प्रयोजनों के लिए नाबालिग बच्चों का उपयोग
                करने हेतु दंड) के तहत न्यायालय ने प्रथम दृष्ट्या अपराधी माना है।
                <br /> आश्रम पर आरोप लगाने वाले भोलानंद ने बाद में जाहिर में माफ़ी
                मांगी व बताया कि मीडिया वाले उसे रुपये, बंगले, गाड़ी आदि का लालच
                देकर आशारामजी बापू के खिलाफ बोलने के लिए मजबूर किया करते थे ।
              </div>
            </div>

            <div class="colorbrown font600">
              <h6 class="colorbrown font600" style="color:#441112">
                क्या ऐसी मीडिया पर भरोसा करेंगे आप ?
              </h6>
              <div
                class="font600 d-flex flex-wrap justify-content-between gap-2"
              >
                <img
                  src="https://c.sachtak.com/images/web/image_165.png"
                  alt=""
                  height="80"
                  class="img-fluid"
                  width="230"
                />
                <img
                  src="https://c.sachtak.com/images/web/image_2.png"
                  alt=""
                  class="img-fluid"
                  height="80"
                  width="120"
                />
                <div
                  class="colorbrown border font600 p-1"
                  style="font-size: 10px;"
                >
                  15 दिसंबर, 2013 को एक बच्चे के रिश्तेदार की शिकायत के बाद एक
                  एफआईआर दर्ज की गई थी। इसमें तीन समाचार चैनलों - न्यूज 24,
                  इंडिया न्यूज और न्यूज नेशन पर "मॉर्फ्ड" वीडियो प्रसारित करने
                  का आरोप लगाया गया था। 10 साल की बच्ची और उसके परिवार का एक
                  "संपादित", "अश्लील" वीडियो संत आसाराम बापू के खिलाफ यौन
                  उत्पीड़न मामले से जोड़कर प्रसारित किया गया था। 2020 और 2021
                  में चार्जशीट दाखिल की गई ।
                </div>
                <img
                  src="https://c.sachtak.com/images/web/image_227.png"
                  alt=""
                  height="70"
                  class="img-fluid"
                  width="230"
                />
                <img
                  src="https://c.sachtak.com/images/web/media.png"
                  alt=""
                  class="img-fluid"
                  height="70"
                  width="230"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div></amp-story-grid-layer
      >
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>
    <amp-story-page id="page32" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div
          animate-in-duration="1s"
          animate-in="fly-in-left"
          animate-in-delay="0.2s"
        >
          <div class="bg-image-top p-2 pt-5 bg-white" style="height: 19vh;">
            <h5 class="mt-2 font600">संदर्भ लिंक्स</h5>
          </div>
          <div class=" bg-white pt-1 px-2">
            <div class="colorbrown font600">
              <div class="font600 d-flex gap-3" style="font-size: 9px;">
                <div class="" style="width: 50%;text-align:justify">
                  Subramanian Swamy
                  https://twitter.com/Swamy39/status/1556561899487375361?t=3y8GM5MkZJWUIcHeTYHfnw&s=19
                  Ashwini Upadhyay
                  https://youtube.com/shorts/_ZSAjg9msZ8?si=jmnvDhbobZWTL6lb
                  Harishankar Jain
                  https://youtu.be/if6S1GLOu0c?si=l8O6ZYBA-9ox636s A.P. Singh
                  https://youtu.be/v1V6Vy6_Rjo?si=lImjz7boxXqL5IrW Dharmendra
                  Mishra https://youtu.be/lprfduVVPkA?si=hYjuSBpdyjXVqYk- Sunil
                  Punalekar
                  https://rishiprasad.org/highlights/271_english_highlights.pdf
                  Kirti Ahuja https://youtu.be/Zd4ijyBHK50?si=1xnPoE1CkR4pxB-M
                  Vishnushankar Jain
                  https://drive.google.com/drive/folders/1fYXTQ_1PaaifH8QjrzEAdOIyRvJs2PMa
                  Sanjay Dixit
                  https://www.youtube.com/live/6kBwwW8Of_A?si=0P2NFzRJkEQ8kOFm
                  D.K. Dubey
                  https://www.youtube.com/live/9YFpBOM96F8?si=m_U1HrLgLD6FvtXu
                  Ashok Singhal https://youtu.be/mpQftXVHsM0?si=E7SaeGjbCXj9Uvtw
                  Pushpendra Kulshreshtha
                  https://youtu.be/hhTdn5F_oyk?si=cF79Gl_HGkEL4Bwi Ashok Ravalji
                  https://youtu.be/OEv0KY_pCAA?si=mvCg28e1H5_CvWOs Madhu Kishwar
                  https://youtu.be/sGBhqzeJXYY?si=BBOjfcgNIY6cvS0C Barkha Trehan
                  https://youtu.be/7WLhvkoSrhw?feature=shared Nitin Shukla
                  https://youtube.com/shorts/2h4yVV5akJ4?si=tL6Nu_-Cx8ivTr3I
                  Gautam Khattar
                  https://youtube.com/shorts/YeN3cbDzeGU?si=QYZblYR7GcX4V9pH
                  https://youtube.com/shorts/Efjk7lrEqnw?si=zXMdxzmrJWGMyIfo
                  Ashutosh Jha https://youtu.be/HzI02IDJ0FY?si=eUZxJMSOgkMFFSCB
                  Ankur Arya
                  https://youtube.com/shorts/kuc2Og3zW8c?si=Eimwyx5ZpUyaomGM
                  Shreyam Tripathi
                  https://youtu.be/DIsTMjdqPmQ?si=9FtvPK6eD1UrTQwr Shri
                  Nrityagopaladasji https://youtu.be/Cuh0K2We6t8?feature=shared
                  Shri Ramabhadracharya
                  https://youtu.be/hMdDNkyLpHo?si=X7rdwA5tO-egb70- Shri
                  Devkinandan Thakur
                  https://youtu.be/l_Uz6FLlPI0?si=mwujCzQj-TLseh_d Yati
                  Narsinhananji 
                  https://youtu.be/Gxw72-q67mQ?si=bbZgbtXHh53gf_HR
                </div>
                <div class="" style="width: 50%;">
                  Jain Digambar Suryasagar Ji Maharaj
                  https://youtu.be/xCDY1KyvinI?si=0mqgm-3EtLQApV7h Swami
                  Sivanand https://youtu.be/3xFF1KesM08?si=XiIsfkJm4WNVYhID
                  Acharya Kaushikji Maharaj
                  https://youtu.be/KGIWTyUZic4?si=I8QmauUZdVbZCaaZ
                  https://youtu.be/bGDbghkNc-g?si=t4-x1sYqcWHxjj23 Sant
                  Kriparamji Maharaj https://youtu.be/ncs_r58bXTM Avdheshji Gupt
                  https://m.facebook.com/ReviewsOnAsaramBapuji/videos/%E0%A4%B5%E0%A4%BF%E0%A4%B6%E0%A5%8D%E0%A4%B5-%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%82-%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%B7%E0%A4%A6-%E0%A4%AE%E0%A5%87%E0%A4%82-%E0%A4%97%E0%A5%8C%E0%A4%B0%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A4%B5%E0%A4%BF%E0%A4%AD%E0%A4%BE%E0%A4%97-%E0%A4%95%E0%A5%87-%E0%A4%B0%E0%A4%BE%E0%A4%B7%E0%A5%8D%E0%A4%9F%E0%A5%8D%E0%A4%B0%E0%A5%80%E0%A4%AF-%E0%A4%89%E0%A4%AA%E0%A4%BE%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%95%E0%A5%8D%E0%A4%B7-%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%85%E0%A4%B5%E0%A4%A7%E0%A5%87%E0%A4%B6-%E0%A4%97%E0%A5%81%E0%A4%AA%E0%A5%8D%E0%A4%A4-%E0%A4%A8%E0%A5%87-%E0%A4%AA/1063605857426315/
                  Swami Shiv Kumar Maharaj
                  https://youtu.be/ZpQ3TfUv_eU?si=FbhFSu4m2D8L8tNu आखिर क्या हुआ
                  15 अगस्त 2013 की रात ?
                  https://youtu.be/N4-lGFPBT7U?si=e0yCBuITz7W5nFql लड़की ने बिना
                  देखे कैसे दी ये जानकारी ?
                  https://youtu.be/SgHSmQVNTcw?si=UTD3FQii7H2UZ8aX
                  https://www.youtube.com/live/9YFpBOM96F8?si=TeUCc2Nt9ZED0WC9
                  चंचल मिश्रा के काले कारनामे-ठोस प्रमाणों के साथ
                  https://youtu.be/tezg8llrXnU?si=2nDsZvdJTWzmWs-q पर्दाफाश -
                  कोर्ट में भी स्वीकारनी पड़ी सच्चाई... पुलिस स्टेशन से मिटाये
                  गये सबूत https://youtu.be/ias8QFfwx-k?si=aBNPeZbJvcnZb414
                  Documents Expose the Truth
                  https://youtu.be/zczPQUZCVxM?si=YRrTDvmPnDIS0EZk Evidence
                  Declares Innocent
                  https://youtu.be/lPU3Jea7cQc?si=x2wpXmTsn-3DVz7X अन्याय का
                  आखिर होगा अंत कब ? 
                  https://youtu.be/9wOyxg_pq5E?si=ydOIpX-_jAWPjjIq सत्य की पुकार
                  https://youtu.be/PCTdkrzL2zM?si=x4_5dYPaongCGcOL पर्यावरण
                  सुरक्षा अभियान https://rishiprasad.org/read_606 Front Page
                  https://www.deccanherald.com/india/rape-accused-must-be-protected-against-possibility-of-false-implication-supreme-court-2641478
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page33" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div animate-in-duration="1s">
          <img
            src="https://c.sachtak.com/images/web/Page-34.png"
            class="object-fit"
            alt=""
            animate-in="zoom-out"
            style="width:100%!important;height:100%!important"
          />
        </div>

        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-page id="page34" auto-advance-after="3s">
      <amp-story-grid-layer template="fill">
        <div animate-in-duration="1s">
          <img
            src="https://c.sachtak.com/images/web/Back-Cover.png"
            class="object-fit"
            alt=""
            animate-in="zoom-out"
            style="width:100%!important;height:100%!important"
          />
        </div>

        <div
          class="text-end button-bg ms-2"
          style="position: fixed;top:90%!important;right:3%!important"
        >
          <amp-call-tracking config="https://example.com/calltracking.json">
            <button
              class="missed-call"
              on="tap:myAction2"
              style="font-size: 12px;"
            >
              <a
                href="tel:+918160811915"
                style="text-decoration: none;font-size:12px"
                class="front"
              >
                Missed Call <br /> +91 8160811915</a
              >
            </button>
          </amp-call-tracking>
        </div>
      </amp-story-grid-layer>
      <amp-story-grid-layer template="vertical" />
    </amp-story-page>

    <amp-story-bookend src="bookend.json" layout="nodisplay" />
  </amp-story>
</div>

<style amp-custom>
  amp-story {
    font-family: "Oswald", sans-serif;
    color: #fff;
  }
  amp-story-page {
    background-color: #fff;
  }
  .page22box {
    height: 55vh !important;
    background-color: #441112;
    color: #fff !important;
  }

  .textsmall {
    font-size: 12px;
  }
  .textextrasmall {
    font-size: 10px;
    color: #441112;
  }

  .textmedium {
    font-size: 13px;
  }
  .colorbrown {
    color: #441112;
  }
  .font600 {
    font-weight: 600;
  }

  .bg-image-top {
    background-image: url(https://c.sachtak.com/images/web/vector1.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 24vh;
  }
  .bg-image-down {
    background-image: url(https://c.sachtak.com/images/web/vector2.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 70vh;
  }
  .bg-page28 {
    background-image: url(https://c.sachtak.com/images/web/vector3.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
  }
  .page6bgimg {
    height: 70vh;
    margin-top: 2rem;
  }
  .bg-image-banner {
    background-image: url(https://c.sachtak.com/images/web/banner.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 39vh;
    width: 100%;
  }

  h1 {
    font-weight: bold;
    font-size: 2.7em;
    font-weight: normal;
    line-height: 1.174;
  }

  .missed-call {
    background: hsl(340deg 100% 32%);
    border-radius: 12px;
    border: none;
    padding: 0;
    cursor: pointer;
    outline-offset: 4px;
    z-index: 99999;
  }
  .front {
    display: block;
    padding: 8px 30px;
    border-radius: 12px;
    font-size: 1.25rem;
    background: hsl(345deg 100% 47%);
    color: white;
    cursor: pointer;
    z-index: 999;
    transform: translateY(-6px);
  }
  .cursorpointer {
    cursor: pointer;
  }
  .font-600 {
    font-weight: 600;
  }

  /* .missed-call:hover .front {
    transform: translateY(-2px);
  } */
  .missed-call:hover,
  .join:hover {
    transform: translateY(-2px);
    background-color: hsl(340deg 100% 32%);
  }
  .layer-content::-webkit-scrollbar {
    width: 5px;
  }
  .button-bg {
    box-shadow: 0 10 10 rgba(0, 0, 0, 0.4);
  }
  .text-white {
    color: #fff !important;
  }
</style>
