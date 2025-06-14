import { useRef, useState, useEffect } from "react";
import { FiSend, FiDownload, FiSave } from "react-icons/fi";
import html2pdf from "html2pdf.js";
import UserSidebar from "../../component/user/UserSidebar";
import Navbar from "../../component/Navbar";
import Text from "../../assets/text.png";
import Sidbar from "../../assets/sidebar.svg";
import TemplatePage from "../TemplatePage";
import axiosInstance from "../../component/axiosInstance";
import { cloudConvertApiKey } from "../../lib/dotenv";

const UserChatPage = () => {
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [saving, setSaving] = useState(false);
	const [downloading, setDownloading] = useState(false);
	const [converting, setConverting] = useState(false);
	const [error, setError] = useState(null);
	const [docxUrl, setDocxUrl] = useState(null);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const [currentPage, setCurrentPage] = useState(1);
	const templateRef = useRef(null);
	const totalPages = 1;
	const [refreshKey, setRefreshKey] = useState(0);

	// Load initial template data from localStorage
	const [data, setData] = useState(() => {
		const stored = localStorage.getItem("templateData");
		try {
			return stored ? JSON.parse(stored) : null;
		} catch (e) {
			console.error("Failed to parse templateData from localStorage:", e);
			return null;
		}
	});

	// Generate PDF using html2pdf.js
	const generatePdf = async () => {
		const element = templateRef.current;
		if (!element) {
			throw new Error("Template reference is not available.");
		}

		const opt = {
			margin: 0,
			filename: JSON.parse(data?.content)?.title || "download.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: {
				scale: 2,
				useCORS: true,
			},
			jsPDF: {
				unit: "mm",
				format: "a4",
				orientation: "portrait",
			},
		};

		return await html2pdf().from(element).set(opt).output("blob");
	};

	// Handle PDF download
	const handleCreatePDF = async () => {
		setError(null);
		try {
			setDownloading(true);
			const blob = await generatePdf();
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = JSON.parse(data?.content)?.title || "download.pdf";
			link.click();
			setMessages((prevMessages) => [
				...prevMessages,
				{
					sender: "bot",
					text: "PDF generated successfully!",
					timestamp: new Date().toLocaleString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		} catch (err) {
			setDownloading(false);
			console.log("Error on creating pdf: ", err);
			setError(err.message);
		} finally {
			setDownloading(false);
		}
	};

	// Start CloudConvert job for PDF-to-DOCX conversion
	const startCloudConvertJob = async (pdfBlob) => {
		setConverting(true);
		setError(null);
		try {
			// Step 1: Upload PDF to CloudConvert
			const formData = new FormData();
			formData.append("file", pdfBlob, "template.pdf");

			const uploadResponse = await axiosInstance.post(
				"https://api.cloudconvert.com/v2/import/upload",
				formData,
				{
					headers: {
						Authorization: `Bearer ${cloudConvertApiKey}`,
						"Content-Type": "multipart/form-data",
					},
				}
			);

			const uploadedFileId = uploadResponse.data.data.id;
			console.log("UploadedFileId", uploadedFileId);

			// Step 2: Create conversion job
			const jobResponse = await axiosInstance.post(
				"https://api.cloudconvert.com/v2/jobs",
				{
					tasks: {
						"import-pdf": {
							operation: "import/upload",
							file: uploadedFileId,
						},
						"convert-to-docx": {
							operation: "convert",
							input: "import-pdf",
							input_format: "pdf",
							output_format: "docx",
						},
						"export-docx": {
							operation: "export/url",
							input: "convert-to-docx",
						},
					},
				},
				{
					headers: {
						Authorization: `Bearer ${cloudConvertApiKey}`,
						"Content-Type": "application/json",
					},
				}
			);

			console.log("Job Response ", jobResponse);

			return jobResponse.data.data.id;
		} catch (err) {
			throw new Error("Failed to start conversion: " + err.message);
		}
	};

	// Poll CloudConvert job status
	const pollJobStatus = async (jobId) => {
		const interval = setInterval(async () => {
			try {
				const statusResponse = await axiosInstance.get(
					`https://api.cloudconvert.com/v2/jobs/${jobId}`,
					{
						headers: {
							Authorization: `Bearer ${cloudConvertApiKey}`,
						},
					}
				);

				const job = statusResponse.data.data;

				console.log("Job Status ", job);

				if (job.status === "finished") {
					const exportTask = job.tasks.find(
						(task) => task.operation === "export/url"
					);
					const docxUrl = exportTask.result.files[0].url;
					setDocxUrl(docxUrl);
					setMessages((prevMessages) => [
						...prevMessages,
						{
							sender: "bot",
							text: "DOCX generated successfully!",
							timestamp: new Date().toLocaleString("en-US", {
								day: "2-digit",
								month: "2-digit",
								year: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							}),
						},
					]);
					setConverting(false);
					clearInterval(interval);
				} else if (job.status === "error") {
					setError("Conversion failed: " + job.message);
					setConverting(false);
					clearInterval(interval);
				}
			} catch (err) {
				setError("Polling error: " + err.message);
				setConverting(false);
				clearInterval(interval);
			}
		}, 5000); // Poll every 5 seconds
	};

	// Handle DOCX conversion
	const handleCreateDocx = async () => {
		if (!data) {
			setError("No template data to convert.");
			return;
		}

		setConverting(true);
		setError(null);
		try {
			const pdfBlob = await generatePdf();
			const jobId = await startCloudConvertJob(pdfBlob);
			if (jobId) {
				pollJobStatus(jobId);
			}
		} catch (err) {
			setError(err.message);
			setConverting(false);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					sender: "bot",
					text: "Failed to generate DOCX. Please try again.",
					timestamp: new Date().toLocaleString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		}
	};

	// Handle sending message and fetching template
	const handleSend = async () => {
		setIsBotTyping(true);
		setError(null);
		try {
			const response = await axiosInstance.post(
				"/generate-template/",
				{
					user_input: newMessage,
				},
				{
					timeout: 600000, // 10 minutes
				}
			);

			if (response.status === 200) {
				localStorage.removeItem("templateData");
				localStorage.setItem(
					"templateData",
					JSON.stringify(response.data)
				);
				const stored = localStorage.getItem("templateData");
				if (stored) {
					setData(JSON.parse(stored));
				}
				setMessages((prevMessages) => [
					...prevMessages,
					{
						sender: "bot",
						text: "Template generated successfully!",
						timestamp: new Date().toLocaleString("en-US", {
							day: "2-digit",
							month: "2-digit",
							year: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
						}),
					},
				]);
			}
		} catch (error) {
			console.error("Error fetching template data:", error);
			setError("Failed to generate template.");
			setMessages((prevMessages) => [
				...prevMessages,
				{
					sender: "bot",
					text: "Sorry, something went wrong. Please try again.",
					timestamp: new Date().toLocaleString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		} finally {
			setIsBotTyping(false);
		}
	};

	// Handle saving template
	const handleSaveTemplate = async () => {
		if (!data) {
			setError("No template data to save.");
			return;
		}

		setSaving(true);
		setError(null);
		try {
			const response = await axiosInstance.post("/save-template/", {
				title: data.title || newMessage || "Untitled",
				content: data.content || {},
				design_recommendations: data.design_recommendations || {},
				image_results: data.image_results || [],
				key_points: data.key_points || [],
			});
			setData(response.data);
			setRefreshKey((prev) => prev + 1);
			setMessages((prevMessages) => [
				...prevMessages,
				{
					sender: "bot",
					text: "Template saved successfully!",
					timestamp: new Date().toLocaleString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		} catch (err) {
			console.error("Error saving template:", err);
			setError("Failed to save template.");
			setMessages((prevMessages) => [
				...prevMessages,
				{
					sender: "bot",
					text: "Failed to save template. Please try again.",
					timestamp: new Date().toLocaleString("en-US", {
						day: "2-digit",
						month: "2-digit",
						year: "2-digit",
						hour: "2-digit",
						minute: "2-digit",
					}),
				},
			]);
		} finally {
			setSaving(false);
		}
	};

	// Handle sending user message
	const handleSendMessage = () => {
		if (newMessage.trim() === "") return;
		setMessages([
			...messages,
			{
				sender: "user",
				text: newMessage,
				timestamp: new Date().toLocaleString("en-US", {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}),
			},
		]);
		setNewMessage("");
		handleSend();
	};

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="container flex flex-1 mt-[75px]">
				{/* <UserSidebar
					isOpen={isSidebarOpen}
					toggleSidebar={toggleSidebar}
					refreshKey={refreshKey}
					setData={setData}
				/> */}
				<div
					className={`${
						isSidebarOpen ? "md:w-[86%]" : "w-full"
					} md:ml-auto flex gap-3`}
				>
					<div className="w-[1200px] border-r border-gray-200 md:block overflow-x-hidden">
						<div className="flex justify-end relative items-center mb-4 bg-[#DBF1FB] py-3 px-2 shadow-lg">
							{/* <button
								onClick={toggleSidebar}
								className="p-2 bg-gray-200 absolute left-2 z-50 rounded-lg hover:bg-gray-300 flex items-center gap-2"
							>
								<img
									src={Sidbar}
									alt="Sidebar"
									className="w-7"
								/>
							</button> */}
							<div className="flex space-x-2">
								<button
									onClick={handleSaveTemplate}
									disabled={saving}
									className={`p-2 rounded-lg flex items-center gap-2 ${
										saving
											? "bg-gray-300 cursor-not-allowed"
											: "bg-gray-200 hover:bg-gray-300"
									}`}
								>
									{saving ? "Saving..." : "Save"}
									<FiSave />
								</button>
								<button
									onClick={handleCreatePDF}
									disabled={downloading}
									className={`p-2 rounded-lg flex items-center gap-2 ${
										downloading
											? "bg-gray-300 cursor-not-allowed"
											: "bg-gray-200 hover:bg-gray-300"
									}`}
								>
									<FiDownload />
									{downloading
										? "Downloading..."
										: "Download PDF"}
								</button>
								<button
									onClick={handleCreateDocx}
									disabled={converting}
									className={`p-2 rounded-lg flex items-center gap-2 ${
										converting
											? "bg-gray-300 cursor-not-allowed"
											: "bg-gray-200 hover:bg-gray-300"
									}`}
								>
									<FiDownload />
									{converting
										? "Converting..."
										: "Download DOCX"}
								</button>
								{docxUrl && (
									<a
										href={docxUrl}
										download="template.docx"
										className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
									>
										<FiDownload />
										Download DOCX
									</a>
								)}
							</div>
						</div>
						<div className="bg-white p-4 rounded-lg shadow-sm w-full h-[calc(100vh-200px)] overflow-y-auto">
							<TemplatePage
								templateRef={templateRef}
								currentPage={currentPage}
								totalPages={totalPages}
								newMessage={newMessage}
								data={data}
							/>
						</div>
					</div>

					<div className="flex flex-col w-full">
						<div className="bg-[#DBF1FB] py-1 px-2 mb-3 shadow-lg flex items-center gap-2">
							<img src={Text} alt="Smart PDF Generator" />
							<span className="text-sm text-[#012939]">
								Smart PDF Generator
							</span>
						</div>
						<div className="flex-1 overflow-y-auto px-2">
							{error && (
								<div className="text-red-500 mb-4">{error}</div>
							)}
							{messages.map((message, index) => (
								<div
									key={index}
									className={`mb-4 flex ${
										message.sender === "user"
											? "justify-end"
											: "justify-start"
									}`}
								>
									<div
										className={`max-w-xs p-3 rounded-lg ${
											message.sender === "user"
												? "bg-blue-100 text-gray-800"
												: "bg-gray-100 text-gray-800"
										}`}
									>
										<p className="text-sm">
											{message.text}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{message.timestamp}
										</p>
									</div>
								</div>
							))}
							{isBotTyping && (
								<div className="mb-4 flex justify-start">
									<div
										className="max-w-xs p-3 rounded-lg bg-gray-100 text-gray-800"
										aria-live="polite"
									>
										<div className="typing-indicator">
											<span></span>
											<span></span>
											<span></span>
										</div>
									</div>
								</div>
							)}
						</div>
						<div className="mb-5 flex items-center space-x-2 px-2">
							<input
								type="text"
								value={newMessage}
								onChange={(e) => setNewMessage(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleSendMessage()
								}
								placeholder="Type a message"
								className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								onClick={handleSendMessage}
								className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
							>
								<FiSend />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserChatPage;
