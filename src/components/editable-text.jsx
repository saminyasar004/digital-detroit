import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function EditableText({ defaultValue, className, style }) {
	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(defaultValue);
	const textareaRef = useRef(null);

	// Sync text state with defaultValue when it changes
	useEffect(() => {
		setText(defaultValue);
	}, [defaultValue]);

	useEffect(() => {
		if (isEditing && textareaRef.current) {
			textareaRef.current.focus();
			textareaRef.current.select();
		}
	}, [isEditing]);

	const handleDoubleClick = () => {
		setIsEditing(true);
	};

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleChange = (e) => {
		setText(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			setIsEditing(false);
		}
	};

	return isEditing ? (
		<textarea
			ref={textareaRef}
			value={text}
			onChange={handleChange}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			className={cn(
				'w-full bg-transparent resize-none outline-none border border-blue-400 p-1',
				className
			)}
			style={{ minHeight: '1.5em', ...style }} // Apply style to textarea
		/>
	) : (
		<p
			onDoubleClick={handleDoubleClick}
			className={cn('cursor-pointer', className)}
			style={style}>
			{text}
		</p>
	);
}
