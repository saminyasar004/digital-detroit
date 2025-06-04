/* eslint-disable react/prop-types */ import EditableText from "@/components/editable-text";
import { baseUrl } from "../lib/dotenv";
import { cn, truncateToFullSentence } from "../lib/utils";

export default function TemplatePage({ currentPage, templateRef, data }) {
	return (
		<div className="min-h-screen bg-white">
			<div
				ref={templateRef}
				className="max-w-full mx-auto bg-white border border-gray-200 shadow-md"
			>
				{currentPage === 1 && <TemplatePageOne data={data} />}
			</div>
		</div>
	);
}

function TemplatePageOne({ data }) {
	// Extract parsed content and image list only if data is available
	// Safely parse content with fallback
	let parsedContent = {};
	try {
		parsedContent = data && data.content ? JSON.parse(data.content) : {};
	} catch (error) {
		console.error(
			"Failed to parse JSON content:",
			error.message,
			data.content
		);
		parsedContent = {}; // Fallback to empty object
	}

	// const parsedContent = data ? JSON.parse(data.content || "{}") : {};
	const keyPoints = data?.key_points || [];
	const imageResults = data?.image_results || [];

	// Extract design recommendations and font styles
	const title = parsedContent["title"] || "Default Title";
	const sub_title = parsedContent["sub-title"] || "Default Sub-title";
	const description =
		parsedContent["description"] || "Default description text.";
	const titleBackgroundColor =
		parsedContent?.design_recommendations?.background_color || "#000000";
	const descriptionBackgroundColor =
		data?.design_recommendations?.description_background_color || "#000000";

	const titleFontStyle =
		parsedContent?.design_recommendations?.title_font ||
		"Arial, 36pt, #ffffff"; // Default if missing
	const descriptionFontStyle =
		parsedContent?.design_recommendations?.description_font ||
		"Arial, 36pt, #ffffff"; // Default if missing

	// Split font styles into components
	const [titleFontFamily, titleFontSize, titleFontColor] = titleFontStyle
		? titleFontStyle.split(",").map((item) => item.trim())
		: ["Arial", "36pt", "#ffffff"];
	const [descriptionFontFamily, descriptionFontSize, descriptionFontColor] =
		descriptionFontStyle
			? descriptionFontStyle.split(",").map((item) => item.trim())
			: ["Arial", "36pt", "#ffffff"];

	// Dynamic image base URL (can be configured)
	const BASE_URL = baseUrl;

	return (
		<div className="bg-white p-2 overflow-x-hidden">
			{/* Header with dynamic font and background */}
			<div
				style={{
					backgroundColor: titleBackgroundColor,
					color: titleFontColor,
				}}
				className={`p-5 text-center text-white ${
					titleBackgroundColor && titleBackgroundColor
				}`}
			>
				<span className="text-base body-text font-medium uppercase">
					{sub_title}
				</span>
				<h2 className="text-4xl header-text font-extrabold uppercase">
					{title}
				</h2>
				{/* <h1 className="text-xl header-text font-bold">{sub_title}</h1> */}
			</div>

			<div className="p-0 relative">
				{/* Top Circle + Key Point */}
				<div className="flex relative mt-0 items-center mb-6">
					<div className="w-36 absolute left-5 -bottom-6 h-36 bg-blue-500 rounded-full flex-shrink-0">
						{imageResults[5] && (
							<img
								src={`${BASE_URL}${imageResults[5]}`}
								alt="Museum"
								className="w-full h-full object-cover rounded-full"
							/>
						)}
					</div>
					<div
						className="mt-4 ml-10 min-h-[2vh] w-full py-4 px-2 rounded-xl"
						style={{
							backgroundColor: descriptionBackgroundColor,
							color: descriptionFontColor,
						}}
					>
						{/* Editable Text for Description */}
						<EditableText
							// defaultValue={keyPoints[0]}
							defaultValue={truncateToFullSentence(
								description,
								150
							)}
							className="text-center ml-32 text-base body-text lowercase"
						/>
					</div>
				</div>

				{/* Second Key Point */}
				<div className="mb-8 ml-36 w-[75%] mr-1">
					<EditableText
						defaultValue={keyPoints[0]}
						// defaultValue={description}
						className="text-justify text-base font-semibold body-text"
					/>
				</div>

				{/* Content Row */}
				<div className="flex items-center justify-center gap-4">
					{/* Left Block */}
					<div className="flex flex-col items-center justify-between w-[30%] mb-3">
						<EditableText
							defaultValue={keyPoints[1]}
							className="text-left text-base body-text pl-2"
						/>
						<div
							style={{
								borderColor: titleBackgroundColor,
							}}
							className="mt-2 border-[4px] h-52 rounded-lg overflow-hidden w-full"
						>
							{imageResults[0] && (
								<img
									src={`${BASE_URL}${imageResults[0]}`}
									alt="Museum"
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					</div>

					{/* Center Circular Image */}
					<div className="flex justify-center items-center">
						<div
							style={{
								borderColor: titleBackgroundColor,
							}}
							className="w-[22rem] h-[22rem] border-[4px] rounded-full overflow-hidden"
						>
							<img
								src={`${BASE_URL}${imageResults[2]}`}
								alt="Main Image"
								className="object-cover w-full h-full"
							/>
						</div>
					</div>

					{/* Right Block */}
					<div className="flex flex-col items-center justify-between w-[25%]">
						<div
							style={{
								borderColor: titleBackgroundColor,
							}}
							className="w-full h-40 border-[4px] overflow-hidden"
						>
							{imageResults[4] && (
								<img
									src={`${BASE_URL}${imageResults[4]}`}
									alt="River Walk"
									className="w-full h-full rounded-md object-cover"
								/>
							)}
						</div>
						<div className="mt-8 bg-black w-full text-white px-4 py-8 rounded-3xl h-full flex items-center justify-center align-middle">
							<EditableText
								defaultValue={keyPoints[2]}
								className="w-full h-full text-center body-text text-base"
							/>
						</div>
					</div>
				</div>

				{/* Bottom Section with 2 more images */}
				<div className="flex items-center gap-6 mt-8">
					<div
						style={{
							borderColor: titleBackgroundColor,
						}}
						className="border-[4px] w-[50%] h-[300px] rounded-xl overflow-hidden"
					>
						{imageResults[1] && (
							<img
								src={`${BASE_URL}${imageResults[1]}`}
								alt="Cuisine"
								className="w-full h-full object-cover rounded-xl"
							/>
						)}
					</div>

					<div>
						<div className="flex flex-col mb-8">
							<EditableText
								defaultValue={keyPoints[3]}
								className="text-justify text-base font-semibold body-text"
							/>
						</div>
						<div className="flex justify-center gap-3 items-center">
							<EditableText
								defaultValue={keyPoints[4]}
								className="text-center w-[50%] mr-3 text-xl font-medium body-text"
							/>
							<div
								style={{
									borderColor: titleBackgroundColor,
								}}
								className="w-[200px] h-52 border-[4px] rounded-md overflow-hidden"
							>
								{imageResults[3] && (
									<img
										src={`${BASE_URL}${imageResults[3]}`}
										alt="Fiesta"
										className="w-full h-full object-cover rounded-md"
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
