import { useEffect, useState } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { heroVideo, smallHeroVideo } from "../utils";

function Hero() {
	const [videoSrc, setVideoSrc] = useState(
		window.innerWidth < 540 ? smallHeroVideo : heroVideo,
	);

      const handleVideoSrcSet = () => {
            if(window.innerWidth < 540) {
                  setVideoSrc(smallHeroVideo)
            } else {
                  setVideoSrc(heroVideo)
            }
      }

      useEffect(() =>{
            window.addEventListener('resize', handleVideoSrcSet);

            return () => {
                  window.removeEventListener("resize", handleVideoSrcSet)
            }
      },[])

      useGSAP(() => {
		gsap.to(".hero-title", {
			opacity: 1,
			duration: 1.5,
			y: 0,
                  delay: videoSrc === heroVideo ? .35 : 1.8,
			ease: "circ.inOut",
		});

            gsap.to("#cta", {
                  opacity: 1, 
                  y: 0,
			ease: "circ.inOut",
                  delay: videoSrc === heroVideo ? .35 : 1.8,
			duration: 1.5,
            })
	}, []);
      
	return (
		<section className="w-full nav-height bg-black relative p-2">
			<div className="h-fit w-full flex justify-start items-center flex-col  pt-10">
				<h1
					id="hero-title"
					className="hero-title -translate-y-8">
					IPhone 15 pro
				</h1>
				<div className="md:w-10/12 w-9/12">
					<video className="pointer-events-none" autoPlay muted playsInline={true} key={videoSrc}>
						<source src={videoSrc} type="video/mp4"/>
					</video>
				</div>
			</div>

                  <div id="cta" className="flex flex-col items-center opacity-0 translate-y-10 ">
                         <a href="#highlights" className="btn">Buy</a>
                         <p className="font-normal text-muted text-gray">From $199/month or $999</p>
                  </div>
		</section>
	);
}

export default Hero;
