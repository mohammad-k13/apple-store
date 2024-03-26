import React, { useEffect, useRef, useState } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

//LOCAL
import ModelView from "./ModelView";
import { yellowImg } from "../utils";
import { models, sizes } from "../constants";
import IPhoneModel from "./IPhone";
import { animationWithGsapTimeline } from "../utils/animation";

function Model() {
	const [size, setSize] = useState("small");
	const [model, setModel] = useState({
		title: "iPhone 15 pro in Natural Titanuim",
		color: ["#8f8a81", "#ffe7b9", "#6f6c64"],
		img: yellowImg,
	});

	const tl = gsap.timeline();

	useEffect(() => {
		if (size === "large") {
			animationWithGsapTimeline(tl, small, smallRotation, "#view1", "#view2", {
				transform: "translateX(-100%)",
				duration: 2,
			});
		}

		if (size === "small") {
			animationWithGsapTimeline(tl, large, largeRotation, "#view2", "#view1", {
				transform: "translateX(0)",
				duration: 2,
			});
		}
	}, [size]);

	//camera control for the model view
	const cameraContolSmall = useRef();
	const cameraContolLarge = useRef();

	//model
	const small = useRef(new THREE.Group());
	const large = useRef(new THREE.Group());

	//rotation
	const [smallRotation, setSmallRotation] = useState(0);
	const [largeRotation, setLargeRotation] = useState(0);

	useGSAP(() => {
		gsap.to("#heading", {
			opacity: 1,
			y: 0,
		});
	}, []);

	return (
		<section className="common-padding">
			<div className="screen-max-width">
				<h1
					id="heading"
					className="section-heading">
					Take a closer look.
				</h1>

				<div className="flex flex-col items-center mt-5">
					<div className="w-full h-[75vh] md:h-[90vh] overflow-hidden relative">
						<ModelView
							index={1}
							groupRef={small}
							gsapType="view1"
							controlRef={cameraContolSmall}
							setRotationState={setSmallRotation}
							item={model}
							size={size}
						/>
						<ModelView
							index={2}
							groupRef={large}
							gsapType="view2"
							controlRef={cameraContolLarge}
							setRotationState={setLargeRotation}
							item={model}
							size={size}
						/>

						<Canvas
							className="w-full h-full"
							style={{
								position: "fixed",
								top: 0,
								bottom: 0,
								left: 0,
								right: 0,
								overflow: "hidden",
							}}
							eventSource={document.getElementById("root")}>
							<View.Port />
						</Canvas>
					</div>
				</div>

				<div className="mx-auto w-full">
					<p className="text-sm font-light text-center mb-5">{model.title}</p>

					<div className="flex-center">
						{/* COLORS */}
						<ul className="color-container">
							{models.map((item, index) => (
								<li
									key={index}
									className={`w-6 h-6 rounded-full mx-2 `}
									style={{ backgroundColor: item.color[0] }}
									onClick={() => setModel(item)}></li>
							))}
						</ul>

						{/* SIZE */}
						<button className="size-btn--container">
							{sizes.map(({ label, value }) => (
								<span
									key={label}
									className="size-btn"
									style={{
										backgroundColor: size === value ? "white" : "transparent",
										color: size === value ? "black" : "white",
									}}
									onClick={() => setSize(value)}>
									{label}
								</span>
							))}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Model;
