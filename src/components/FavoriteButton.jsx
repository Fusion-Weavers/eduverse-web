import { useState } from "react";
import { IoHeart, IoHeartOutline, IoHourglassOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useFavorites } from "../context/FavoritesContext";
import "./FavoriteButton.css";

const FavoriteButton = ({
  itemId,
  itemType, // 'topic' or 'concept'
  size = 'medium', // 'small', 'medium', 'large'
  showLabel = false,
  className = '',
  disabled = false,
  onToggle = null // Optional callback when favorite status changes
}) => {
  const {
    isTopicFavorited,
    isConceptFavorited,
    toggleTopicFavorite,
    toggleConceptFavorite,
    syncStatus
  } = useFavorites();

  const [isAnimating, setIsAnimating] = useState(false);

  // Determine if item is favorited based on type
  const isFavorited = itemType === 'topic'
    ? isTopicFavorited(itemId)
    : isConceptFavorited(itemId);

  // Handle favorite toggle
  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    // Start animation
    setIsAnimating(true);

    try {
      let newStatus;
      if (itemType === 'topic') {
        newStatus = toggleTopicFavorite(itemId);
      } else {
        newStatus = toggleConceptFavorite(itemId);
      }

      // Call optional callback
      if (onToggle) {
        onToggle(newStatus, itemId, itemType);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }

    // End animation after a short delay
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Determine button classes
  const buttonClasses = [
    'favorite-button',
    `favorite-button--${size}`,
    isFavorited ? 'favorite-button--favorited' : 'favorite-button--not-favorited',
    isAnimating ? 'favorite-button--animating' : '',
    disabled ? 'favorite-button--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  // Determine icon based on favorite status
  const icon = isFavorited ? <IoHeart aria-hidden="true" /> : <IoHeartOutline aria-hidden="true" />;

  // Determine label text
  const labelText = isFavorited
    ? `Remove from favorites`
    : `Add to favorites`;

  // Show sync status indicator if there are pending changes
  const showSyncIndicator = syncStatus === 'pending' || syncStatus === 'syncing';

  return (
    <button
      className={buttonClasses}
      onClick={handleToggle}
      disabled={disabled}
      title={labelText}
      aria-label={labelText}
      type="button"
    >
      <span className="favorite-button__icon" role="img" aria-hidden="true">
        {icon}
      </span>

      {showLabel && (
        <span className="favorite-button__label">
          {isFavorited ? 'Favorited' : 'Favorite'}
        </span>
      )}

      {showSyncIndicator && (
        <span
          className="favorite-button__sync-indicator"
          title={syncStatus === 'syncing' ? 'Syncing...' : 'Pending sync'}
          aria-label={syncStatus === 'syncing' ? 'Syncing favorites' : 'Favorites pending sync'}
        >
          {syncStatus === 'syncing' ? (
            <IoHourglassOutline aria-hidden="true" />
          ) : (
            <IoCloudUploadOutline aria-hidden="true" />
          )}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;