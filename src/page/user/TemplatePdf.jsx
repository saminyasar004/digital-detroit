import React, { forwardRef, useImperativeHandle } from 'react';
import { baseUrl } from '../../lib/dotenv';

const TemplatePdf = forwardRef(({ data }, ref) => {
	// Extract parsed content and image list only if data is available
	const parsedContent = data ? JSON.parse(data.content || '{}') : {};
	const keyPoints = data?.key_points || [];
	const imageResults = data?.image_results || [];

	// Extract design recommendations and font styles
	const title = parsedContent['title'] || 'Default Title';
	const sub_title = parsedContent['sub-title'] || 'Default Sub-title';
	const description =
		parsedContent['description'] || 'Default description text.';
	const background_color =
		parsedContent?.design_recommendations?.background_color || '#000000';
	const description_background_color = '#000000';

	const titleFontStyle =
		parsedContent?.design_recommendations?.title_font || 'Arial, 36pt, #361F1B';
	const description_font =
		parsedContent?.design_recommendations?.description_font ||
		'Arial, 36pt, #361F1B';

	// Split font styles into components (just getting font family and color for usage)
	const [fontFamily, , fontColor] = titleFontStyle
		? titleFontStyle.split(',').map((item) => item.trim())
		: ['Arial', '36pt', '#361F1B'];
	const [desFontFamily, , desFontColor] = description_font
		? description_font.split(',').map((item) => item.trim())
		: ['Arial', '36pt', '#361F1B'];

	// Dynamic image base URL (can be configured)
	const BASE_URL = baseUrl;

	useImperativeHandle(ref, () => ({
		generateHtml: () => {
			return `
      <html>
      <head>
        <style>
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            margin: 0; 
            font-family: ${fontFamily}, sans-serif; 
            background-color: ${background_color};
            color: ${fontColor};
          }
          .header {
            text-align: center;
            padding: 24px 0 40px 0;
            background-color: #3b82f6;
            color: white;
          }
          .header h2 {
            margin: 0;
            font-size: 2rem;
            text-transform: uppercase;
            font-weight: 500;
          }
          .header h1 {
            margin: 0;
            font-size: 2.5rem;
            font-weight: 700;
          }
          .container {
            padding: 24px;
            color: white;
          }
          .description-box {
            background-color: ${description_background_color};
            color: white;
            border-radius: 9999px;
            padding: 8px 16px;
            margin-left: 192px;
            min-height: 10vh;
            text-align: center;
            font-size: 1.25rem;
          }
          .top-circle {
            position: relative;
            width: 192px;
            height: 192px;
            border-radius: 50%;
            overflow: hidden;
            background-color: #3b82f6;
            position: absolute;
            bottom: -64px;
            left: 0;
          }
          .top-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .keypoint-1 {
            margin-left: 144px;
            margin-bottom: 32px;
            font-size: 1.875rem;
            text-align: center;
          }
          .content-row {
            display: flex;
            justify-content: center;
            gap: 24px;
            margin-top: 32px;
            color: ${desFontColor};
            font-family: ${desFontFamily};
          }
          .left-block, .right-block {
            width: 25%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }
          .left-block img, .right-block img {
            border: 4px solid #3b82f6;
            border-radius: 1rem;
            object-fit: cover;
          }
          .left-block .image-container {
            margin-top: 16px;
            height: 23vh;
            width: 100%;
            overflow: hidden;
            border-radius: 1.5rem;
            border: 4px solid #3b82f6;
          }
          .center-circle {
            width: 384px;
            height: 384px;
            border-radius: 50%;
            border: 4px solid #3b82f6;
            overflow: hidden;
          }
          .bottom-section {
            display: flex;
            gap: 24px;
            margin-top: 32px;
            color: ${desFontColor};
            font-family: ${desFontFamily};
          }
          .bottom-left {
            border: 4px solid #3b82f6;
            border-radius: 1rem;
            width: 40%;
            height: 250px;
            overflow: hidden;
          }
          .bottom-right {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          .bottom-right-text {
            font-size: 1.5rem;
            text-align: center;
            margin-bottom: 40px;
          }
          .bottom-right-row {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .bottom-right-row .text {
            width: 50%;
            font-size: 1.25rem;
            text-align: center;
            margin-right: 12px;
          }
          .bottom-right-row .image-container {
            width: 200px;
            height: 160px;
            border-radius: 0.5rem;
            border: 4px solid #3b82f6;
            overflow: hidden;
          }
          img {
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${title}</h2>
          <h1>${sub_title}</h1>
        </div>
        <div class="container">
          <div style="position: relative; margin-top: 96px; margin-bottom: 40px;">
            <div class="top-circle">
              ${
								imageResults[0]
									? `<img src="${BASE_URL}${imageResults[0]}" alt="Museum"/>`
									: ''
							}
            </div>
            <div class="description-box">${description}</div>
          </div>

          <div class="keypoint-1">${keyPoints[0] || ''}</div>

          <div class="content-row">
            <div class="left-block">
              <div>${keyPoints[1] || ''}</div>
              <div class="image-container">
                ${
									imageResults[1]
										? `<img src="${BASE_URL}${imageResults[1]}" alt="Left Block"/>`
										: ''
								}
              </div>
            </div>

            <div class="center-circle">
              ${
								imageResults[2]
									? `<img src="${BASE_URL}${imageResults[2]}" alt="Center Circle"/>`
									: ''
							}
            </div>

            <div class="right-block">
              <div class="image-container" style="height: 128px;">
                ${
									imageResults[3]
										? `<img src="${BASE_URL}${imageResults[3]}" alt="Right Top"/>`
										: ''
								}
              </div>
              <div style="background-color: black; color: white; padding: 8px; border-radius: 1.5rem; min-height: 23vh; margin-top: 16px; width: 100%; text-align: left;">
                ${keyPoints[2] || ''}
              </div>
            </div>
          </div>

          <div class="bottom-section">
            <div class="bottom-left">
              ${
								imageResults[4]
									? `<img src="${BASE_URL}${imageResults[4]}" alt="Bottom Left"/>`
									: ''
							}
            </div>

            <div class="bottom-right">
              <div class="bottom-right-text">${keyPoints[3] || ''}</div>
              <div class="bottom-right-row">
                <div class="text">${keyPoints[4] || ''}</div>
                <div class="image-container">
                  ${
										imageResults[5]
											? `<img src="${BASE_URL}${imageResults[5]}" alt="Bottom Right"/>`
											: ''
									}
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
      `;
		},
	}));

	return null; // No UI rendering in React; HTML string generated via ref
});

export default TemplatePdf;
