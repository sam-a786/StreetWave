import './ImageSelection.css';
interface ImageSelectionProps {
    selectedImages: string[];
    setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
}
type ImageProps = {
    name: string
    src: string;
    alt: string;
    isSelected: boolean;
};
const Image: React.FC<ImageProps> = ({ src, alt }) => {
    return (
        <div
            style={{ border: "2px solid transparent" }}
        >
            <img src={src} alt={alt} />
        </div>
    );
};

const ImageSelection: React.FC<ImageSelectionProps> = ({
    selectedImages, //array of strings representing the currently selected images
    setSelectedImages //function to update the selected images
}) => {
    const images = [
        {
            className: "top-left",
            name: "O2",
            src: "data:image/png;base64,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",
            alt: "Random Image 1"
        },
        {
            className: "top-right",
            name: "Three",
            src: "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/3-brand.svg/1200px-3-brand.svg.png",
            alt: "Random Image 2"
        },
        {
            className: "bottom-left",
            name: "Vodafone",
            src: "data:image/png;base64,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",
            alt: "Random Image 3"
        },
        {
            className: "bottom-right",
            name: "EE",
            src: "data:image/png;base64,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",
            alt: "Random Image 4"
        },
    ];
    const handleImageClick = (src: string) => {
        if (selectedImages.includes(src)) {
            setSelectedImages(selectedImages.filter((imageSrc) => imageSrc !== src));
        } else {
            setSelectedImages([...selectedImages, src]);
        }
    };
    return (
        <div className="image-container">
            {images?.map((item, index) =>
                <div
                    key={index}
                    className={item.className}
                    style={{ border: selectedImages.includes(item.name) ? "3.5px solid blue" : undefined }}
                    onClick={() => handleImageClick(item.name)}>
                    <Image
                        name={item.name}
                        key={item.src}
                        src={item.src}
                        alt={item.alt}
                        isSelected={selectedImages.includes(item.name)}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageSelection;
