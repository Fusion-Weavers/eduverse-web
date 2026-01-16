import { useState } from "react";
import { 
  IoHeart, 
  IoHeartOutline, 
  IoHourglassOutline, 
  IoCloudUploadOutline 
} from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";

const FavoriteButton = ({
  itemId,
  itemType, // 'topic' or 'concept'
  size = 'medium', // 'small', 'medium', 'large'
  showLabel = false,
  className = '',
  disabled = false,
  onToggle = null
}) => {
  const {
    isTopicFavorited,
    isConceptFavorited,
    toggleTopicFavorite,
    toggleConceptFavorite,
    syncStatus
  } = useFavorites();

  const [isAnimating, setIsAnimating] = useState(false);

  const isFavorited = itemType === 'topic'
    ? isTopicFavorited(itemId)
    : isConceptFavorited(itemId);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setIsAnimating(true);
    try {
      let newStatus;
      if (itemType === 'topic') {
        newStatus = toggleTopicFavorite(itemId);
      } else {
        newStatus = toggleConceptFavorite(itemId);
      }
      if (onToggle) onToggle(newStatus, itemId, itemType);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
    setTimeout(() => setIsAnimating(false), 450); // Slightly longer for the spring effect
  };

  // Size Mapping
  const sizeClasses = {
    small: 'p-1.5 text-base',
    medium: 'p-2.5 text-xl',
    large: 'p-3.5 text-2xl'
  };

  const showSyncIndicator = syncStatus === 'pending' || syncStatus === 'syncing';

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      type="button"
      className={`
        relative flex items-center gap-2 rounded-2xl transition-all duration-300
        ${sizeClasses[size]}
        ${isFavorited 
          ? 'bg-rose-500/10 text-rose-500 shadow-sm shadow-rose-500/10' 
          : 'bg-white/40 backdrop-blur-md border border-white/60 text-slate-400 hover:text-slate-600 hover:bg-white/80'}
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'active:scale-90'}
        ${className}
      `}
      title={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {/* Main Heart Icon */}
      <span className={`
        transition-transform duration-500 
        ${isAnimating ? 'animate-ping opacity-75' : ''}
        ${isFavorited ? 'scale-110' : 'scale-100'}
      `}>
        {isFavorited ? <IoHeart /> : <IoHeartOutline />}
      </span>

      {/* Label Text */}
      {showLabel && (
        <span className="text-xs font-black uppercase tracking-widest px-1">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}

      {/* Sync Status Floating Badge */}
      {showSyncIndicator && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white ring-2 ring-white">
          {syncStatus === 'syncing' ? (
            <IoHourglassOutline className="animate-spin" />
          ) : (
            <IoCloudUploadOutline />
          )}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;