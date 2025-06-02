/* eslint-disable react/prop-types */ import EditableText from "@/components/editable-text";
import { baseUrl } from "../lib/dotenv";

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
	const background_color =
		parsedContent?.design_recommendations?.background_color || "#00000";
	const description_background_color = "#000000";

	const titleFontStyle =
		parsedContent?.design_recommendations?.title_font ||
		"Arial, 36pt, #361F1B"; // Default if missing
	const description_font =
		parsedContent?.design_recommendations?.description_font ||
		"Arial, 36pt, #361F1B"; // Default if missing

	// Split font styles into components
	const [fontFamily, fontColor] = titleFontStyle
		? titleFontStyle.split(",").map((item) => item.trim())
		: ["Arial", "36pt", "#361F1B"];
	const [desfontFamily, desfontSize] = description_font
		? titleFontStyle.split(",").map((item) => item.trim())
		: ["Arial", "36pt", "#361F1B"];

	// Dynamic image base URL (can be configured)
	const BASE_URL = baseUrl;

	return (
		<div className="bg-white p-2">
			{/* Header with dynamic font and background */}
			<div className="p-5 text-center bg-blue-500 text-white">
				<h2 className="text-2xl header-text font-medium uppercase">
					{title}
				</h2>
				<h1 className="text-xl header-text font-bold">{sub_title}</h1>
			</div>

			<div className="p-6 relative">
				{/* Top Circle + Key Point */}
				<div className="flex relative mt-4 items-center mb-6">
					<div className="w-36 absolute -bottom-5 h-36 bg-blue-500 rounded-full flex-shrink-0">
						{imageResults[0] && (
							<img
								src={`${BASE_URL}${imageResults[0]}`}
								alt="Museum"
								className="w-full h-full object-cover rounded-full"
							/>
						)}
					</div>
					<div
						className="ml-4 min-h-[5vh] w-full py-6 px-4 rounded-full"
						style={{
							backgroundColor: description_background_color,
							color: "#fff",
						}}
					>
						{/* Editable Text for Description */}
						<EditableText
							defaultValue={description}
							className="text-center ml-40 text-base body-text"
						/>
					</div>
				</div>

				{/* Second Key Point */}
				<div className="mb-8 ml-36 w-[80%]">
					<EditableText
						defaultValue={keyPoints[0]}
						className="text-center text-base body-text"
					/>
				</div>

				{/* Content Row */}
				<div className="flex items-center justify-center gap-6">
					{/* Left Block */}
					<div className="flex flex-col items-center justify-between w-[20%]">
						<EditableText
							defaultValue={keyPoints[1]}
							className="text-center text-sm body-text"
						/>
						<div className="mt-2 border-blue-500 border-[4px] h-40 rounded-3xl overflow-hidden w-full">
							{imageResults[1] && (
								<img
									src={`${BASE_URL}${imageResults[1]}`}
									alt="Museum"
									className="w-full h-full object-cover"
								/>
							)}
						</div>
					</div>

					{/* Center Circular Image */}
					<div className="flex justify-center items-center">
						<div className="w-[19rem] h-[19rem] border-[4px] border-blue-500 rounded-full overflow-hidden">
							<img
								src={`${BASE_URL}${imageResults[2]}`}
								alt="Main Image"
								className="object-cover w-full h-full"
							/>
						</div>
					</div>

					{/* Right Block */}
					<div className="flex flex-col items-center justify-between w-[25%]">
						<div className="w-full h-40 border-[4px] rounded-md border-blue-500 overflow-hidden">
							{imageResults[3] && (
								<img
									src={`${BASE_URL}${imageResults[3]}`}
									alt="River Walk"
									className="w-full h-full rounded-md object-cover"
								/>
							)}
						</div>
						<div className="mt-8 bg-black w-full text-white px-2 py-1 rounded-3xl min-h-[23vh] ">
							<EditableText
								defaultValue={keyPoints[2]}
								className="text-left body-text text-sm min-h-[12vh]"
							/>
						</div>
					</div>
				</div>

				{/* Bottom Section with 2 more images */}
				<div className="flex items-center gap-6 mt-8">
					<div className="border-[4px] w-[40%] h-[200px] border-blue-500 rounded-xl overflow-hidden">
						{imageResults[4] && (
							<img
								src={`${BASE_URL}${imageResults[4]}`}
								alt="Cuisine"
								className="w-full h-full object-cover rounded-xl"
							/>
						)}
					</div>

					<div>
						<div className="flex flex-col mb-12">
							<EditableText
								defaultValue={keyPoints[3]}
								className="text-center text-lg body-text"
							/>
						</div>
						<div className="flex justify-center gap-3 items-center">
							<EditableText
								defaultValue={keyPoints[4]}
								className="text-center w-[50%] mr-3 text-base body-text"
							/>
							<div className="w-[200px] h-52 border-[4px] rounded-md border-blue-500 overflow-hidden">
								{imageResults[5] && (
									<img
										src={`${BASE_URL}${imageResults[5]}`}
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
