import { CafeCarousel } from "../components/CafeCarousel";
import cafeDesign1 from "../assets/cafeDesign1.jpg";
import cafeDesign3 from "../assets/cafeDesign3.png";

function Home() {
  return (
    <div className="">
      <div className="bg-[#f5f5ef] pt-24 grid lg:grid-cols-3 max-md:grid-cols-1 max-lg:pt-12">
        <div className="my-12 lg:col-span-2 lg:border-r-4 max-md:border-b-4 border-[#c6c0b7]">
          <img src={cafeDesign1} className="lg:w-2/3 mx-auto"/>
        </div>
        <div className="my-auto mx-auto w-4/5 px-12 text-[#373333] text-center">
          <h1 className="font-bold text-2xl my-4">ENJOY THE ARTISTIC VIBE AT OUR CAFE</h1>
          <p className="my-4">while sipping on coffee and munching on wraps</p>
          <button className="my-2 mb-12 p-4 bg-[#545454] text-white rounded-3xl transition duration-700 hover:-translate-y-1 hover:scale-105">VIEW MENU</button>
        </div>
      </div>
      <div className="bg-[#c6c0b7] max-md:text-center max-md:px-12">
        <div className="px-12 pt-12 pb-3">
          <h2 className="text-2xl my-4 font-bold">PROMOTION AND EVENTS</h2>
          <p className="text-lg my-4">JOIN OUR LOYALTY PROGRAM TO ENJOY EXCLUSIVE DISCOUNTS</p>
          <div className="">
            <button className="w-24 text-white text-center py-3 bg-[#cb9b73] rounded transition duration-700 hover:-translate-y-1 hover:scale-105">REGISTER</button>
            <button className="w-24 my-4 ml-6 text-white text-center py-3 bg-[#cb9b73] rounded transition duration-700 hover:-translate-y-1 hover:scale-105">LOGIN</button>
          </div>
        </div>
        <div className='pb-12'>
          <CafeCarousel />
        </div>
      </div>
      <div className=" bg-[#f5f5ef] grid lg:grid-cols-2 max-md:grid-cols-1">
        <div className="my-auto">
          <div className="w-3/5 mx-auto text-center">
            <h2 className="my-6 py-4 text-2xl font-bold text-[#373333] border-b-4 border-[#c6c0b7]">ABOUT US</h2>
            <p className="my-2 text-xl text-[#1a0906]">ArtisanBrews is more than just a place to eat and drink; it is a place to appreciate the beauty and creativity of different forms of art!</p>
            <button className="my-2 p-4 bg-[#cb9b73] rounded-2xl text-white transition duration-700 hover:-translate-y-1 hover:scale-105">LEARN MORE</button>
          </div>
        </div>
        <div className="my-auto">
          <img src={cafeDesign3} className="w-4/5 mx-auto"/>
        </div>
      </div>
      <div className="">
        <div className="h-48 bg-[#c6c0b7]"></div>
        <div className="h-3/4 relative bg-[#f5f5ef] grid lg:grid-cols-2 max-md:grid-cols-1">
          <div>
            <h2 className="w-3/4 mx-auto mb-3 mt-6 pb-4 text-2xl font-bold text-center text-[#545454] border-b-4 border-[#c6c0b7]">OUR LOCATION</h2>
            <div>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7976.848424821097!2d110.34889370512823!3d1.5146835747744618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31fba740cd72c8fd%3A0x5543ccabe94477a2!2sGala%20City%20Commercial%20Centre!5e0!3m2!1sen!2smy!4v1705730379626!5m2!1sen!2smy" 
              className="w-3/4 h-96 mx-auto my-12"></iframe>
            </div>
          </div>
          <div className="">
            <div className="w-1/3 px-12 py-6 bg-[#545454] lg:absolute text-center -top-20 right-36 max-md:relative max-md:top-0 max-md:right-0 max-lg:w-full">
              <h2 className="pt-8 my-4 font-bold text-2xl text-white">OPENING HOURS</h2>
              <table className="text-left mx-auto my-2 text-white">
                <tbody>
                  <tr className="border-b-2 border-slate-200">
                    <td>MONDAY</td>
                    <td className="pl-4">9AM - 9PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>TUESDAY</td>
                    <td className="pl-4">9AM - 9PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>WEDNESDAY</td>
                    <td className="pl-4">9AM - 9PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>THURSDAY</td>
                    <td className="pl-4">9AM - 9PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>FRIDAY</td>
                    <td className="pl-4">9AM - 9PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>SATURDAY</td>
                    <td className="pl-4">8AM - 7PM</td>
                  </tr>
                  <tr className="border-b-2 border-slate-200">
                    <td>SUNDAY</td>
                    <td className="pl-4">8AM - 7PM</td>
                  </tr>
                </tbody>
              </table>
              <p className="py-4 mx-16 text-base text-[#ead6bb] border-b-2 border-[#ead6bb]">Lorem ipsum dolor sit amet, consectetur adipiscing elit, 93250, Kuching, Malaysia</p>
              <button className="p-4 my-6 mx-auto rounded-xl bg-[#d9d9d9] text-[#545454] transition duration-700 hover:-translate-y-1 hover:scale-105">MAKE A RESERVATION</button>
            </div>
          </div>
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}

export default Home;