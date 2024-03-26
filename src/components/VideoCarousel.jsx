import { useEffect, useRef, useState } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/all";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";


gsap.registerPlugin(ScrollTrigger)

function VideoCarousel() {
	//* refs
	const videoRef = useRef([]);
	const videoSpanRef = useRef([]);
	const videoDivRef = useRef([]);

	//* states
	const [video, setVideo] = useState({
		isEnd: false,
		startPlay: false,
		videoId: 0,
		isLastVideo: false,
		isPlaying: false,
	});
	const [loadedData, setLoadedData] = useState([]);

	const { isEnd, isLastVideo, isPlaying, startPlay, videoId } = video;

	//* animation
	useGSAP(() => {
		gsap.to('#slider', {
			transform: `translateX(${-100 * videoId}%)`,
			duration: 2,
			ease: "power2.inOut"
		})
		gsap.to("#video", {
			scrollTrigger: {
				trigger: "#video",
				toggleActions: "restart none none none",
			},
			onComplete: () => {
				setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
			},
		});
	}, [isEnd, videoId]);

	function handleLoadedMetaData(index, event) {
		setLoadedData((prevState) => [...prevState, event]);
	}

	//* effects
	useEffect(() => {
		let span = videoRef.current;
		if (loadedData.length > 3) {
			if (!isPlaying) {
				span[videoId].pause();
			} else {
				startPlay && span[videoId].play();
			}
		}
	}, [startPlay, videoId, isPlaying, loadedData]);

	useEffect(() => {
		let currentProgress = 0;
		let span = videoSpanRef.current;

		if (span[videoId]) {
			//animate the progress of video
			let animate = gsap.to(span[videoId], {
				onUpdate: () => {
					const progress = Math.ceil(animate.progress() * 100);

					if (currentProgress != progress) {
						currentProgress = progress;

						gsap.to(videoDivRef.current[videoId], {
							width:
								window.innerWidth < 760
									? "10vw" // phone
									: window.innerWidth < 1200
									? "10vw" // tablet
									: "4vw", // labtop
						});

						gsap.to(span[videoId], {
							width: `${currentProgress}%`,
							backgroundColor: "#f1f1f1",
						});
					}
				},
				onComplete: () => {
					if (isPlaying) {
						gsap.to(videoDivRef.current[videoId], {
							width: "12px",
						});
						gsap.to(span[videoId], {
							backgroundColor: "#afafaf",
						});
					}
				},
			});

			if (videoId === 0) {
				animate.restart();
			}

			const animateUpdate = () => {
				animate.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
			};

			if (isPlaying) {
				gsap.ticker.add(animateUpdate);
			} else {
				gsap.ticker.remove(animateUpdate)
			}
		}
	}, [videoId, startPlay]);

	function handleProcess(type, i) {
		switch (type) {
			case "video-end":
				setVideo((prevState) => ({ ...prevState, isEnd: true, videoId: i + 1 }));
				break;

			case "video-last":
				setVideo((prevState) => ({ ...prevState, isLastVideo: true }));
				break;

			case "video-reset":
				setVideo((prevState) => ({ ...prevState, videoId: 0, isLastVideo: false }));
				break;

			case "play":
				setVideo((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
				break;

			case "pause":
				setVideo((prevState) => ({ ...prevState, isPlaying: !prevState.isPlaying }));
				break;
			default:
				return video;
		}
	}

	return (
		<>
			<div className="flex items-center">
				{hightlightsSlides.map((slide, index) => (
					<div
						key={slide.id}
						id="slider"
						className="sm:pr-20 pr-10">
						<div className="video-carousel--container">
							<div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
								<video
									id="video"
									muted
									playsInline={true}
									preload="auto"
									ref={(el) => (videoRef.current[index] = el)}
									onEnded={() => {
										index !== 3 ? handleProcess("video-end", index) : handleProcess('video-last')
									}}
									onPlay={() => {
										setVideo((prevVideo) => ({
											...prevVideo,
											isPlaying: true,
										}));
									}}
									onLoadedMetadata={(e) => handleLoadedMetaData(index, e)}>
									<source
										src={slide.video}
										type="video/mp4"
									/>
								</video>
							</div>

							<div className="absolute top-12 left-[5%] z-10">
								{slide.textLists.map((text) => (
									<p
										key={text}
										className="md:text-2xl text-cl font-medium">
										{text}
									</p>
								))}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="relative flex-center mt-10">
				<div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
					{videoRef.current.map((_, index) => (
						<span
							key={index}
							ref={(el) => (videoDivRef.current[index] = el)}
							className="mx-2 w-3 h-3 rounded-full bg-gray-200 relative cursor-pointer">
							<span
								className="absolute h-full w-full rounded-full"
								ref={(el) => (videoSpanRef.current[index] = el)}></span>
						</span>
					))}
				</div>

				<button className="control-btn">
					<img
						src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
						alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
						onClick={
							isLastVideo
								? () => handleProcess("video-reset")
								: !isPlaying
								? () => handleProcess("play")
								: () => handleProcess("pause")
						}
					/>
				</button>
			</div>
		</>
	);
}

export default VideoCarousel;