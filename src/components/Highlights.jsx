import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { rightImg, watchImg } from "../utils";
import VideoCarousel from "./VideoCarousel";

function Highlights() {
	useGSAP(() => {
		gsap.to("#title", { opacity: 1, y: 0 });
		gsap.to(".link", { opacity: 1, y: 0, stagger: .2, delay: .2 });
	}, []);

	return (
		<section
			id="highlights"
			className="w-screen overflow-hidden h-full common-padding bg-zinc">
			<div className="screen-max-width">
				<div className="mb-12 w-full flex items-end justify-between max-md:flex-col max-md:items-start">
					<h1
						id="title"
						className="section-heading translate-y-5">
						Get the highlights.
					</h1>

					<div className="flex flex-wrap items-end gap-5">
						<p className="link">Watch the film
							<img src={watchImg} alt="watchimg" className="ml-2"/>
						</p>
						<p className="link">Watch the event
							<img src={rightImg} alt="rightImg" className="ml-2"/>
						</p>
					</div>
				</div>

				<VideoCarousel />
			</div>
		</section>
	);
}

export default Highlights;
