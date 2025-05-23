import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


type WysiwygEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
};

export const WysiwygEditor: React.FC<WysiwygEditorProps> = ({ 
    value, 
    onChange,
    placeholder = "Write something here...",
    disabled = false
}) => {
    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={{
                toolbar: [
                    [{ font: [] }],
                    [{ header: [1, 2, 3, false] }],
                    [{ align: [] }],
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                    ["link"]
                ],
            }}
            readOnly={disabled}
        />
    );
};


export const WysiwygViewer: React.FC<{ value: string }> = ({ value }) => {
    return (
        <div
            className="ql-editor ql-container"
            dangerouslySetInnerHTML={{ __html: value }}
        />
    );
};
