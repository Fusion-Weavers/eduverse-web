import {
    IoBookOutline,
    IoLibraryOutline,
    IoNuclearOutline,
    IoFlaskOutline,
    IoLeafOutline,
    IoCogOutline
} from "react-icons/io5";

const subjectIconMap = {
    physics: IoNuclearOutline,
    nuclear: IoNuclearOutline,
    chemistry: IoFlaskOutline,
    flask: IoFlaskOutline,
    biology: IoLeafOutline,
    leaf: IoLeafOutline,
    engineering: IoCogOutline,
    cog: IoCogOutline,
    library: IoLibraryOutline,
    book: IoBookOutline,
    "⚛️": IoNuclearOutline,
    "🧪": IoFlaskOutline,
    "🧬": IoLeafOutline,
    "⚙️": IoCogOutline,
    "📚": IoLibraryOutline
};

export function getSubjectIcon(iconKey) {
    if (!iconKey) return IoLibraryOutline;
    const normalized = typeof iconKey === "string" ? iconKey.toLowerCase() : "";
    return subjectIconMap[normalized] || subjectIconMap[iconKey] || IoLibraryOutline;
}
